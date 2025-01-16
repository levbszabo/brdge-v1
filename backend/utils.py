# utils.py
import os
from pdf2image import convert_from_path
import subprocess
import os
from datetime import datetime
import json
import httpx
from deepgram import (
    DeepgramClient,
    DeepgramClientOptions,
    PrerecordedOptions,
    FileSource,
)
from deepgram.utils import verboselogs
from openai import OpenAI
import base64
import imghdr
import logging
import json
from typing import Dict, List, Optional
import os
from elevenlabs import ElevenLabs
import os
import requests
import shutil
import boto3
import dotenv
from PIL import Image

dotenv.load_dotenv(".env")

import json

CHUNK_SIZE = 1024  # Size of chunks to read/write at a time
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")  # Your API key for authentication
# ELEVENLABS_VOICE_ID = os.getenv("ELEVENLABS_VOICE_ID")  # ID of the voice model to use

# Add S3 configuration
S3_BUCKET = os.getenv("S3_BUCKET")
S3_REGION = os.getenv("S3_REGION", "us-east-1")

# Add debug logging for S3 configuration


s3_client = boto3.client("s3", region_name=S3_REGION)

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)


def get_poppler_path():
    try:
        # Adjust this according to your system's configuration
        return subprocess.check_output(["which", "pdftoppm"]).decode().strip()
    except subprocess.CalledProcessError:
        return None


def pdf_to_images(pdf_path):
    """
    Convert a PDF file to a list of PIL Images, one per page.

    :param pdf_path: Path to the input PDF file
    :return: List of PIL Image objects
    """
    try:
        poppler_path = get_poppler_path()
        if poppler_path:
            poppler_dir = os.path.dirname(poppler_path)
            # Convert PDF to images
            images = convert_from_path(pdf_path, poppler_path=poppler_dir)
            return images
        else:
            print(
                "Error: poppler not found. Please install poppler and ensure it's in your PATH."
            )
            return []
    except Exception as e:
        print(f"Error converting PDF to images: {e}")
        return []


def transcribe_audio_helper(audio_file_path: str, outdir_path: str) -> list:
    # Create a Deepgram client
    config = DeepgramClientOptions(verbose=verboselogs.SPAM)
    deepgram = DeepgramClient(os.getenv("DEEPGRAM_API_KEY", ""), config)

    # Prepare the audio file and options
    with open(audio_file_path, "rb") as file:
        payload: FileSource = {"buffer": file.read()}

    options = PrerecordedOptions(
        model="nova-2",
        smart_format=True,
        utterances=False,
        punctuate=True,
        diarize=True,
    )

    # Transcribe the file
    start_time = datetime.now()
    response = deepgram.listen.rest.v("1").transcribe_file(
        payload, options, timeout=httpx.Timeout(300.0, connect=10.0)
    )
    end_time = datetime.now()

    # Print execution time
    print(f"Execution time: {(end_time - start_time).seconds} seconds")

    # Parse the response
    response_json_dict = json.loads(response.to_json())
    transcript = response_json_dict["results"]["channels"][0]["alternatives"][0][
        "transcript"
    ]

    with open(outdir_path, "w") as f:
        f.write(transcript)
    return transcript
    # parsed_content = []


def encode_image(image_path):
    try:
        with open(image_path, "rb") as image_file:
            file_data = image_file.read()
            file_type = imghdr.what(None, file_data)
            if file_type is None:
                raise ValueError(f"Unsupported image type for file: {image_path}")
            encoded_string = base64.b64encode(file_data).decode("utf-8")
        return encoded_string
    except Exception as e:
        logger.error(f"Error encoding image {image_path}: {str(e)}")
        raise


