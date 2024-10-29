# routes.py
# brian voice :nPczCjzI2devNBz1zQrb
import re
from flask import request, jsonify, send_file, abort, url_for, current_app
from flask_cors import CORS, cross_origin
from app import app, db
from werkzeug.utils import secure_filename
import os
import boto3
import uuid
from models import Brdge, User, UserAccount
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
from sqlalchemy import text

# Set botocore to only log errors
logging.getLogger("botocore").setLevel(logging.ERROR)
logging.getLogger("boto3").setLevel(logging.ERROR)

# AWS S3 configuration
S3_BUCKET = os.getenv("S3_BUCKET")
S3_REGION = os.getenv("S3_REGION", "us-east-1")  # Default to 'us-east-1' if not set

# Initialize S3 client with the correct region
s3_client = boto3.client("s3", region_name=S3_REGION)

# Enable CORS for all routes
CORS(app)

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
endpoint_secret = os.getenv("STRIPE_WEBHOOK_SECRET")

# Add these constants at the top of the file with other configurations
STRIPE_PRICE_ID = os.getenv("STRIPE_PRICE_ID")  # Add this to your .env file
STRIPE_PRODUCT_PRICE = 5900  # Price in cents ($59.00)
STRIPE_PRODUCT_CURRENCY = "usd"


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
        # Delete associated files from S3
        s3_folder = brdge.folder
        s3_objects = s3_client.list_objects_v2(Bucket=S3_BUCKET, Prefix=s3_folder)
        for obj in s3_objects.get("Contents", []):
            s3_client.delete_object(Bucket=S3_BUCKET, Key=obj["Key"])

        # Delete the brdge from the database
        db.session.delete(brdge)
        db.session.commit()

        return jsonify({"message": "Brdge deleted successfully"}), 200
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error deleting brdge: {str(e)}")
        return jsonify({"error": "An error occurred while deleting the brdge"}), 500


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

        # Update brdge data
        brdge.presentation_filename = presentation_filename
        brdge.folder = str(brdge.id)

        # Upload PDF to S3
        s3_folder = brdge.folder
        s3_presentation_key = f"{s3_folder}/{presentation_filename}"
        s3_client.upload_file(pdf_temp_path, S3_BUCKET, s3_presentation_key)

        # Upload slide images to S3
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

        return (
            jsonify(
                {
                    "message": "Brdge created successfully",
                    "brdge": brdge.to_dict(),
                    "num_slides": len(slide_images),
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


@app.route("/api/brdges/<string:brdge_id>/audio/generated/<filename>", methods=["GET"])
@app.route("/api/brdges/<int:brdge_id>/audio/generated/<filename>", methods=["GET"])
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
def check_auth():
    current_user_id = get_jwt_identity()
    return jsonify(logged_in_as=current_user_id), 200


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
def google_auth():
    try:
        data = request.get_json()
        credential = data.get("credential")  # Changed from 'token' to 'credential'

        if not credential:
            print("No credential provided in request")
            return jsonify({"error": "No credential provided"}), 400

        try:
            idinfo = id_token.verify_oauth2_token(
                credential,  # Use credential instead of token
                google_requests.Request(),
                os.getenv("GOOGLE_CLIENT_ID"),
            )

            # Verify issuer
            if idinfo["iss"] not in [
                "accounts.google.com",
                "https://accounts.google.com",
            ]:
                return jsonify({"error": "Wrong issuer"}), 400

            # Get user email
            email = idinfo["email"]

            # Find or create user
            user = User.query.filter_by(email=email).first()
            if not user:
                user = User(
                    email=email, password_hash=""
                )  # Google users don't need password
                db.session.add(user)
                db.session.flush()  # Get the user ID

                # Create user account
                new_account = UserAccount(
                    user_id=user.id, account_type="free", created_at=datetime.utcnow()
                )
                db.session.add(new_account)
                db.session.commit()

            # Generate JWT token
            access_token = create_access_token(identity=user.id)
            return jsonify({"access_token": access_token}), 200

        except ValueError as e:
            print(f"Invalid token: {str(e)}")
            return jsonify({"error": "Invalid token"}), 400

    except Exception as e:
        print(f"Unexpected error in google_auth: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.before_request
def log_request_info():
    print(f"Request: {request.method} {request.path}")


@app.route("/api/auth/verify", methods=["GET"])
@jwt_required()
def verify_token():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user:
        return jsonify({"verified": True, "user_id": current_user_id}), 200
    else:
        return jsonify({"verified": False}), 401


@app.route("/api/user/profile", methods=["GET"])
@jwt_required()
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


@app.route("/api/create-checkout-session", methods=["POST"])
@jwt_required()
def create_checkout_session():
    try:
        data = request.get_json()
        tier = data.get("tier")

        # Use relative URLs for success/cancel to work in popup
        success_url = (
            f"{os.getenv('FRONTEND_URL')}/profile?payment_status=success&tier={tier}"
        )
        cancel_url = f"{os.getenv('FRONTEND_URL')}/profile?payment_status=cancelled"

        if tier == "standard":
            payment_link = os.getenv("STRIPE_STANDARD_PAYMENT_LINK")
        elif tier == "premium":
            payment_link = os.getenv("STRIPE_PREMIUM_PAYMENT_LINK")
        else:
            return jsonify({"error": "Invalid subscription tier"}), 400

        # Add success and cancel URLs to payment link
        payment_link = (
            f"{payment_link}?success_url={success_url}&cancel_url={cancel_url}"
        )

        print(f"Created payment link: {payment_link}")  # Debug log
        return jsonify({"url": payment_link})

    except Exception as e:
        print(f"Error creating checkout session: {str(e)}")
        return jsonify({"error": str(e)}), 400


@app.route("/api/verify-subscription", methods=["POST"])
@jwt_required()
def verify_subscription():
    try:
        current_user_id = get_jwt_identity()
        print(f"Verifying subscription for user {current_user_id}")

        user = User.query.get(current_user_id)
        if not user:
            print(f"User {current_user_id} not found")
            return jsonify({"error": "User not found"}), 404

        data = request.get_json()
        tier = data.get("tier")

        print(f"Received subscription request - User: {current_user_id}, Tier: {tier}")

        if not tier:
            print("No tier specified in request")
            return jsonify({"error": "No tier specified"}), 400

        tier_mapping = {"standard": "standard", "premium": "pro"}

        if tier not in tier_mapping:
            print(f"Invalid tier specified: {tier}")
            return jsonify({"error": "Invalid tier specified"}), 400

        try:
            # Get or create user account
            user_account = user.account
            if not user_account:
                print("Creating new user account")
                user_account = UserAccount(
                    user_id=user.id,
                    account_type=tier_mapping[tier],
                    created_at=datetime.utcnow(),
                )
                db.session.add(user_account)
            else:
                print(
                    f"Updating existing account from {user_account.account_type} to {tier_mapping[tier]}"
                )
                user_account.account_type = tier_mapping[tier]

            db.session.commit()
            print(f"Successfully updated user {user.id} to {tier_mapping[tier]} plan")

            return (
                jsonify(
                    {
                        "success": True,
                        "message": "Subscription updated successfully",
                        "new_tier": tier_mapping[tier],
                    }
                ),
                200,
            )

        except Exception as e:
            print(f"Database error: {str(e)}")
            db.session.rollback()
            return jsonify({"error": "Database error occurred"}), 500

    except Exception as e:
        print(f"Unexpected error: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/user/stats", methods=["GET"])
@jwt_required()
def get_user_stats():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Get brdge count
        brdges_count = Brdge.query.filter_by(user_id=current_user_id).count()

        # Get limit based on account type
        limit = {"free": 2, "standard": 20, "pro": float("inf")}.get(
            user.account.account_type, 2
        )

        return jsonify(
            {
                "brdges_created": brdges_count,
                "brdges_limit": "Unlimited" if limit == float("inf") else str(limit),
            }
        )

    except Exception as e:
        return jsonify({"error": str(e)}), 400
