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
    Response,
    stream_with_context,
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
    BrdgeScript,
    KnowledgeBase,
    DocumentKnowledge,
    Recording,
    UserIssues,
)
from utils import (
    clone_voice_helper,
    pdf_to_images,
    transcribe_audio_helper,
    align_transcript_with_slides,
    generate_voice_helper,
    convert_webm_to_mp4,
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
from openai import AsyncOpenAI
import asyncio
from botocore.config import Config  # Add this import at the top
from threading import Thread
from sqlalchemy.orm import scoped_session, sessionmaker

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
STRIPE_PRODUCT_PRICE = 24900  # Price in cents ($249.00) - Premium tier price
STRIPE_PRODUCT_CURRENCY = "usd"
STRIPE_STANDARD_PRICE = 9900  # Price in cents ($99.00) - Standard tier price

# Set up logger
logger = logging.getLogger(__name__)

# Add these constants at the top of routes.py with other configurations
SUBSCRIPTION_TIERS = {
    "free": {"brdges_limit": 1, "minutes_limit": 30},  # Updated from 2 to 1
    "standard": {
        "brdges_limit": 10,  # Updated from 20 to 10
        "minutes_limit": 300,  # Updated from 120 to 300
        "price_id": os.getenv("STRIPE_STANDARD_PRICE_ID"),
    },
    "pro": {  # Premium tier
        "brdges_limit": float("inf"),  # Unlimited
        "minutes_limit": 1000,  # Updated from 300 to 1000
        "price_id": os.getenv("STRIPE_PREMIUM_PRICE_ID"),
    },
    "admin": {  # Admin tier - manually assigned only
        "brdges_limit": float("inf"),  # Unlimited
        "minutes_limit": 1000,
        "price_id": None,  # No price ID since this is manually assigned
    },
}

# Add these constants near the top with other configurations
MAX_PDF_SIZE = 20 * 1024 * 1024  # 20MB
MAX_VIDEO_SIZE = 100 * 1024 * 1024  # 100MB

# Add this configuration right after creating the app
app.config["MAX_CONTENT_LENGTH"] = (
    MAX_VIDEO_SIZE + MAX_PDF_SIZE
)  # Allow for both files plus some overhead

# Add this constant with the other file configurations
ALLOWED_VIDEO_FORMATS = ["video/mp4", "video/webm"]


# Add this error handler
@app.errorhandler(RequestEntityTooLarge)
def handle_large_request(e):
    return (
        jsonify({"error": "File too large. Video limit is 100MB, PDF limit is 20MB."}),
        413,
    )


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
def delete_brdge(brdge_id):
    try:
        brdge = Brdge.query.get_or_404(brdge_id)

        # Start database transaction
        db.session.begin_nested()

        try:
            # 1. Delete associated scripts first
            BrdgeScript.query.filter_by(brdge_id=brdge_id).delete()

            # 2. Delete recordings
            Recording.query.filter_by(brdge_id=brdge_id).delete()

            # 3. Delete walkthroughs and their messages
            for walkthrough in brdge.walkthroughs:
                WalkthroughMessage.query.filter_by(
                    walkthrough_id=walkthrough.id
                ).delete()
            Walkthrough.query.filter_by(brdge_id=brdge_id).delete()

            # 4. Disassociate usage logs from this brdge (set brdge_id to null)
            UsageLogs.query.filter_by(brdge_id=brdge_id).update(
                {UsageLogs.brdge_id: None}
            )

            # 5. Delete voices if they exist
            Voice.query.filter_by(brdge_id=brdge_id).delete()

            # 6. Delete document knowledge entries
            DocumentKnowledge.query.filter_by(brdge_id=brdge_id).delete()

            # 7. Delete knowledge base entries
            KnowledgeBase.query.filter_by(brdge_id=brdge_id).delete()

            # 8. Delete S3 files
            try:
                # List all objects in the brdge's folder
                prefix = f"{brdge.folder}/"
                response = s3_client.list_objects_v2(Bucket=S3_BUCKET, Prefix=prefix)

                # Delete each object
                for obj in response.get("Contents", []):
                    logger.debug(f"Deleting S3 object: {obj['Key']}")
                    s3_client.delete_object(Bucket=S3_BUCKET, Key=obj["Key"])

                logger.info(f"Successfully deleted S3 files for brdge {brdge_id}")
            except Exception as e:
                logger.error(f"Error deleting S3 files: {e}")
                raise

            # 9. Finally delete the brdge itself
            db.session.delete(brdge)

            # Commit all changes
            db.session.commit()

            return jsonify({"message": "Brdge deleted successfully"}), 200

        except Exception as e:
            # If anything fails, rollback the nested transaction
            db.session.rollback()
            logger.error(f"Error in delete transaction: {e}")
            raise

    except Exception as e:
        # Rollback the main transaction if there's an error
        db.session.rollback()
        logger.error(f"Error deleting brdge: {e}")
        return jsonify({"error": str(e)}), 500


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
        recording = request.files.get("screen_recording")
        recording_metadata = request.form.get("recording_metadata")

        # Validation...
        missing_fields = []
        if not name:
            missing_fields.append("name")
        if not recording:
            missing_fields.append("screen_recording")

        if missing_fields:
            return (
                jsonify(
                    {
                        "error": "Missing required fields",
                        "missing_fields": missing_fields,
                    }
                ),
                400,
            )

        # Add file format validation for video
        if recording:
            if recording.content_type not in ALLOWED_VIDEO_FORMATS:
                return (
                    jsonify(
                        {
                            "error": "Invalid video format",
                            "message": "Please upload either an MP4 or WebM video file.",
                            "allowed_formats": [".mp4", ".webm"],
                        }
                    ),
                    400,
                )

            # Size validation
            if recording.content_length > MAX_VIDEO_SIZE:
                return (
                    jsonify(
                        {
                            "error": "Video file size too large",
                            "message": "Video file size exceeds 100MB limit. Please upload a smaller file.",
                            "max_size_mb": MAX_VIDEO_SIZE / (1024 * 1024),
                        }
                    ),
                    400,
                )

        # PDF validation
        if presentation:
            if not presentation.filename.lower().endswith(".pdf"):
                return (
                    jsonify(
                        {
                            "error": "Invalid file format",
                            "message": "Please upload a PDF file.",
                            "allowed_formats": [".pdf"],
                        }
                    ),
                    400,
                )

            if presentation.content_length > MAX_PDF_SIZE:
                return (
                    jsonify(
                        {
                            "error": "PDF file size too large",
                            "message": "PDF file size exceeds 20MB limit. Please upload a smaller file.",
                            "max_size_mb": MAX_PDF_SIZE / (1024 * 1024),
                        }
                    ),
                    400,
                )

        # Parse recording metadata
        recording_duration = None
        if recording_metadata:
            try:
                metadata = json.loads(recording_metadata)
                recording_duration = metadata.get("duration")
            except json.JSONDecodeError:
                logger.warning("Failed to parse recording metadata")

        # Step 1: Create Brdge object
        brdge = Brdge(
            name=name,
            user_id=user.id,
            presentation_filename="" if not presentation else "temp",
            audio_filename="",
            folder="temp",
        )
        db.session.add(brdge)
        db.session.flush()

        # Step 2: Set folder and process files
        folder = str(brdge.id)
        brdge.folder = folder

        # Handle presentation file if it exists
        if presentation:
            original_filename = presentation.filename
            presentation_filename = secure_filename(
                f"{uuid.uuid4()}_{original_filename}"
            )
            presentation_key = f"{folder}/{presentation_filename}"

            presentation.seek(0)
            s3_client.upload_fileobj(
                presentation,
                S3_BUCKET,
                presentation_key,
                ExtraArgs={"ContentType": "application/pdf"},
            )

            brdge.presentation_filename = presentation_filename

            # Start async processing after successful upload
            start_async_pdf_processing(brdge.id, original_filename, presentation_key)

        # Handle recording file (required)
        recording = request.files.get("screen_recording")
        if not recording:
            return jsonify({"error": "Recording file is required"}), 400

        # Save original WebM temporarily for processing
        temp_webm_path = f"/tmp/{str(uuid.uuid4())}.webm"
        recording.save(temp_webm_path)

        try:
            # Start transcription with WebM file (can happen in parallel)
            transcript_data = transcribe_audio_helper(
                temp_webm_path, f"/tmp/transcript_{brdge.id}.txt"
            )

            # Convert WebM to MP4
            mp4_path, conversion_success = convert_webm_to_mp4(temp_webm_path)

            if not conversion_success:
                raise Exception("Failed to convert video to MP4 format")

            # Upload MP4 to S3
            mp4_filename = os.path.basename(mp4_path)
            recording_key = f"{folder}/recordings/{mp4_filename}"

            with open(mp4_path, "rb") as mp4_file:
                s3_client.upload_fileobj(
                    mp4_file,
                    S3_BUCKET,
                    recording_key,
                    ExtraArgs={"ContentType": "video/mp4"},
                )

            # Create Recording object with MP4 info
            recording_obj = Recording(
                brdge_id=brdge.id,
                filename=mp4_filename,
                format="mp4",
                duration=recording_duration if recording_metadata else None,
            )
            db.session.add(recording_obj)

            # Create initial BrdgeScript object
            script_obj = BrdgeScript(
                brdge_id=brdge.id,
                status="pending",
                script_metadata={
                    "recording_filename": mp4_filename,
                    "duration": recording_duration,
                },
            )
            db.session.add(script_obj)

            try:
                # Initialize empty lists for words and segments
                words = []
                segments = []
                transcript_text = ""

                # Get the first alternative from the first channel
                channels = transcript_data.get("channels", [])
                if channels and len(channels) > 0:
                    alternatives = channels[0].get("alternatives", [])
                    if alternatives and len(alternatives) > 0:
                        alternative = alternatives[0]
                        transcript_text = alternative.get("transcript", "")

                        # Process word-level timing
                        for word in alternative.get("words", []):
                            words.append(
                                {
                                    "word": word.get(
                                        "punctuated_word", word.get("word", "")
                                    ),
                                    "start": word.get("start", 0),
                                    "end": word.get("end", 0),
                                    "confidence": word.get("confidence", 1.0),
                                }
                            )

                        # Create segments from the transcript if paragraphs not available
                        if not segments:
                            segments.append(
                                {
                                    "text": transcript_text,
                                    "start": 0,
                                    "end": (
                                        alternative.get("words", [])[-1].get("end", 0)
                                        if alternative.get("words")
                                        else 0
                                    ),
                                    "speaker": "Speaker 0",
                                }
                            )

                # Update script object with processed transcript data
                script_obj.content = {
                    "transcript": transcript_text,
                    "segments": segments,
                    "words": words,
                }
                script_obj.status = "completed"

            except Exception as e:
                logger.error(f"Transcription error: {e}")
                script_obj.status = "failed"
                script_obj.script_metadata = {
                    **script_obj.script_metadata,
                    "error": str(e),
                }

            finally:
                # Clean up temp files
                if os.path.exists(temp_webm_path):
                    os.remove(temp_webm_path)
                if os.path.exists(mp4_path):
                    os.remove(mp4_path)
                if os.path.exists(f"/tmp/transcript_{brdge.id}.txt"):
                    os.remove(f"/tmp/transcript_{brdge.id}.txt")

            db.session.commit()

            return (
                jsonify(
                    {
                        "message": "Brdge created successfully",
                        "brdge": brdge.to_dict(),
                        "script": script_obj.to_dict(),
                        "processing_status": "started" if presentation else None,
                    }
                ),
                201,
            )

        except Exception as e:
            db.session.rollback()
            logger.error(f"S3 upload error: {e}")
            return jsonify({"error": "Failed to upload files", "detail": str(e)}), 500

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error creating brdge: {e}")
        return jsonify({"error": "Error creating brdge", "detail": str(e)}), 500


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
    user = User.query.get(current_user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    # Get or create user account
    user_account = user.account or UserAccount(user_id=user.id)

    # Get payment method details if user has a Stripe customer ID
    payment_method_last4 = None
    if user_account.stripe_customer_id:
        try:
            # First get the customer
            customer = stripe.Customer.retrieve(user_account.stripe_customer_id)

            # If customer has an active subscription, get its payment method
            if user_account.stripe_subscription_id:
                subscription = stripe.Subscription.retrieve(
                    user_account.stripe_subscription_id
                )
                # Get the payment method directly from the subscription's payment method
                if subscription.default_payment_method:
                    payment_method = stripe.PaymentMethod.retrieve(
                        subscription.default_payment_method
                    )
                    if payment_method.card:
                        payment_method_last4 = payment_method.card.last4
            # Fallback to customer payment methods if no subscription
            else:
                # Check invoice_settings.default_payment_method first
                payment_method_id = customer.invoice_settings.default_payment_method

                if payment_method_id:
                    payment_method = stripe.PaymentMethod.retrieve(payment_method_id)
                    if payment_method.card:
                        payment_method_last4 = payment_method.card.last4
                # If no default payment method, check default_source
                elif customer.default_source:
                    payment_source = stripe.PaymentMethod.retrieve(
                        customer.default_source
                    )
                    if hasattr(payment_source, "card"):
                        payment_method_last4 = payment_source.card.last4

            logger.info(f"Payment method found: {payment_method_last4 is not None}")

        except Exception as e:
            logger.error("Error fetching payment method details")
            logger.debug(
                f"Error type: {type(e).__name__}"
            )  # Log only error type, not details

    response_data = {
        "email": user.email,
        "account": user_account.to_dict(),
        "payment_method_last4": payment_method_last4,
    }
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

            # Only update subscription status, keep account_type unchanged
            user_account.subscription_status = "canceled"

            # Save changes
            db.session.commit()

            return (
                jsonify(
                    {
                        "message": "Subscription canceled successfully",
                        "details": {
                            "message": "Your subscription has been canceled but your account will remain active. Our team will contact you about next steps.",
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
        Note: You must provide exactly {num_slides} scripts and agents in the JSON format

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
          "2": {{
            "script": "Now that we've covered the basics, let's dive into some specific techniques our team uses. I find that having a structured approach while staying flexible is key to successful project delivery.",
            "agent": "Agent Mode: Internal Training Agent   
                     
                     Identity:
                     - Demonstrates Sarah's detail-oriented approach
                     - Emphasizes practical implementation steps
                     - Balances structure with adaptability
                     
                     Knowledge Base:
                     - Specific project management techniques
                     - Implementation strategies and best practices
                     - Common pitfalls and solutions
          }}
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
                temperature=0.1,
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
@jwt_required(optional=True)
@cross_origin()
def get_brdge_scripts(brdge_id):
    """Get existing scripts for a brdge if they exist"""
    try:
        # Get current user (optional)
        current_user = get_current_user()

        # Get the brdge to check permissions
        brdge = Brdge.query.get_or_404(brdge_id)

        # Check if user has access (owner or public brdge)
        if not brdge.shareable and current_user and current_user.id != brdge.user_id:
            return jsonify({"error": "Unauthorized access"}), 403

        # Query the most recent script from database
        script = (
            Scripts.query.filter_by(brdge_id=brdge_id)
            .order_by(Scripts.generated_at.desc())
            .first()
        )

        if not script:
            logger.info(f"No scripts found for brdge {brdge_id}")
            return (
                jsonify(
                    {
                        "has_scripts": False,
                        "message": "No scripts found",
                        "brdge_id": brdge_id,
                    }
                ),
                200,
            )

        logger.info(f"Found scripts for brdge {brdge_id}")
        return (
            jsonify(
                {
                    "has_scripts": True,
                    "scripts": script.scripts,
                    "metadata": {
                        "generated_at": script.generated_at.isoformat(),
                        "source_walkthrough_id": script.walkthrough_id,
                        "brdge_id": brdge_id,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Error fetching scripts for brdge {brdge_id}: {str(e)}")
        return (
            jsonify(
                {
                    "error": str(e),
                    "message": "Error fetching scripts",
                    "details": {"brdge_id": brdge_id, "error_type": type(e).__name__},
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

                    # Deactivate all other voices for this brdge
                    existing_voices = Voice.query.filter_by(brdge_id=brdge_id).all()
                    for v in existing_voices:
                        v.status = "inactive"

                    # Set the newly created voice to active
                    voice.status = "active"

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


@app.route("/api/brdges/<int:brdge_id>/scripts/update", methods=["PUT"])
def update_scripts(brdge_id):
    try:
        data = request.json.get("scripts", {})

        # Get existing scripts
        script = (
            Scripts.query.filter_by(brdge_id=brdge_id)
            .order_by(Scripts.generated_at.desc())
            .first()
        )

        if not script:
            return jsonify({"error": "No scripts found"}), 404

        existing_scripts = script.scripts

        # Update only the fields that were sent
        for slide_number, updated_content in data.items():
            if slide_number not in existing_scripts:
                existing_scripts[slide_number] = {}

            if "script" in updated_content:
                existing_scripts[slide_number]["script"] = updated_content["script"]
            if "agent" in updated_content:
                existing_scripts[slide_number]["agent"] = updated_content["agent"]

        # Create new version with updated content
        new_script = Scripts(
            brdge_id=brdge_id,
            walkthrough_id=script.walkthrough_id,
            scripts=existing_scripts,
            generated_at=datetime.utcnow(),
        )

        db.session.add(new_script)
        db.session.commit()

        return jsonify(
            {"message": "Scripts updated successfully", "scripts": new_script.scripts}
        )

    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating scripts: {e}")
        return jsonify({"error": str(e)}), 500


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


# Add this new route for AI script editing
@app.route("/api/brdges/<int:brdge_id>/scripts/ai-edit", methods=["GET"])
def ai_edit_script(brdge_id):
    try:
        # Parse query params
        slide_number = request.args.get("slideNumber")
        edit_instruction = request.args.get("instruction")
        edit_speech = request.args.get("editSpeech", "true").lower() == "true"
        edit_knowledge = request.args.get("editKnowledge", "true").lower() == "true"
        walkthrough_id = request.args.get("walkthroughId")

        if not slide_number or not edit_instruction:
            return jsonify({"error": "Missing required parameters"}), 400

        if not edit_speech and not edit_knowledge:
            return jsonify({"error": "At least one edit target must be selected"}), 400

        current_content_str = request.args.get("currentContent", "{}")
        current_content = json.loads(current_content_str)

        # Get the latest script to use as base for the new version
        script = (
            Scripts.query.filter_by(brdge_id=brdge_id)
            .order_by(Scripts.generated_at.desc())
            .first()
        )
        if not script:
            return jsonify({"error": "No scripts found for this brdge"}), 404

        script_system_prompt = """You are an advanced AI writing assistant specializing in presentation script optimization.

        Core Guidelines for Presentation Scripts:
        - Write in plain text only - NO markup, NO special characters
        - NO emphasis markers, NO pause indicators, NO annotations
        - Use natural speech patterns and clear punctuation
        - Write numbers as they should be spoken
        - Use contractions naturally (I'm, we're, let's)
        - Keep sentences concise and flowing
        - Write exactly as it should be read aloud
        - Avoid any formatting or special characters
        - Return only the script content, no additional text or markers

        Remember: Focus on creating engaging, natural speech that flows well when spoken aloud.
        """

        knowledge_system_prompt = """You are an advanced AI writing assistant specializing in AI knowledge base optimization.

        Core Guidelines for AI Knowledge Base:
        - Structure information hierarchically
        - Include key concepts and their relationships
        - Add relevant examples and use cases
        - Include domain-specific terminology
        - Add engagement prompts and follow-up questions
        - Focus on factual content and context
        - Return only the knowledge content, no additional text or markers

        Remember: Focus on creating comprehensive, well-structured knowledge that helps the AI understand and respond effectively.
        """

        def generate():
            try:
                results = {"script": None, "agent": None, "type": None}

                # Generate script if requested
                if edit_speech:
                    results["type"] = "script"
                    for chunk in generate_script():
                        if isinstance(chunk, dict):
                            yield f"data: {json.dumps({'type': 'script', 'token': chunk.get('token', '')})}\n\n"
                            results["script"] = (results["script"] or "") + chunk.get(
                                "token", ""
                            )

                # Generate knowledge if requested
                if edit_knowledge:
                    results["type"] = "agent" if not edit_speech else "both"
                    for chunk in generate_knowledge():
                        if isinstance(chunk, dict):
                            yield f"data: {json.dumps({'type': 'agent', 'token': chunk.get('token', '')})}\n\n"
                            results["agent"] = (results["agent"] or "") + chunk.get(
                                "token", ""
                            )

                # Send final content with type information
                final_content = {
                    "type": results["type"],
                    "content": {
                        "script": (
                            results["script"]
                            if edit_speech
                            else current_content.get("script", "")
                        ),
                        "agent": (
                            results["agent"]
                            if edit_knowledge
                            else current_content.get("agent", "")
                        ),
                    },
                }

                yield f"data: {json.dumps({'final': final_content})}\n\n"
                yield "data: [DONE]\n\n"

            except Exception as e:
                app.logger.error(f"Error in stream generation: {e}")
                yield f"data: {json.dumps({'error': str(e)})}\n\n"

        def generate_script():
            try:
                client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
                stream = client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": script_system_prompt},
                        {
                            "role": "user",
                            "content": f"""
                            Original Script: {current_content.get('script', '')}
                            Edit Request: {edit_instruction}
                            
                            Please modify the script according to this request.
                            Return only the modified script content.
                        """,
                        },
                    ],
                    stream=True,
                    temperature=0.0,
                )

                for chunk in stream:
                    if chunk.choices[0].delta.content:
                        content = chunk.choices[0].delta.content
                        if content.strip():
                            yield {"token": content}

            except Exception as e:
                app.logger.error(f"Error generating script: {e}")
                raise

        def generate_knowledge():
            try:
                client = openai.OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
                stream = client.chat.completions.create(
                    model="gpt-4o",
                    messages=[
                        {"role": "system", "content": knowledge_system_prompt},
                        {
                            "role": "user",
                            "content": f"""
                            Original Knowledge: {current_content.get('agent', '')}
                            Edit Request: {edit_instruction}
                            
                            Please modify the knowledge base according to this request.
                            Return only the modified knowledge content.
                        """,
                        },
                    ],
                    stream=True,
                    temperature=0.0,
                )

                for chunk in stream:
                    if chunk.choices[0].delta.content:
                        content = chunk.choices[0].delta.content
                        if content.strip():
                            yield {"token": content}

            except Exception as e:
                app.logger.error(f"Error generating knowledge: {e}")
                raise

        return Response(
            stream_with_context(generate()),
            mimetype="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "Content-Type": "text/event-stream",
                "X-Accel-Buffering": "no",
                "Access-Control-Allow-Origin": "*",
            },
        )
    except Exception as e:
        app.logger.error(f"Error in ai_edit_script: {e}")
        return jsonify({"error": str(e)}), 500


# Add new endpoint to get script history
@app.route("/api/brdges/<int:brdge_id>/scripts/history", methods=["GET"])
def get_script_history(brdge_id):
    try:
        # Get all script versions for this brdge, ordered by timestamp
        scripts = (
            Scripts.query.filter_by(brdge_id=brdge_id)
            .order_by(Scripts.generated_at.desc())
            .all()
        )
        return jsonify([script.to_dict() for script in scripts])
    except Exception as e:
        app.logger.error(f"Error fetching script history: {e}")
        return jsonify({"error": str(e)}), 500


# Add endpoint to restore a previous version
@app.route(
    "/api/brdges/<int:brdge_id>/scripts/<int:script_id>/restore", methods=["POST"]
)
def restore_script_version(brdge_id, script_id):
    try:
        # Find the script version to restore
        script_to_restore = Scripts.query.get(script_id)
        if not script_to_restore or script_to_restore.brdge_id != brdge_id:
            return jsonify({"error": "Script version not found"}), 404

        # Create a new version with the restored content
        new_script_version = Scripts(
            brdge_id=brdge_id,
            walkthrough_id=script_to_restore.walkthrough_id,
            scripts=script_to_restore.scripts,
            generated_at=datetime.utcnow(),
        )
        db.session.add(new_script_version)
        db.session.commit()

        return jsonify(new_script_version.to_dict())
    except Exception as e:
        app.logger.error(f"Error restoring script version: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/brdges/<int:brdge_id>/voices", methods=["GET"])
def get_voices(brdge_id):
    try:
        voices = Voice.query.filter_by(brdge_id=brdge_id).all()
        return jsonify(
            {
                "voices": [
                    {
                        "id": voice.id,
                        "name": voice.name,
                        "created_at": voice.created_at.isoformat(),
                        "active": True,  # All voices are active by default for now
                    }
                    for voice in voices
                ]
            }
        )
    except Exception as e:
        app.logger.error(f"Error fetching voices: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/brdges/<int:brdge_id>/recordings/latest/signed-url", methods=["GET"])
def get_recording_signed_url(brdge_id):
    try:
        recording = (
            Recording.query.filter_by(brdge_id=brdge_id)
            .order_by(Recording.created_at.desc())
            .first()
        )

        if not recording:
            return jsonify({"error": "No recording found"}), 404

        # Configure S3 client with the correct signature version
        s3_client = boto3.client(
            "s3",
            region_name=S3_REGION,
            config=Config(signature_version="s3v4", s3={"addressing_style": "virtual"}),
        )

        s3_key = f"{recording.brdge.folder}/recordings/{recording.filename}"

        # Determine content type based on file extension
        content_type = "video/*"  # Default to any video format
        if recording.filename.endswith(".webm"):
            content_type = "video/webm"
        elif recording.filename.endswith(".mp4"):
            content_type = "video/mp4"

        # Generate signed URL with generic video content type
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={
                "Bucket": S3_BUCKET,
                "Key": s3_key,
                "ResponseContentType": content_type,
                "ResponseContentDisposition": "inline",
                "ResponseCacheControl": "no-cache",
                "ResponseExpires": "0",
            },
            ExpiresIn=3600,
        )

        return jsonify(
            {
                "url": url,
                "format": recording.format,
                "duration": recording.duration,
                "created_at": (
                    recording.created_at.isoformat() if recording.created_at else None
                ),
            }
        )

    except Exception as e:
        logger.error(f"Error generating signed URL for recording: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/brdges/<int:brdge_id>/script", methods=["GET"])
def get_brdge_script(brdge_id):
    try:
        script = (
            BrdgeScript.query.filter_by(brdge_id=brdge_id)
            .order_by(BrdgeScript.created_at.desc())
            .first()
        )

        if not script:
            return jsonify({"error": "No script found"}), 404

        return jsonify(script.to_dict())

    except Exception as e:
        logger.error(f"Error fetching script: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/brdges/<int:brdge_id>/agent-config", methods=["GET"])
def get_agent_config(brdge_id):
    try:
        # Add debug logging
        logger.info(f"Fetching agent config for brdge {brdge_id}")

        brdge = Brdge.query.get_or_404(brdge_id)

        # Debug log the brdge object
        logger.info(f"Brdge data: {brdge.to_dict()}")

        # Create config structure using the actual agent_personality from the brdge
        config = {
            "personality": (
                brdge.agent_personality if hasattr(brdge, "agent_personality") else ""
            ),
            "knowledgeBase": [
                {
                    "id": "presentation",
                    "type": "presentation",
                    "name": brdge.presentation_filename,
                    "content": "",
                }
            ],
        }

        # Add any additional knowledge base entries
        knowledge_entries = KnowledgeBase.query.filter_by(brdge_id=brdge_id).all()
        for entry in knowledge_entries:
            config["knowledgeBase"].append(
                {
                    "id": str(entry.id),
                    "type": "custom",
                    "name": entry.name,
                    "content": entry.content,
                }
            )

        logger.info(f"Returning config: {config}")
        return jsonify(config)

    except Exception as e:
        logger.error(f"Error fetching agent config: {e}")
        # Add more detailed error logging
        logger.error(f"Error details: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/brdges/<int:brdge_id>/agent-config", methods=["PUT"])
def update_agent_config(brdge_id):
    try:
        brdge = Brdge.query.get_or_404(brdge_id)
        data = request.json

        # Update personality
        brdge.agent_personality = data.get("personality", "")

        # Update knowledge base entries
        KnowledgeBase.query.filter_by(brdge_id=brdge_id).delete()

        for entry in data.get("knowledgeBase", []):
            if entry["type"] != "presentation":  # Skip presentation entry
                new_entry = KnowledgeBase(
                    brdge_id=brdge_id, name=entry["name"], content=entry["content"]
                )
                db.session.add(new_entry)

        db.session.commit()
        return jsonify({"message": "Configuration updated successfully"})

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating agent config: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/brdges/<int:brdge_id>/voice/activate", methods=["POST"])
def activate_voice(brdge_id):
    """Activate a voice for a brdge"""
    try:
        data = request.get_json()
        voice_id = data.get("voice_id")

        if not voice_id:
            return jsonify({"error": "voice_id is required"}), 400

        # First, set all voices for this brdge to inactive
        voices = Voice.query.filter_by(brdge_id=brdge_id).all()
        for voice in voices:
            voice.status = "inactive"

        # Then activate the selected voice
        voice = Voice.query.filter_by(
            brdge_id=brdge_id, cartesia_voice_id=voice_id
        ).first()

        if not voice:
            return jsonify({"error": "Voice not found"}), 404

        voice.status = "active"
        db.session.commit()

        return jsonify(
            {"message": "Voice activated successfully", "voice": voice.to_dict()}
        )
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error activating voice: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/brdges/<int:brdge_id>/voice/deactivate", methods=["POST"])
def deactivate_voice(brdge_id):
    """Deactivate a voice for a brdge"""
    try:
        data = request.get_json()
        voice_id = data.get("voice_id")

        if not voice_id:
            return jsonify({"error": "voice_id is required"}), 400

        voice = Voice.query.filter_by(
            brdge_id=brdge_id, cartesia_voice_id=voice_id
        ).first()

        if not voice:
            return jsonify({"error": "Voice not found"}), 404

        voice.status = "inactive"
        db.session.commit()

        return jsonify(
            {"message": "Voice deactivated successfully", "voice": voice.to_dict()}
        )
    except Exception as e:
        db.session.rollback()
        logger.error(f"Error deactivating voice: {str(e)}")
        return jsonify({"error": str(e)}), 500


def start_async_pdf_processing(brdge_id: int, presentation_filename: str, s3_key: str):
    """
    Start asynchronous PDF processing in a separate thread
    """

    def run_async():
        try:
            # Create application context
            with app.app_context():
                # Create a new scoped session for this thread
                thread_session = scoped_session(sessionmaker(bind=db.engine))

                # Create event loop for this thread
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)

                # Run the processing
                try:
                    loop.run_until_complete(
                        process_pdf_document(brdge_id, presentation_filename, s3_key)
                    )
                except Exception as e:
                    logger.error(f"Error in PDF processing: {str(e)}")
                    # Update document status to failed
                    doc_knowledge = (
                        thread_session.query(DocumentKnowledge)
                        .filter_by(
                            brdge_id=brdge_id,
                            presentation_filename=presentation_filename,
                        )
                        .first()
                    )
                    if doc_knowledge:
                        doc_knowledge.status = "failed"
                        doc_knowledge.error_message = str(e)
                        thread_session.commit()
                finally:
                    loop.close()
                    thread_session.remove()

        except Exception as e:
            logger.error(f"Critical error in processing thread: {str(e)}")

    # Create and start the processing thread
    processing_thread = Thread(target=run_async)
    processing_thread.daemon = True  # Make thread daemon so it doesn't block shutdown
    processing_thread.start()

    logger.info(f"Started PDF processing thread for brdge {brdge_id}")


@app.route("/api/brdges/<int:brdge_id>/presentation", methods=["POST"])
def upload_presentation(brdge_id):
    try:
        # Get the brdge and verify ownership
        brdge = Brdge.query.get_or_404(brdge_id)

        # Get the uploaded file
        if "presentation" not in request.files:
            return jsonify({"error": "No presentation file in request"}), 422

        presentation = request.files["presentation"]
        if not presentation.filename:
            return jsonify({"error": "No selected file"}), 422

        # Check file type
        if not presentation.filename.lower().endswith(".pdf"):
            return jsonify({"error": "Only PDF files are allowed"}), 422

        # Validate file size
        if presentation.content_length > MAX_PDF_SIZE:
            return (
                jsonify(
                    {
                        "error": "PDF file size too large",
                        "message": "PDF file size exceeds 20MB limit. Please upload a smaller file.",
                        "max_size_mb": MAX_PDF_SIZE / (1024 * 1024),
                    }
                ),
                422,
            )

        # Generate unique filename and update brdge
        original_filename = presentation.filename
        presentation_filename = secure_filename(f"{uuid.uuid4()}_{original_filename}")

        # Upload to S3 using the brdge's folder
        presentation_key = f"{brdge.folder}/{presentation_filename}"
        presentation.seek(0)
        s3_client.upload_fileobj(
            presentation,
            S3_BUCKET,
            presentation_key,
            ExtraArgs={"ContentType": "application/pdf"},
        )

        # Update brdge
        brdge.presentation_filename = presentation_filename
        db.session.commit()

        # Start async processing
        start_async_pdf_processing(brdge_id, original_filename, presentation_key)

        return (
            jsonify(
                {
                    "message": "Presentation uploaded successfully",
                    "presentation_filename": presentation_filename,
                    "folder": brdge.folder,
                    "processing_status": "started",
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Error uploading presentation: {str(e)}")
        db.session.rollback()
        return jsonify({"error": str(e)}), 500


# Add a new endpoint to check processing status
@app.route("/api/brdges/<int:brdge_id>/presentation/status", methods=["GET"])
def get_presentation_processing_status(brdge_id):
    try:
        doc_knowledge = (
            DocumentKnowledge.query.filter_by(brdge_id=brdge_id)
            .order_by(DocumentKnowledge.created_at.desc())
            .first()
        )

        if not doc_knowledge:
            return (
                jsonify(
                    {"status": "not_found", "message": "No document processing found"}
                ),
                404,
            )

        return jsonify(
            {
                "status": doc_knowledge.status,
                "error_message": (
                    doc_knowledge.error_message
                    if doc_knowledge.status == "failed"
                    else None
                ),
                "metadata": (
                    {
                        "total_pages": doc_knowledge.total_pages,
                        "total_words": doc_knowledge.total_words,
                        "created_at": doc_knowledge.created_at.isoformat(),
                        "updated_at": (
                            doc_knowledge.updated_at.isoformat()
                            if doc_knowledge.updated_at
                            else None
                        ),
                    }
                    if doc_knowledge.status == "completed"
                    else None
                ),
            }
        )
    except Exception as e:
        logger.error(f"Error checking presentation status: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/brdges/<int:brdge_id>/pdf/status", methods=["GET"])
def get_pdf_processing_status(brdge_id):
    """Get the status of PDF processing for a brdge"""
    try:
        doc_knowledge = (
            DocumentKnowledge.query.filter_by(brdge_id=brdge_id)
            .order_by(DocumentKnowledge.created_at.desc())
            .first()
        )

        if not doc_knowledge:
            return (
                jsonify(
                    {
                        "status": "not_found",
                        "message": "No PDF processing found for this brdge",
                    }
                ),
                404,
            )

        return jsonify(
            {
                "status": doc_knowledge.status,
                "error": (
                    doc_knowledge.error_message
                    if doc_knowledge.status == "failed"
                    else None
                ),
                "progress": (
                    {
                        "total_pages": doc_knowledge.total_pages,
                        "total_words": doc_knowledge.total_words,
                        "created_at": doc_knowledge.created_at.isoformat(),
                        "updated_at": (
                            doc_knowledge.updated_at.isoformat()
                            if doc_knowledge.updated_at
                            else None
                        ),
                    }
                    if doc_knowledge.status == "completed"
                    else None
                ),
            }
        )

    except Exception as e:
        logger.error(f"Error checking PDF status: {str(e)}")
        return jsonify({"error": str(e)}), 500


async def process_pdf_document(brdge_id: int, presentation_filename: str, s3_key: str):
    """
    Asynchronously process a PDF document and store extracted information using GPT-4V
    """
    # Get the thread-local session
    thread_session = scoped_session(sessionmaker(bind=db.engine))

    try:
        logger.info(f"Starting PDF processing for brdge {brdge_id}")

        # Create initial document knowledge entry
        doc_knowledge = DocumentKnowledge(
            brdge_id=brdge_id,
            presentation_filename=presentation_filename,
            s3_location=s3_key,
            status="processing",
        )
        thread_session.add(doc_knowledge)
        thread_session.commit()
        logger.info(f"Created document knowledge entry for brdge {brdge_id}")

        # Download PDF from S3
        temp_pdf_path = f"/tmp/{presentation_filename}"
        s3_client.download_file(S3_BUCKET, s3_key, temp_pdf_path)
        logger.info(f"Downloaded PDF from S3 for brdge {brdge_id}")

        # Convert PDF to images using pdf_to_images utility
        slide_images = pdf_to_images(temp_pdf_path)
        total_pages = len(slide_images)
        logger.info(f"Converted {total_pages} pages to images for brdge {brdge_id}")

        # Prepare images for GPT-4V
        image_data = []
        for idx, image in enumerate(slide_images, 1):
            # Convert PIL Image to base64
            buffered = BytesIO()
            image.save(buffered, format="JPEG", quality=60)
            img_str = base64.b64encode(buffered.getvalue()).decode()
            image_data.append(
                {"slide_number": str(idx), "image": f"data:image/jpeg;base64,{img_str}"}
            )
        logger.info(f"Prepared image data for GPT-4V for brdge {brdge_id}")

        # Use OpenAI to analyze content with GPT-4V
        client = AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
        analysis_prompt = """Analyze these presentation slides and extract:
        1. Main topics and themes
        2. Key points per slide
        3. Important entities (people, companies, technical terms, etc.)
        4. Text content from each slide
        
        Return a JSON object with these keys:
        {
            "topics": ["topic1", "topic2", ...],
            "key_points": {"1": ["point1", "point2"], "2": ["point1", "point2"], ...},
            "entities": {
                "technical_terms": ["term1", "term2"],
                "people": ["person1", "person2"],
                "companies": ["company1", "company2"],
                "other": ["entity1", "entity2"]
            },
            "slide_contents": {"1": "text content", "2": "text content", ...}
        }
        """

        # Prepare messages with images
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": analysis_prompt},
                    *[
                        {
                            "type": "image_url",
                            "image_url": {"url": slide["image"], "detail": "low"},
                        }
                        for slide in image_data
                    ],
                ],
            }
        ]

        logger.info(f"Calling GPT-4V for analysis for brdge {brdge_id}")
        response = await client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.2,
        )

        analysis_result = json.loads(response.choices[0].message.content)
        logger.info(f"Received analysis from GPT-4V for brdge {brdge_id}")

        # Calculate total words from extracted text
        total_words = sum(
            len(text.split())
            for text in analysis_result.get("slide_contents", {}).values()
        )

        # Update document knowledge
        doc_knowledge.total_pages = total_pages
        doc_knowledge.total_words = total_words
        doc_knowledge.slide_contents = analysis_result.get("slide_contents", {})
        doc_knowledge.topics = analysis_result.get("topics", [])
        doc_knowledge.key_points = analysis_result.get("key_points", {})
        doc_knowledge.entities = analysis_result.get("entities", {})
        doc_knowledge.status = "completed"
        thread_session.commit()
        logger.info(f"Updated document knowledge with analysis for brdge {brdge_id}")

        # Cleanup
        os.remove(temp_pdf_path)
        logger.info(f"Completed PDF processing for brdge {brdge_id}")

    except Exception as e:
        logger.error(f"Error processing PDF for brdge {brdge_id}: {str(e)}")
        if "doc_knowledge" in locals():
            doc_knowledge.status = "failed"
            doc_knowledge.error_message = str(e)
            thread_session.commit()
        raise
    finally:
        thread_session.remove()  # Clean up the session


@app.route("/api/brdges/<int:brdge_id>/document-knowledge", methods=["GET"])
def get_document_knowledge(brdge_id):
    """Get the document knowledge content for a brdge"""
    try:
        # Get the latest document knowledge entry
        doc_knowledge = (
            DocumentKnowledge.query.filter_by(brdge_id=brdge_id)
            .order_by(DocumentKnowledge.created_at.desc())
            .first()
        )

        if not doc_knowledge or doc_knowledge.status != "completed":
            return (
                jsonify(
                    {
                        "topics": [],
                        "key_points": {},
                        "entities": {
                            "technical_terms": [],
                            "people": [],
                            "companies": [],
                            "other": [],
                        },
                        "slide_contents": {},
                    }
                ),
                200,
            )

        return (
            jsonify(
                {
                    "topics": doc_knowledge.topics,
                    "key_points": doc_knowledge.key_points,
                    "entities": doc_knowledge.entities,
                    "slide_contents": doc_knowledge.slide_contents,
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Error fetching document knowledge: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/brdge/<int:brdge_id>/check-auth", methods=["GET", "OPTIONS"])
@cross_origin()
@jwt_required(optional=True)  # Make JWT optional for OPTIONS request
def check_brdge_auth(brdge_id):
    # Handle preflight OPTIONS request
    if request.method == "OPTIONS":
        return jsonify({"message": "OK"}), 200

    try:
        # Get current user from JWT
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({"error": "Authentication required"}), 401

        # Query the brdge
        brdge = Brdge.query.get_or_404(brdge_id)

        # Check if user owns the brdge
        if brdge.user_id != current_user_id:
            return jsonify({"error": "Unauthorized"}), 403

        return jsonify(
            {
                "authorized": True,
                "brdge": {"id": brdge.id, "public_id": brdge.public_id},
            }
        )

    except Exception as e:
        print(f"Error in check_brdge_auth: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500


@app.route("/api/brdges/<int:brdge_id>/agent-data", methods=["GET"])
def get_agent_data(brdge_id):
    try:
        logger.info(f"Fetching consolidated agent data for brdge {brdge_id}")

        # Get the brdge
        brdge = Brdge.query.get_or_404(brdge_id)

        # Get agent config (personality and knowledge base)
        config = {
            "personality": (
                brdge.agent_personality if hasattr(brdge, "agent_personality") else ""
            ),
            "knowledgeBase": [
                {
                    "id": "presentation",
                    "type": "presentation",
                    "name": brdge.presentation_filename,
                    "content": "",
                }
            ],
        }

        # Add knowledge base entries
        knowledge_entries = KnowledgeBase.query.filter_by(brdge_id=brdge_id).all()
        for entry in knowledge_entries:
            config["knowledgeBase"].append(
                {
                    "id": str(entry.id),
                    "type": "custom",
                    "name": entry.name,
                    "content": entry.content,
                }
            )

        # Get document knowledge
        doc_knowledge = DocumentKnowledge.query.filter_by(brdge_id=brdge_id).first()
        document_knowledge_data = {}
        if doc_knowledge:
            document_knowledge_data = {
                "slide_contents": doc_knowledge.slide_contents,
                "topics": doc_knowledge.topics,
                "key_points": doc_knowledge.key_points,
                "entities": doc_knowledge.entities,
            }

        # Get active voice
        active_voice = Voice.query.filter_by(brdge_id=brdge_id, status="active").first()
        voice_data = active_voice.to_dict() if active_voice else None

        # Get latest script/transcript
        script = (
            BrdgeScript.query.filter_by(brdge_id=brdge_id)
            .order_by(BrdgeScript.created_at.desc())
            .first()
        )
        script_data = script.to_dict() if script else {}

        # Combine all data
        consolidated_data = {
            "personality": config["personality"],
            "knowledgeBase": config["knowledgeBase"],
            "documentKnowledge": document_knowledge_data,
            "activeVoice": voice_data,
            "transcript": script_data,
            "brdgeId": brdge_id,
            "userId": brdge.user_id,
        }

        logger.info("Successfully compiled consolidated agent data")
        return jsonify(consolidated_data)

    except Exception as e:
        logger.error(f"Error fetching consolidated agent data: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/update-overage-settings", methods=["POST"])
@login_required
def update_overage_settings(user):
    try:
        data = request.get_json()
        allow_overage = data.get("allow_overage")

        if allow_overage is None:
            return jsonify({"error": "allow_overage parameter is required"}), 400

        # Get user account
        user_account = UserAccount.query.filter_by(user_id=user.id).first()
        if not user_account:
            return jsonify({"error": "User account not found"}), 404

        # Update the setting
        user_account.allow_overage = allow_overage
        db.session.commit()

        return jsonify(
            {
                "success": True,
                "message": "Overage settings updated successfully",
                "allow_overage": user_account.allow_overage,
            }
        )

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating overage settings: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/contact", methods=["POST"])
@login_required
def contact(user):
    try:
        data = request.get_json()
        message = data.get("message")

        if not message:
            return jsonify({"error": "Message is required"}), 400

        # Get user's email directly from the User object
        if not user.email:
            return jsonify({"error": "User email not found"}), 404

        # Log the issue in the database
        new_issue = UserIssues(user_id=user.id, message=message, status="pending")
        db.session.add(new_issue)
        db.session.commit()

        logger.info(
            f"New support request logged - Issue ID: {new_issue.id}, User: {user.email}"
        )

        return jsonify(
            {
                "success": True,
                "message": "Your message has been sent successfully",
                "issue_id": new_issue.id,
            }
        )

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error logging contact request: {e}")
        return jsonify({"error": str(e)}), 500
