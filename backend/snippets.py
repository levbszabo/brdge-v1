import requests
import os

# Base URL of your Flask application
BASE_URL = "http://localhost:5000"  # Adjust if your server runs on a different port


def get_brdges():
    response = requests.get(f"{BASE_URL}/api/brdges")
    print("GET /api/brdges")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    print()


def create_brdge(name, presentation_path):
    url = f"{BASE_URL}/api/brdges"
    data = {"name": name}
    files = {
        "presentation": open(presentation_path, "rb"),
    }

    response = requests.post(url, data=data, files=files)
    print("POST /api/brdges")
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
    print()


# transcribe_audio for brdge id = 1
def transcribe_audio(brdge_id):
    response = requests.post(f"{BASE_URL}/api/brdges/{brdge_id}/audio/transcribe")
    return response
    # print("GET /api/brdges/1/transcribe")
    # print(f"Status Code: {response.status_code}")
    # print(f"Response: {response.json()}")
    # print()


def align_transcript(brdge_id):
    response = requests.post(f"{BASE_URL}/api/brdges/{brdge_id}/audio/align_transcript")
    return response


get_brdges()
# response = transcribe_audio(1)
response = align_transcript(1)


import imghdr
import base64


def encode_image(image_path):
    with open(image_path, "rb") as image_file:
        file_data = image_file.read()
        file_type = imghdr.what(None, file_data)
        if file_type is None:
            raise ValueError(f"Unsupported image type for file: {image_path}")
        encoded_string = base64.b64encode(file_data).decode("utf-8")
    return encoded_string


slides_dir = "/tmp/slides_1"
encoded_frames = []
for image_file in sorted(os.listdir(slides_dir)):
    if image_file.lower().endswith((".png", ".jpg", ".jpeg")):
        image_path = os.path.join(slides_dir, image_file)
        encoded_frame = encode_image(image_path)
        encoded_frames.append(encoded_frame)

# Replace this with a real file path on your system
# sample_presentation = "123.pdf"

# if os.path.exists(sample_presentation):
#     create_brdge("Sample Brdge", sample_presentation)
# else:
#     print("Please provide a valid file path for the presentation file.")
