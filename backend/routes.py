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
    Voice,
    UsageLogs,
    BrdgeScript,
    KnowledgeBase,
    DocumentKnowledge,
    Recording,
    UserIssues,
    Course,
    CourseModule,
    Enrollment,
    ModulePermissions,
    ConversationLogs,
    ServiceLead,
    JobApplication,  # Add JobApplication model
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

# Import the full module, not just the function
from sqlalchemy.orm.attributes import flag_modified
from dotenv import load_dotenv
import ffmpeg
import time
import threading
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import gemini
from email import encoders
from email.mime.base import MIMEBase

# If gemini.py is in the same package (e.g. backend folder is a package)
# Or if gemini.py is at the root and backend is a package: from .. import gemini

# Load environment variables
load_dotenv()

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
STRIPE_PRODUCT_PRICE = 14900  # Price in cents ($149.00) - Premium tier price
STRIPE_PRODUCT_CURRENCY = "usd"
STRIPE_STANDARD_PRICE = 4900  # Price in cents ($49.00) - Standard tier price

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
MAX_VIDEO_SIZE = 500 * 1024 * 1024  # 500MB

# Add this configuration right after creating the app
app.config["MAX_CONTENT_LENGTH"] = (
    MAX_VIDEO_SIZE + MAX_PDF_SIZE
)  # Allow for both files plus some overhead

# Add this constant with the other file configurations
ALLOWED_VIDEO_FORMATS = ["video/mp4", "video/webm"]

# Get AWS credentials from environment variables
AWS_ACCOUNT_ID = os.environ.get("AWS_ACCOUNT_ID")
AWS_SECRET_KEY = os.environ.get("AWS_SECRET_KEY")
AWS_REGION = os.environ.get("AWS_REGION")
S3_BUCKET_NAME = os.environ.get("S3_BUCKET_NAME")  # This matches your .env file


