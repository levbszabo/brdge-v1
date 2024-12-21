# routes.py
# brian voice :nPczCjzI2devNBz1zQrb
import re
from flask import (
    request,
    jsonify,
    send_file,
    abort,
    url_for,
    current_app,
    Blueprint,
    make_response,
)
from flask_cors import CORS, cross_origin
from werkzeug.utils import secure_filename
import os
import boto3
import uuid
from models import (
    Brdge,
    User,
    UserAccount,
    Walkthrough,
    WalkthroughMessage,
    Scripts,
    Voice,
    ViewerConversation,
    UsageLogs,
)
from utils import (
    clone_voice_helper,
    pdf_to_images,
    transcribe_audio_helper,
    align_transcript_with_slides,
    generate_voice_helper,
)
from io import BytesIO
import botocore
import json
from werkzeug.security import check_password_hash, generate_password_hash
from jwt import encode, decode, ExpiredSignatureError, InvalidTokenError
from datetime import datetime, timedelta
from werkzeug.exceptions import RequestEntityTooLarge
from functools import wraps
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
import logging
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import Flow
import stripe
from sqlalchemy import text, func, distinct, or_
from typing import Dict, List, Optional
import openai
import requests
from app import app, db
from PIL import Image
import io
import base64
from concurrent.futures import ThreadPoolExecutor, as_completed

# Set botocore to only log errors
logging.getLogger("botocore").setLevel(logging.ERROR)
logging.getLogger("boto3").setLevel(logging.ERROR)

# AWS S3 configuration
S3_BUCKET = os.getenv("S3_BUCKET")
S3_REGION = os.getenv("S3_REGION", "us-east-1")  # Default to 'us-east-1' if not set

# Initialize S3 client with the correct region
s3_client = boto3.client("s3", region_name=S3_REGION)

# Enable CORS for all routes

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

# Add these constants at the top of the file with other configurations
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID")  # Add this to your .env file
STRIPE_PRODUCT_PRICE = 5900  # Price in cents ($59.00)
STRIPE_PRODUCT_CURRENCY = "usd"

# Set up logger
logger = logging.getLogger(__name__)

# Add these constants at the top of routes.py with other configurations
SUBSCRIPTION_TIERS = {
    "free": {"brdges_limit": 2, "minutes_limit": 30},
    "standard": {
        "brdges_limit": 20,
        "minutes_limit": 120,
        "price_id": os.getenv("STRIPE_STANDARD_PRICE_ID"),
    },
    "pro": {  # Premium tier
        "brdges_limit": float("inf"),  # Unlimited
        "minutes_limit": 300,
        "price_id": os.getenv("STRIPE_PREMIUM_PRICE_ID"),
    },
    "admin": {  # Admin tier - manually assigned only
        "brdges_limit": float("inf"),  # Unlimited
        "minutes_limit": 1000,
        "price_id": None,  # No price ID since this is manually assigned
    },
}


@jwt_required(optional=True)
def get_current_user():
    current_user_id = get_jwt_identity()
    return User.query.get(current_user_id) if current_user_id else None


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_current_user()
        if not user:
            return jsonify({"error": "Authentication required"}), 401
        return f(user, *args, **kwargs)

    return decorated_function


@app.route("/api/brdges/<int:brdge_id>", methods=["PUT"])
@login_required
def update_brdge(user, brdge_id):
    brdge = Brdge.query.filter_by(
        id=brdge_id, user_id=user.id
    ).first_or_404()  # {{ edit_5 }} Ensure brdge belongs to user
    name = request.form.get("name")
    presentation = request.files.get("presentation")

    if name:
        brdge.name = name

    if presentation:
        # Process new presentation
        presentation_filename = secure_filename(
            f"{uuid.uuid4()}_{presentation.filename}"
        )
        pdf_temp_path = os.path.join("/tmp/brdge", presentation_filename)
        os.makedirs("/tmp/brdge", exist_ok=True)  # Ensure the directory exists
        presentation.save(pdf_temp_path)

        # Convert PDF to images
        slide_images = pdf_to_images(pdf_temp_path)

        # Upload new PDF and slides to S3
        s3_folder = brdge.folder
        s3_presentation_key = f"{s3_folder}/{presentation_filename}"
        s3_client.upload_file(pdf_temp_path, S3_BUCKET, s3_presentation_key)
        brdge.presentation_filename = presentation_filename

        # Upload new slide images
        for idx, image in enumerate(slide_images):
            image_filename = f"slide_{idx+1}.png"
            s3_image_key = f"{s3_folder}/slides/{image_filename}"

            # Save image to a bytes buffer
            img_byte_arr = BytesIO()
            image.save(img_byte_arr, format="PNG")
            img_byte_arr.seek(0)

            # Upload image to S3
            s3_client.upload_fileobj(img_byte_arr, S3_BUCKET, s3_image_key)

        # Clean up temporary PDF file
        os.remove(pdf_temp_path)

    db.session.commit()

    # Return updated brdge data
    return (
        jsonify({"message": "Brdge updated successfully", "brdge": brdge.to_dict()}),
        200,
    )


@app.route("/api/brdges/<int:brdge_id>", methods=["GET"])
@jwt_required(optional=True)
def get_brdge(brdge_id):
    current_user = get_current_user()
    brdge = Brdge.query.filter_by(id=brdge_id).first_or_404()

    # Check if the user owns the brdge or if the brdge is shareable
    if (current_user and current_user.id == brdge.user_id) or brdge.shareable:
        # Count the number of slide images in the S3 folder
        s3_folder = brdge.folder
        response = s3_client.list_objects_v2(
            Bucket=S3_BUCKET,
            Prefix=f"{s3_folder}/slides/",
        )
        num_slides = len(
            [obj for obj in response.get("Contents", []) if obj["Key"].endswith(".png")]
        )

        # Fetch transcripts if stored
        transcripts = []  # Implement fetching transcripts from storage if applicable

        brdge_data = brdge.to_dict()
        brdge_data["num_slides"] = num_slides
        brdge_data["transcripts"] = transcripts

        return jsonify(brdge_data), 200
    else:
        return jsonify({"error": "Unauthorized"}), 401


@app.route("/api/brdges/public/<string:public_id>", methods=["GET"])
def get_public_brdge_by_id(public_id):
    try:
        app.logger.debug(f"Attempting to fetch brdge with public_id: {public_id}")
        brdge = Brdge.query.filter_by(
            public_id=public_id, shareable=True
        ).first_or_404()
        app.logger.debug(f"Brdge found: {brdge}")

        # Count the number of slide images in the S3 folder
        s3_folder = brdge.folder
        response = s3_client.list_objects_v2(
            Bucket=S3_BUCKET,
            Prefix=f"{s3_folder}/slides/",
        )
        num_slides = len(
            [obj for obj in response.get("Contents", []) if obj["Key"].endswith(".png")]
        )

        # Fetch transcripts if stored
        transcripts = []  # Implement fetching transcripts from storage if applicable

        brdge_data = brdge.to_dict()
        brdge_data["num_slides"] = num_slides
        brdge_data["transcripts"] = transcripts

        return jsonify(brdge_data), 200
    except Exception as e:
        app.logger.error(f"Error fetching public brdge: {str(e)}")
        return jsonify({"error": "An error occurred while fetching the brdge"}), 500


@app.route("/api/brdges/<int:brdge_id>", methods=["DELETE"])
@jwt_required()
def delete_brdge(brdge_id):
    current_user = get_current_user()
    brdge = Brdge.query.filter_by(id=brdge_id, user_id=current_user.id).first_or_404()

    try:
        # Start a transaction
        db.session.begin_nested()

        try:
            # First delete all viewer conversations
            ViewerConversation.query.filter_by(brdge_id=brdge_id).delete()

            # Delete associated scripts
            Scripts.query.filter_by(brdge_id=brdge_id).delete()

            # Delete associated walkthrough messages
            walkthroughs = Walkthrough.query.filter_by(brdge_id=brdge_id).all()
            for walkthrough in walkthroughs:
                WalkthroughMessage.query.filter_by(
                    walkthrough_id=walkthrough.id
                ).delete()

            # Delete walkthroughs
            Walkthrough.query.filter_by(brdge_id=brdge_id).delete()

            # Delete S3 files
            s3_folder = brdge.folder
            try:
                # List all objects with this prefix
                s3_objects = s3_client.list_objects_v2(
                    Bucket=S3_BUCKET, Prefix=s3_folder
                )

                # Delete each object
                for obj in s3_objects.get("Contents", []):
                    app.logger.debug(f"Deleting S3 object: {obj['Key']}")
                    s3_client.delete_object(Bucket=S3_BUCKET, Key=obj["Key"])

                app.logger.info(f"Successfully deleted S3 files for brdge {brdge_id}")
            except Exception as s3_error:
                app.logger.error(f"Error deleting S3 files: {s3_error}")
                raise

            # Finally delete the brdge
            db.session.delete(brdge)

            # Commit the transaction
            db.session.commit()
            app.logger.info(
                f"Successfully deleted brdge {brdge_id} and all related data"
            )

            return jsonify({"message": "Brdge deleted successfully"}), 200

        except Exception as inner_error:
            db.session.rollback()
            app.logger.error(f"Error in delete transaction: {inner_error}")
            raise

    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error deleting brdge: {e}")
        return (
            jsonify(
                {
                    "error": "Failed to delete brdge",
                    "message": str(e),
                    "details": {"brdge_id": brdge_id, "error_type": type(e).__name__},
                }
            ),
            500,
        )


@app.route("/api/brdges/<int:brdge_id>/slides/<int:slide_number>", methods=["GET"])
def get_slide_image(brdge_id, slide_number):
    brdge = Brdge.query.get_or_404(brdge_id)

    # Check local cache first
    cache_dir = f"/tmp/brdge/slides_{brdge_id}"
    cache_file_path = os.path.join(cache_dir, f"slide_{slide_number}.png")

    if os.path.exists(cache_file_path):
        return send_file(cache_file_path, mimetype="image/png")

    # If not in cache, fetch from S3
    s3_key = f"{brdge.folder}/slides/slide_{slide_number}.png"

    try:
        # Ensure cache directory exists
        os.makedirs(cache_dir, exist_ok=True)

        # Download file from S3 to cache
        s3_client.download_file(S3_BUCKET, s3_key, cache_file_path)

        # Send the cached file
        return send_file(cache_file_path, mimetype="image/png")
    except botocore.exceptions.ClientError as e:
        if e.response["Error"]["Code"] == "404":
            print(f"Error: The slide image does not exist in S3: {s3_key}")
            abort(404)
        else:
            print(f"Error fetching image from S3: {e}")
            abort(500)
    except Exception as e:
        print(f"Unexpected error: {e}")
        abort(500)


