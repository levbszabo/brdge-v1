import uuid
from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

    # One-to-one relationship with UserAccount
    account = db.relationship("UserAccount", backref="user", uselist=False)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class UserAccount(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(
        db.Integer, db.ForeignKey("user.id"), nullable=False, unique=True
    )

    # Account Details
    account_type = db.Column(db.String(20), default="free")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Stripe Integration
    stripe_customer_id = db.Column(db.String(255))
    stripe_subscription_id = db.Column(db.String(255))

    # Billing Details
    next_billing_date = db.Column(db.DateTime)
    subscription_status = db.Column(
        db.String(50)
    )  # 'active', 'canceled', 'past_due', etc.

    # Usage Stats
    total_brdges = db.Column(db.Integer, default=0)
    storage_used = db.Column(db.Float, default=0.0)  # in MB
    last_activity = db.Column(db.DateTime)

    def to_dict(self):
        return {
            "account_type": self.account_type,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "subscription_status": self.subscription_status,
            "next_billing_date": (
                self.next_billing_date.isoformat() if self.next_billing_date else None
            ),
            "usage_stats": {
                "total_brdges": self.total_brdges,
                "storage_used": self.storage_used,
                "last_activity": (
                    self.last_activity.isoformat() if self.last_activity else None
                ),
            },
        }


class Brdge(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    presentation_filename = db.Column(db.String(255), nullable=False)
    audio_filename = db.Column(db.String(255), nullable=False)
    folder = db.Column(db.String(255), nullable=False)
    shareable = db.Column(db.Boolean, default=False)  # Ensure this is a Boolean
    public_id = db.Column(
        db.String(36), unique=True, nullable=True
    )  # Ensure this is present
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)

    user = db.relationship("User", backref=db.backref("brdges", lazy=True))

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.public_id:
            self.public_id = str(uuid.uuid4())

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "presentation_filename": self.presentation_filename,
            "audio_filename": self.audio_filename,
            "folder": self.folder,
            "shareable": self.shareable,  # Include shareable status
            "public_id": self.public_id,  # Include public_id
            "user_id": self.user_id,  # Include user_id
            "presentation_s3_key": f"{self.folder}/{self.presentation_filename}",
            "audio_s3_key": (
                f"{self.folder}/audio/{self.audio_filename}"
                if self.audio_filename
                else None
            ),
        }
