# routes.py
from app import app, db
from flask import request, jsonify, send_file, abort
from werkzeug.utils import secure_filename
import os
import boto3
import uuid
from models import Brdge
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
    s3_client.upload_fileobj(audio_file, S3_BUCKET, s3_audio_key)

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
        # Copy the object to a new key and delete the old one
        s3_client.copy_object(
            Bucket=S3_BUCKET,
            CopySource={"Bucket": S3_BUCKET, "Key": old_key},
            Key=new_key,
        )
        s3_client.delete_object(Bucket=S3_BUCKET, Key=old_key)
        brdge.audio_filename = secure_filename(new_name)
        db.session.commit()
        return jsonify({"message": "Audio renamed successfully"}), 200
    except Exception as e:
        print(f"Error renaming audio in S3: {e}")
        return jsonify({"error": "Error renaming audio"}), 500


# create a route to transcribe the audio we will use a utils function called transcribe_audio to do this
# we need to pull the audio to a local file first, transcribe and then upload to s3


@app.route("/api/brdges/<int:brdge_id>/audio/transcribe", methods=["POST"])
def transcribe_audio(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    if not brdge.audio_filename:
        return jsonify({"error": "No audio file associated with this brdge"}), 400

    brdge_data = brdge.to_dict()
    audio_s3_key = brdge_data["audio_s3_key"]
    audio_local_path = f"/tmp/{brdge.audio_filename}"

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
        return jsonify({"error": f"Error downloading audio file: {str(e)}"}), 500

    transcript_local = f"/tmp/transcript_{brdge_id}.txt"
    try:
        transcribed_transcript = transcribe_audio_helper(
            audio_local_path, transcript_local
        )
    except Exception as e:
        return jsonify({"error": f"Error transcribing audio: {str(e)}"}), 500

    transcript_s3_key = f"{brdge.folder}/transcripts/transcript.txt"
    try:
        s3_client.upload_file(transcript_local, S3_BUCKET, transcript_s3_key)
    except Exception as e:
        return jsonify({"error": f"Error uploading transcript to S3: {str(e)}"}), 500

    # Clean up local files
    os.remove(audio_local_path)
    # os.remove(transcript_local)

    return jsonify({"transcript": transcribed_transcript}), 200


@app.route("/api/brdges/<int:brdge_id>/audio/align_transcript", methods=["POST"])
def align_transcript(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    # check in cache for transcript
    if not os.path.exists(f"/tmp/transcript_{brdge_id}.txt"):
        s3_client.download_file(
            S3_BUCKET,
            f"{brdge.folder}/transcripts/transcript.txt",
            f"/tmp/transcript_{brdge_id}.txt",
        )
    with open(f"/tmp/transcript_{brdge_id}.txt", "r") as f:
        transcript = f.read()
    slides_dir_local = f"/tmp/slides_{brdge_id}"
    os.makedirs(slides_dir_local, exist_ok=True)

    # List all objects in the S3 folder
    s3_prefix = f"{brdge.folder}/slides/"
    s3_objects = s3_client.list_objects_v2(Bucket=S3_BUCKET, Prefix=s3_prefix)

    # Download each file in the folder
    for obj in s3_objects.get("Contents", []):
        file_key = obj["Key"]
        file_name = os.path.basename(file_key)
        local_file_path = os.path.join(slides_dir_local, file_name)
        s3_client.download_file(S3_BUCKET, file_key, local_file_path)

    image_transcripts = align_transcript_with_slides(transcript, slides_dir_local)
    aligned_transcript_local = f"/tmp/aligned_transcript_{brdge_id}.json"
    with open(aligned_transcript_local, "w") as f:
        f.write(json.dumps(image_transcripts))
    aligned_transcript_s3_key = f"{brdge.folder}/transcripts/aligned_transcript.json"
    s3_client.upload_file(
        aligned_transcript_local, S3_BUCKET, aligned_transcript_s3_key
    )
    return jsonify(image_transcripts), 200


@app.route("/api/brdges/<int:brdge_id>/transcripts/aligned", methods=["GET"])
def get_aligned_transcript(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    # check in cache for algined transcript - would be at /tmp/aligned_transcript_{brdge_id}.json
    if not os.path.exists(f"/tmp/aligned_transcript_{brdge_id}.json"):
        aligned_transcript_s3_key = (
            f"{brdge.folder}/transcripts/aligned_transcript.json"
        )
        s3_client.download_file(
            S3_BUCKET,
            aligned_transcript_s3_key,
            f"/tmp/aligned_transcript_{brdge_id}.json",
        )
    with open(f"/tmp/aligned_transcript_{brdge_id}.json", "r") as f:
        aligned_transcript = json.load(f)
    return jsonify(aligned_transcript), 200


@app.route("/api/brdges/<int:brdge_id>/audio/clone_voice", methods=["POST"])
def clone_voice(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id).to_dict()
    if not brdge.get("audio_filename"):
        return jsonify({"error": "No audio file associated with this brdge"}), 400

    audio_s3_key = brdge.get("audio_s3_key")
    audio_local_path = f"/tmp/audio_{brdge_id}.mp3"

    try:
        s3_client.download_file(S3_BUCKET, audio_s3_key, audio_local_path)
    except Exception as e:
        return jsonify({"error": f"Error downloading audio file: {str(e)}"}), 500

    voice_id = clone_voice_helper(brdge.get("name"), audio_local_path)
    with open(f"/tmp/voice_id_{brdge_id}.txt", "w") as f:
        f.write(voice_id)
    s3_client.upload_file(
        f"/tmp/voice_id_{brdge_id}.txt",
        S3_BUCKET,
        f"{brdge.get('folder')}/audio/voice_id.txt",
    )
    return jsonify({"voice_id": voice_id}), 200


@app.route("/api/brdges/<int:brdge_id>/audio/generate_voice", methods=["POST"])
def generate_voice(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id).to_dict()
    voice_id_s3_key = f"{brdge.get('folder')}/audio/voice_id.txt"
    s3_client.download_file(S3_BUCKET, voice_id_s3_key, f"/tmp/voice_id_{brdge_id}.txt")
    with open(f"/tmp/voice_id_{brdge_id}.txt", "r") as f:
        voice_id = f.read()
    transcript_s3_key = f"{brdge.get('folder')}/transcripts/aligned_transcript.json"
    s3_client.download_file(
        S3_BUCKET, transcript_s3_key, f"/tmp/aligned_transcript_{brdge_id}.json"
    )
    with open(f"/tmp/aligned_transcript_{brdge_id}.json", "r") as f:
        transcript = json.load(f)
    # generate voice
    # voice_name = brdge.get("name") + "_" + str(brdge_id)
    outdir = generate_voice_helper(brdge_id, transcript, voice_id)
    # upload audio to s3
    for file in os.listdir(outdir):
        s3_client.upload_file(
            f"{outdir}/{file}",
            S3_BUCKET,
            f"{brdge.get('folder')}/audio/processed/{file}",
        )
    # we return the tmp dir to frontend so it can play the audio
    return jsonify({"message": "Voice generated successfully", "outdir": outdir}), 200


@app.route("/api/brdges/<int:brdge_id>/audio/generated", methods=["GET"])
def get_generated_audio_files(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    cache_dir = f"/tmp/audio/processed/{brdge_id}"
    s3_folder = f"{brdge.folder}/audio/processed"

    # Check cache first
    if os.path.exists(cache_dir):
        audio_files = [f for f in os.listdir(cache_dir) if f.endswith(".mp3")]
    else:
        # If not in cache, list files from S3
        response = s3_client.list_objects_v2(Bucket=S3_BUCKET, Prefix=s3_folder)
        audio_files = [
            obj["Key"].split("/")[-1]
            for obj in response.get("Contents", [])
            if obj["Key"].endswith(".mp3")
        ]

    return jsonify({"files": audio_files}), 200


@app.route("/api/brdges/<int:brdge_id>/audio/generated/<filename>", methods=["GET"])
def get_generated_audio_file(brdge_id, filename):
    brdge = Brdge.query.get_or_404(brdge_id)
    cache_dir = f"/tmp/audio/processed/{brdge_id}"
    cache_file_path = os.path.join(cache_dir, filename)
    s3_key = f"{brdge.folder}/audio/processed/{filename}"

    if os.path.exists(cache_file_path):
        # Serve from cache if available
        return send_file(cache_file_path, mimetype="audio/mpeg")
    else:
        try:
            # If not in cache, fetch from S3 and store in cache
            os.makedirs(cache_dir, exist_ok=True)
            s3_client.download_file(S3_BUCKET, s3_key, cache_file_path)
            return send_file(cache_file_path, mimetype="audio/mpeg")
        except Exception as e:
            print(f"Error fetching audio from S3: {e}")
            abort(404)


@app.route("/api/brdges/<int:brdge_id>/transcripts/cached", methods=["GET"])
def get_cached_transcripts(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    cache_file = f"/tmp/transcripts_{brdge_id}.json"

    if os.path.exists(cache_file):
        with open(cache_file, "r") as f:
            transcripts = json.load(f)
        return jsonify({"cached": True, "transcripts": transcripts}), 200
    else:
        return jsonify({"cached": False}), 200


@app.route("/api/brdges/<int:brdge_id>/voice-clone/cached", methods=["GET"])
def get_cached_voice_clone(brdge_id):
    brdge = Brdge.query.get_or_404(brdge_id)
    cache_dir = f"/tmp/audio/processed/{brdge_id}"

    if os.path.exists(cache_dir):
        audio_files = [f for f in os.listdir(cache_dir) if f.endswith(".mp3")]
        return jsonify({"cached": True, "audioFiles": audio_files}), 200
    else:
        return jsonify({"cached": False}), 200
