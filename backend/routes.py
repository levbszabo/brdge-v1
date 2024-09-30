# routes.py
from app import app, db
from flask import request, jsonify, send_file, abort
from werkzeug.utils import secure_filename
import os
import boto3
import uuid
from models import Brdge
from utils import pdf_to_images
from io import BytesIO

# AWS S3 configuration
S3_BUCKET = os.getenv("S3_BUCKET")
S3_REGION = os.getenv("S3_REGION", "us-east-1")  # Default to 'us-east-1' if not set

# Initialize S3 client with the correct region
s3_client = boto3.client("s3", region_name=S3_REGION)


@app.route("/api/brdges/<int:brdge_id>", methods=["PUT"])
def update_brdge(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    name = request.form.get("name")
    presentation = request.files.get("presentation")

    if name:
        brdge.name = name

    if presentation:
        # Process new presentation
        presentation_filename = secure_filename(
            f"{uuid.uuid4()}_{presentation.filename}"
        )
        pdf_temp_path = os.path.join("/tmp", presentation_filename)
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
def get_brdge(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)

    # Assuming you have a way to get the number of slides and transcripts
    # For now, we'll assume num_slides is stored or can be calculated
    s3_folder = brdge.folder
    # Count the number of slide images in the S3 folder
    response = s3_client.list_objects_v2(
        Bucket=S3_BUCKET,
        Prefix=f"{s3_folder}/slides/",
    )
    num_slides = len(
        [obj for obj in response.get("Contents", []) if obj["Key"].endswith(".png")]
    )

    # Fetch transcripts if stored (you'll need to implement this part)
    transcripts = []  # Fetch transcripts from database or storage

    brdge_data = brdge.to_dict()
    brdge_data["num_slides"] = num_slides
    brdge_data["transcripts"] = transcripts

    return jsonify(brdge_data), 200


@app.route("/api/brdges/<int:brdge_id>/slides/<int:slide_number>", methods=["GET"])
def get_slide_image(brdge_id, slide_number):
    brdge = Brdge.query.get_or_404(brdge_id)
    s3_key = f"{brdge.folder}/slides/slide_{slide_number}.png"

    try:
        s3_object = s3_client.get_object(Bucket=S3_BUCKET, Key=s3_key)
        image_data = s3_object["Body"].read()
        return send_file(BytesIO(image_data), mimetype="image/png")
    except Exception as e:
        print(f"Error fetching image from S3: {e}")
        abort(404)


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
        presentation_filename="",  # Will update after S3 upload
        audio_filename="",  # Placeholder for now
        folder="",  # Will update after S3 upload
    )
    db.session.add(brdge)
    db.session.flush()  # Assigns an ID without committing

    # Generate unique filename for the PDF
    presentation_filename = secure_filename(f"{uuid.uuid4()}_{presentation.filename}")

    # Save the PDF locally for processing
    pdf_temp_path = os.path.join("/tmp", presentation_filename)
    presentation.save(pdf_temp_path)

    # Convert PDF to images
    slide_images = pdf_to_images(pdf_temp_path)

    # Upload PDF and images to S3
    s3_folder = f"brdges/{brdge.id}"
    s3_presentation_key = f"{s3_folder}/{presentation_filename}"

    # Upload the original PDF to S3
    s3_client.upload_file(pdf_temp_path, S3_BUCKET, s3_presentation_key)

    # Update brdge data with S3 information
    brdge.presentation_filename = presentation_filename
    brdge.folder = s3_folder

    # Upload slide images to S3
    num_slides = len(slide_images)
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
                "num_slides": num_slides,  # Return the number of slides instead of URLs
            }
        ),
        201,
    )