def align_transcript_with_slides(
    transcript: str, slides_dir: str
) -> Dict[str, List[str]]:
    prompt = """
    I have given you a set of {num_slides} slides, each represented by an image, and a user transcript that describes or presents those slides. 
    Your task is to align specific parts of the transcript with the corresponding slides, ensuring that every slide has an associated transcript segment. 
    Each slide's transcript should capture the content or theme of the slide and should be as precise as possible. 

    Please ensure:
    - The transcript is segmented so that each portion corresponds to the correct slide based on the topic or description given in the transcript.
    - Every slide should have a transcript, and the transcript segments should not overlap between slides.
    - **Do not truncate** or oversimplify the transcript. If a portion of the transcript is long, retain the full detail of the content even if it seems extensive for a single slide.
- If a large portion of the transcript is associated with a slide, include it fully rather than splitting it arbitrarily. Only split the transcript if a new topic clearly applies to a different slide.

    Return the response in the following JSON format:
    {{
        "image_transcripts": [
            {{
            "image_number": 1,
        "transcript": "..."
        }},
        {{
        "image_number": 2,
        "transcript": "..."
        }},
            ...
        ]
    }}

    **User Transcript:**
    {transcript}
    """.format(
        transcript=transcript, num_slides=len(os.listdir(slides_dir))
    )

    encoded_frames = []
    for image_file in sorted(os.listdir(slides_dir)):
        if image_file.lower().endswith((".png", ".jpg", ".jpeg")):
            image_path = os.path.join(slides_dir, image_file)
            try:
                logger.debug(f"Attempting to encode image: {image_path}")
                encoded_frame = encode_image(image_path)
                encoded_frames.append(encoded_frame)
                logger.debug(f"Successfully encoded image {image_file}")
            except Exception as e:
                logger.error(f"Error processing image {image_file}: {str(e)}")

    logger.debug(f"Number of successfully encoded frames: {len(encoded_frames)}")

    input_data = {
        "model": "gpt-4o",
        "messages": [
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    *[
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{frame}",
                                "detail": "low",
                            },
                        }
                        for frame in encoded_frames
                    ],
                ],
            },
        ],
        "temperature": 0.0,
        "response_format": {"type": "json_object"},
    }

    client = OpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    response = client.chat.completions.create(**input_data)

    image_transcripts = json.loads(response.choices[0].message.content)
    return image_transcripts


def generate_slide_scripts(brdge_id):
    walkthrough_path = f"data/walkthroughs/brdge_{brdge_id}.json"
    with open(walkthrough_path, "r") as f:
        walkthroughs = json.load(f)
    walkthrough = walkthroughs[-1]


def clone_voice_helper(name, audio_file_path):
    """
    Clone a voice using the ElevenLabs API.

    :param name: The name to identify the cloned voice.
    :param audio_file_path: Path to the MP3 file containing the voice sample.
    :return: The voice_id of the cloned voice.
    """
    client = ElevenLabs(api_key=os.getenv("ELEVENLABS_API_KEY"))

    try:
        response = client.clone(
            name=name,
            files=[audio_file_path],
            description=f"Cloned voice for Brdge {name}",
        )
        voice_id = response.voice_id
        return voice_id
    except Exception as e:
        print(f"Error cloning voice: {str(e)}")
        return None


# Function to generate audio for a single page
def generate_audio_for_page(page_number, text, outdir, voice_id):
    output_path = f"{outdir}/slide_{page_number}.mp3"
    if voice_id is None:
        voice_id = "NVfYoEx7jEm8F3SG7RTC"
    # Construct the URL for the Text-to-Speech API request
    tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}/stream"

    # Set up headers for the API request, including the API key for authentication
    headers = {"Accept": "application/json", "xi-api-key": ELEVENLABS_API_KEY}

    # Set up the data payload for the API request, including the text and voice settings
    data = {
        "text": text,
        "model_id": "eleven_multilingual_v2",
        "voice_settings": {
            "stability": 0.50,
            "similarity_boost": 0.80,
            "style": 0.0,
            "use_speaker_boost": True,
        },
    }

    # Make the POST request to the TTS API with headers and data, enabling streaming response
    response = requests.post(tts_url, headers=headers, json=data, stream=True)

    if response.ok:
        # Open the output file in write-binary mode
        with open(output_path, "wb") as f:
            # Read the response in chunks and write to the file
            for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
                f.write(chunk)
        print(f"Audio stream for page {page_number} saved successfully.")
    else:
        # Print the error message if the request was not successful
        print(f"Error generating audio for page {page_number}: {response.text}")


