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


def get_transcripts_algined(brdge_id):
    response = requests.get(f"{BASE_URL}/api/brdges/{brdge_id}/transcripts/aligned")
    return response


get_brdges()
# response = get_transcripts_algined(1)
# print(response.json())

# response = transcribe_audio(1)
# response = align_transcript(1)
# response = get_transcripts_algined(1)
# Replace this with a real file path on your system
# sample_presentation = "123.pdf"

# if os.path.exists(sample_presentation):
#     create_brdge("Sample Brdge", sample_presentation)
# else:
#     print("Please provide a valid file path for the presentation file.")
