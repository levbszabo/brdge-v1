import uuid
from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))

    # One-to-one relationship with UserAccount
    account = db.relationship("UserAccount", backref="user", uselist=False)
    # One-to-many relationship with Brdge
    brdges = db.relationship("Brdge", backref="user", lazy="dynamic")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def get_brdge_count(self):
        return self.brdges.count()


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
            "stripe_customer_id": self.stripe_customer_id,
            "stripe_subscription_id": self.stripe_subscription_id,
            "usage_stats": {
                "total_brdges": self.total_brdges,
                "storage_used": self.storage_used,
                "last_activity": (
                    self.last_activity.isoformat() if self.last_activity else None
                ),
            },
        }


class Brdge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    presentation_filename = db.Column(db.String(255), nullable=False)
    audio_filename = db.Column(db.String(255), nullable=False)
    folder = db.Column(db.String(255), nullable=False)
    shareable = db.Column(db.Boolean, default=False)
    public_id = db.Column(db.String(36), unique=True, nullable=True)

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
            "shareable": self.shareable,
            "public_id": self.public_id,
            "user_id": self.user_id,
            "presentation_s3_key": f"{self.folder}/{self.presentation_filename}",
            "audio_s3_key": (
                f"{self.folder}/audio/{self.audio_filename}"
                if self.audio_filename
                else None
            ),
        }


class Walkthrough(db.Model):
    """Stores walkthrough data for a brdge presentation"""

    id = db.Column(db.Integer, primary_key=True)
    brdge_id = db.Column(db.Integer, db.ForeignKey("brdge.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    status = db.Column(
        db.String(50), default="in_progress"
    )  # in_progress, completed, error
    total_slides = db.Column(db.Integer, nullable=False)

    # Relationship to slide messages
    messages = db.relationship(
        "WalkthroughMessage", backref="walkthrough", lazy="dynamic"
    )

    # Relationship to brdge
    brdge = db.relationship("Brdge", backref="walkthroughs")

    def to_dict(self):
        """Convert walkthrough to dictionary format"""
        return {
            "id": self.id,
            "brdge_id": self.brdge_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "completed_at": (
                self.completed_at.isoformat() if self.completed_at else None
            ),
            "status": self.status,
            "total_slides": self.total_slides,
            "slides": {
                str(msg.slide_number): msg.to_dict()
                for msg in self.messages.order_by(WalkthroughMessage.timestamp).all()
            },
        }

    @staticmethod
    def from_json(brdge_id: int, json_data: dict):
        """Create a walkthrough from JSON data"""
        walkthrough = Walkthrough(
            brdge_id=brdge_id,
            total_slides=json_data.get("metadata", {}).get("total_slides", 0),
            created_at=datetime.fromisoformat(json_data.get("timestamp")),
            status=json_data.get("metadata", {}).get("status", "in_progress"),
        )

        if json_data.get("metadata", {}).get("completed_at"):
            walkthrough.completed_at = datetime.fromisoformat(
                json_data["metadata"]["completed_at"]
            )

        return walkthrough


class WalkthroughMessage(db.Model):
    """Stores individual messages within a walkthrough"""

    id = db.Column(db.Integer, primary_key=True)
    walkthrough_id = db.Column(
        db.Integer, db.ForeignKey("walkthrough.id"), nullable=False
    )
    slide_number = db.Column(db.Integer, nullable=False)
    role = db.Column(db.String(50), nullable=False)  # user, assistant, system
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        """Convert message to dictionary format"""
        return {
            "role": self.role,
            "content": self.content,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
        }

    @staticmethod
    def from_dict(walkthrough_id: int, slide_number: int, message_data: dict):
        """Create a message from dictionary data"""
        return WalkthroughMessage(
            walkthrough_id=walkthrough_id,
            slide_number=slide_number,
            role=message_data.get("role"),
            content=message_data.get("content"),
            timestamp=(
                datetime.fromisoformat(message_data.get("timestamp"))
                if message_data.get("timestamp")
                else datetime.utcnow()
            ),
        )


class Scripts(db.Model):
    """Stores generated scripts for a brdge"""

    id = db.Column(db.Integer, primary_key=True)
    brdge_id = db.Column(db.Integer, db.ForeignKey("brdge.id"), nullable=False)
    walkthrough_id = db.Column(
        db.Integer, db.ForeignKey("walkthrough.id"), nullable=False
    )
    scripts = db.Column(db.JSON, nullable=False)  # Store the slide scripts as JSON
    generated_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    brdge = db.relationship("Brdge", backref="scripts")
    walkthrough = db.relationship("Walkthrough", backref="generated_scripts")

    def to_dict(self):
        return {
            "id": self.id,
            "brdge_id": self.brdge_id,
            "walkthrough_id": self.walkthrough_id,
            "scripts": self.scripts,
            "generated_at": self.generated_at.isoformat(),
        }
