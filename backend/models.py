# models.py
from app import db


class Brdge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    presentation_filename = db.Column(db.String(255), nullable=False)
    audio_filename = db.Column(
        db.String(255), nullable=False, default=""
    )  # Allow empty string as default
    folder = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "presentation_filename": self.presentation_filename,
            "audio_filename": self.audio_filename,
            "folder": self.folder,
            # Include the S3 keys for the files
            "presentation_s3_key": f"{self.folder}/{self.presentation_filename}",
            "audio_s3_key": f"{self.folder}/{self.audio_filename}",
        }