# Generate audio for all pages


def generate_voice_helper(brdge_id, transcript, voice_id):
    transcript = transcript["image_transcripts"]
    outdir = f"/tmp/brdge/audio/processed/{brdge_id}"
    os.makedirs(outdir, exist_ok=True)

    for page in transcript:
        # Extract page number and transcript from the dictionary
        page_number = page["image_number"]
        full_text = page["transcript"]
        generate_audio_for_page(page_number, full_text, outdir, voice_id)

    return outdir


# Example usage:
# # transcript = "Your transcript text here"
# transcript_dir = "processed/transcripts/sms"
# slides_dir = "processed/slides/sms"
# # slides_directory = "path/to/your/slides/directory"
# result = align_transcript_with_slides(transcript_dir, slides_dir)
# # print(result)


def create_brdge_directory_structure(brdge_id: str) -> Dict[str, str]:
    """
    Create the directory structure for a brdge and return paths

    Args:
        brdge_id: The ID of the brdge

    Returns:
        Dictionary containing paths for each directory
    """
    base_dir = f"/tmp/brdge/{brdge_id}"
    directories = {
        "base": base_dir,
        "source": f"{base_dir}/source",
        "slides": f"{base_dir}/slides",
        "scripts": f"{base_dir}/scripts",
        "walkthroughs": f"{base_dir}/walkthroughs",
        "voices": f"{base_dir}/voices",
        "audio": f"{base_dir}/audio",
    }

    # Create directories
    for dir_path in directories.values():
        os.makedirs(dir_path, exist_ok=True)

    return directories


def cleanup_brdge_directory(brdge_id: str) -> None:
    """
    Clean up all temporary files for a brdge

    Args:
        brdge_id: The ID of the brdge to clean up
    """
    base_dir = f"/tmp/brdge/{brdge_id}"
    if os.path.exists(base_dir):
        shutil.rmtree(base_dir)


def get_brdge_paths(brdge_id: str) -> Dict[str, str]:
    """
    Get the paths for a brdge's directory structure

    Args:
        brdge_id: The ID of the brdge

    Returns:
        Dictionary containing paths for each directory
    """
    base_dir = f"/tmp/brdge/{brdge_id}"
    return {
        "base": base_dir,
        "source": f"{base_dir}/source",
        "slides": f"{base_dir}/slides",
        "scripts": f"{base_dir}/scripts",
        "walkthroughs": f"{base_dir}/walkthroughs",
        "voices": f"{base_dir}/voices",
        "audio": f"{base_dir}/audio",
    }