@app.route("/api/brdges/<string:public_id>/slides/<int:slide_number>", methods=["GET"])
def get_public_slide_image(public_id, slide_number):
    brdge = Brdge.query.filter_by(public_id=public_id, shareable=True).first_or_404()

    # Check local cache first
    cache_dir = f"/tmp/brdge/slides_{brdge.id}"  # Note: Using brdge.id here
    cache_file_path = os.path.join(cache_dir, f"slide_{slide_number}.png")

    if os.path.exists(cache_file_path):
        return send_file(cache_file_path, mimetype="image/png")

    # If not in cache, fetch from S3
    s3_key = f"{brdge.folder}/slides/slide_{slide_number}.png"

    try:
        # Ensure cache directory exists
        os.makedirs(cache_dir, exist_ok=True)

        # Download file from S3 to cache
        s3_client.download_file(S3_BUCKET, s3_key, cache_file_path)

        # Send the cached file
        return send_file(cache_file_path, mimetype="image/png")
    except botocore.exceptions.ClientError as e:
        if e.response["Error"]["Code"] == "404":
            print(f"Error: The public slide image does not exist in S3: {s3_key}")
            abort(404)
        else:
            print(f"Error fetching public image from S3: {e}")
            abort(500)
    except Exception as e:
        print(f"Unexpected error fetching public slide: {e}")
        abort(500)


@app.route("/api/brdges", methods=["GET"])
@jwt_required()
def get_brdges():
    print("Received request for /api/brdges")  # Debug log
    print("Request headers:", request.headers)  # Debug log
    current_user = get_current_user()
    print(f"Current user: {current_user}")  # Debug log
    if not current_user:
        print("User not found")  # Debug log
        return jsonify({"error": "User not found"}), 404
    brdges = Brdge.query.filter_by(user_id=current_user.id).all()
    print(f"Brdges found: {len(brdges)}")  # Debug log
    return jsonify({"brdges": [brdge.to_dict() for brdge in brdges]}), 200


def generate_initial_scripts(brdge_id: int, slide_images: list) -> dict:
    """
    Generate initial scripts from slide images without conversation history.
    Args:
        brdge_id: ID of the brdge
        slide_images: List of PIL Image objects
    Returns:
        Generated scripts and agent personas
    """
    try:
        # Create initial walkthrough
        walkthrough = Walkthrough(
            brdge_id=brdge_id, total_slides=len(slide_images), status="completed"
        )
        db.session.add(walkthrough)
        db.session.flush()  # Get the walkthrough ID

        # Process each slide image
        slides_data = {}
        for idx, image in enumerate(slide_images, 1):
            try:
                # Convert to RGB if necessary
                if image.mode in ("RGBA", "P"):
                    image = image.convert("RGB")

                # Create a copy for compression
                img_copy = image.copy()

                # Resize to smaller dimensions while maintaining aspect ratio
                max_size = (800, 800)
                img_copy.thumbnail(max_size, Image.Resampling.LANCZOS)

                # Compress to JPEG with reduced quality
                buffer = io.BytesIO()
                img_copy.save(buffer, format="JPEG", quality=60, optimize=True)
                compressed_image = buffer.getvalue()

                # Convert to base64
                base64_image = base64.b64encode(compressed_image).decode("utf-8")
                slides_data[str(idx)] = base64_image

            except Exception as e:
                print(f"Error processing slide {idx}: {e}")
                continue

        # Prepare the prompt for GPT-4 Vision
        prompt = """
        You are analyzing a series of presentation slides to generate two components for each slide:
        
        1. A TTS-friendly script that sounds natural and conversational
        2. Detailed agent persona and interaction guidelines
        
        Instructions for Scripts:
        - Write in plain, natural conversational language
        - Use contractions and casual phrases (I'm, let's, we're)
        - NO special characters or formatting marks
        - NO bracketed instructions or emphasis marks
        - Include natural pauses through punctuation (commas, periods)
        - Make it sound like someone talking to a friend
        - Use simple transition words (so, now, anyway, you see)
        - Keep sentences shorter and flowing
        - Write numbers as they would be spoken
        - Avoid symbols, abbreviations, or anything that might confuse TTS
        
        Instructions for Agent Definition:
        Define a consistent agent persona that embodies the presenter while operating in one of these modes:
        
        1. External Engagement Agent:
           - Share insights with potential customers/partners
           - Blend personality with professional presentation
           - Communicate value proposition and expertise
        
        2. Internal Training Agent:
           - Scale knowledge across the organization
           - Maintain teaching approach and experience sharing
           - Transfer best practices and insights
        
        3. Knowledge Collaboration Agent:
           - Represent presenter in team discussions
           - Mirror collaboration and consensus-building
           - Share expertise while gathering team input
        
        4. Educational Guide Agent:
           - Deliver teaching content interactively
           - Maintain teaching philosophy and methods
           - Share knowledge in authentic voice
        
        Present the results in this JSON format:
        {
          "1": {
            "script": "Natural conversational script for this slide",
            "agent": "Detailed agent persona and guidelines"
          }
        }
        
        Analyze each slide's content and generate appropriate scripts and agent personas.
        """

        # Call OpenAI API with vision model
        client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))

        # Prepare messages with images
        messages = [
            {"role": "system", "content": prompt},
            {
                "role": "user",
                "content": [
                    {
                        "type": "text",
                        "text": "Please analyze these slides and generate scripts and agent personas for each one.",
                    }
                ]
                + [
                    {
                        "type": "image_url",
                        "image_url": {
                            "url": f"data:image/jpeg;base64,{img_data}",
                            "detail": "low",
                        },
                    }
                    for img_data in slides_data.values()
                ],
            },
        ]

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            max_tokens=4096,
            temperature=0.3,
            response_format={"type": "json_object"},
        )

        generated_content = json.loads(response.choices[0].message.content)

        # Create walkthrough messages for each slide
        for slide_num, content in generated_content.items():
            # Add script as assistant message
            script_message = WalkthroughMessage(
                walkthrough_id=walkthrough.id,
                slide_number=int(slide_num),
                role="assistant",
                content=content["script"],
            )
            db.session.add(script_message)

            # Add agent persona as system message
            agent_message = WalkthroughMessage(
                walkthrough_id=walkthrough.id,
                slide_number=int(slide_num),
                role="system",
                content=content["agent"],
            )
            db.session.add(agent_message)

        # Save scripts to database
        script = Scripts(
            brdge_id=brdge_id,
            walkthrough_id=walkthrough.id,
            scripts=generated_content,
            generated_at=datetime.utcnow(),
        )
        db.session.add(script)

        # Mark walkthrough as completed
        walkthrough.completed_at = datetime.utcnow()
        db.session.commit()

        return generated_content

    except Exception as e:
        print(f"Error generating initial scripts: {e}")
        db.session.rollback()
        return None


def upload_image_to_s3(args):
    """Helper function to upload a single image to S3"""
    image, s3_key, s3_bucket = args
    try:
        img_byte_arr = BytesIO()
        image.save(img_byte_arr, format="PNG")
        img_byte_arr.seek(0)
        s3_client.upload_fileobj(img_byte_arr, s3_bucket, s3_key)
        return True
    except Exception as e:
        print(f"Error uploading {s3_key}: {e}")
        return False


@app.route("/api/brdges", methods=["POST"])
@login_required
def create_brdge(user):
    try:
        name = request.form.get("name")
        presentation = request.files.get("presentation")

        if not all([name, presentation]):
            return jsonify({"error": "Missing data"}), 400

        brdge = Brdge(
            name=name,
            presentation_filename="",
            audio_filename="",
            folder="",
            user_id=user.id,
        )
        db.session.add(brdge)
        db.session.flush()

        # Generate unique filename for the PDF
        presentation_filename = secure_filename(
            f"{uuid.uuid4()}_{presentation.filename}"
        )

        # Create directories for storing files
        pdf_temp_path = os.path.join("/tmp/brdge", presentation_filename)
        os.makedirs("/tmp/brdge", exist_ok=True)
        presentation.save(pdf_temp_path)

        # Convert PDF to images
        slide_images = pdf_to_images(pdf_temp_path)

        # Generate initial scripts from the images
        initial_scripts = generate_initial_scripts(brdge.id, slide_images)

        # Update brdge data
        brdge.presentation_filename = presentation_filename
        brdge.folder = str(brdge.id)

        # Upload PDF to S3
        s3_folder = brdge.folder
        s3_presentation_key = f"{s3_folder}/{presentation_filename}"
        s3_client.upload_file(pdf_temp_path, S3_BUCKET, s3_presentation_key)

        # Prepare all image upload tasks
        from concurrent.futures import ThreadPoolExecutor, as_completed

        upload_tasks = []
        for idx, image in enumerate(slide_images):
            image_filename = f"slide_{idx+1}.png"
            s3_image_key = f"{s3_folder}/slides/{image_filename}"
            upload_tasks.append((image, s3_image_key, S3_BUCKET))

        # Upload images concurrently
        failed_uploads = []
        with ThreadPoolExecutor(max_workers=min(10, len(slide_images))) as executor:
            future_to_key = {
                executor.submit(upload_image_to_s3, task): task[1]
                for task in upload_tasks
            }

            for future in as_completed(future_to_key):
                s3_key = future_to_key[future]
                try:
                    success = future.result()
                    if not success:
                        failed_uploads.append(s3_key)
                except Exception as e:
                    print(f"Error uploading {s3_key}: {e}")
                    failed_uploads.append(s3_key)

        if failed_uploads:
            raise Exception(f"Failed to upload some images: {failed_uploads}")

        # Clean up temporary PDF file
        os.remove(pdf_temp_path)

        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Brdge created successfully",
                    "brdge": brdge.to_dict(),
                    "num_slides": len(slide_images),
                    "initial_scripts": initial_scripts,
                }
            ),
            201,
        )

    except RequestEntityTooLarge:
        return jsonify({"error": "File too large. Maximum size is 16 MB."}), 413
    except Exception as e:
        print(f"Error creating brdge: {e}")
        return jsonify({"error": "An unexpected error occurred"}), 500


