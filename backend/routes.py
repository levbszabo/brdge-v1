# routes.py
from app import app, db
from flask import request, jsonify
from werkzeug.utils import secure_filename
import os
import boto3
import uuid
from models import Brdge
from utils import pdf_to_images  # We'll create this utility function
from io import BytesIO

# AWS S3 configuration (we'll detail this in the next section)
S3_BUCKET = os.getenv("S3_BUCKET")

# Initialize S3 client
s3_client = boto3.client("s3")


@app.route("/api/brdges", methods=["GET"])
def get_brdges():
    brdges = Brdge.query.all()
    return jsonify([brdge.to_dict() for brdge in brdges]), 200


@app.route("/api/brdges", methods=["POST"])
def create_brdge():
    name = request.form.get("name")
    presentation = request.files.get("presentation")

    if not all([name, presentation]):
        return jsonify({"error": "Missing data"}), 400

    # Create brdge data first to get the ID
    brdge = Brdge(
        name=name,
        presentation_filename="",  # We'll update this after S3 upload
        audio_filename="",  # Placeholder for now
        folder="",  # We'll update this after S3 upload
    )
    db.session.add(brdge)
    db.session.flush()  # This assigns an ID to the brdge without committing the transaction

    # Generate unique filename for the PDF
    presentation_filename = secure_filename(f"{uuid.uuid4()}_{presentation.filename}")

    # Upload PDF to S3
    s3_folder = f"brdges/{brdge.id}"
    s3_presentation_key = f"{s3_folder}/{presentation_filename}"

    s3_client.upload_fileobj(presentation, S3_BUCKET, s3_presentation_key)

    # Update brdge data with S3 information
    brdge.presentation_filename = presentation_filename
    brdge.folder = s3_folder

    # Save the PDF locally for processing
    pdf_temp_path = f"/tmp/{presentation_filename}"
    s3_client.download_file(S3_BUCKET, s3_presentation_key, pdf_temp_path)

    # Convert PDF to images
    slide_images = pdf_to_images(pdf_temp_path)

    # Upload slide images to S3 and get their URLs
    slide_image_urls = []
    for idx, image in enumerate(slide_images):
        image_filename = f"slide_{idx+1}.png"
        s3_image_key = f"{s3_folder}/slides/{image_filename}"

        # Save image to a bytes buffer
        img_byte_arr = BytesIO()
        image.save(img_byte_arr, format="PNG")
        img_byte_arr.seek(0)

        # Upload image to S3
        s3_client.upload_fileobj(img_byte_arr, S3_BUCKET, s3_image_key)

        # Generate pre-signed URL
        image_url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": S3_BUCKET, "Key": s3_image_key},
            ExpiresIn=3600,  # URL expires in 1 hour
        )
        slide_image_urls.append(image_url)

    # Clean up temporary PDF file
    os.remove(pdf_temp_path)

    db.session.commit()

    return (
        jsonify(
            {
                "message": "Brdge created successfully",
                "brdge": brdge.to_dict(),
                "slide_image_urls": slide_image_urls,
            }
        ),
        201,
    )
