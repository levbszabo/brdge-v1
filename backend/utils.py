# utils.py
import os
from pdf2image import convert_from_path
import subprocess


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