@app.route("/api/brdges/<int:brdge_id>/audio", methods=["GET"])
def get_audio(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    if not brdge.audio_filename:
        abort(404)

    s3_key = f"{brdge.folder}/audio/{brdge.audio_filename}"

    try:
        s3_object = s3_client.get_object(Bucket=S3_BUCKET, Key=s3_key)
        audio_data = s3_object["Body"].read()
        return send_file(BytesIO(audio_data), mimetype="audio/mpeg")
    except Exception as e:
        print(f"Error fetching audio from S3: {e}")
        abort(404)


@app.route("/api/brdges/<int:brdge_id>/audio", methods=["POST"])
def upload_audio(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    audio_file = request.files.get("audio")

    if not audio_file:
        return jsonify({"error": "No audio file provided"}), 400

    # Generate unique filename for the audio file
    audio_filename = secure_filename(audio_file.filename)
    s3_folder = brdge.folder
    s3_audio_key = f"{s3_folder}/audio/{audio_filename}"

    # Upload audio file to S3
    try:
        s3_client.upload_fileobj(audio_file, S3_BUCKET, s3_audio_key)
    except Exception as e:
        print(f"Error uploading audio to S3: {e}")
        return jsonify({"error": "Error uploading audio"}), 500

    # Update brdge record with audio filename
    brdge.audio_filename = audio_filename
    db.session.commit()

    return jsonify({"message": "Audio uploaded successfully"}), 200


@app.route("/api/brdges/<int:brdge_id>/audio", methods=["DELETE"])
def delete_audio(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    if not brdge.audio_filename:
        return jsonify({"error": "No audio file to delete"}), 400

    s3_key = f"{brdge.folder}/audio/{brdge.audio_filename}"

    try:
        s3_client.delete_object(Bucket=S3_BUCKET, Key=s3_key)
        brdge.audio_filename = ""  # Set to empty string instead of None
        db.session.commit()
        return jsonify({"message": "Audio deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting audio from S3: {e}")
        return jsonify({"error": "Error deleting audio"}), 500


@app.route("/api/brdges/<int:brdge_id>/audio/rename", methods=["PUT"])
def rename_audio(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    data = request.get_json()
    new_name = data.get("new_name")

    if not new_name:
        return jsonify({"error": "New name not provided"}), 400

    old_key = f"{brdge.folder}/audio/{brdge.audio_filename}"
    new_key = f"{brdge.folder}/audio/{secure_filename(new_name)}"

    try:
        # Copy the object to a new key
        s3_client.copy_object(
            Bucket=S3_BUCKET,
            CopySource={"Bucket": S3_BUCKET, "Key": old_key},
            Key=new_key,
        )
        # Delete the old object
        s3_client.delete_object(Bucket=S3_BUCKET, Key=old_key)
        # Update the brdge record
        brdge.audio_filename = secure_filename(new_name)
        db.session.commit()
        return jsonify({"message": "Audio renamed successfully"}), 200
    except Exception as e:
        print(f"Error renaming audio in S3: {e}")
        return jsonify({"error": "Error renaming audio"}), 500


@app.route("/api/brdges/<int:brdge_id>/audio/transcribe", methods=["POST"])
def transcribe_audio(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    if not brdge.audio_filename:
        return jsonify({"error": "No audio file associated with this brdge"}), 400

    brdge_data = brdge.to_dict()
    audio_s3_key = f"{brdge.folder}/audio/{brdge.audio_filename}"
    audio_local_path = f"/tmp/brdge/{brdge.audio_filename}"
    os.makedirs("/tmp/brdge", exist_ok=True)  # Ensure the directory exists

    try:
        # Check if the object exists before attempting to download
        s3_client.head_object(Bucket=S3_BUCKET, Key=audio_s3_key)
    except botocore.exceptions.ClientError as e:
        if e.response["Error"]["Code"] == "404":
            return (
                jsonify({"error": f"Audio file not found in S3: {audio_s3_key}"}),
                404,
            )
        else:
            # Something else has gone wrong
            return jsonify({"error": f"Error accessing S3: {str(e)}"}), 500

    try:
        s3_client.download_file(S3_BUCKET, audio_s3_key, audio_local_path)
    except Exception as e:
        print(f"Error downloading audio from S3: {e}")
        return jsonify({"error": f"Error downloading audio file: {str(e)}"}), 500

    transcript_local = f"/tmp/brdge/transcript_{brdge_id}.txt"
    try:
        transcribed_transcript = transcribe_audio_helper(
            audio_local_path, transcript_local
        )
    except Exception as e:
        print(f"Error transcribing audio: {e}")
        return jsonify({"error": f"Error transcribing audio: {str(e)}"}), 500

    transcript_s3_key = f"{brdge.folder}/transcripts/transcript.txt"
    try:
        s3_client.upload_file(transcript_local, S3_BUCKET, transcript_s3_key)
    except Exception as e:
        print(f"Error uploading transcript to S3: {e}")
        return jsonify({"error": f"Error uploading transcript to S3: {str(e)}"}), 500

    # Clean up local files
    os.remove(audio_local_path)
    os.remove(transcript_local)

    return jsonify({"transcript": transcribed_transcript}), 200


@app.route("/api/brdges/<int:brdge_id>/audio/align_transcript", methods=["POST"])
def align_transcript(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    # Check in cache for transcript
    transcript_local_path = f"/tmp/brdge/transcript_{brdge_id}.txt"
    if not os.path.exists(transcript_local_path):
        try:
            s3_client.download_file(
                S3_BUCKET,
                f"{brdge.folder}/transcripts/transcript.txt",
                transcript_local_path,
            )
        except Exception as e:
            print(f"Error downloading transcript from S3: {e}")
            return jsonify({"error": "Transcript not found"}), 404

    with open(transcript_local_path, "r") as f:
        transcript = f.read()

    slides_dir_local = f"/tmp/brdge/slides_{brdge_id}"
    os.makedirs(slides_dir_local, exist_ok=True)

    # List all objects in the S3 slides folder
    s3_prefix = f"{brdge.folder}/slides/"
    try:
        s3_objects = s3_client.list_objects_v2(Bucket=S3_BUCKET, Prefix=s3_prefix)
    except Exception as e:
        print(f"Error listing slides in S3: {e}")
        return jsonify({"error": "Error accessing slides in S3"}), 500

    if "Contents" not in s3_objects:
        return jsonify({"error": "No slides found in S3"}), 404

    # Download each slide image
    for obj in s3_objects.get("Contents", []):
        file_key = obj["Key"]
        file_name = os.path.basename(file_key)
        local_file_path = os.path.join(slides_dir_local, file_name)
        try:
            s3_client.download_file(S3_BUCKET, file_key, local_file_path)
        except Exception as e:
            print(f"Error downloading slide {file_name} from S3: {e}")
            return jsonify({"error": f"Error downloading slide {file_name}"}), 500

    # Align transcript with slides
    try:
        image_transcripts = align_transcript_with_slides(transcript, slides_dir_local)
    except Exception as e:
        print(f"Error aligning transcript with slides: {e}")
        return jsonify({"error": "Error aligning transcript with slides"}), 500

    # Save aligned transcript locally
    aligned_transcript_local = f"/tmp/brdge/aligned_transcript_{brdge_id}.json"
    try:
        with open(aligned_transcript_local, "w") as f:
            json.dump(image_transcripts, f)
    except Exception as e:
        print(f"Error saving aligned transcript locally: {e}")
        return jsonify({"error": "Error saving aligned transcript"}), 500

    # Upload aligned transcript to S3
    aligned_transcript_s3_key = f"{brdge.folder}/transcripts/aligned_transcript.json"
    try:
        s3_client.upload_file(
            aligned_transcript_local, S3_BUCKET, aligned_transcript_s3_key
        )
    except Exception as e:
        print(f"Error uploading aligned transcript to S3: {e}")
        return jsonify({"error": "Error uploading aligned transcript to S3"}), 500

    # Clean up local files
    try:
        os.remove(transcript_local_path)
        os.remove(aligned_transcript_local)
        # Optionally, remove downloaded slides
        for file in os.listdir(slides_dir_local):
            os.remove(os.path.join(slides_dir_local, file))
        os.rmdir(slides_dir_local)
    except Exception as e:
        print(f"Error cleaning up local files: {e}")

    return jsonify(image_transcripts), 200


@app.route("/api/brdges/<int:brdge_id>/transcripts/aligned", methods=["GET"])
def get_aligned_transcript(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    # Check in cache for aligned transcript
    aligned_transcript_local = f"/tmp/brdge/aligned_transcript_{brdge_id}.json"
    aligned_transcript_s3_key = f"{brdge.folder}/transcripts/aligned_transcript.json"

    if not os.path.exists(aligned_transcript_local):
        try:
            s3_client.download_file(
                S3_BUCKET,
                aligned_transcript_s3_key,
                aligned_transcript_local,
            )
        except Exception as e:
            print(f"Error downloading aligned transcript from S3: {e}")
            abort(404)

    try:
        with open(aligned_transcript_local, "r") as f:
            aligned_transcript = json.load(f)
    except Exception as e:
        print(f"Error reading aligned transcript file: {e}")
        abort(500)

    return jsonify(aligned_transcript), 200


@app.route("/api/brdges/<int:brdge_id>/transcripts/aligned", methods=["PUT"])
def update_aligned_transcript(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    data = request.get_json()
    updated_transcripts = data.get("transcripts")

    if not updated_transcripts:
        return jsonify({"error": "No transcripts provided"}), 400

    # Load existing aligned transcript
    aligned_transcript_local = f"/tmp/brdge/aligned_transcript_{brdge_id}.json"
    aligned_transcript_s3_key = f"{brdge.folder}/transcripts/aligned_transcript.json"

    if not os.path.exists(aligned_transcript_local):
        try:
            s3_client.download_file(
                S3_BUCKET,
                aligned_transcript_s3_key,
                aligned_transcript_local,
            )
        except Exception as e:
            print(f"Error downloading aligned transcript from S3: {e}")
            return jsonify({"error": "Aligned transcript not found"}), 404

    try:
        with open(aligned_transcript_local, "r") as f:
            aligned_transcript = json.load(f)
    except Exception as e:
        print(f"Error reading aligned transcript file: {e}")
        return jsonify({"error": "Error reading aligned transcript"}), 500

    # Update the transcripts
    image_transcripts = aligned_transcript.get("image_transcripts", [])
    if len(image_transcripts) != len(updated_transcripts):
        return jsonify({"error": "Transcript length mismatch"}), 400

    for i, text in enumerate(updated_transcripts):
        image_transcripts[i]["transcript"] = text

    # Save updated aligned transcript
    try:
        with open(aligned_transcript_local, "w") as f:
            json.dump(aligned_transcript, f)
    except Exception as e:
        print(f"Error writing updated aligned transcript: {e}")
        return jsonify({"error": "Error saving updated transcript"}), 500

    # Upload updated transcript to S3
    try:
        s3_client.upload_file(
            aligned_transcript_local,
            S3_BUCKET,
            aligned_transcript_s3_key,
        )
    except Exception as e:
        print(f"Error uploading updated aligned transcript to S3: {e}")
        return jsonify({"error": "Error uploading updated transcript"}), 500

    # Clean up local file
    try:
        os.remove(aligned_transcript_local)
    except Exception as e:
        print(f"Error cleaning up local aligned transcript file: {e}")

    return jsonify({"message": "Transcripts updated successfully"}), 200


@app.route("/api/brdges/<int:brdge_id>/audio/clone_voice", methods=["POST"])
def clone_voice(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id).to_dict()
    if not brdge.get("audio_filename"):
        return jsonify({"error": "No audio file associated with this brdge"}), 400

    audio_s3_key = f"{brdge.get('folder')}/audio/{brdge.get('audio_filename')}"
    audio_local_path = f"/tmp/brdge/audio_{brdge_id}.mp3"
    os.makedirs("/tmp/brdge", exist_ok=True)  # Ensure the directory exists

    try:
        s3_client.download_file(S3_BUCKET, audio_s3_key, audio_local_path)
    except Exception as e:
        print(f"Error downloading audio file from S3: {e}")
        return jsonify({"error": f"Error downloading audio file: {str(e)}"}), 500

    try:
        voice_id = clone_voice_helper(brdge.get("name"), audio_local_path)
    except Exception as e:
        print(f"Error cloning voice: {e}")
        return jsonify({"error": f"Error cloning voice: {str(e)}"}), 500

    voice_id_local_path = f"/tmp/brdge/voice_id_{brdge_id}.txt"
    try:
        with open(voice_id_local_path, "w") as f:
            f.write(voice_id)
    except Exception as e:
        print(f"Error writing voice ID to local file: {e}")
        return jsonify({"error": "Error saving voice ID locally"}), 500

    voice_id_s3_key = f"{brdge.get('folder')}/audio/voice_id.txt"
    try:
        s3_client.upload_file(
            voice_id_local_path,
            S3_BUCKET,
            voice_id_s3_key,
        )
    except Exception as e:
        print(f"Error uploading voice ID to S3: {e}")
        return jsonify({"error": "Error uploading voice ID to S3"}), 500

    # Clean up local files
    try:
        os.remove(audio_local_path)
        os.remove(voice_id_local_path)
    except Exception as e:
        print(f"Error cleaning up local files after cloning voice: {e}")

    return jsonify({"voice_id": voice_id}), 200


@app.route("/api/brdges/<int:brdge_id>/audio/generate_voice", methods=["POST"])
def generate_voice(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id).to_dict()

    # Get voice_id from request data
    data = request.get_json()
    voice_id = data.get("voice_id") if data else None

    if not voice_id:
        # Retrieve voice_id from cloned voice
        voice_id_s3_key = f"{brdge.get('folder')}/audio/voice_id.txt"
        voice_id_local_path = f"/tmp/brdge/voice_id_{brdge_id}.txt"
        os.makedirs("/tmp/brdge", exist_ok=True)  # Ensure the directory exists

        try:
            s3_client.download_file(S3_BUCKET, voice_id_s3_key, voice_id_local_path)
            with open(voice_id_local_path, "r") as f:
                voice_id = f.read().strip()
        except Exception as e:
            print(f"Error retrieving voice ID from S3: {e}")
            return (
                jsonify(
                    {
                        "error": "Voice ID not found. Please clone a voice or provide a voice ID."
                    }
                ),
                400,
            )

    # Proceed with voice generation
    transcript_s3_key = f"{brdge.get('folder')}/transcripts/aligned_transcript.json"
    aligned_transcript_local = f"/tmp/brdge/aligned_transcript_{brdge_id}.json"
    os.makedirs("/tmp/brdge", exist_ok=True)  # Ensure the directory exists

    try:
        s3_client.download_file(S3_BUCKET, transcript_s3_key, aligned_transcript_local)
    except Exception as e:
        print(f"Error downloading aligned transcript from S3: {e}")
        return jsonify({"error": "Aligned transcript not found"}), 404

    try:
        with open(aligned_transcript_local, "r") as f:
            transcript = json.load(f)
    except Exception as e:
        print(f"Error reading aligned transcript file: {e}")
        return jsonify({"error": "Error reading aligned transcript"}), 500

    # Generate voice
    try:
        outdir = generate_voice_helper(brdge_id, transcript, voice_id)
    except Exception as e:
        print(f"Error generating voice: {e}")
        return jsonify({"error": "Error generating voice"}), 500

    # Upload all generated audio files to S3
    for file in os.listdir(outdir):
        local_file_path = os.path.join(outdir, file)
        s3_key = f"{brdge.get('folder')}/audio/processed/{file}"
        try:
            s3_client.upload_file(local_file_path, S3_BUCKET, s3_key)
            print(f"Successfully uploaded {file} to S3")
        except Exception as e:
            print(f"Error uploading {file} to S3: {e}")
            return jsonify({"error": f"Error uploading {file} to S3"}), 500

    return jsonify({"message": "Voice generated successfully"}), 200


@app.route("/api/brdges/<int:brdge_id>/audio/generated", methods=["GET", "OPTIONS"])
@cross_origin()
def get_generated_audio_files(brdge_id):
    if request.method == "OPTIONS":
        return "", 200  # Respond to preflight request

    brdge = Brdge.query.filter_by(id=brdge_id).first_or_404()

    cache_dir = f"/tmp/brdge/audio/processed/{brdge.id}"
    s3_folder = f"{brdge.folder}/audio/processed"

    # Check cache first
    if os.path.exists(cache_dir):
        audio_files = [f for f in os.listdir(cache_dir) if f.endswith(".mp3")]
    else:
        # If not in cache, list files from S3
        try:
            response = s3_client.list_objects_v2(Bucket=S3_BUCKET, Prefix=s3_folder)
        except Exception as e:
            print(f"Error listing generated audio files in S3: {e}")
            return jsonify({"error": "Error accessing generated audio files"}), 500

        audio_files = [
            obj["Key"].split("/")[-1]
            for obj in response.get("Contents", [])
            if obj["Key"].endswith(".mp3")
        ]

    # Sort audio files by slide number using precise regex
    def extract_slide_number(filename):
        match = re.match(r"slide_(\d+)\.mp3$", filename)
        if match:
            return int(match.group(1))
        else:
            return float("inf")

    audio_files.sort(key=extract_slide_number)
    print(f"Sorted audio files: {audio_files}")  # Debug print

    return jsonify({"files": audio_files}), 200


@app.route("/api/brdges/<string:public_id>/audio/generated", methods=["GET"])
def get_generated_audio_files_by_public_id(public_id):
    print(f"Fetching generated audio files for public_id: {public_id}")  # Debug log
    if request.method == "OPTIONS":
        return "", 200

    # Fetch the Brdge using the public ID
    brdge = Brdge.query.filter_by(public_id=public_id).first_or_404()
    print(f"Found brdge: id={brdge.id}, folder={brdge.folder}")  # Debug log

    cache_dir = f"/tmp/brdge/audio/processed/{brdge.id}"
    s3_folder = f"{brdge.folder}/audio/processed"
    print(f"Cache dir: {cache_dir}")  # Debug log
    print(f"S3 folder: {s3_folder}")  # Debug log

    # Check cache first
    if os.path.exists(cache_dir):
        audio_files = [f for f in os.listdir(cache_dir) if f.endswith(".mp3")]
    else:
        # If not in cache, list files from S3
        try:
            response = s3_client.list_objects_v2(Bucket=S3_BUCKET, Prefix=s3_folder)
        except Exception as e:
            print(f"Error listing generated audio files in S3: {e}")
            return jsonify({"error": "Error accessing generated audio files"}), 500

        audio_files = [
            obj["Key"].split("/")[-1]
            for obj in response.get("Contents", [])
            if obj["Key"].endswith(".mp3")
        ]

    # Sort audio files by slide number using precise regex
    def extract_slide_number(filename):
        match = re.match(r"slide_(\d+)\.mp3$", filename)
        if match:
            return int(match.group(1))
        else:
            return float("inf")

    audio_files.sort(key=extract_slide_number)
    print(f"Sorted audio files: {audio_files}")  # Debug print

    print(f"Returning audio files: {audio_files}")  # Debug log
    return jsonify({"files": audio_files}), 200


@app.route("/api/brdges/<int:brdge_id>/audio/generated/<filename>", methods=["GET"])
@app.route("/api/brdges/<string:brdge_id>/audio/generated/<filename>", methods=["GET"])
def get_generated_audio_file(brdge_id, filename):
    brdge = Brdge.query.filter(
        (Brdge.id == brdge_id) | (Brdge.public_id == brdge_id)
    ).first_or_404()
    cache_dir = f"/tmp/brdge/audio/processed/{brdge.id}"
    cache_file_path = os.path.join(cache_dir, filename)
    s3_key = f"{brdge.folder}/audio/processed/{filename}"

    if os.path.exists(cache_file_path):
        return send_file(cache_file_path, mimetype="audio/mpeg")
    else:
        try:
            os.makedirs(cache_dir, exist_ok=True)
            s3_client.download_file(S3_BUCKET, s3_key, cache_file_path)
            return send_file(cache_file_path, mimetype="audio/mpeg")
        except Exception as e:
            print(f"Error fetching audio from S3: {e}")
            abort(404)


@app.route("/api/brdges/<int:brdge_id>/transcripts/cached", methods=["GET"])
def get_cached_transcripts(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    cache_file = f"/tmp/brdge/transcripts_{brdge_id}.json"

    if os.path.exists(cache_file):
        try:
            with open(cache_file, "r") as f:
                transcripts = json.load(f)
            return jsonify({"cached": True, "transcripts": transcripts}), 200
        except Exception as e:
            print(f"Error reading cached transcripts: {e}")
            return jsonify({"error": "Error reading cached transcripts"}), 500
    else:
        return jsonify({"cached": False}), 200


@app.route("/api/brdges/<int:brdge_id>/voice-clone/cached", methods=["GET"])
def get_cached_voice_clone(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    cache_dir = f"/tmp/brdge/audio/processed/{brdge.id}"

    if os.path.exists(cache_dir):
        try:
            audio_files = [f for f in os.listdir(cache_dir) if f.endswith(".mp3")]
            return jsonify({"cached": True, "audioFiles": audio_files}), 200
        except Exception as e:
            print(f"Error reading cached voice clone audio files: {e}")
            return (
                jsonify({"error": "Error reading cached voice clone audio files"}),
                500,
            )
        else:
            return jsonify({"cached": False}), 200


@app.route("/api/brdges/<int:brdge_id>/deploy", methods=["POST"])
def deploy_brdge(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    # Assuming deploying involves making the Brdge publicly accessible
    # You might need to set a flag in the database or generate a unique token
    # For simplicity, we'll return the shareable link

    shareable_link = url_for("get_brdge", brdge_id=brdge_id, _external=True)
    return jsonify({"shareable_link": shareable_link}), 200


@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    print(f"Login attempt for email: {email}")

    user = User.query.filter_by(email=email).first()
    if user:
        print(f"User found: {user.id}, {user.email}")
        if check_password_hash(user.password_hash, password):
            access_token = create_access_token(
                identity=user.id, expires_delta=timedelta(hours=24)
            )
            print("Password check successful, token generated")
            return jsonify({"access_token": access_token}), 200
        else:
            print("Password check failed")
    else:
        print("User not found in database")

    return jsonify({"error": "Invalid credentials"}), 401


@app.route("/api/check-auth", methods=["GET"])
@jwt_required()
@cross_origin()
def check_auth():
    current_user_id = get_jwt_identity()
    return jsonify(logged_in_as=currentuser_id), 200


@app.route("/api/your-endpoint", methods=["GET"])
def your_endpoint():
    data = {"message": "Hello from the backend!"}
    return jsonify(data)


@app.route("/api/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    try:
        # Create user
        new_user = User(email=email)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.flush()  # Get the user ID

        # Create user account
        new_account = UserAccount(
            user_id=new_user.id, account_type="free", created_at=datetime.utcnow()
        )
        db.session.add(new_account)
        db.session.commit()

        return jsonify({"message": "User registered successfully"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/api/brdges/<int:brdge_id>/toggle_shareable", methods=["POST"])
@jwt_required()
def toggle_shareable(brdge_id):
    current_user = get_current_user()
    brdge = Brdge.query.filter_by(id=brdge_id, user_id=current_user.id).first_or_404()

    brdge.shareable = not brdge.shareable
    if brdge.shareable and not brdge.public_id:
        brdge.public_id = str(uuid.uuid4())

    db.session.commit()

    return (
        jsonify(
            {
                "message": "Brdge shareable status updated",
                "shareable": brdge.shareable,
                "public_id": brdge.public_id if brdge.shareable else None,
            }
        ),
        200,
    )


@app.route("/api/brdges/<int:brdge_id>", methods=["GET", "PUT"])
@login_required
def manage_brdge(user, brdge_id):
    brdge = Brdge.query.filter_by(id=brdge_id, user_id=user.id).first_or_404()

    if request.method == "GET":
        return jsonify(brdge.to_dict()), 200
    elif request.method == "PUT":
        data = request.form
        if "name" in data:
            brdge.name = data["name"]
        if "presentation" in request.files:
            presentation = request.files["presentation"]
            # Process new presentation
            presentation_filename = secure_filename(
                f"{uuid.uuid4()}_{presentation.filename}"
            )
            pdf_temp_path = os.path.join("/tmp/brdge", presentation_filename)
            os.makedirs("/tmp/brdge", exist_ok=True)
            presentation.save(pdf_temp_path)

            # Convert PDF to images and upload to S3
            slide_images = pdf_to_images(pdf_temp_path)

            s3_folder = brdge.folder
            s3_presentation_key = f"{s3_folder}/{presentation_filename}"
            s3_client.upload_file(pdf_temp_path, S3_BUCKET, s3_presentation_key)
            brdge.presentation_filename = presentation_filename

            for idx, image in enumerate(slide_images):
                image_filename = f"slide_{idx+1}.png"
                s3_image_key = f"{s3_folder}/slides/{image_filename}"
                img_byte_arr = BytesIO()
                image.save(img_byte_arr, format="PNG")
                img_byte_arr.seek(0)
                s3_client.upload_fileobj(img_byte_arr, S3_BUCKET, s3_image_key)

            os.remove(pdf_temp_path)

        db.session.commit()
        return (
            jsonify(
                {"message": "Brdge updated successfully", "brdge": brdge.to_dict()}
            ),
            200,
        )

    return jsonify({"error": "Invalid method"}), 405


@app.route("/api/auth/google", methods=["POST"])
@cross_origin()
def google_auth():
    try:
        data = request.get_json()
        credential = data.get("credential")

        if not credential:
            return jsonify({"error": "No credential provided"}), 400

        try:
            # Verify the Google token
            idinfo = id_token.verify_oauth2_token(
                credential,
                google_requests.Request(),
                os.getenv("GOOGLE_CLIENT_ID"),
                clock_skew_in_seconds=60,
            )

            # Verify issuer
            if idinfo["iss"] not in [
                "accounts.google.com",
                "https://accounts.google.com",
            ]:
                return jsonify({"error": "Wrong issuer"}), 400

            email = idinfo["email"]
            if not email:
                return jsonify({"error": "No email found in Google token"}), 400

            # Find or create user
            user = User.query.filter_by(email=email).first()

            if not user:
                # Create new user
                user = User(email=email, password_hash="")
                db.session.add(user)
                db.session.flush()

                # Create user account
                user_account = UserAccount(
                    user_id=user.id,
                    account_type="free",
                    created_at=datetime.utcnow(),
                    last_activity=datetime.utcnow(),
                )
                db.session.add(user_account)
                db.session.commit()
            else:
                # Update existing user's last activity
                if user.account:
                    user.account.last_activity = datetime.utcnow()
                    db.session.commit()

            # Generate JWT token
            access_token = create_access_token(
                identity=user.id, expires_delta=timedelta(hours=24)
            )

            return (
                jsonify(
                    {
                        "access_token": access_token,
                        "user": {
                            "email": user.email,
                            "name": idinfo.get("name"),
                            "account_type": (
                                user.account.account_type if user.account else "free"
                            ),
                            "id": user.id,
                        },
                        "message": "Successfully signed up with Google",
                    }
                ),
                200,
            )

        except ValueError as token_error:
            return jsonify({"error": "Invalid token"}), 400

    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Authentication failed"}), 500


@app.before_request
def log_request_info():
    print(f"Request: {request.method} {request.path}")


@app.route("/api/auth/verify", methods=["GET"])
@jwt_required()
@cross_origin()
def verify_token():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user:
        return jsonify({"verified": True, "user_id": current_user_id}), 200
    else:
        return jsonify({"verified": False}), 401


@app.route("/api/user/profile", methods=["GET"])
@jwt_required()
@cross_origin()
def get_user_profile():
    current_user_id = get_jwt_identity()
    print(f"Fetching profile for user ID: {current_user_id}")  # Debug log

    user = User.query.get(current_user_id)
    if not user:
        print("User not found")  # Debug log
        return jsonify({"error": "User not found"}), 404

    # Get or create user account
    user_account = user.account or UserAccount(user_id=user.id)
    if not user.account:
        print("Creating new user account")  # Debug log
        db.session.add(user_account)
        db.session.commit()

    response_data = {"email": user.email, "account": user_account.to_dict()}
    print("Response data:", response_data)  # Debug log
    return jsonify(response_data)


@app.route("/api/user/stats", methods=["GET"])
@jwt_required()
def get_user_stats():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Get account type and corresponding limits
        account_type = user.account.account_type if user.account else "free"
        tier_limits = SUBSCRIPTION_TIERS.get(account_type, SUBSCRIPTION_TIERS["free"])

        # Get brdge count
        brdges_count = Brdge.query.filter_by(user_id=current_user_id).count()

        # Calculate total minutes from UsageLogs
        usage_logs = UsageLogs.query.filter_by(owner_id=current_user_id).all()
        total_minutes = sum(log.duration_minutes or 0 for log in usage_logs)

        response_data = {
            "brdges_created": brdges_count,
            "brdges_limit": (
                "Unlimited"
                if tier_limits["brdges_limit"] == float("inf")
                else tier_limits["brdges_limit"]
            ),
            "account_type": account_type,
            "minutes_used": round(total_minutes, 1),
            "minutes_limit": tier_limits["minutes_limit"],
            "usage_stats": {
                "total_sessions": len(usage_logs),
                "completed_sessions": len(
                    [log for log in usage_logs if log.duration_minutes is not None]
                ),
                "interrupted_sessions": len(
                    [log for log in usage_logs if log.was_interrupted]
                ),
            },
        }

        logger.info(f"User stats for {current_user_id}: {response_data}")
        return jsonify(response_data)

    except Exception as e:
        logger.error(f"Error in get_user_stats: {str(e)}")
        return jsonify({"error": str(e)}), 500


stripe.api_key = os.getenv("STRIPE_SECRET_KEY")


@app.route("/api/create-checkout-session", methods=["POST"])
@login_required
def create_checkout_session(user):
    try:
        data = request.get_json()
        tier = data.get("tier")
        logger.info(f"Creating checkout session for tier: {tier}")

        # Map frontend tier names to price IDs
        price_ids = {
            "standard": SUBSCRIPTION_TIERS["standard"]["price_id"],
            "premium": SUBSCRIPTION_TIERS["pro"][
                "price_id"
            ],  # Premium maps to 'pro' in backend
        }

        price_id = price_ids.get(tier)
        if not price_id:
            return jsonify({"error": "Invalid tier"}), 400

        # Get user account
        user_account = UserAccount.query.filter_by(user_id=user.id).first()

        try:
            # Create checkout session with metadata
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                mode="subscription",
                line_items=[{"price": price_id, "quantity": 1}],
                success_url=f"{request.headers.get('Origin')}/payment-success?session_id={{CHECKOUT_SESSION_ID}}&tier={tier}",
                cancel_url=f"{request.headers.get('Origin')}/profile",
                client_reference_id=str(user.id),
                customer=(
                    user_account.stripe_customer_id
                    if user_account and user_account.stripe_customer_id
                    else None
                ),
                allow_promotion_codes=True,
                metadata={"user_id": user.id, "tier": tier},
            )

            logger.info(f"Checkout session created: {session.id}")
            return jsonify({"url": session.url}), 200

        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {str(e)}")
            return jsonify({"error": str(e)}), 400

    except Exception as e:
        logger.error(f"Error creating checkout session: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/verify-subscription", methods=["POST"])
@login_required
def verify_subscription(user):
    try:
        data = request.get_json()
        tier = data.get("tier")
        session_id = data.get("session_id")

        logger.info(
            f"Verifying subscription - User: {user.id}, Tier: {tier}, Session: {session_id}"
        )

        if not tier or not session_id:
            return jsonify({"error": "Missing required parameters"}), 400

        # Map frontend tier names to database account types
        tier_mapping = {
            "standard": "standard",
            "premium": "pro",  # Premium tier maps to 'pro' in database
        }
        account_type = tier_mapping.get(tier)

        if not account_type:
            return jsonify({"error": "Invalid subscription tier"}), 400

        # Retrieve and verify the session
        try:
            session = stripe.checkout.Session.retrieve(
                session_id, expand=["subscription"]
            )

            # Verify session belongs to user
            if str(user.id) != session.client_reference_id:
                logger.error(
                    f"Session mismatch - Session user: {session.client_reference_id}, Current user: {user.id}"
                )
                return jsonify({"error": "Session does not match user"}), 403

            # Get or create user account
            user_account = UserAccount.query.filter_by(user_id=user.id).first()
            if not user_account:
                user_account = UserAccount(user_id=user.id)
                db.session.add(user_account)

            # Update account details
            user_account.account_type = account_type
            user_account.stripe_customer_id = session.customer
            user_account.stripe_subscription_id = session.subscription.id
            user_account.subscription_status = "active"
            user_account.last_activity = datetime.utcnow()
            user_account.next_billing_date = datetime.fromtimestamp(
                session.subscription.current_period_end
            )

            db.session.commit()
            logger.info(
                f"Successfully updated subscription for user {user.id} to {account_type}"
            )

            return (
                jsonify(
                    {
                        "message": "Subscription verified and updated successfully",
                        "account": user_account.to_dict(),
                    }
                ),
                200,
            )

        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {str(e)}")
            return jsonify({"error": str(e)}), 400

    except Exception as e:
        logger.error(f"Error verifying subscription: {e}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/api/cancel-subscription", methods=["POST"])
@login_required
def cancel_subscription(user):
    try:
        # Get user account
        user_account = UserAccount.query.filter_by(user_id=user.id).first()
        if not user_account or not user_account.stripe_subscription_id:
            return jsonify({"error": "No active subscription found"}), 400

        try:
            # Cancel the subscription in Stripe
            subscription = stripe.Subscription.modify(
                user_account.stripe_subscription_id, cancel_at_period_end=True
            )

            # Update user account
            user_account.account_type = "free"
            user_account.subscription_status = "canceled"

            # Save changes
            db.session.commit()

            return (
                jsonify(
                    {
                        "message": "Subscription canceled successfully",
                        "details": {
                            "message": "Your subscription has been canceled. While your brdges will remain in your account, they will be inactive until you reactivate your subscription.",
                            "effective_date": (
                                datetime.fromtimestamp(
                                    subscription.cancel_at
                                ).isoformat()
                                if subscription.cancel_at
                                else None
                            ),
                            "current_period_end": datetime.fromtimestamp(
                                subscription.current_period_end
                            ).isoformat(),
                        },
                    }
                ),
                200,
            )

        except stripe.error.StripeError as e:
            logger.error(f"Stripe error: {str(e)}")
            return jsonify({"error": "Failed to cancel subscription with Stripe"}), 400

    except Exception as e:
        logger.error(f"Error canceling subscription: {str(e)}")
        db.session.rollback()
        return jsonify({"error": "Failed to cancel subscription"}), 500


@app.route("/api/create-portal-session", methods=["POST"])
@login_required
def create_portal_session(user):
    try:
        # Get user account
        user_account = UserAccount.query.filter_by(user_id=user.id).first()
        if not user_account or not user_account.stripe_customer_id:
            return jsonify({"error": "No active subscription found"}), 400

        try:
            # Create portal session directly with proration settings
            session = stripe.billing_portal.Session.create(
                customer=user_account.stripe_customer_id,
                return_url=f"{request.headers.get('Origin')}/profile",
                flow_data={
                    "type": "subscription_update",
                    "subscription_update": {
                        "subscription": user_account.stripe_subscription_id,
                        "features": {
                            "proration_behavior": "create_prorations",
                            "upgrade_downgrade_enabled": True,
                            "payment_method_update_enabled": True,
                            "cancellation_enabled": True,
                        },
                    },
                },
            )

            return jsonify({"url": session.url}), 200

        except stripe.error.StripeError as e:
            print(f"Stripe error: {str(e)}")
            return jsonify({"error": str(e)}), 400

    except Exception as e:
        print(f"Error creating portal session: {str(e)}")
        return jsonify({"error": "Failed to create portal session"}), 500


@app.route("/api/brdges/<int:brdge_id>/generate-slide-scripts", methods=["POST"])
def generate_slide_scripts(brdge_id):
    """Generate cleaned-up scripts and agent prompts using walkthrough data"""
    try:
        data = request.get_json()
        walkthrough_id = data.get("walkthrough_id")

        if not walkthrough_id:
            return jsonify({"error": "Walkthrough ID required"}), 400

        # Get walkthrough from database
        walkthrough = Walkthrough.query.get_or_404(walkthrough_id)

        if walkthrough.brdge_id != brdge_id:
            return jsonify({"error": "Walkthrough does not belong to this brdge"}), 403

        # Get all messages for this walkthrough
        messages = (
            WalkthroughMessage.query.filter_by(walkthrough_id=walkthrough_id)
            .order_by(WalkthroughMessage.slide_number, WalkthroughMessage.timestamp)
            .all()
        )

        # Organize messages by slide
        slides_data = {}
        for msg in messages:
            slide_num = str(msg.slide_number)
            if slide_num not in slides_data:
                slides_data[slide_num] = []
            slides_data[slide_num].append(
                {
                    "role": msg.role,
                    "content": msg.content,
                    "timestamp": msg.timestamp.isoformat(),
                }
            )

        # Log the conversation transcript for debugging
        app.logger.info(f"Conversation transcript: {json.dumps(slides_data, indent=2)}")

        # Prepare the prompt with conversation transcript
        prompt = """
        You are provided with transcripts of a user's presentation across {num_slides} slides. Generate two components:

        1. A TTS-friendly script that sounds natural and conversational
        2. Detailed agent persona and interaction guidelines

        Instructions for Scripts:
        - Write in plain, natural conversational language
        - Use contractions and casual phrases (I'm, let's, we're)
        - NO special characters or formatting marks
        - NO bracketed instructions or emphasis marks
        - Include natural pauses through punctuation (commas, periods)
        - Make it sound like someone talking to a friend
        - Use simple transition words (so, now, anyway, you see)
        - Keep sentences shorter and flowing
        - Write numbers as they would be spoken
        - Avoid symbols, abbreviations, or anything that might confuse TTS

        Instructions for Agent Definition:
        Define a consistent agent persona that embodies the original presenter while operating in one of these modes. The agent should maintain the presenter's unique voice, expertise, and communication style throughout.

        1. Agent Identity & Mode:
           First, establish the presenter's baseline characteristics:
           - Communication style (from walkthrough conversation)
           - Level of expertise and background
           - Personal examples and experiences shared
           - Unique perspectives and insights

           Then, adapt one of these modes while maintaining the presenter's identity:
           
           - External Engagement Agent:
             Purpose: Share presenter's insights with potential customers/partners
             Style: Blend presenter's personality with professional presentation
             Focus: Communicate presenter's value proposition and expertise
           
           - Internal Training Agent:
             Purpose: Scale presenter's knowledge across the organization
             Style: Maintain presenter's teaching approach and experience sharing
             Focus: Transfer presenter's best practices and insights
           
           - Knowledge Collaboration Agent:
             Purpose: Represent presenter in team discussions and knowledge sharing
             Style: Mirror presenter's collaboration and consensus-building approach
             Focus: Share presenter's expertise while gathering team input
           
           - Educational Guide Agent:
             Purpose: Deliver presenter's teaching content interactively
             Style: Maintain presenter's teaching philosophy and methods
             Focus: Share presenter's knowledge in their authentic voice

        2. Core Knowledge Base:
           - Presenter's specific expertise and experience
           - Real examples and cases from presenter's walkthrough
           - Industry knowledge demonstrated in presentation
           - Presenter's unique insights and methodologies

        3. Interaction Strategy:
           - Adopt presenter's way of gauging audience understanding
           - Use presenter's preferred explanation methods
           - Mirror presenter's engagement techniques
           - Maintain presenter's tone and rapport-building style

        4. Information Collection Goals:
           - Gather information the presenter would find valuable
           - Ask questions in presenter's style
           - Focus on presenter's key areas of interest
           - Identify action items aligned with presenter's goals

        5. Conversation Navigation:
           - Use presenter's conversation starters and transitions
           - Handle questions as presenter would
           - Address concerns using presenter's approach
           - Guide conversations toward presenter's intended outcomes

        Note: The agent should feel like having a conversation with the actual presenter, 
        maintaining their personality while delivering structured content.

        Present the results in this JSON format:
        {{
          "1": {{
            "script": "Hi everyone! Today I want to share our team's approach to project management. I've been leading projects for over 5 years now, and I've learned some valuable lessons that I think will really help you.",
            "agent": "Agent Mode: Internal Training Agent
                     
                     Identity:
                     - Embodies Sarah's hands-on leadership style
                     - Maintains her focus on practical, tested solutions
                     - Shares her authentic experiences and lessons learned
                     
                     Knowledge Base:
                     - Sarah's project management methodology
                     - Real examples from her team's successes
                     - Specific challenges she's overcome
                     
                     Interaction Strategy:
                     - Use Sarah's approachable questioning style
                     - Share her personal anecdotes when relevant
                     - Mirror her way of breaking down complex topics
                     
                     Information Goals:
                     - Understand team's current challenges (as Sarah would)
                     - Identify areas where her experience is most relevant
                     - Gather feedback she would find valuable
                     
                     Conversation Flow:
                     - Open with Sarah's welcoming style
                     - Share her methodology through stories
                     - Address concerns using her problem-solving approach
                     - Close with her action-oriented next steps"
          }},
          ...
        }}

        -----------Conversation Transcript-----------
        {transcript}
        """.format(
            num_slides=len(slides_data), transcript=json.dumps(slides_data, indent=2)
        )

        try:
            # Generate scripts using OpenAI
            client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.3,
                response_format={"type": "json_object"},
            )

            # Log the OpenAI response for debugging
            app.logger.info(f"OpenAI response: {response.choices[0].message.content}")

            generated_content = json.loads(response.choices[0].message.content)

            # Ensure proper format for each slide
            formatted_scripts = {}
            for slide_num, content in generated_content.items():
                if (
                    isinstance(content, dict)
                    and "script" in content
                    and "agent" in content
                ):
                    formatted_scripts[slide_num] = {
                        "script": content["script"],
                        "agent": content["agent"],
                    }
                else:
                    # Handle legacy format or unexpected content
                    formatted_scripts[slide_num] = {
                        "script": content if isinstance(content, str) else str(content),
                        "agent": "Discuss the key points presented in this slide. Ask viewers for their thoughts and experiences related to these concepts.",
                    }

            # Check for existing scripts and update if found
            existing_script = Scripts.query.filter_by(
                brdge_id=brdge_id, walkthrough_id=walkthrough_id
            ).first()

            if existing_script:
                existing_script.scripts = formatted_scripts
                existing_script.generated_at = datetime.utcnow()
                script = existing_script
            else:
                script = Scripts(
                    brdge_id=brdge_id,
                    walkthrough_id=walkthrough_id,
                    scripts=formatted_scripts,
                    generated_at=datetime.utcnow(),
                )
                db.session.add(script)

            db.session.commit()
            app.logger.info(
                f"Successfully saved scripts and agent prompts for brdge {brdge_id}"
            )

            return (
                jsonify(
                    {
                        "message": "Scripts and agent prompts generated successfully",
                        "scripts": script.scripts,
                        "metadata": {
                            "generated_at": script.generated_at.isoformat(),
                            "walkthrough_id": walkthrough_id,
                            "num_slides": len(formatted_scripts),
                        },
                    }
                ),
                200,
            )

        except Exception as e:
            db.session.rollback()
            app.logger.error(f"Error generating scripts and agent prompts: {e}")
            raise

        # After successful generation and saving to database
        script = Scripts.query.filter_by(
            brdge_id=brdge_id, walkthrough_id=walkthrough_id
        ).first()

        if script:
            return (
                jsonify(
                    {
                        "message": "Scripts generated successfully",
                        "has_scripts": True,  # Add this flag
                        "scripts": script.scripts,
                        "metadata": {
                            "generated_at": script.generated_at.isoformat(),
                            "walkthrough_id": walkthrough_id,
                            "num_slides": len(script.scripts),
                        },
                    }
                ),
                200,
            )
        else:
            return (
                jsonify(
                    {
                        "error": "Failed to retrieve generated scripts",
                        "has_scripts": False,
                    }
                ),
                500,
            )

    except Exception as e:
        logger.error(f"Error in script generation: {e}")
        return jsonify({"error": str(e), "has_scripts": False}), 500


@app.route("/api/brdges/<int:brdge_id>/scripts", methods=["GET"])
def get_brdge_scripts(brdge_id):
    """Get existing scripts for a brdge if they exist"""
    try:
        # Query the most recent script from database
        script = (
            Scripts.query.filter_by(brdge_id=brdge_id)
            .order_by(Scripts.generated_at.desc())
            .first()
        )

        if not script:
            logger.info(f"No scripts found for brdge {brdge_id}")
            return jsonify({"has_scripts": False, "message": "No scripts found"}), 200

        logger.info(f"Found scripts for brdge {brdge_id}")
        return (
            jsonify(
                {
                    "has_scripts": True,
                    "scripts": script.scripts,
                    "metadata": {
                        "generated_at": script.generated_at.isoformat(),
                        "source_walkthrough_id": script.walkthrough_id,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Error fetching scripts: {e}")
        return (
            jsonify(
                {
                    "error": str(e),
                    "message": "Error fetching scripts",
                    "details": {"brdge_id": brdge_id},
                }
            ),
            500,
        )


@app.route("/api/brdges/<int:brdge_id>/voice/clone", methods=["POST"])
@cross_origin()
def clone_voice_for_brdge(brdge_id):
    """Clone a voice from uploaded audio sample using Cartesia API"""
    try:
        # Get the brdge to use its name as default
        brdge = Brdge.query.filter_by(id=brdge_id).first_or_404()

        # Get form data
        audio_file = request.files.get("audio")
        name = request.form.get("name", brdge.name)
        description = request.form.get("description", f"Voice clone for {brdge.name}")
        language = request.form.get("language", "en")
        mode = request.form.get("mode", "stability")
        enhance = request.form.get("enhance", "true").lower() == "true"
        transcript = request.form.get("transcript", "")

        if not audio_file:
            return jsonify({"error": "No audio file provided"}), 400

        # Create temporary directory for audio file
        temp_dir = "/tmp/voice_clone"
        os.makedirs(temp_dir, exist_ok=True)
        temp_audio_path = os.path.join(
            temp_dir, f"temp_{brdge_id}_{secure_filename(audio_file.filename)}"
        )

        try:
            # Save audio file temporarily
            audio_file.save(temp_audio_path)

            # Prepare the multipart form data for Cartesia API
            files = {"clip": ("audio.wav", open(temp_audio_path, "rb"), "audio/wav")}
            data = {
                "name": name,
                "description": description,
                "language": language,
                "mode": mode,
                "enhance": str(enhance).lower(),
            }
            if transcript:
                data["transcript"] = transcript

            # Make request to Cartesia API
            headers = {
                "X-API-Key": os.getenv("CARTESIA_API_KEY"),
                "Cartesia-Version": "2024-06-10",
            }

            response = requests.post(
                "https://api.cartesia.ai/voices/clone",
                headers=headers,
                files=files,
                data=data,
            )

            # Log the response for debugging
            logger.info(f"Cartesia API response: {response.text}")

            try:
                # Try to parse the response data regardless of status code
                voice_data = response.json()

                # Check if we got the expected fields
                if "id" in voice_data and "name" in voice_data:
                    logger.info(f"Successfully parsed voice data: {voice_data}")

                    # Parse the datetime string correctly
                    try:
                        # Remove microseconds if present and parse the timezone offset
                        datetime_str = voice_data.get("created_at", "")
                        if datetime_str:
                            # Remove microseconds precision beyond 6 digits
                            parts = datetime_str.split(".")
                            if len(parts) > 1:
                                microseconds = parts[1].split("-")[0][
                                    :6
                                ]  # Take only up to 6 digits
                                datetime_str = f"{parts[0]}.{microseconds}{datetime_str[datetime_str.find('-'):]}"
                    except Exception as dt_error:
                        logger.error(f"Error parsing datetime: {dt_error}")
                        datetime_str = datetime.utcnow().isoformat()

                    voice = Voice.from_cartesia_response(brdge_id, voice_data)
                    logger.info(f"Created voice record: {voice.to_dict()}")

                    # Save to database
                    db.session.add(voice)
                    db.session.commit()
                    logger.info(f"Successfully saved voice to database")

                    return (
                        jsonify(
                            {
                                "message": "Voice cloned successfully",
                                "voice": voice.to_dict(),
                            }
                        ),
                        201,
                    )
                else:
                    logger.error(f"Missing required fields in response: {voice_data}")
                    return (
                        jsonify(
                            {
                                "error": "Invalid response from voice service",
                                "details": voice_data,
                            }
                        ),
                        400,
                    )
            except Exception as db_error:
                logger.error(f"Database error while saving voice: {db_error}")
                db.session.rollback()
                raise

            finally:
                # Clean up temporary file
                if os.path.exists(temp_audio_path):
                    os.remove(temp_audio_path)

        except Exception as e:
            db.session.rollback()
            logger.error(f"Error cloning voice: {e}")
            return jsonify({"error": "Failed to clone voice", "details": str(e)}), 500

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error cloning voice: {e}")
        return jsonify({"error": "Failed to clone voice", "details": str(e)}), 500


@app.route("/api/brdges/<int:brdge_id>/voices", methods=["GET"])
@cross_origin()
def get_brdge_voices(brdge_id):
    """Get all saved voices for a brdge"""
    try:
        # Debug: Check what brdge_id we're querying
        logger.info(f"Querying voices for brdge_id: {brdge_id}")

        # Get all voices for this brdge (don't filter by status)
        voices = (
            Voice.query.filter_by(brdge_id=brdge_id)
            .order_by(Voice.created_at.desc())
            .all()
        )

        # Debug: Log what we found
        logger.info(f"Found {len(voices)} voices for brdge {brdge_id}")
        for voice in voices:
            logger.info(f"Voice details: {voice.to_dict()}")

        # Format voices for frontend
        voice_list = [
            {
                "id": voice.cartesia_voice_id,  # Frontend expects Cartesia's ID
                "name": voice.name,
                "created_at": voice.created_at.isoformat(),
                "language": voice.language,
                "description": voice.description,
            }
            for voice in voices
        ]

        # Debug: Log what we're returning
        logger.info(f"Returning voice list: {voice_list}")

        return (
            jsonify(
                {
                    "has_voices": len(voice_list) > 0,
                    "voices": voice_list,
                    "default_voice": "85100d63-eb8a-4225-9750-803920c3c8d3",
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Error fetching voices: {e}")
        # Debug: Log the full error details
        logger.exception("Full error details:")
        return (
            jsonify(
                {
                    "has_voices": False,
                    "voices": [],
                    "error": "Failed to fetch voices",
                    "details": str(e),
                    "default_voice": "85100d63-eb8a-4225-9750-803920c3c8d3",
                }
            ),
            500,
        )


@app.route("/api/walkthroughs", methods=["POST"])
def create_walkthrough():
    """Create a new walkthrough"""
    data = request.get_json()
    brdge_id = data.get("brdge_id")
    total_slides = data.get("total_slides")

    try:
        walkthrough = Walkthrough(brdge_id=brdge_id, total_slides=total_slides)
        db.session.add(walkthrough)
        db.session.commit()

        return (
            jsonify(
                {
                    "id": walkthrough.id,
                    "brdge_id": walkthrough.brdge_id,
                    "created_at": walkthrough.created_at.isoformat(),
                    "status": walkthrough.status,
                }
            ),
            201,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/api/walkthroughs/<int:walkthrough_id>/messages", methods=["POST"])
def add_walkthrough_message(walkthrough_id):
    """Add a message to a walkthrough"""
    data = request.get_json()
    slide_number = data.get("slide_number")
    role = data.get("role")
    content = data.get("content")

    try:
        message = WalkthroughMessage(
            walkthrough_id=walkthrough_id,
            slide_number=slide_number,
            role=role,
            content=content,
        )
        db.session.add(message)
        db.session.commit()

        return (
            jsonify(
                {
                    "id": message.id,
                    "slide_number": message.slide_number,
                    "role": message.role,
                    "timestamp": message.timestamp.isoformat(),
                }
            ),
            201,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/api/walkthroughs/<int:walkthrough_id>/complete", methods=["POST"])
def complete_walkthrough(walkthrough_id):
    """Mark a walkthrough as completed"""
    try:
        walkthrough = Walkthrough.query.get_or_404(walkthrough_id)
        walkthrough.status = "completed"
        walkthrough.completed_at = datetime.utcnow()
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Walkthrough completed",
                    "completed_at": walkthrough.completed_at.isoformat(),
                }
            ),
            200,
        )
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


@app.route("/api/brdges/<int:brdge_id>/walkthrough-list", methods=["GET"])
def get_brdge_walkthroughs(brdge_id):
    """
    Get a list of all walkthroughs available for a brdge.
    Returns labeled walkthroughs that can be used in a dropdown selection.
    """
    try:
        # Get current user but don't require it
        current_user = get_current_user()
        logger.info(f"Current user: {current_user.id if current_user else 'None'}")

        # Query walkthroughs directly from database
        walkthroughs = (
            Walkthrough.query.filter_by(brdge_id=brdge_id)
            .order_by(Walkthrough.created_at.desc())
            .all()
        )

        if not walkthroughs:
            logger.info(f"No walkthroughs found for brdge {brdge_id}")
            return (
                jsonify(
                    {
                        "has_walkthroughs": False,
                        "walkthroughs": [],
                        "message": "No walkthroughs found",
                    }
                ),
                200,
            )

        # Format walkthrough data
        walkthrough_list = [
            {
                "id": w.id,
                "label": f"Walkthrough {idx + 1}",
                "timestamp": w.created_at.isoformat(),
                "slide_count": w.total_slides,
                "status": w.status,
                "message_count": w.messages.count(),
            }
            for idx, w in enumerate(walkthroughs)
        ]

        logger.info(
            f"Found {len(walkthrough_list)} walkthrough(s) for brdge {brdge_id}"
        )
        return (
            jsonify(
                {
                    "has_walkthroughs": True,
                    "walkthroughs": walkthrough_list,
                    "message": f"Found {len(walkthrough_list)} walkthrough(s)",
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Error in get_brdge_walkthroughs: {str(e)}")
        return (
            jsonify(
                {
                    "error": str(e),
                    "message": "Error fetching walkthroughs",
                    "details": {"brdge_id": brdge_id, "error_type": type(e).__name__},
                }
            ),
            500,
        )


@app.route("/api/walkthroughs/<int:walkthrough_id>", methods=["GET"])
def get_walkthrough(walkthrough_id):
    """Get a specific walkthrough's details and messages"""
    try:
        walkthrough = Walkthrough.query.get_or_404(walkthrough_id)

        # Get all messages for this walkthrough
        messages = (
            WalkthroughMessage.query.filter_by(walkthrough_id=walkthrough_id)
            .order_by(WalkthroughMessage.slide_number, WalkthroughMessage.timestamp)
            .all()
        )

        # Organize messages by slide
        slides_data = {}
        for msg in messages:
            slide_num = str(msg.slide_number)
            if slide_num not in slides_data:
                slides_data[slide_num] = []
            slides_data[slide_num].append(msg.to_dict())

        return (
            jsonify(
                {
                    "id": walkthrough.id,
                    "brdge_id": walkthrough.brdge_id,
                    "created_at": walkthrough.created_at.isoformat(),
                    "completed_at": (
                        walkthrough.completed_at.isoformat()
                        if walkthrough.completed_at
                        else None
                    ),
                    "status": walkthrough.status,
                    "total_slides": walkthrough.total_slides,
                    "slides": slides_data,
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Error fetching walkthrough: {e}")
        return (
            jsonify(
                {
                    "error": str(e),
                    "message": "Error fetching walkthrough",
                    "details": {
                        "walkthrough_id": walkthrough_id,
                        "error_type": type(e).__name__,
                    },
                }
            ),
            500,
        )


@app.route("/api/brdges/<int:brdge_id>/scripts/debug", methods=["GET"])
def debug_brdge_scripts(brdge_id):
    """Debug endpoint to check script availability"""
    try:
        script = (
            Scripts.query.filter_by(brdge_id=brdge_id)
            .order_by(Scripts.generated_at.desc())
            .first()
        )

        if not script:
            return (
                jsonify(
                    {
                        "has_scripts": False,
                        "message": "No scripts found",
                        "debug_info": {
                            "brdge_id": brdge_id,
                            "scripts_count": Scripts.query.filter_by(
                                brdge_id=brdge_id
                            ).count(),
                        },
                    }
                ),
                200,
            )

        return (
            jsonify(
                {
                    "has_scripts": True,
                    "scripts": script.scripts,
                    "debug_info": {
                        "brdge_id": brdge_id,
                        "generated_at": script.generated_at.isoformat(),
                        "walkthrough_id": script.walkthrough_id,
                        "script_keys": list(script.scripts.keys()),
                    },
                }
            ),
            200,
        )

    except Exception as e:
        app.logger.error(f"Error in debug_brdge_scripts: {e}")
        return (
            jsonify(
                {
                    "error": str(e),
                    "message": "Error fetching scripts",
                    "debug_info": {
                        "brdge_id": brdge_id,
                        "error_type": type(e).__name__,
                    },
                }
            ),
            500,
        )


@app.route("/api/brdges/<int:brdge_id>/scripts/update", methods=["PUT", "OPTIONS"])
@cross_origin()
def update_brdge_scripts(brdge_id):
    """Update scripts for a brdge"""
    if request.method == "OPTIONS":
        return "", 200

    try:
        data = request.get_json()
        updated_scripts = data.get("scripts")

        if not updated_scripts:
            return jsonify({"error": "No scripts provided"}), 400

        script = (
            Scripts.query.filter_by(brdge_id=brdge_id)
            .order_by(Scripts.generated_at.desc())
            .first()
        )

        if not script:
            return jsonify({"error": "No scripts found for this brdge"}), 404

        # Create a new scripts dictionary that will store both script and agent content
        combined_scripts = script.scripts.copy() if script.scripts else {}

        # Update with new content
        for slide_num, content in updated_scripts.items():
            # Ensure content is in the correct format
            if isinstance(content, dict) and "script" in content:
                combined_scripts[slide_num] = {
                    "script": content.get("script", ""),
                    "agent": content.get("agent", ""),
                }
            else:
                # Handle legacy format or invalid data
                app.logger.warning(
                    f"Received unexpected format for slide {slide_num}: {content}"
                )
                combined_scripts[slide_num] = {"script": str(content), "agent": ""}

        # Update scripts in database
        script.scripts = combined_scripts
        script.generated_at = datetime.utcnow()
        db.session.commit()

        app.logger.info(f"Successfully updated scripts for brdge {brdge_id}")
        return (
            jsonify(
                {
                    "message": "Scripts updated successfully",
                    "scripts": script.scripts,
                    "metadata": {
                        "generated_at": script.generated_at.isoformat(),
                        "walkthrough_id": script.walkthrough_id,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating scripts: {e}")
        return (
            jsonify(
                {
                    "error": str(e),
                    "message": "Error updating scripts",
                    "details": {"brdge_id": brdge_id},
                }
            ),
            500,
        )


@app.route("/api/brdges/<int:brdge_id>/viewer-conversations", methods=["POST"])
@jwt_required(optional=True)
def add_viewer_conversation(brdge_id):
    try:
        data = request.get_json()
        viewer_id = data.get("user_id")
        message = data.get("message")
        role = data.get("role")
        slide_number = data.get("slide_number")

        if not all([viewer_id, message, role]):
            return jsonify({"error": "Missing required fields"}), 400

        # Handle both int and string user IDs
        user_id = None
        anonymous_id = None

        # If viewer_id is already an integer or can be converted to one
        if isinstance(viewer_id, int) or (
            isinstance(viewer_id, str) and viewer_id.isdigit()
        ):
            user_id = int(viewer_id)
        else:
            # If it's a string starting with 'anon_', treat as anonymous
            anonymous_id = viewer_id

        conversation = ViewerConversation(
            user_id=user_id,
            anonymous_id=anonymous_id,
            brdge_id=brdge_id,
            message=message,
            role=role,
            slide_number=slide_number,
        )

        db.session.add(conversation)
        db.session.commit()

        return (
            jsonify(
                {"id": conversation.id, "timestamp": conversation.timestamp.isoformat()}
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error logging viewer conversation: {e}")
        return jsonify({"error": str(e)}), 500


def get_unique_interaction_counts(brdge_id):
    """Get counts of unique users who interacted with a brdge"""
    try:
        # Debug: Print raw query results
        user_query = (
            db.session.query(func.count(distinct(ViewerConversation.user_id)))
            .filter(
                ViewerConversation.brdge_id == brdge_id,
                ViewerConversation.user_id.isnot(None),
            )
            .scalar()
            or 0
        )

        anon_query = (
            db.session.query(func.count(distinct(ViewerConversation.anonymous_id)))
            .filter(
                ViewerConversation.brdge_id == brdge_id,
                ViewerConversation.anonymous_id.isnot(None),
            )
            .scalar()
            or 0
        )

        total_query = (
            db.session.query(ViewerConversation)
            .filter(ViewerConversation.brdge_id == brdge_id)
            .all()
        )

        app.logger.info(f"Debug - Brdge {brdge_id}:")
        app.logger.info(f"Unique user IDs: {user_query}")
        app.logger.info(f"Unique anonymous IDs: {anon_query}")
        app.logger.info(f"Total conversations: {len(total_query)}")

        # Count unique user_ids (excluding nulls)
        unique_users = user_query

        # Count unique anonymous_ids (excluding nulls)
        unique_anon = anon_query

        # Total interactions (messages)
        total_interactions = len(total_query)

        result = {
            "unique_users": unique_users,
            "unique_anonymous_users": unique_anon,
            "total_unique_users": unique_users + unique_anon,
            "total_interactions": total_interactions,
        }

        app.logger.info(f"Final metrics: {result}")
        return result

    except Exception as e:
        app.logger.error(f"Error in get_unique_interaction_counts: {e}")
        return {
            "unique_users": 0,
            "unique_anonymous_users": 0,
            "total_unique_users": 0,
            "total_interactions": 0,
        }


@app.route("/api/brdges/<int:brdge_id>/viewer-conversations", methods=["GET"])
@jwt_required(optional=True)
@cross_origin()
def get_viewer_conversations(brdge_id):
    """Get viewer conversations for a brdge"""
    try:
        current_user = get_current_user()
        brdge = Brdge.query.get_or_404(brdge_id)

        app.logger.info(f"Fetching conversations for Brdge {brdge_id}")
        if current_user:
            app.logger.info(f"Current user: {current_user.id}")

        # Get interaction counts
        interaction_stats = get_unique_interaction_counts(brdge_id)
        app.logger.info(f"Interaction stats: {interaction_stats}")

        # Base query for the brdge
        query = ViewerConversation.query.filter_by(brdge_id=brdge_id)

        # If user owns the brdge, show all conversations
        if current_user and current_user.id == brdge.user_id:
            app.logger.info("User owns the Brdge - showing all conversations")
        # If user is authenticated but doesn't own the brdge, show only their conversations
        elif current_user:
            query = query.filter_by(user_id=current_user.id)
            app.logger.info(f"Filtering conversations for user {current_user.id}")
        # If user is not authenticated, require anonymous_id
        else:
            anonymous_id = request.args.get("anonymous_id")
            if anonymous_id:
                query = query.filter_by(anonymous_id=anonymous_id)
                app.logger.info(
                    f"Filtering conversations for anonymous user {anonymous_id}"
                )
            else:
                return (
                    jsonify(
                        {"error": "Anonymous ID required for non-authenticated users"}
                    ),
                    400,
                )

        conversations = query.order_by(ViewerConversation.timestamp.desc()).all()
        app.logger.info(f"Found {len(conversations)} conversations")

        return (
            jsonify(
                {
                    "conversations": [conv.to_dict() for conv in conversations],
                    "interaction_stats": interaction_stats,
                }
            ),
            200,
        )

    except Exception as e:
        app.logger.error(f"Error fetching viewer conversations: {e}")
        return jsonify({"error": str(e)}), 500


@app.after_request
def add_security_headers(response):
    """Add security headers to response"""
    response.headers["Content-Security-Policy"] = (
        "frame-ancestors 'self' https://accounts.google.com/; frame-src 'self' https://accounts.google.com/;"
    )
    response.headers["Cross-Origin-Opener-Policy"] = "same-origin-allow-popups"
    return response


@app.route("/api/user/current", methods=["GET", "OPTIONS"])
@cross_origin()
@jwt_required(optional=True)
def get_current_user_details():
    if request.method == "OPTIONS":
        response = make_response()
        response.headers.add(
            "Access-Control-Allow-Headers", "Authorization, Content-Type"
        )
        response.headers.add("Access-Control-Allow-Methods", "GET, OPTIONS")
        return response

    current_user_id = get_jwt_identity()
    if not current_user_id:
        return jsonify({"error": "Unauthorized"}), 401

    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify({"id": user.id, "email": user.email}), 200


@app.route("/api/brdges/<int:brdge_id>/usage-logs", methods=["POST"])
def create_usage_log(brdge_id):
    """Create a new usage log entry when agent starts speaking"""
    try:
        data = request.get_json()
        owner_id = Brdge.query.get(brdge_id).user_id
        # Create new usage log
        usage_log = UsageLogs(
            brdge_id=brdge_id,
            owner_id=owner_id,
            viewer_user_id=data.get("viewer_user_id"),
            anonymous_id=data.get("anonymous_id"),
            agent_message="",
            started_at=datetime.fromisoformat(data["started_at"]),
            was_interrupted=data.get("was_interrupted", False),
        )

        db.session.add(usage_log)
        db.session.commit()

        return (
            jsonify({"id": usage_log.id, "message": "Usage log created successfully"}),
            201,
        )

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating usage log: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/brdges/<int:brdge_id>/usage-logs/<int:log_id>", methods=["PUT"])
def update_usage_log(brdge_id, log_id):
    """Update an existing usage log when speech ends or is interrupted"""
    try:
        data = request.get_json()
        usage_log = UsageLogs.query.get(log_id)

        if not usage_log:
            return jsonify({"error": "Usage log not found"}), 404

        if usage_log.brdge_id != brdge_id:
            return jsonify({"error": "Usage log does not belong to this brdge"}), 403

        # Update fields
        if "ended_at" in data:
            usage_log.ended_at = datetime.fromisoformat(data["ended_at"])
        if "duration_minutes" in data:
            usage_log.duration_minutes = data["duration_minutes"]
        if "was_interrupted" in data:
            usage_log.was_interrupted = data["was_interrupted"]
        if "agent_message" in data:
            usage_log.agent_message = data["agent_message"]

        db.session.commit()

        return jsonify({"message": "Usage log updated successfully"}), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating usage log: {e}")
        return jsonify({"error": str(e)}), 500