# Add this error handler
@app.errorhandler(RequestEntityTooLarge)
def handle_large_request(e):
    return (
        jsonify({"error": "File too large. Video limit is 500MB, PDF limit is 20MB."}),
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

    # Check if:
    # 1. The user owns the bridge OR
    # 2. The bridge is shareable OR
    # 3. The bridge is in a module the user can access
    is_owner = current_user and current_user.id == brdge.user_id
    is_public = brdge.shareable
    has_module_access = False

    # Get all modules containing this bridge
    course_modules = CourseModule.query.filter_by(brdge_id=brdge_id).all()

    # Check if any module grants access
    for module in course_modules:
        if module.can_access(current_user):
            has_module_access = True
            break

    # Grant access if any of the conditions are met
    if is_owner or is_public or has_module_access:
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

        # Add course modules with permissions
        course_modules_data = []
        for module in CourseModule.query.filter_by(brdge_id=brdge_id).all():
            module_dict = module.to_dict()
            # Add permissions
            permission = ModulePermissions.query.filter_by(
                course_module_id=module.id
            ).first()
            if permission:
                module_dict["permissions"] = permission.to_dict()
            else:
                module_dict["permissions"] = {"access_level": "enrolled"}  # Default

            course_modules_data.append(module_dict)

        brdge_data["course_modules"] = course_modules_data

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
@login_required
def delete_brdge(user, brdge_id):
    try:
        brdge = Brdge.query.filter_by(id=brdge_id, user_id=user.id).first_or_404()

        # Start database transaction
        db.session.begin_nested()

        try:
            # 1. Delete associated scripts first
            BrdgeScript.query.filter_by(brdge_id=brdge_id).delete()

            # 2. Delete any course modules that reference this brdge
            CourseModule.query.filter_by(brdge_id=brdge_id).delete()

            # 3. Delete recordings
            Recording.query.filter_by(brdge_id=brdge_id).delete()
            db.session.flush()  # Ensure recordings are deleted before brdge

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


def process_brdge_content(
    brdge_id,
    video_path,
    pdf_path=None,
    bridge_type="course",
    additional_instructions="",
):
    """Process uploaded content using Gemini and create a script"""
    try:
        # Create initial script object with pending status
        script = BrdgeScript(
            brdge_id=brdge_id,
            content={},
            status="pending",
            script_metadata={"logs": [], "progress": 0},
        )
        db.session.add(script)
        db.session.commit()

        # Define callback to update the script with logs
        def update_script_logs(brdge_id, logs, progress=0):
            try:
                # Get the latest script for this brdge
                script = (
                    BrdgeScript.query.filter_by(brdge_id=brdge_id)
                    .order_by(BrdgeScript.id.desc())
                    .first()
                )
                if script:
                    script.script_metadata = {"logs": logs, "progress": progress}
                    db.session.commit()
            except Exception as e:
                logger.error(f"Error updating script logs: {e}")

        # Call the Gemini processing with the callback
        knowledge = gemini.create_brdge_knowledge(
            video_path,
            pdf_path,
            brdge_id=brdge_id,
            callback=update_script_logs,
            bridge_type=bridge_type,
            additional_instructions=additional_instructions,
        )

        # Update with final results
        script = (
            BrdgeScript.query.filter_by(brdge_id=brdge_id)
            .order_by(BrdgeScript.id.desc())
            .first()
        )
        if script:
            script.content = knowledge
            script.status = "completed"
            db.session.commit()
            return script
        else:
            logger.error(f"Script not found for brdge_id {brdge_id}")
            return None
    except Exception as e:
        logger.error(f"Error processing content: {str(e)}")
        # Update script status to failed if it exists
        script = (
            BrdgeScript.query.filter_by(brdge_id=brdge_id)
            .order_by(BrdgeScript.id.desc())
            .first()
        )
        if script:
            script.status = "failed"
            script.script_metadata = {
                "error": str(e),
                "logs": script.script_metadata.get("logs", [])
                + [
                    {
                        "message": f"Error: {str(e)}",
                        "status": "error",
                        "timestamp": time.time(),
                    }
                ],
            }
            db.session.commit()
        return script


@app.route("/api/brdges", methods=["POST"])
@login_required
def create_brdge(user):
    try:
        name = request.form.get("name")
        presentation = request.files.get("presentation")
        recording = request.files.get("screen_recording")
        # Get bridge type and instructions from the form
        bridge_type = request.form.get("bridge_type", "course")  # Default to course
        additional_instructions = request.form.get("additional_instructions", "")

        async_processing = (
            request.form.get("async", "false").lower() == "true"
        )  # Get async parameter

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

        # Validate video format - only accept MP4
        if recording:
            if (
                not recording.filename.lower().endswith(".mp4")
                and recording.content_type != "video/mp4"
            ):
                return (
                    jsonify(
                        {
                            "error": "Invalid video format",
                            "message": "Please upload an MP4 video file only.",
                            "allowed_formats": [".mp4"],
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
                            "message": "Video file size exceeds 500MB limit. Please upload a smaller file.",
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

        # Create Brdge object
        brdge = Brdge(
            name=name,
            user_id=user.id,
            bridge_type=bridge_type,  # Use retrieved variable
            additional_instructions=additional_instructions,  # Use retrieved variable
            presentation_filename="" if not presentation else "temp",
            audio_filename="",
            folder="temp",
        )
        db.session.add(brdge)
        db.session.commit()  # Commit to ensure brdge.id is valid

        # Update the folder with the brdge ID
        brdge.folder = str(brdge.id)
        brdge = db.session.merge(brdge)
        db.session.commit()

        # Paths for temporary files
        pdf_local_path = None
        video_local_path = None

        # Handle presentation file if it exists
        if presentation:
            original_filename = presentation.filename
            presentation_filename = secure_filename(
                f"{uuid.uuid4()}_{original_filename}"
            )
            presentation_key = f"{brdge.folder}/{presentation_filename}"
            pdf_local_path = f"/tmp/brdge_{brdge.id}_{presentation_filename}"

            # Save PDF locally for Gemini processing
            os.makedirs(os.path.dirname(pdf_local_path), exist_ok=True)
            presentation.seek(0)
            presentation.save(pdf_local_path)

            # Upload to S3
            presentation.seek(0)
            s3_client.upload_fileobj(
                presentation,
                S3_BUCKET,
                presentation_key,
                ExtraArgs={"ContentType": "application/pdf"},
            )

            brdge.presentation_filename = presentation_filename
            db.session.commit()

        # Handle recording file (required)
        if not recording:
            return jsonify({"error": "Recording file is required"}), 400

        # Save MP4 file - IMPORTANT: Save to disk before processing
        mp4_filename = secure_filename(f"{uuid.uuid4()}_{recording.filename}")
        recording_key = f"{brdge.folder}/recordings/{mp4_filename}"
        video_local_path = f"/tmp/brdge_{brdge.id}_{mp4_filename}"

        # Save locally for processing
        os.makedirs(os.path.dirname(video_local_path), exist_ok=True)
        recording.seek(0)
        recording.save(video_local_path)

        # Upload to S3 - Use a copy of the file to avoid double free
        with open(video_local_path, "rb") as file_to_upload:
            s3_client.upload_fileobj(
                file_to_upload,
                S3_BUCKET,
                recording_key,
                ExtraArgs={"ContentType": "video/mp4"},
            )

        # Create Recording object
        rec_obj = Recording(
            brdge_id=brdge.id,
            filename=mp4_filename,
            format="mp4",
            duration=None,
        )
        db.session.add(rec_obj)
        db.session.commit()

        # Create initial script object with pending status
        script = BrdgeScript(
            brdge_id=brdge.id,
            content={},
            status="pending",
            script_metadata={"logs": [], "progress": 0},
        )
        db.session.add(script)
        db.session.commit()

        # Save our file paths for the background thread - we'll pass only IDs and paths, not file objects
        brdge_id = brdge.id  # Get ID before request ends
        final_video_path = video_local_path
        final_pdf_path = pdf_local_path

        # If async processing is requested, process in background thread
        if async_processing:
            # Create a completely independent function that doesn't use any request resources
            def process_in_background(b_id, v_path, p_path, b_type, add_instr):
                with app.app_context():
                    try:
                        # Process using only paths to saved files
                        process_brdge_content(b_id, v_path, p_path, b_type, add_instr)
                    except Exception as e:
                        logger.error(
                            f"Background processing error: {str(e)}", exc_info=True
                        )
                        # Update script status to failed
                        try:
                            script = (
                                BrdgeScript.query.filter_by(brdge_id=b_id)
                                .order_by(BrdgeScript.id.desc())
                                .first()
                            )
                            if script:
                                script.status = "failed"
                                if not script.script_metadata:
                                    script.script_metadata = {"logs": [], "progress": 0}
                                script.script_metadata["logs"].append(
                                    {
                                        "message": f"Processing failed: {str(e)}",
                                        "status": "error",
                                        "timestamp": time.time(),
                                    }
                                )
                                db.session.commit()
                        except Exception as db_error:
                            logger.error(
                                f"Failed to update script status: {str(db_error)}"
                            )
                    finally:
                        # Clean up temporary files in the background thread
                        try:
                            if v_path and os.path.exists(v_path):
                                os.remove(v_path)
                            if p_path and os.path.exists(p_path):
                                os.remove(p_path)
                        except Exception as cleanup_error:
                            logger.error(
                                f"Error cleaning up files: {str(cleanup_error)}"
                            )

            # Start a background thread with only primitive types (no file objects)
            thread = Thread(
                target=process_in_background,
                args=(
                    brdge_id,
                    final_video_path,
                    final_pdf_path,
                    bridge_type,
                    additional_instructions,
                ),
            )
            thread.daemon = True
            thread.start()

            return (
                jsonify(
                    {
                        "message": "Brdge created and processing started",
                        "brdge": brdge.to_dict(),
                        "processing_status": "pending",
                    }
                ),
                201,
            )
        else:
            # Original synchronous processing
            try:
                # Process content using Gemini
                script_obj = process_brdge_content(
                    brdge.id,
                    video_local_path,
                    pdf_local_path,
                    bridge_type,
                    additional_instructions,
                )

                # Clean up temporary files
                if os.path.exists(video_local_path):
                    os.remove(video_local_path)
                if pdf_local_path and os.path.exists(pdf_local_path):
                    os.remove(pdf_local_path)

                return (
                    jsonify(
                        {
                            "message": "Brdge created successfully",
                            "brdge": brdge.to_dict(),
                            "script": script_obj.to_dict() if script_obj else None,
                        }
                    ),
                    201,
                )

            except Exception as e:
                logger.error(f"Error processing files: {str(e)}", exc_info=True)
                db.session.rollback()
                return (
                    jsonify({"error": "Failed to process files", "detail": str(e)}),
                    500,
                )

    except Exception as e:
        logger.error(f"Error creating brdge: {str(e)}", exc_info=True)
        db.session.rollback()
        return jsonify({"error": "Error creating brdge", "detail": str(e)}), 500


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
@cross_origin()
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


@app.route("/api/create-checkout-session", methods=["POST"])
@login_required
def create_checkout_session(user):
    try:
        data = request.get_json()
        tier = data.get("tier")  # e.g., "standard", "premium"
        logger.info(f"Attempting to set/update tier to: {tier} for user {user.id}")

        # Map frontend tier names to backend/Stripe price IDs and account types
        # 'premium' frontend tier maps to 'pro' in SUBSCRIPTION_TIERS
        target_account_type = "pro" if tier == "premium" else tier
        if target_account_type not in SUBSCRIPTION_TIERS or not SUBSCRIPTION_TIERS[
            target_account_type
        ].get("price_id"):
            return jsonify({"error": "Invalid tier or missing price ID for tier"}), 400

        target_price_id = SUBSCRIPTION_TIERS[target_account_type]["price_id"]

        user_account = UserAccount.query.filter_by(user_id=user.id).first()

        if not user_account:
            # This case should ideally not happen if accounts are created on registration
            logger.error(f"UserAccount not found for user {user.id}. Creating one.")
            user_account = UserAccount(user_id=user.id, account_type="free")
            db.session.add(user_account)
            # db.session.commit() # Commit later or handle potential flush issues

        # Scenario 1: User has an existing active subscription and wants to change/upgrade it
        if (
            user_account.stripe_subscription_id
            and user_account.subscription_status == "active"
        ):
            logger.info(
                f"User {user.id} has active subscription {user_account.stripe_subscription_id}. Attempting to modify."
            )
            try:
                # We retrieve the subscription, but will list items explicitly
                # current_subscription = stripe.Subscription.retrieve(
                #     user_account.stripe_subscription_id
                # )

                # Explicitly list subscription items for the subscription ID
                try:
                    subscription_items_list = stripe.SubscriptionItem.list(
                        subscription=user_account.stripe_subscription_id,
                        limit=1,  # We typically only expect one primary item for simple subscriptions
                    )
                except stripe.error.StripeError as e:
                    logger.error(
                        f"Stripe error listing subscription items for sub {user_account.stripe_subscription_id}: {str(e)}"
                    )
                    return (
                        jsonify(
                            {
                                "error": f"Could not retrieve subscription items: {str(e)}"
                            }
                        ),
                        500,
                    )

                if not subscription_items_list or not subscription_items_list.data:
                    logger.error(
                        f"Subscription {user_account.stripe_subscription_id} for user {user.id} has no items listed via API."
                    )
                    return (
                        jsonify({"error": "Subscription has no items to modify."}),
                        500,
                    )

                first_subscription_item = subscription_items_list.data[0]
                current_price_id = first_subscription_item.price.id

                if current_price_id == target_price_id:
                    logger.info(f"User {user.id} is already on the target plan {tier}.")
                    return (
                        jsonify(
                            {
                                "message": "You are already on this plan.",
                                "updated_directly": True,
                            }
                        ),
                        200,
                    )

                # Modify the existing subscription
                updated_subscription = stripe.Subscription.modify(
                    user_account.stripe_subscription_id,
                    items=[
                        {
                            "id": first_subscription_item.id,  # Use the ID of the first subscription item
                            "price": target_price_id,
                        }
                    ],
                    proration_behavior="create_prorations",
                    payment_behavior="default_incomplete",  # Allows for 3DS if needed on proration
                    expand=["latest_invoice.payment_intent"],
                )

                logger.info(
                    f"Successfully modified subscription for user {user.id} to {target_price_id}. New status: {updated_subscription.status}"
                )

                # Update local UserAccount
                user_account.account_type = target_account_type
                user_account.stripe_customer_id = (
                    updated_subscription.customer
                )  # Should be same, but good to ensure
                # stripe_subscription_id remains the same
                user_account.subscription_status = (
                    updated_subscription.status
                )  # Could be 'active' or 'incomplete' if payment needed
                user_account.next_billing_date = datetime.fromtimestamp(
                    updated_subscription.current_period_end
                )
                user_account.last_activity = datetime.utcnow()

                db.session.commit()
                logger.info(
                    f"UserAccount for {user.id} updated in DB. New type: {target_account_type}, next_billing: {user_account.next_billing_date}"
                )

                if (
                    updated_subscription.status == "incomplete"
                    and updated_subscription.latest_invoice
                    and updated_subscription.latest_invoice.payment_intent
                ):
                    # If proration requires payment and 3DS
                    logger.info(
                        f"Subscription update for user {user.id} requires further action (e.g. 3DS)."
                    )
                    return (
                        jsonify(
                            {
                                "message": "Subscription update requires payment confirmation.",
                                "requires_action": True,
                                "payment_intent_client_secret": updated_subscription.latest_invoice.payment_intent.client_secret,
                                "subscription_id": updated_subscription.id,
                            }
                        ),
                        200,
                    )  # Or a more specific status code like 202 Accepted

                return (
                    jsonify(
                        {
                            "message": "Subscription updated successfully.",
                            "updated_directly": True,
                            "account": user_account.to_dict(),
                        }
                    ),
                    200,
                )

            except stripe.error.StripeError as e:
                logger.error(
                    f"Stripe error modifying subscription for user {user.id}: {str(e)}"
                )
                return (
                    jsonify({"error": f"Could not update your subscription: {str(e)}"}),
                    400,
                )
            except Exception as e:
                logger.error(
                    f"Error modifying subscription for user {user.id}: {str(e)}"
                )
                db.session.rollback()
                return (
                    jsonify(
                        {
                            "error": "An unexpected error occurred while updating your subscription."
                        }
                    ),
                    500,
                )

        # Scenario 2: User is on 'free' plan, or no active subscription, or a 'canceled' (but not yet ended) subscription.
        # For 'canceled' subs, Stripe policy is usually to create a new one if they re-subscribe before period end.
        # Or if trying to upgrade a 'free' plan.
        logger.info(
            f"User {user.id} does not have an active subscription to modify directly for tier {tier}. Proceeding to Stripe Checkout."
        )
        try:
            # Create checkout session with metadata
            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                mode="subscription",
                line_items=[{"price": target_price_id, "quantity": 1}],
                success_url=f"{request.headers.get('Origin')}/payment-success?session_id={{CHECKOUT_SESSION_ID}}&tier={tier}",
                cancel_url=f"{request.headers.get('Origin')}/profile",
                client_reference_id=str(user.id),
                customer=(
                    user_account.stripe_customer_id
                    if user_account and user_account.stripe_customer_id
                    else None
                ),  # Pass customer_id if exists, Stripe will link or create
                allow_promotion_codes=True,
                metadata={
                    "user_id": user.id,
                    "tier": tier,
                },  # tier here is the original request e.g. 'premium'
            )

            logger.info(
                f"Stripe Checkout session created: {session.id} for user {user.id}, tier {tier}"
            )
            return jsonify({"url": session.url}), 200

        except stripe.error.StripeError as e:
            logger.error(
                f"Stripe error creating checkout session for user {user.id}: {str(e)}"
            )
            return jsonify({"error": str(e)}), 400

    except Exception as e:
        logger.error(
            f"Error in create_checkout_session for user {user.id if 'user' in locals() and user else 'unknown'}: {e}",
            exc_info=True,
        )
        db.session.rollback()
        return jsonify({"error": "An internal error occurred."}), 500


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


@app.route("/api/brdges/<int:brdge_id>/voice/clone", methods=["POST"])
@jwt_required()
@cross_origin()
def clone_voice_for_brdge(brdge_id):
    """Clone a voice from uploaded audio sample using Cartesia API"""
    try:
        current_user = get_current_user()
        # Get the brdge to use its name as default
        brdge = Brdge.query.filter_by(
            id=brdge_id, user_id=current_user.id
        ).first_or_404()

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
        # Ensure brdge exists and get owner_id
        brdge = Brdge.query.get_or_404(brdge_id)
        owner_id = brdge.user_id

        # Create new usage log
        usage_log = UsageLogs(
            brdge_id=brdge_id,
            owner_id=owner_id,
            viewer_user_id=data.get("viewer_user_id"),
            anonymous_id=data.get("anonymous_id"),
            agent_message="",  # Agent message will be updated later
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


@app.route("/api/brdges/<int:brdge_id>/check-auth", methods=["GET", "OPTIONS"])
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


# Add this new route for getting agent configuration
@app.route("/api/brdges/<int:brdge_id>/agent-config", methods=["GET"])
@cross_origin()
def get_agent_config(brdge_id):
    """Get agent configuration for a brdge"""
    try:
        # Get the brdge to check permissions
        brdge = Brdge.query.get_or_404(brdge_id)

        # Get the latest script to extract data
        script = (
            BrdgeScript.query.filter_by(brdge_id=brdge_id)
            .order_by(BrdgeScript.id.desc())
            .first()
        )

        if not script:
            return jsonify({"error": "No script found for this brdge"}), 404

        # Create simplified agent personality with only the editable fields
        simplified_agent_personality = {
            "name": "AI Assistant",
            "persona_background": "A helpful AI assistant",
            "communication_style": "friendly",
        }

        if script.content and "agent_personality" in script.content:
            content = script.content
            agent_personality = content.get("agent_personality", {})

            # Only include the three editable fields
            if "name" in agent_personality:
                simplified_agent_personality["name"] = agent_personality["name"]
            if "persona_background" in agent_personality:
                simplified_agent_personality["persona_background"] = agent_personality[
                    "persona_background"
                ]
            if "communication_style" in agent_personality:
                simplified_agent_personality["communication_style"] = agent_personality[
                    "communication_style"
                ]

        # Construct response
        response = {
            "personality": brdge.agent_personality or "friendly AI assistant",
            "agentPersonality": simplified_agent_personality,
            "knowledgeBase": [],
        }

        # Add presentation document to knowledge base if it exists
        if brdge.presentation_filename:
            response["knowledgeBase"].append(
                {
                    "id": "presentation",
                    "type": "presentation",
                    "name": brdge.presentation_filename,
                    "content": "",
                }
            )

        # Include data from script content
        if script.content:
            # Add teaching_persona to the response
            if "teaching_persona" in script.content:
                response["teaching_persona"] = script.content.get("teaching_persona")

            # Add engagement_opportunities to the response
            if "engagement_opportunities" in script.content:
                opportunities = script.content.get("engagement_opportunities")
                logger.info(f"Found {len(opportunities)} engagement opportunities")
                response["engagement_opportunities"] = opportunities

            # Add timeline to the response (from video_timeline or timeline)
            if "video_timeline" in script.content:
                response["timeline"] = script.content.get("video_timeline")
            elif "timeline" in script.content:
                response["timeline"] = script.content.get("timeline")

            # Add knowledge_base to the response
            if "knowledge_base" in script.content:
                response["knowledge_base"] = script.content.get("knowledge_base")

            # Add qa_pairs to the response if available
            if "qa_pairs" in script.content:
                response["qa_pairs"] = script.content.get("qa_pairs")

            # Add brdge data for completeness
            response["brdge"] = brdge.to_dict()

        # Cache control headers to ensure fresh data
        response_obj = jsonify(response)
        response_obj.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response_obj.headers["Pragma"] = "no-cache"
        response_obj.headers["Expires"] = "0"

        return response_obj, 200

    except Exception as e:
        logger.error(f"Error fetching agent config: {str(e)}")
        return jsonify({"error": str(e)}), 500


# Add this route for updating agent configuration
@app.route("/api/brdges/<int:brdge_id>/agent-config", methods=["PUT"])
@jwt_required()
@cross_origin()
def update_agent_config(brdge_id):
    """Update agent configuration for a brdge"""
    try:
        current_user = get_current_user()
        # Get the brdge and verify it exists and belongs to the user
        brdge = Brdge.query.filter_by(
            id=brdge_id, user_id=current_user.id
        ).first_or_404()

        # Parse the request data
        data = request.json
        logger.info(f"Received agent config update for brdge {brdge_id}: {data}")

        # Update brdge's agent personality field if provided
        if "personality" in data:
            brdge.agent_personality = data["personality"]
            logger.info(f"Updated brdge.agent_personality to: {data['personality']}")

        # Commit brdge changes
        db.session.commit()

        # Get latest script to update
        script = (
            BrdgeScript.query.filter_by(brdge_id=brdge_id)
            .order_by(BrdgeScript.id.desc())
            .first()
        )

        if not script:
            logger.warning(
                f"No script found for brdge {brdge_id}, cannot update agent personality"
            )
            return (
                jsonify(
                    {
                        "message": "Agent basic info updated, but no script found to update agent personality"
                    }
                ),
                200,
            )

        # Make a deep copy of the content to avoid reference issues
        content = script.content.copy() if script.content else {}

        # Handle teaching_persona updates directly
        if "teaching_persona" in data and isinstance(data["teaching_persona"], dict):
            # Log that we're updating the teaching_persona
            logger.info(f"Updating teaching_persona with data from request")

            # Update or create the teaching_persona in content
            if "teaching_persona" not in content:
                content["teaching_persona"] = {}

            # Update specific fields in teaching_persona
            teaching_persona = data["teaching_persona"]

            # Update instructor_profile fields
            if "instructor_profile" in teaching_persona:
                if "instructor_profile" not in content["teaching_persona"]:
                    content["teaching_persona"]["instructor_profile"] = {}
                if "name" in teaching_persona["instructor_profile"]:
                    content["teaching_persona"]["instructor_profile"]["name"] = (
                        teaching_persona["instructor_profile"]["name"]
                    )

            # Update communication_patterns fields
            if "communication_patterns" in teaching_persona:
                if "communication_patterns" not in content["teaching_persona"]:
                    content["teaching_persona"]["communication_patterns"] = {}
                if "vocabulary_level" in teaching_persona["communication_patterns"]:
                    content["teaching_persona"]["communication_patterns"][
                        "vocabulary_level"
                    ] = teaching_persona["communication_patterns"]["vocabulary_level"]
                if "recurring_phrases" in teaching_persona["communication_patterns"]:
                    content["teaching_persona"]["communication_patterns"][
                        "recurring_phrases"
                    ] = teaching_persona["communication_patterns"]["recurring_phrases"]
                if "speaking_pace" in teaching_persona["communication_patterns"]:
                    content["teaching_persona"]["communication_patterns"][
                        "speaking_pace"
                    ] = teaching_persona["communication_patterns"]["speaking_pace"]

            # Update speech_characteristics fields
            if "speech_characteristics" in teaching_persona:
                if "speech_characteristics" not in content["teaching_persona"]:
                    content["teaching_persona"]["speech_characteristics"] = {}
                if "accent" in teaching_persona["speech_characteristics"]:
                    if (
                        "accent"
                        not in content["teaching_persona"]["speech_characteristics"]
                    ):
                        content["teaching_persona"]["speech_characteristics"][
                            "accent"
                        ] = {}
                    if (
                        "cadence"
                        in teaching_persona["speech_characteristics"]["accent"]
                    ):
                        content["teaching_persona"]["speech_characteristics"]["accent"][
                            "cadence"
                        ] = teaching_persona["speech_characteristics"]["accent"][
                            "cadence"
                        ]

            # Update persona_simulation_guidance fields
            if "persona_simulation_guidance" in teaching_persona:
                if "persona_simulation_guidance" not in content["teaching_persona"]:
                    content["teaching_persona"]["persona_simulation_guidance"] = {}
                if (
                    "response_templates"
                    in teaching_persona["persona_simulation_guidance"]
                ):
                    if (
                        "response_templates"
                        not in content["teaching_persona"][
                            "persona_simulation_guidance"
                        ]
                    ):
                        content["teaching_persona"]["persona_simulation_guidance"][
                            "response_templates"
                        ] = {}
                    templates = teaching_persona["persona_simulation_guidance"][
                        "response_templates"
                    ]
                    if "greeting" in templates:
                        content["teaching_persona"]["persona_simulation_guidance"][
                            "response_templates"
                        ]["greeting"] = templates["greeting"]
                    if "knowledge_check" in templates:
                        content["teaching_persona"]["persona_simulation_guidance"][
                            "response_templates"
                        ]["knowledge_check"] = templates["knowledge_check"]
                    if "addressing_misconceptions" in templates:
                        content["teaching_persona"]["persona_simulation_guidance"][
                            "response_templates"
                        ]["addressing_misconceptions"] = templates[
                            "addressing_misconceptions"
                        ]

        # ADD THIS NEW BLOCK: Handle engagement_opportunities updates
        if "engagement_opportunities" in data and isinstance(
            data["engagement_opportunities"], list
        ):
            # Log the update
            logger.info(f"Updating engagement_opportunities with data from request")
            logger.info(
                f"Received {len(data['engagement_opportunities'])} engagement opportunities"
            )

            # Get current count (for logging)
            current_count = 0
            if "engagement_opportunities" in content:
                current_count = len(content["engagement_opportunities"])

            # Replace the entire engagement_opportunities array
            content["engagement_opportunities"] = data["engagement_opportunities"]

            logger.info(
                f"Updated engagement_opportunities: Previous count: {current_count}, New count: {len(content['engagement_opportunities'])}"
            )

        # Update the script content
        script.content = content
        flag_modified(script, "content")
        script.updated_at = datetime.utcnow()
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Agent configuration updated successfully",
                    "updated_fields": list(data.keys()),
                    "success": True,
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating agent config: {str(e)}")
        return jsonify({"error": str(e), "success": False}), 500


# Add this route for getting script content directly from BrdgeScript
@app.route("/api/brdges/<int:brdge_id>/script", methods=["GET"])
@cross_origin()
def get_brdge_script_content(brdge_id):
    """Get script content for a brdge from BrdgeScript"""
    try:
        # Get the brdge to check permissions
        brdge = Brdge.query.get_or_404(brdge_id)

        # Get current user (optional)
        current_user = get_current_user()

        # Check if user has access (owner or public brdge)
        if not brdge.shareable and current_user and current_user.id != brdge.user_id:
            return jsonify({"error": "Unauthorized access"}), 403

        # Get the latest script
        script = (
            BrdgeScript.query.filter_by(brdge_id=brdge_id)
            .order_by(BrdgeScript.id.desc())
            .first()
        )

        if not script:
            return (
                jsonify(
                    {"status": "not_found", "message": "No script found for this brdge"}
                ),
                404,
            )

        # Return the script content with cache control headers
        response = jsonify(
            {
                "status": script.status,
                "content": script.content,
                "metadata": script.script_metadata,
            }
        )

        # Add cache control headers to prevent stale data
        response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
        response.headers["Pragma"] = "no-cache"
        response.headers["Expires"] = "0"

        return response, 200

    except Exception as e:
        # Log the error
        current_app.logger.error(f"Error retrieving script: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/users/voices", methods=["GET"])
@cross_origin()
def get_user_voices():
    """Get all voices created by the user across all bridges"""
    try:
        current_user_id = get_jwt_identity()
        if not current_user_id:
            return jsonify({"error": "Authentication required"}), 401

        # Get all bridges owned by the user
        user_bridges = Brdge.query.filter_by(user_id=current_user_id).all()
        bridge_ids = [bridge.id for bridge in user_bridges]

        # Get all voices for these bridges
        voices = Voice.query.filter(Voice.brdge_id.in_(bridge_ids)).all()

        # Format voices for frontend with additional bridge information
        voice_list = []
        for voice in voices:
            # Get the bridge name for context
            bridge = Brdge.query.get(voice.brdge_id)
            voice_list.append(
                {
                    "id": voice.cartesia_voice_id,
                    "name": voice.name,
                    "created_at": voice.created_at.isoformat(),
                    "language": voice.language,
                    "description": voice.description,
                    "status": voice.status,
                    "brdge_id": voice.brdge_id,
                    "brdge_name": bridge.name if bridge else "Unknown Bridge",
                    "is_from_current_bridge": False,  # This will be set on frontend
                }
            )

        # Sort voices by creation date (newest first)
        voice_list.sort(key=lambda x: x["created_at"], reverse=True)

        logger.info(f"Found {len(voice_list)} voices for user {current_user_id}")

        return (
            jsonify(
                {
                    "has_voices": len(voice_list) > 0,
                    "voices": voice_list,
                    "default_voice": "85100d63-eb8a-4225-9750-803920c3c8d3",
                    "user_id": current_user_id,
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Error fetching user voices: {e}")
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


@app.route("/api/brdges/<int:brdge_id>/voice/use-from-other", methods=["POST"])
@cross_origin()
def use_voice_from_other_bridge(brdge_id):
    """Use a voice from another bridge with this bridge"""
    try:
        # Parse request data
        data = request.json
        voice_id = data.get("voice_id")
        source_brdge_id = data.get("source_brdge_id")

        if not voice_id or not source_brdge_id:
            return jsonify({"error": "Missing required parameters"}), 400

        # Verify the voice exists in the source bridge
        source_voice = Voice.query.filter_by(
            cartesia_voice_id=voice_id, brdge_id=source_brdge_id
        ).first()

        if not source_voice:
            return jsonify({"error": "Voice not found in source bridge"}), 404

        # Get the current bridge
        target_bridge = Brdge.query.get_or_404(brdge_id)

        # Check authorization - user must own both bridges
        current_user = get_current_user()
        if not current_user:
            return jsonify({"error": "Authentication required"}), 401

        # Check the source bridge belongs to the user
        source_bridge = Brdge.query.get_or_404(source_brdge_id)
        if (
            source_bridge.user_id != current_user.id
            or target_bridge.user_id != current_user.id
        ):
            return (
                jsonify({"error": "You don't have permission to use this voice"}),
                403,
            )

        # Deactivate any active voices for the target bridge
        active_voices = Voice.query.filter_by(brdge_id=brdge_id, status="active").all()
        for voice in active_voices:
            voice.status = "inactive"

        # Create a shared reference to the voice in the target bridge
        shared_voice = Voice(
            brdge_id=brdge_id,
            cartesia_voice_id=source_voice.cartesia_voice_id,
            name=f"{source_voice.name} (from {source_bridge.name})",
            description=f"Voice imported from another project: {source_bridge.name}",
            language=source_voice.language,
            created_at=datetime.utcnow(),
            status="active",
        )

        db.session.add(shared_voice)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Voice from another bridge activated successfully",
                    "voice": shared_voice.to_dict(),
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error using voice from another bridge: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/brdges/<int:brdge_id>/update-voice", methods=["POST"])
@cross_origin()
@jwt_required()
def update_brdge_voice(brdge_id):
    """Update a brdge's voice_id field"""
    try:
        # Get the brdge without filtering by user_id since we're not using authentication for now
        current_user = get_current_user()
        brdge = Brdge.query.filter_by(
            id=brdge_id, user_id=current_user.id
        ).first_or_404()

        # Get the voice_id from request data
        data = request.json
        voice_id = data.get("voice_id")  # Can be null to reset to default

        # Update the brdge
        brdge.voice_id = voice_id
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Brdge voice updated successfully",
                    "brdge_id": brdge_id,
                    "voice_id": voice_id,
                }
            ),
            200,
        )

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error updating brdge voice: {e}")
        return jsonify({"error": str(e)}), 500


# Course Management Routes
@app.route("/api/courses", methods=["GET"])
@jwt_required()
def get_courses():
    """Get all courses for the logged-in user"""
    user_id = get_jwt_identity()
    courses = Course.query.filter_by(user_id=user_id).all()

    # For each course, get its modules with associated brdges
    result = []
    for course in courses:
        course_dict = course.to_dict()
        # Sort modules by position
        course_modules = (
            CourseModule.query.filter_by(course_id=course.id)
            .order_by(CourseModule.position)
            .all()
        )
        modules = []

        for cm in course_modules:
            brdge = Brdge.query.get(cm.brdge_id)
            if brdge:
                module_data = {
                    "id": cm.id,
                    "brdge_id": brdge.id,
                    "name": brdge.name,
                    "position": cm.position,
                    "shareable": brdge.shareable,
                    "public_id": brdge.public_id,
                }
                modules.append(module_data)

        course_dict["modules"] = modules
        result.append(course_dict)

    return jsonify({"courses": result})


@app.route("/api/courses", methods=["POST"])
@login_required
def create_course(user):
    """Create a new course"""
    data = request.json

    if not data or not data.get("name"):
        return jsonify({"error": "Course name is required"}), 400

    course = Course(
        name=data.get("name"), description=data.get("description", ""), user_id=user.id
    )

    db.session.add(course)
    db.session.commit()

    return jsonify({"course": course.to_dict()}), 201


@app.route("/api/courses/<int:course_id>", methods=["GET"])
@login_required
def get_course(user, course_id):
    try:
        course = Course.query.get(course_id)
        if not course or course.user_id != user.id:
            return jsonify({"error": "Course not found or not authorized"}), 404

        # Eager load permissions for each module
        modules_with_permissions = []
        for module in course.modules:
            module_data = module.to_dict()

            # Get permission directly
            permission = ModulePermissions.query.filter_by(
                course_module_id=module.id
            ).first()
            if permission:
                module_data["access_level"] = permission.access_level
            else:
                module_data["access_level"] = "enrolled"  # Default

            modules_with_permissions.append(module_data)

        course_data = course.to_dict()
        course_data["modules"] = modules_with_permissions

        return jsonify({"course": course_data, "status": "success"})
    except Exception as e:
        app.logger.error(f"Error fetching course: {str(e)}")
        return jsonify({"error": "Failed to fetch course", "status": "error"}), 500


@app.route("/api/courses/<int:course_id>", methods=["PUT"])
@login_required
def update_course(user, course_id):
    """Update a course"""
    course = Course.query.get(course_id)

    if not course:
        return jsonify({"error": "Course not found"}), 404

    if course.user_id != user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    data = request.json

    if data.get("name"):
        course.name = data.get("name")

    if "description" in data:
        course.description = data.get("description")

    if "shareable" in data:
        course.shareable = data.get("shareable")

    course.updated_at = datetime.utcnow()
    db.session.commit()

    return jsonify({"course": course.to_dict()})


@app.route("/api/courses/<int:course_id>", methods=["DELETE"])
@login_required
def delete_course(user, course_id):
    """Delete a course"""
    course = Course.query.get(course_id)

    if not course:
        return jsonify({"error": "Course not found"}), 404

    if course.user_id != user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    # Note: This will automatically delete all CourseModule entries due to cascade
    db.session.delete(course)
    db.session.commit()

    return jsonify({"message": "Course deleted successfully"})


@app.route("/api/courses/<int:course_id>/modules", methods=["POST"])
@login_required
def add_module_to_course(user, course_id):
    """Add a module (brdge) to a course"""
    course = Course.query.get(course_id)

    if not course:
        return jsonify({"error": "Course not found"}), 404

    if course.user_id != user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    data = request.json

    if not data or not data.get("brdge_id"):
        return jsonify({"error": "Module ID is required"}), 400

    brdge_id = data.get("brdge_id")
    brdge = Brdge.query.get(brdge_id)

    if not brdge:
        return jsonify({"error": "Module not found"}), 404

    if brdge.user_id != user.id:
        return jsonify({"error": "Unauthorized access to module"}), 403

    # Check if module is already in course
    existing_module = CourseModule.query.filter_by(
        course_id=course_id, brdge_id=brdge_id
    ).first()

    if existing_module:
        return jsonify({"error": "Module already in course"}), 400

    # Get the highest position to add the new module at the end
    highest_position = (
        db.session.query(func.max(CourseModule.position))
        .filter(CourseModule.course_id == course_id)
        .scalar()
        or 0
    )

    # Create course module with the next position
    course_module = CourseModule(
        course_id=course_id, brdge_id=brdge_id, position=highest_position + 1
    )

    db.session.add(course_module)
    db.session.commit()

    return (
        jsonify(
            {
                "message": "Module added to course",
                "course_module": course_module.to_dict(),
            }
        ),
        201,
    )


@app.route("/api/courses/<int:course_id>/modules/<int:module_id>", methods=["DELETE"])
@login_required
def remove_module_from_course(user, course_id, module_id):
    """Remove a module from a course"""
    course = Course.query.get(course_id)

    if not course:
        return jsonify({"error": "Course not found"}), 404

    if course.user_id != user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    course_module = CourseModule.query.get(module_id)

    if not course_module or course_module.course_id != course_id:
        return jsonify({"error": "Module not found in course"}), 404

    # Get the position of the module to be removed
    position_to_remove = course_module.position

    # Delete the module
    db.session.delete(course_module)

    # Update positions of remaining modules
    modules_to_update = CourseModule.query.filter(
        CourseModule.course_id == course_id, CourseModule.position > position_to_remove
    ).all()

    for module in modules_to_update:
        module.position -= 1

    db.session.commit()

    return jsonify({"message": "Module removed from course"})


@app.route("/api/courses/<int:course_id>/modules/reorder", methods=["PUT"])
@login_required
def reorder_course_modules(user, course_id):
    """Reorder modules within a course"""
    course = Course.query.get(course_id)

    if not course:
        return jsonify({"error": "Course not found"}), 404

    if course.user_id != user.id:
        return jsonify({"error": "Unauthorized access"}), 403

    data = request.json

    if not data or not data.get("modules"):
        return jsonify({"error": "Module order data is required"}), 400

    # Expected format: {modules: [{id: 1, position: 3}, {id: 2, position: 1}, ...]}
    module_order = data.get("modules")

    for item in module_order:
        module_id = item.get("id")
        new_position = item.get("position")

        if module_id and new_position is not None:
            course_module = CourseModule.query.get(module_id)
            if course_module and course_module.course_id == course_id:
                course_module.position = new_position

    db.session.commit()

    return jsonify({"message": "Course modules reordered successfully"})


@app.route("/api/courses/<int:course_id>/toggle_shareable", methods=["POST"])
@jwt_required()
def toggle_course_shareable(course_id):
    """Toggle whether a course is shareable"""
    user_id = get_jwt_identity()
    course = Course.query.get(course_id)

    if not course:
        return jsonify({"error": "Course not found"}), 404

    if course.user_id != user_id:
        return jsonify({"error": "Unauthorized access"}), 403

    # Toggle shareable status
    course.shareable = not course.shareable
    db.session.commit()

    return jsonify({"shareable": course.shareable})


@app.route("/api/courses/<int:course_id>/modules/<int:module_id>", methods=["PUT"])
@login_required
def update_course_module(user, course_id, module_id):
    """Update a module in a course"""
    course = Course.query.get_or_404(course_id)

    # Ensure the user owns the course
    if course.user_id != user.id:
        return jsonify({"error": "Unauthorized"}), 403

    # Get the module
    module = CourseModule.query.filter_by(
        id=module_id, course_id=course_id
    ).first_or_404()

    # Update the module with data from the request
    data = request.get_json()

    # Update description if provided
    if "description" in data:
        module.description = data["description"]

    # Handle other fields if needed...

    db.session.commit()

    return jsonify({"success": True, "module": module.to_dict()})


@app.route("/api/courses/<int:course_id>/upload-thumbnail", methods=["POST"])
@login_required
def upload_course_thumbnail(user, course_id):
    """Upload a thumbnail image for a course"""
    try:
        course = Course.query.get_or_404(course_id)

        # Ensure the user owns the course
        if course.user_id != user.id:
            return jsonify({"error": "Unauthorized"}), 403

        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        # Get file extension
        _, ext = os.path.splitext(file.filename)

        # Create a secure filename
        filename = f"course_thumbnail{ext}"

        # S3 key
        s3_key = f"courses/{course_id}/{filename}"

        # Upload to S3
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=AWS_ACCOUNT_ID,
            aws_secret_access_key=AWS_SECRET_KEY,
            region_name=AWS_REGION,
        )

        s3_client.upload_fileobj(
            file,
            S3_BUCKET_NAME,
            s3_key,
            ExtraArgs={
                "ContentType": file.content_type
                # Removed ACL parameter
            },
        )

        # Generate proxy URL instead of direct S3 URL
        thumbnail_url = f"/api/thumbnails/{s3_key}"

        # Update course with thumbnail URL
        course.thumbnail_url = thumbnail_url
        db.session.commit()

        return jsonify({"success": True, "thumbnail_url": thumbnail_url})

    except Exception as e:
        print(f"Error in upload_course_thumbnail: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route(
    "/api/courses/<int:course_id>/modules/<int:module_id>/upload-thumbnail",
    methods=["POST"],
)
@login_required
def upload_module_thumbnail(user, course_id, module_id):
    """Upload a thumbnail image for a module in a course"""
    try:
        course = Course.query.get_or_404(course_id)

        # Ensure the user owns the course
        if course.user_id != user.id:
            return jsonify({"error": "Unauthorized"}), 403

        # Get the module
        module = CourseModule.query.filter_by(
            id=module_id, course_id=course_id
        ).first_or_404()

        if "file" not in request.files:
            return jsonify({"error": "No file part"}), 400

        file = request.files["file"]

        if file.filename == "":
            return jsonify({"error": "No selected file"}), 400

        # Get file extension
        _, ext = os.path.splitext(file.filename)

        # Create a secure filename based on the brdge_id
        brdge_id = request.form.get("brdge_id")
        if not brdge_id:
            brdge_id = module.brdge_id

        filename = f"{brdge_id}_thumbnail{ext}"

        # S3 key
        s3_key = f"courses/{course_id}/{filename}"

        # Upload to S3
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=AWS_ACCOUNT_ID,
            aws_secret_access_key=AWS_SECRET_KEY,
            region_name=AWS_REGION,
        )

        s3_client.upload_fileobj(
            file,
            S3_BUCKET_NAME,
            s3_key,
            ExtraArgs={
                "ContentType": file.content_type
                # Removed ACL parameter
            },
        )

        # Generate proxy URL instead of direct S3 URL
        thumbnail_url = f"/api/thumbnails/{s3_key}"

        # Update module with thumbnail URL
        module.thumbnail_url = thumbnail_url
        db.session.commit()

        return jsonify({"success": True, "thumbnail_url": thumbnail_url})

    except Exception as e:
        print(f"Error in upload_module_thumbnail: {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/thumbnails/<path:s3_key>", methods=["GET"])
def get_thumbnail(s3_key):
    """Proxy S3 thumbnails through backend to avoid CORS issues"""
    try:
        # Configure S3 client
        s3_client = boto3.client(
            "s3",
            aws_access_key_id=AWS_ACCOUNT_ID,
            aws_secret_access_key=AWS_SECRET_KEY,
            region_name=AWS_REGION,
        )

        # Create a file-like object to hold the image
        file_obj = io.BytesIO()

        # Download the file from S3 to the file-like object
        s3_client.download_fileobj(S3_BUCKET_NAME, s3_key, file_obj)
        file_obj.seek(0)

        # Detect content type based on file extension
        content_type = "image/jpeg"  # Default
        if s3_key.lower().endswith(".png"):
            content_type = "image/png"
        elif s3_key.lower().endswith(".gif"):
            content_type = "image/gif"
        elif s3_key.lower().endswith(".webp"):
            content_type = "image/webp"

        # Return the image with appropriate headers
        return Response(
            file_obj.getvalue(),
            mimetype=content_type,
            headers={
                "Cache-Control": "max-age=86400",  # Cache for 24 hours
                "Content-Type": content_type,
            },
        )

    except Exception as e:
        logger.error(f"Error serving thumbnail: {str(e)}")
        return jsonify({"error": "Thumbnail not found"}), 404


@app.route("/api/courses/<int:course_id>/enroll", methods=["POST"])
@login_required
def enroll_in_course(user, course_id):
    """Enroll a user in a course"""
    try:
        # Check if the course exists
        course = Course.query.get(course_id)
        if not course:
            return jsonify({"error": "Course not found"}), 404

        # Check if the course is shareable
        if not course.shareable and course.user_id != user.id:
            return jsonify({"error": "Course is not public"}), 403

        # Check if the user is already enrolled
        existing_enrollment = Enrollment.query.filter_by(
            user_id=user.id, course_id=course_id
        ).first()

        if existing_enrollment:
            # If already enrolled but status is dropped, reactive it
            if existing_enrollment.status != "active":
                existing_enrollment.status = "active"
                existing_enrollment.last_accessed_at = datetime.utcnow()
                db.session.commit()
            return jsonify({"message": "Already enrolled in this course"}), 200

        # Create a new enrollment
        enrollment = Enrollment(user_id=user.id, course_id=course_id, status="active")
        db.session.add(enrollment)
        db.session.commit()

        return jsonify({"message": "Successfully enrolled in course"}), 201

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error enrolling in course: {str(e)}")
        return jsonify({"error": "Error enrolling in course"}), 500


@app.route("/api/courses/<int:course_id>/enrollment-status", methods=["GET"])
@jwt_required()
def get_enrollment_status(course_id):
    current_user = get_current_user()
    enrollment = Enrollment.query.filter_by(
        user_id=current_user.id, course_id=course_id, status="active"
    ).first()

    return (
        jsonify(
            {
                "enrolled": enrollment is not None,
                "has_premium_access": (
                    enrollment.has_premium_access if enrollment else False
                ),
                "status": enrollment.status if enrollment else None,
            }
        ),
        200,
    )


@app.route("/api/courses/<int:course_id>/enrollments", methods=["GET"])
@login_required
def get_course_enrollments(user, course_id):
    """Get all enrollments for a course (course owner only)"""
    try:
        # Check if the course exists
        course = Course.query.get(course_id)
        if not course:
            return jsonify({"error": "Course not found"}), 404

        # Check if the user is the course owner
        if course.user_id != user.id:
            return jsonify({"error": "Unauthorized access"}), 403

        # Get all active enrollments
        enrollments = Enrollment.query.filter_by(
            course_id=course_id, status="active"
        ).all()

        return (
            jsonify(
                {
                    "enrollments": [enrollment.to_dict() for enrollment in enrollments],
                    "total": len(enrollments),
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Error fetching course enrollments: {str(e)}")
        return jsonify({"error": "Error fetching course enrollments"}), 500


@app.route("/api/courses/public/<string:public_id>", methods=["GET"])
@jwt_required(optional=True)
def get_public_course_by_id(public_id):
    """Get course by public ID for public sharing"""
    try:
        # Find the course by public_id
        course = Course.query.filter_by(public_id=public_id).first()

        if not course:
            return jsonify({"error": "Course not found"}), 404

        # If course is not shareable, check if user is owner
        if not course.shareable:
            # Get current user if logged in
            current_user_id = get_jwt_identity()

            # If no user is logged in or user is not the owner
            if not current_user_id or course.user_id != int(current_user_id):
                return jsonify({"error": "Course is not public"}), 403

        # Get course data with full module details including permissions
        course_data = course.to_dict()

        # Enhance module data with explicit permissions to ensure is_public is set
        if "modules" in course_data and course_data["modules"]:
            for i, module_data in enumerate(course_data["modules"]):
                module_id = module_data.get("id")
                if module_id:
                    # Get the actual module object to access permissions
                    module = CourseModule.query.get(module_id)
                    if module:
                        # This will include access_level and is_public
                        course_data["modules"][i] = module.to_dict()

        # Check if user is enrolled if logged in
        if get_jwt_identity():
            try:
                enrollment = Enrollment.query.filter_by(
                    user_id=get_jwt_identity(), course_id=course.id, status="active"
                ).first()

                course_data["user_enrolled"] = enrollment is not None
            except Exception as e:
                logger.error(f"Error checking enrollment: {str(e)}")
                course_data["user_enrolled"] = False
        else:
            course_data["user_enrolled"] = False

        return jsonify(course_data), 200

    except Exception as e:
        logger.error(f"Error getting public course: {str(e)}")
        return jsonify({"error": "Error fetching course"}), 500


@app.route("/api/courses/<int:course_id>/unenroll", methods=["POST"])
@login_required
def unenroll_from_course(user, course_id):
    """Unenroll a user from a course"""
    try:
        # Check if the user is enrolled
        enrollment = Enrollment.query.filter_by(
            user_id=user.id, course_id=course_id, status="active"
        ).first()

        if not enrollment:
            return jsonify({"error": "You are not enrolled in this course"}), 404

        # Update enrollment status to dropped
        enrollment.status = "dropped"
        db.session.commit()

        return jsonify({"message": "Successfully unenrolled from course"}), 200

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error unenrolling from course: {str(e)}")
        return jsonify({"error": "Error unenrolling from course"}), 500


@app.route("/api/courses/marketplace", methods=["GET"])
@jwt_required(optional=True)
def get_marketplace_courses():
    try:
        # Query all courses that are marked as marketplace=True and shareable=True
        marketplace_courses = Course.query.filter_by(
            marketplace=True, shareable=True
        ).all()

        # Serialize the courses
        courses_data = []
        for course in marketplace_courses:
            course_dict = course.to_dict()
            # Add creator information
            creator = User.query.get(course.user_id)
            if creator:
                course_dict["created_by"] = creator.email.split("@")[
                    0
                ]  # Use first part of email as display name
            else:
                course_dict["created_by"] = "Brdge AI Team"
            courses_data.append(course_dict)

        return jsonify({"courses": courses_data, "status": "success"})
    except Exception as e:
        app.logger.error(f"Error fetching marketplace courses: {str(e)}")
        return (
            jsonify(
                {"error": "Failed to fetch marketplace courses", "status": "error"}
            ),
            500,
        )


@app.route(
    "/api/courses/<int:course_id>/modules/<int:module_id>/permissions",
    methods=["PUT", "OPTIONS"],
)
@cross_origin()
@login_required
def update_module_permissions(user, course_id, module_id):
    # For OPTIONS request (CORS preflight)
    if request.method == "OPTIONS":
        return {"Allow": "PUT, OPTIONS"}, 200

    try:
        # Get course and verify ownership
        course = Course.query.get(course_id)
        if not course or course.user_id != user.id:
            return jsonify({"error": "Course not found or not authorized"}), 404

        # Get module and verify it belongs to course
        module = CourseModule.query.filter_by(id=module_id, course_id=course_id).first()
        if not module:
            return jsonify({"error": "Module not found in this course"}), 404

        # Get data from request
        data = request.get_json()
        access_level = data.get("access_level")

        # Validate access level
        if access_level not in ["public", "enrolled", "premium"]:
            return jsonify({"error": "Invalid access level"}), 400

        # Get or create permission
        permission = ModulePermissions.query.filter_by(
            course_module_id=module_id
        ).first()
        if not permission:
            permission = ModulePermissions(course_module_id=module_id)
            db.session.add(permission)

        # Update permission
        permission.access_level = access_level
        db.session.commit()

        return jsonify({"status": "success", "permission": permission.to_dict()})

    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating module permissions: {str(e)}")
        return jsonify({"error": "Failed to update module permissions"}), 500


@app.route("/api/courses/enrolled", methods=["GET"])
@jwt_required()
def get_user_enrolled_courses():
    """Get all courses a user is enrolled in with detailed information"""
    try:
        current_user = get_current_user()

        # Query all active enrollments for this user
        enrollments = Enrollment.query.filter_by(
            user_id=current_user.id, status="active"
        ).all()

        # Collect course data with enrollment details
        enrolled_courses = []
        for enrollment in enrollments:
            course = Course.query.get(enrollment.course_id)
            if not course:
                continue

            # Get course data
            course_data = course.to_dict()

            # Add enrollment-specific data
            course_data["enrollment"] = {
                "id": enrollment.id,
                "status": enrollment.status,
                "progress": enrollment.progress,
                "has_premium_access": enrollment.has_premium_access,
                "last_accessed_at": (
                    enrollment.last_accessed_at.isoformat()
                    if enrollment.last_accessed_at
                    else None
                ),
                "enrolled_at": (
                    enrollment.enrolled_at.isoformat()
                    if enrollment.enrolled_at
                    else None
                ),
            }

            # For each module, determine if the user can access it based on their enrollment
            if "modules" in course_data and course_data["modules"]:
                for module in course_data["modules"]:
                    # Get module permissions
                    module_id = module.get("id")
                    if module_id:
                        course_module = CourseModule.query.get(module_id)
                        if course_module:
                            # Check access level
                            can_access = course_module.can_access(current_user)
                            module["can_access"] = can_access

            enrolled_courses.append(course_data)

        return (
            jsonify(
                {"enrolled_courses": enrolled_courses, "count": len(enrolled_courses)}
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Error fetching enrolled courses: {str(e)}")
        return jsonify({"error": "Failed to fetch enrolled courses"}), 500


@app.route("/api/courses/<int:course_id>/public", methods=["GET"])
@jwt_required(optional=True)
def get_public_course_details(course_id):
    """Get course details for enrolled users or public courses"""
    try:
        course = Course.query.get_or_404(course_id)
        current_user_id = get_jwt_identity()

        # Always allow access if course is public/shareable
        if course.shareable:
            course_data = course.to_dict()
            return jsonify(course_data)

        # Check if user is enrolled
        if current_user_id:
            enrollment = Enrollment.query.filter_by(
                user_id=current_user_id, course_id=course_id, status="active"
            ).first()

            if enrollment:
                course_data = course.to_dict()
                return jsonify(course_data)

        # If not shareable and not enrolled, return 403
        return jsonify({"error": "You don't have access to this course"}), 403

    except Exception as e:
        app.logger.error(f"Error getting public course: {str(e)}")
        return jsonify({"error": "Failed to get course details"}), 500


@app.route("/api/brdges/<int:brdge_id>/conversation-logs", methods=["POST"])
@cross_origin()
def add_conversation_log(brdge_id):
    """Store a conversation log entry between agent and user"""
    try:
        data = request.get_json()

        # Get required fields
        message = data.get("message")
        role = data.get("role")
        timestamp_str = data.get("timestamp")
        was_interrupted = data.get("was_interrupted", False)
        duration_seconds = data.get("duration_seconds", 0.0)

        # Get ownership/viewer info
        viewer_user_id = data.get("viewer_user_id")
        anonymous_id = data.get("anonymous_id")

        # Get the brdge to determine owner_id
        brdge = Brdge.query.get_or_404(brdge_id)
        owner_id = brdge.user_id

        # Validate required fields
        if not all([message, role]):
            return jsonify({"error": "Missing required fields"}), 400

        # Parse timestamp if provided, otherwise use current time
        if timestamp_str:
            try:
                timestamp = datetime.fromisoformat(timestamp_str)
            except ValueError:
                timestamp = datetime.utcnow()
        else:
            timestamp = datetime.utcnow()

        # Create conversation log
        conversation_log = ConversationLogs(
            brdge_id=brdge_id,
            owner_id=owner_id,
            viewer_user_id=viewer_user_id,
            anonymous_id=anonymous_id,
            role=role,
            message=message,
            timestamp=timestamp,
            was_interrupted=was_interrupted,
            duration_seconds=duration_seconds,
        )

        db.session.add(conversation_log)
        db.session.commit()

        logger.info(f"Added conversation log: {role} message for brdge {brdge_id}")

        return (
            jsonify(
                {
                    "id": conversation_log.id,
                    "timestamp": conversation_log.timestamp.isoformat(),
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error logging conversation: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/brdges/<int:brdge_id>/conversation-logs", methods=["GET"])
@jwt_required(optional=True)
@cross_origin()
def get_conversation_logs(brdge_id):
    """Get conversation logs for a brdge"""
    try:
        current_user = get_current_user()
        brdge = Brdge.query.get_or_404(brdge_id)

        # Base query for the brdge
        query = ConversationLogs.query.filter_by(brdge_id=brdge_id)

        # If user owns the brdge, show all conversations
        if current_user and current_user.id == brdge.user_id:
            pass  # No additional filtering
        # If user is authenticated but doesn't own the brdge, show only their conversations
        elif current_user:
            query = query.filter_by(viewer_user_id=current_user.id)
        # If user is not authenticated, require anonymous_id
        else:
            anonymous_id = request.args.get("anonymous_id")
            if anonymous_id:
                query = query.filter_by(anonymous_id=anonymous_id)
            else:
                return (
                    jsonify(
                        {"error": "Anonymous ID required for non-authenticated users"}
                    ),
                    400,
                )

        # Get conversations with most recent first
        conversations = query.order_by(ConversationLogs.timestamp.desc()).all()

        return (
            jsonify(
                {
                    "conversations": [conv.to_dict() for conv in conversations],
                    "count": len(conversations),
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Error fetching conversation logs: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/contact", methods=["POST"])
@jwt_required()
def submit_contact_issue():
    try:
        current_user = get_current_user()
        data = request.get_json()
        message = data.get("message")

        if not message:
            return jsonify({"error": "Message is required"}), 400

        # Create new user issue
        user_issue = UserIssues(
            user_id=current_user.id,
            message=message,
            status="pending",
            created_at=datetime.utcnow(),
        )

        db.session.add(user_issue)
        db.session.commit()

        # Send email notification
        email_content = {"email": current_user.email, "message": message}
        send_notification_email(
            subject="New Support Request from Brdge AI",
            content=email_content,
            template_type="support",
        )

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Your message has been received. Our team will get back to you soon.",
                    "issue": user_issue.to_dict(),
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error submitting contact issue: {str(e)}")
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Failed to submit your message. Please try again.",
                }
            ),
            500,
        )


@app.route("/api/services/leads", methods=["POST"])
def submit_service_lead():
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ["name", "email", "hasExistingCourse"]
        missing_fields = [field for field in required_fields if not data.get(field)]
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

        # Validate email format
        email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(email_regex, data.get("email")):
            return jsonify({"error": "Invalid email format"}), 400

        # Create new lead
        lead = ServiceLead(
            name=data.get("name"),
            email=data.get("email"),
            has_existing_course=data.get("hasExistingCourse") == "yes",
            course_topic=data.get("courseTopic"),
            status="new",
        )

        db.session.add(lead)
        db.session.commit()

        # Send email notification
        email_content = {
            "name": data.get("name"),
            "email": data.get("email"),
            "has_existing_course": data.get("hasExistingCourse"),
            "course_topic": data.get("courseTopic"),
        }
        send_notification_email(
            subject="New Service Lead from Brdge AI",
            content=email_content,
            template_type="lead",
        )

        return (
            jsonify(
                {
                    "success": True,
                    "message": "Thank you for your interest! Our team will contact you within 24 hours.",
                    "lead": lead.to_dict(),
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error submitting service lead: {str(e)}")
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Failed to submit your information. Please try again.",
                }
            ),
            500,
        )


def send_notification_email(
    subject,
    content,
    template_type="support",
    attachment_path=None,
    attachment_filename=None,
):
    try:
        email_user = os.getenv("SMTP_EMAIL", "levi@brdge-ai.com")  # Renamed for clarity
        email_password = os.getenv("SMTP_PASSWORD")  # Renamed for clarity
        recipient_email = "levi@dotbridge.io"  # Target recipient

        msg = MIMEMultipart()
        msg["From"] = f"Brdge AI Careers <{email_user}>"
        msg["To"] = recipient_email
        msg["Subject"] = subject

        if template_type == "support":
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>🎯 New Support Request</h2>
                    <p><strong>From User:</strong> {content['email']}</p>
                    <p><strong>Time:</strong> {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}</p>
                    <p><strong>Message:</strong></p>
                    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
                        {content['message']}
                    </div>
                </body>
            </html>
            """
        elif template_type == "lead":
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>🚀 New Service Lead</h2>
                    <p><strong>Name:</strong> {content['name']}</p>
                    <p><strong>Email:</strong> {content['email']}</p>
                    <p><strong>Has Existing Course:</strong> {content['has_existing_course']}</p>
                    <p><strong>Course Topic:</strong> {content['course_topic'] or 'Not specified'}</p>
                    <p><strong>Time:</strong> {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}</p>
                </body>
            </html>
            """
        elif template_type == "job_application":
            html_content = f"""
            <html>
                <body style="font-family: Arial, sans-serif;">
                    <h2>📄 New Job Application Received</h2>
                    <p><strong>Applicant Name:</strong> {content['name']}</p>
                    <p><strong>Applicant Email:</strong> <a href="mailto:{content['email']}">{content['email']}</a></p>
                    <p><strong>Applying for:</strong> {content['job_title']} (Job ID: {content.get('job_id', 'N/A')})</p>
                    <p><strong>Application ID (DB):</strong> {content.get('application_id', 'N/A')}</p>
                    <p><strong>Submitted at:</strong> {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S UTC')}</p>
                    <p>The resume is attached to this email.</p>
                </body>
            </html>
            """

        msg.attach(MIMEText(html_content, "html"))

        if attachment_path and attachment_filename:
            try:
                with open(attachment_path, "rb") as attachment:
                    part = MIMEBase("application", "octet-stream")
                    part.set_payload(attachment.read())
                encoders.encode_base64(part)
                part.add_header(
                    "Content-Disposition",
                    f"attachment; filename= {attachment_filename}",
                )
                msg.attach(part)
                logger.info(f"Successfully attached {attachment_filename} to email.")
            except Exception as attach_error:
                logger.error(
                    f"Error attaching file {attachment_filename} to email: {attach_error}"
                )
                # Optionally, modify email body to indicate attachment failure
                # For now, we'll let the email send without it if attachment fails

        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(email_user, email_password)  # Use renamed variables
            server.send_message(msg)

        logger.info(
            f"Notification email sent successfully: {subject} to {recipient_email}"
        )
        return True

    except Exception as e:
        logger.error(f"Failed to send notification email: {str(e)}")
        return False


@app.route("/api/test-email", methods=["GET"])
def test_email():
    """Test email configuration"""
    try:
        test_content = {
            "email": "test@example.com",
            "message": "This is a test email from Brdge AI system.",
        }

        success = send_notification_email(
            subject="Test Email from Brdge AI",
            content=test_content,
            template_type="support",
        )

        if success:
            return (
                jsonify(
                    {
                        "success": True,
                        "message": "Test email sent successfully to your inbox",
                    }
                ),
                200,
            )
        else:
            return (
                jsonify({"success": False, "message": "Failed to send test email"}),
                500,
            )

    except Exception as e:
        logger.error(f"Error sending test email: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/brdges/<int:brdge_id>/status", methods=["GET"])
@login_required
def get_brdge_status(user, brdge_id):
    try:
        # Get the latest script for this brdge
        brdge = Brdge.query.filter_by(id=brdge_id, user_id=user.id).first_or_404()
        script = (
            BrdgeScript.query.filter_by(brdge_id=brdge_id)
            .order_by(BrdgeScript.id.desc())
            .first()
        )

        if not script:
            return jsonify({"status": "pending", "logs": [], "progress": 0}), 200

        # Get metadata with logs
        metadata = script.script_metadata or {}
        logs = metadata.get("logs", [])
        progress = metadata.get("progress", 0)

        # Return the status, progress, and logs
        return (
            jsonify(
                {
                    "status": script.status,
                    "logs": logs,
                    "progress": progress,
                    "updated_at": (
                        script.created_at.isoformat() if script.created_at else None
                    ),
                }
            ),
            200,
        )

    except Exception as e:
        logger.error(f"Error getting brdge status: {str(e)}")
        return jsonify({"error": "Error getting brdge status", "detail": str(e)}), 500


def process_brdge_content_with_logs(
    brdge_id, video_local_path, pdf_local_path, template_type, script_id
):
    """Process brdge content with detailed logging."""
    try:
        script_obj = BrdgeScript.query.get(script_id)
        if not script_obj:
            logger.error(f"Could not find BrdgeScript with ID {script_id}")
            return

        # Initialize metadata if needed
        if not script_obj.script_metadata:
            script_obj.script_metadata = {"logs": [], "progress": 0}

        # Helper function to add logs
        def add_log(message, status="info", progress=None):
            metadata = script_obj.script_metadata
            metadata["logs"].append(
                {"message": message, "status": status, "timestamp": time.time()}
            )
            if progress is not None:
                metadata["progress"] = progress
            script_obj.script_metadata = metadata
            db.session.commit()

        # Begin processing
        add_log("Starting content analysis", "info", 5)

        # Step 1: Extract video content
        add_log("Analyzing video content...", "info", 10)
        # [Your video processing code here]
        add_log("Video analysis complete", "success", 30)

        # Step 2: Process PDF if available
        if pdf_local_path:
            add_log("Processing presentation content...", "info", 35)
            # [Your PDF processing code here]
            add_log("Presentation analysis complete", "success", 50)

        # Step 3: Generate knowledge base
        add_log("Building knowledge base from content...", "info", 55)
        # [Your knowledge base generation code here]
        add_log("Knowledge base creation complete", "success", 70)

        # Step 4: Create teaching persona
        add_log("Extracting teaching patterns...", "info", 75)
        # [Your teaching persona extraction code here]
        add_log("Teaching persona analysis complete", "success", 85)

        # Step 5: Generate engagement opportunities
        add_log("Identifying engagement opportunities...", "info", 90)
        # [Your engagement opportunities code here]
        add_log("Engagement opportunities identified", "success", 95)

        # Step 6: Finalize and save results
        add_log("Compiling extracted intelligence...", "info", 98)

        # Call your actual processing function here
        extraction_results = process_brdge_content(
            brdge_id, video_local_path, pdf_local_path, template_type
        )

        # Update the script content with extraction results
        script_obj.content = extraction_results
        script_obj.status = "completed"
        add_log("Content processing completed!", "success", 100)

        db.session.commit()

        # Clean up temporary files
        if os.path.exists(video_local_path):
            os.remove(video_local_path)
        if pdf_local_path and os.path.exists(pdf_local_path):
            os.remove(pdf_local_path)

    except Exception as e:
        logger.error(
            f"Error in process_brdge_content_with_logs: {str(e)}", exc_info=True
        )
        try:
            if script_obj:
                script_obj.status = "failed"
                if script_obj.script_metadata:
                    script_obj.script_metadata["logs"].append(
                        {
                            "message": "Processing failed. Please try again.",
                            "status": "error",
                            "timestamp": time.time(),
                        }
                    )
                db.session.commit()
        except Exception:
            logger.error("Failed to update script status on error", exc_info=True)


@app.route("/api/preview-subscription-upgrade", methods=["POST"])
@login_required
def preview_subscription_upgrade(user):
    try:
        data = request.get_json()
        target_frontend_tier = data.get("target_tier")  # e.g., "standard", "premium"

        if not target_frontend_tier:
            return jsonify({"error": "Target tier is required"}), 400

        logger.info(
            f"Previewing subscription upgrade to: {target_frontend_tier} for user {user.id}"
        )

        user_account = UserAccount.query.filter_by(user_id=user.id).first()

        if (
            not user_account
            or not user_account.stripe_subscription_id
            or user_account.subscription_status != "active"
        ):
            logger.warning(
                f"User {user.id} does not have an active subscription to preview an upgrade for."
            )
            return jsonify({"error": "No active subscription found to upgrade."}), 400

        # Map frontend tier name to backend SUBSCRIPTION_TIERS key
        target_account_type_key = (
            "pro" if target_frontend_tier == "premium" else target_frontend_tier
        )
        if target_account_type_key not in SUBSCRIPTION_TIERS or not SUBSCRIPTION_TIERS[
            target_account_type_key
        ].get("price_id"):
            return (
                jsonify(
                    {
                        "error": "Invalid target tier or missing price ID for target tier."
                    }
                ),
                400,
            )

        new_price_id = SUBSCRIPTION_TIERS[target_account_type_key]["price_id"]

        # Get current subscription's item to replace
        try:
            current_sub_items = stripe.SubscriptionItem.list(
                subscription=user_account.stripe_subscription_id, limit=1
            )
            if not current_sub_items or not current_sub_items.data:
                logger.error(
                    f"No items found for active subscription {user_account.stripe_subscription_id}"
                )
                return (
                    jsonify({"error": "Could not find items on current subscription."}),
                    500,
                )
            current_item_id = current_sub_items.data[0].id
            current_price_id = current_sub_items.data[0].price.id

            if current_price_id == new_price_id:
                return (
                    jsonify(
                        {
                            "message": "You are already on this plan.",
                            "already_on_plan": True,
                        }
                    ),
                    200,
                )

        except stripe.error.StripeError as e:
            logger.error(
                f"Stripe error fetching current subscription items for preview: {str(e)}"
            )
            return (
                jsonify(
                    {
                        "error": "Could not fetch current subscription details for preview."
                    }
                ),
                500,
            )

        # Preview the invoice for the change
        try:
            preview_invoice = stripe.Invoice.upcoming(
                customer=user_account.stripe_customer_id,
                subscription=user_account.stripe_subscription_id,
                subscription_items=[
                    {
                        "id": current_item_id,
                        "price": new_price_id,  # The new price ID to upgrade to
                    }
                ],
                subscription_proration_behavior="create_prorations",
            )

            # Calculate prorated charge by summing proration line items
            net_proration_charge_cents = 0
            for line in preview_invoice.lines.data:
                if line.proration:
                    net_proration_charge_cents += line.amount

            # Use the calculated net proration, ensuring it's not negative for display purposes (minimum $0 charge)
            prorated_charge_now_cents = max(0, net_proration_charge_cents)

            # The subscription's next invoice will have the full amount for the new tier.
            # The preview_invoice.lines will contain details. The total of the invoice is prorated.
            # To get the next *regular* charge, we look at the new price.
            next_regular_charge_cents = SUBSCRIPTION_TIERS[target_account_type_key].get(
                "price_in_cents"
            )  # Assumes you add this to SUBSCRIPTION_TIERS
            if not next_regular_charge_cents:
                # Fallback by looking up the price object if not stored (less efficient)
                new_price_obj = stripe.Price.retrieve(new_price_id)
                next_regular_charge_cents = new_price_obj.unit_amount

            # next_billing_date from the preview invoice subscription details (if available) or current sub's period end
            # The preview_invoice.subscription_details.current_period_end might reflect the new cycle
            # For simplicity, we'll state the next regular billing date based on current cycle end transformed by proration.
            # Stripe handles the exact date, but it will be approx one month from the proration billing.
            # The actual next_billing_date is better sourced after actual modification.
            # For preview, the `preview_invoice.period_end` or `preview_invoice.next_payment_attempt` might be useful

            next_billing_date_timestamp = (
                preview_invoice.next_payment_attempt
            )  # This is often the most reliable for preview
            if not next_billing_date_timestamp:
                # Fallback: if next_payment_attempt is null (e.g. $0 proration), use subscription period end for context
                # This is more about *when the next full cycle starts* rather than when the prorated amount is due if $0.
                sub_details = stripe.Subscription.retrieve(
                    user_account.stripe_subscription_id
                )
                next_billing_date_timestamp = sub_details.current_period_end

            response_data = {
                "prorated_charge_now_cents": prorated_charge_now_cents,
                "next_regular_charge_cents": next_regular_charge_cents,
                "currency": preview_invoice.currency,
                "next_billing_date_timestamp": next_billing_date_timestamp,  # User for display: "Your next bill on [date]"
                "target_tier_name": target_frontend_tier.capitalize(),
                "new_price_id_for_confirmation": new_price_id,  # For frontend to pass back if user confirms
            }
            logger.info(
                f"Upgrade preview for user {user.id} to {target_frontend_tier}: {response_data}"
            )
            return jsonify(response_data), 200

        except stripe.error.StripeError as e:
            logger.error(
                f"Stripe error fetching upcoming invoice for preview: {str(e)}"
            )
            return (
                jsonify({"error": "Could not fetch upgrade preview from Stripe."}),
                500,
            )
        except Exception as e:
            logger.error(
                f"Unexpected error during upgrade preview: {str(e)}", exc_info=True
            )
            return (
                jsonify(
                    {
                        "error": "An unexpected error occurred while preparing the upgrade preview."
                    }
                ),
                500,
            )

    except Exception as e:
        logger.error(
            f"Overall error in preview_subscription_upgrade for user {user.id if 'user' in locals() and user else 'unknown'}: {e}",
            exc_info=True,
        )
        db.session.rollback()  # Should not be needed as this is a read-mostly endpoint
        return (
            jsonify({"error": "An internal error occurred while previewing upgrade."}),
            500,
        )


# It's good practice to configure Gemini and get the model once when the app starts,
# or use a request context to manage it if preferred.


@app.route("/api/careers/challenge/<job_id_str>", methods=["GET"])
@cross_origin()
def get_job_challenges_route(job_id_str):
    """
    API endpoint to fetch a dynamically generated sequence of challenges for a given job ID.
    Relies on gemini.py to handle model initialization internally.
    """
    try:
        current_app.logger.info(f"Request received for job ID {job_id_str} challenges.")

        # get_dynamic_challenge_sequence now handles getting the model internally
        challenges = gemini.get_dynamic_challenge_sequence(job_id_str)

        if (
            not challenges
            or (
                len(challenges) == 1
                and challenges[0].get("type") == "error_placeholder"
            )
            or (len(challenges) == 1 and "error" in challenges[0])
        ):
            error_message = "Could not generate challenges for this role at the moment."
            status_code = 500
            if (
                challenges and "error" in challenges[0]
            ):  # Check if the first item is an error dict
                if challenges[0]["error"] == "Unknown job ID, no challenges defined.":
                    error_message = (
                        "Invalid job ID or no challenges defined for this role."
                    )
                    status_code = 404
                # If it's an error_placeholder from generation failure
                elif challenges[0].get("type") == "error_placeholder":
                    error_message = challenges[0].get("description", error_message)

            current_app.logger.error(
                f"Challenge generation failed for job ID {job_id_str}: {error_message}"
            )
            return jsonify({"error": error_message}), status_code

        current_app.logger.info(
            f"Successfully generated {len(challenges)} challenges for job ID {job_id_str}."
        )
        return jsonify(challenges), 200

    except Exception as e:
        current_app.logger.error(
            f"Error fetching challenges for job ID {job_id_str}: {e}", exc_info=True
        )
        return (
            jsonify(
                {"error": "An internal error occurred while generating challenges."}
            ),
            500,
        )


@app.route("/api/careers/challenge/submit", methods=["POST"])
@cross_origin()
def submit_challenge_solution_route():
    data = request.get_json()
    current_app.logger.info(
        f"Received solution submission for challenge type: {data.get('challengeType')}"
    )

    job_id = data.get("jobId")
    challenge_id = data.get("challengeId")
    challenge_type = data.get("challengeType")
    solution_data = data.get("solution")
    validation_criteria = data.get("validationCriteria")
    original_challenge_description = data.get("originalChallengeDescription")

    if not all(
        [job_id, challenge_id, challenge_type, solution_data, validation_criteria]
    ):
        return (
            jsonify({"error": "Missing required fields for solution submission."}),
            400,
        )

    try:
        # Perform basic validation on the solution data based on challenge type
        if challenge_type == "logic_puzzle" and "selected_option" not in solution_data:
            current_app.logger.warning(
                f"Logic puzzle solution missing selected_option: {solution_data}"
            )
            solution_data = {"selected_option": solution_data.get("text", "0")}

        elif (
            challenge_type == "visual_pattern"
            and "selected_option_id" not in solution_data
        ):
            current_app.logger.warning(
                f"Visual pattern solution missing selected_option_id: {solution_data}"
            )
            return (
                jsonify(
                    {"error": "Invalid solution format for visual pattern challenge."}
                ),
                400,
            )

        elif challenge_type == "http_status_codes" and (
            "question_id" not in solution_data or "selected_index" not in solution_data
        ):
            current_app.logger.warning(
                f"HTTP status code solution missing question_id or selected_index: {solution_data}"
            )
            return (
                jsonify(
                    {"error": "Invalid solution format for HTTP status code challenge."}
                ),
                400,
            )

        # Get a model instance for validation
        gemini.configure_genai()  # Ensure Gemini is configured
        model_instance = gemini.get_model(model_name="gemini-2.0-flash")

        if not model_instance:
            current_app.logger.error(
                "Failed to get Gemini model for solution validation."
            )
            return (
                jsonify({"error": "Backend model error, cannot validate solution."}),
                503,
            )

        # Update the validation criteria based on challenge type if needed
        if challenge_type == "http_status_codes" and "questions" in validation_criteria:
            # Store the full questions data in validation_criteria
            # so validate_solution can find the correct question by ID
            pass  # Already in the right format

        # Validate the solution
        evaluation_result = gemini.validate_solution(
            model_instance,
            challenge_type,
            solution_data,
            validation_criteria,
            original_challenge_description,
        )

        is_correct = evaluation_result.get("is_correct", False)
        feedback_message = evaluation_result.get(
            "feedback", "Your solution has been processed."
        )

        # Add gamification elements to the response
        xp_earned = 50 if is_correct else 10  # Base XP for attempt, more for correct

        # Return a more enriched response with gamification elements
        response = {
            "success": is_correct,
            "message": feedback_message,
            "challenge_id": challenge_id,
            "gamification": {
                "xp_earned": xp_earned,
                "level_progress": xp_earned
                / 100,  # Simple percentage towards next level
                "badges": [],  # Could add badges based on challenge type and performance
                "stats": {
                    "challenge_type": challenge_type,
                    "time_taken": data.get(
                        "timeTaken", 0
                    ),  # If client sends time taken
                    "attempt_count": data.get(
                        "attemptCount", 1
                    ),  # If client tracks attempts
                },
            },
        }

        # Add specific badge for first correct solution of this type
        if is_correct:
            badge_name = ""
            badge_description = ""

            if challenge_type == "logic_puzzle":
                badge_name = "Logic Master"
                badge_description = "Successfully solved a complex logic puzzle"
            elif challenge_type == "visual_pattern":
                badge_name = "Pattern Recognition"
                badge_description = "Successfully identified a complex visual pattern"
            elif challenge_type == "code_snippet":
                badge_name = "Code Optimizer"
                badge_description = "Successfully improved a code snippet"
            elif challenge_type == "system_design_visual":
                badge_name = "System Architect"
                badge_description = "Successfully designed a complex system"
            elif challenge_type == "game_theory_interactive":
                badge_name = "Strategic Thinker"
                badge_description = "Successfully navigated a strategic scenario"
            elif challenge_type == "http_status_codes":
                badge_name = "HTTP Expert"
                badge_description = "Successfully mastered HTTP status codes"

            if badge_name:
                response["gamification"]["badges"].append(
                    {
                        "name": badge_name,
                        "description": badge_description,
                        "icon": badge_name.lower().replace(" ", "_"),
                    }
                )

        return jsonify(response), 200

    except Exception as e:
        current_app.logger.error(
            f"Error during solution validation for challenge {challenge_id}: {e}",
            exc_info=True,
        )
        return (
            jsonify(
                {
                    "error": "An internal error occurred while validating your solution.",
                    "success": False,
                }
            ),
            500,
        )


@app.route("/api/careers/apply/<int:job_id>", methods=["POST"])
def handle_job_application(job_id):
    try:
        if "resume" not in request.files:
            return jsonify({"error": "Resume file is required"}), 400

        name = request.form.get("name")
        email = request.form.get("email")
        job_title = request.form.get("jobTitle")  # Get job title from form
        resume_file = request.files["resume"]

        if not name or not email or not job_title:
            return jsonify({"error": "Name, email, and job title are required"}), 400

        # Validate email format
        email_regex = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
        if not re.match(email_regex, email):
            return jsonify({"error": "Invalid email format"}), 400

        # Secure filename and save resume temporarily
        resume_filename = secure_filename(f"{uuid.uuid4()}_{resume_file.filename}")
        temp_resume_dir = "/tmp/resumes"
        os.makedirs(temp_resume_dir, exist_ok=True)
        temp_resume_path = os.path.join(temp_resume_dir, resume_filename)
        resume_file.save(temp_resume_path)

        # Store application in database (optional, but good practice)
        # This assumes you have a JobApplication model
        try:
            application = JobApplication(
                job_id=job_id,
                name=name,
                email=email,
                job_title=job_title,
                resume_filename=resume_filename,  # Store filename for reference
                status="submitted",
            )
            db.session.add(application)
            db.session.commit()
            application_id = application.id
        except Exception as db_error:
            db.session.rollback()
            logger.error(f"Database error saving job application: {db_error}")
            # Continue with email sending even if DB save fails for now
            application_id = None

        # Send email notification with resume attached
        email_subject = f"New Job Application: {job_title} - {name}"
        email_content_data = {
            "name": name,
            "email": email,
            "job_id": job_id,
            "job_title": job_title,
            "application_id": application_id,
        }

        email_sent = send_notification_email(
            subject=email_subject,
            content=email_content_data,
            template_type="job_application",  # New template type
            attachment_path=temp_resume_path,
            attachment_filename=resume_file.filename,  # Use original filename for attachment
        )

        if not email_sent:
            logger.error(f"Failed to send application email for {name} - {job_title}")
            # Decide if this should be a hard failure for the user
            # For now, we'll still return success if DB save worked, but log error

        # Clean up temporary resume file
        if os.path.exists(temp_resume_path):
            os.remove(temp_resume_path)

        return (
            jsonify(
                {
                    "message": "Application submitted successfully! We will be in touch.",
                    "application_id": application_id,
                }
            ),
            201,
        )

    except Exception as e:
        logger.error(f"Error handling job application: {str(e)}", exc_info=True)
        # Clean up temp file in case of error during processing after save
        if "temp_resume_path" in locals() and os.path.exists(temp_resume_path):
            os.remove(temp_resume_path)
        return (
            jsonify({"error": "An error occurred while submitting your application."}),
            500,
        )


# ... (rest of your routes.py)
