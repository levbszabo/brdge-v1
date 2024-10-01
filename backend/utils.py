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
from typing import Dict, List

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
        utterances=True,
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
    I've given you a slide deck of images in order. In addition we have a user transcript presenting that slide
    deck. Your job is to align the transcript to the slides and return your response in a json format. Ensure every
    slide has a transcript. 

    There are {num_slides} slides in the deck.
    
    return your response in json format as 
    "image_transcripts": [
        "image_number": [
        "transcript"
    ], 
    ]
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


# Example usage:
# # transcript = "Your transcript text here"
# transcript_dir = "processed/transcripts/sms"
# slides_dir = "processed/slides/sms"
# # slides_directory = "path/to/your/slides/directory"
# result = align_transcript_with_slides(transcript_dir, slides_dir)
# # print(result)
