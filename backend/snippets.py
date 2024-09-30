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


if __name__ == "__main__":
    # Example usage
    get_brdges()

    # For create_brdge, you need to provide an actual file path
    # Replace this with a real file path on your system
    # sample_presentation = "123.pdf"

    # if os.path.exists(sample_presentation):
    #     create_brdge("Sample Brdge", sample_presentation)
    # else:
    #     print("Please provide a valid file path for the presentation file.")