def save_walkthrough(brdge_id: str, walkthrough_number: int, data: dict) -> bool:
    """Save a single walkthrough to the filesystem and S3"""
    try:
        # Validate inputs
        if not isinstance(brdge_id, str):
            raise ValueError(f"brdge_id must be string, got {type(brdge_id)}")
        if not isinstance(walkthrough_number, int):
            raise ValueError(
                f"walkthrough_number must be int, got {type(walkthrough_number)}"
            )
        if not isinstance(data, dict):
            raise ValueError(f"data must be dict, got {type(data)}")

        logger.debug("=== Save Walkthrough Debug Info ===")
        logger.debug(f"brdge_id: {brdge_id} (type: {type(brdge_id)})")
        logger.debug(
            f"walkthrough_number: {walkthrough_number} (type: {type(walkthrough_number)})"
        )
        logger.debug(f"S3_BUCKET: {S3_BUCKET}")

        # Get paths
        paths = get_brdge_paths(str(brdge_id))
        logger.debug(f"Local paths: {paths}")

        # Local file path
        local_path = os.path.join(
            paths["walkthroughs"], f"walkthrough_{walkthrough_number}.json"
        )
        logger.debug(f"Local file path: {local_path}")

        # First save locally
        try:
            with open(local_path, "w", encoding="utf-8") as f:
                json_str = json.dumps(data, indent=2, default=str)
                f.write(json_str)
            logger.debug(f"Successfully saved local file: {local_path}")
            logger.debug(f"File exists check: {os.path.exists(local_path)}")
            logger.debug(f"File size: {os.path.getsize(local_path)} bytes")
        except Exception as e:
            logger.error(f"Error saving local file: {e}")
            return False

        # Then upload to S3
        try:
            s3_key = (
                f"{str(brdge_id)}/walkthroughs/walkthrough_{walkthrough_number}.json"
            )
            logger.debug(f"Uploading to S3:")
            logger.debug(f"  - Bucket: {S3_BUCKET}")
            logger.debug(f"  - Key: {s3_key}")
            logger.debug(f"  - Local file: {local_path}")

            s3_client.upload_file(
                local_path,
                S3_BUCKET,
                s3_key,
                ExtraArgs={"ContentType": "application/json"},
            )

            # Verify upload
            try:
                s3_client.head_object(Bucket=S3_BUCKET, Key=s3_key)
                logger.debug("S3 upload verified - file exists in bucket")
            except Exception as e:
                logger.error(f"S3 upload verification failed: {e}")

            return True

        except Exception as e:
            logger.error(f"S3 upload error: {e}")
            logger.error(f"S3 key: {s3_key}")
            logger.error(f"Local file exists: {os.path.exists(local_path)}")
            return False

    except Exception as e:
        logger.error(f"Error in save_walkthrough: {e}")
        logger.error(f"Full error details:", exc_info=True)
        return False


def get_walkthrough(brdge_id: str, walkthrough_number: int) -> Optional[dict]:
    """Get a specific walkthrough"""
    paths = get_brdge_paths(brdge_id)
    local_path = os.path.join(
        paths["walkthroughs"], f"walkthrough_{walkthrough_number}.json"
    )

    try:
        if os.path.exists(local_path):
            with open(local_path, "r") as f:
                return json.load(f)

        # If not in local cache, try S3
        s3_key = f"{brdge_id}/walkthroughs/walkthrough_{walkthrough_number}.json"
        response = s3_client.get_object(Bucket=S3_BUCKET, Key=s3_key)
        data = json.loads(response["Body"].read().decode("utf-8"))

        # Cache it locally
        os.makedirs(paths["walkthroughs"], exist_ok=True)
        with open(local_path, "w") as f:
            json.dump(data, f, indent=2)

        return data
    except Exception as e:
        logger.error(f"Error getting walkthrough: {e}")
        return None


def get_walkthrough_count(brdge_id: str) -> int:
    """Get the number of walkthroughs for a brdge"""
    paths = get_brdge_paths(brdge_id)

    try:
        # Check local directory
        if os.path.exists(paths["walkthroughs"]):
            files = [
                f
                for f in os.listdir(paths["walkthroughs"])
                if f.startswith("walkthrough_") and f.endswith(".json")
            ]
            return len(files)

        # If not local, check S3
        prefix = f"{brdge_id}/walkthroughs/"
        response = s3_client.list_objects_v2(Bucket=S3_BUCKET, Prefix=prefix)
        return len(
            [
                obj
                for obj in response.get("Contents", [])
                if obj["Key"].endswith(".json")
            ]
        )
    except Exception as e:
        logger.error(f"Error getting walkthrough count: {e}")
        return 0


def list_walkthroughs(brdge_id: str) -> List[Dict]:
    """List all walkthroughs with metadata"""
    paths = get_brdge_paths(brdge_id)
    walkthroughs = []

    try:
        count = get_walkthrough_count(brdge_id)
        for i in range(1, count + 1):
            walkthrough = get_walkthrough(brdge_id, i)
            if walkthrough:
                walkthroughs.append(
                    {
                        "id": i,
                        "timestamp": walkthrough["timestamp"],
                        "status": walkthrough["metadata"]["status"],
                        "slide_count": walkthrough["metadata"]["total_slides"],
                    }
                )
    except Exception as e:
        logger.error(f"Error listing walkthroughs: {e}")

    return walkthroughs
