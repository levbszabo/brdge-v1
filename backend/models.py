import uuid
from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import json
import logging

# Set up logging
logger = logging.getLogger(__name__)


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
    allow_overage = db.Column(
        db.Boolean, default=True
    )  # New column for overage control

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
            "allow_overage": self.allow_overage,
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
    agent_personality = db.Column(
        db.Text, nullable=True, default="friendly ai assistant"
    )
    voice_id = db.Column(
        db.String(255), nullable=True
    )  # Keep as string for Cartesia voice ID

    # Define recordings relationship with back_populates instead of backref
    recordings = db.relationship(
        "Recording",
        back_populates="brdge",
        foreign_keys="Recording.brdge_id",
        lazy="dynamic",
        cascade="all, delete-orphan",
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.public_id:
            self.public_id = str(uuid.uuid4())

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "user_id": self.user_id,
            "presentation_filename": self.presentation_filename,
            "audio_filename": self.audio_filename,
            "folder": self.folder,
            "shareable": self.shareable,
            "public_id": self.public_id,
            "agent_personality": self.agent_personality,
            "voice_id": self.voice_id,  # Ensure voice_id is included
        }


class Recording(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brdge_id = db.Column(db.Integer, db.ForeignKey("brdge.id"), nullable=False)
    filename = db.Column(db.String(255), nullable=False)
    format = db.Column(db.String(10), default="mp4")  # e.g., 'mp4', 'webm'
    duration = db.Column(db.Float)  # Duration in seconds
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Define the relationship without backref to avoid circular reference
    brdge = db.relationship("Brdge", foreign_keys=[brdge_id])

    def to_dict(self):
        return {
            "id": self.id,
            "brdge_id": self.brdge_id,
            "filename": self.filename,
            "format": self.format,
            "duration": self.duration,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }


class Voice(db.Model):
    """Stores voice clone data for a brdge"""

    id = db.Column(db.Integer, primary_key=True)
    brdge_id = db.Column(db.Integer, db.ForeignKey("brdge.id"), nullable=False)
    cartesia_voice_id = db.Column(
        db.String(255), nullable=False
    )  # ID from Cartesia API
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    language = db.Column(db.String(10), default="en")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(50), default="active")  # active, deleted, etc.

    # Relationship to brdge
    brdge = db.relationship("Brdge", backref="voices")

    def to_dict(self):
        """Convert voice to dictionary format"""
        return {
            "id": self.id,
            "brdge_id": self.brdge_id,
            "cartesia_voice_id": self.cartesia_voice_id,
            "name": self.name,
            "description": self.description,
            "language": self.language,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "status": self.status,
        }

    @classmethod
    def from_cartesia_response(cls, brdge_id, response_data):
        """Create a Voice instance from Cartesia API response"""
        try:
            # Parse the datetime string correctly
            created_at_str = response_data.get("created_at", "")
            if created_at_str:
                try:
                    # First try direct parsing
                    created_at = datetime.fromisoformat(created_at_str)
                except ValueError:
                    # If that fails, try to clean up the string
                    try:
                        # Extract the main part of the timestamp before any potential duplication
                        timestamp_parts = created_at_str.split("-08:00")
                        if len(timestamp_parts) > 1:
                            # Take the first part and add the timezone back
                            created_at_str = f"{timestamp_parts[0]}-08:00"
                        created_at = datetime.fromisoformat(created_at_str)
                    except (ValueError, IndexError):
                        logger.error(
                            f"Could not parse datetime string: {created_at_str}"
                        )
                        created_at = datetime.utcnow()
            else:
                created_at = datetime.utcnow()

            return cls(
                brdge_id=brdge_id,
                cartesia_voice_id=response_data.get("id"),
                name=response_data.get("name"),
                description=response_data.get("description"),
                language=response_data.get("language", "en"),
                status=response_data.get("api_status", "active"),
                created_at=created_at,
            )
        except Exception as e:
            logger.error(f"Error creating Voice from response: {e}")
            # Fallback to current time if there's an error
            return cls(
                brdge_id=brdge_id,
                cartesia_voice_id=response_data.get("id"),
                name=response_data.get("name"),
                description=response_data.get("description"),
                language=response_data.get("language", "en"),
                status=response_data.get("api_status", "active"),
                created_at=datetime.utcnow(),
            )


class UsageLogs(db.Model):
    """Tracks agent interaction durations and usage metrics"""

    id = db.Column(db.Integer, primary_key=True)
    brdge_id = db.Column(db.Integer, db.ForeignKey("brdge.id"), nullable=True)
    owner_id = db.Column(
        db.Integer, db.ForeignKey("user.id"), nullable=False
    )  # The brdge owner
    viewer_user_id = db.Column(
        db.Integer, db.ForeignKey("user.id"), nullable=True
    )  # Registered user if any
    anonymous_id = db.Column(db.String(255), nullable=True)  # For anonymous viewers
    agent_message = db.Column(db.Text, nullable=False)
    started_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    ended_at = db.Column(db.DateTime)
    duration_minutes = db.Column(
        db.Float, nullable=False, default=0.0
    )  # Precision to 0.01
    was_interrupted = db.Column(db.Boolean, default=False)

    # Relationships
    brdge = db.relationship("Brdge", backref="usage_logs")
    owner = db.relationship("User", foreign_keys=[owner_id], backref="owned_usage_logs")
    viewer = db.relationship(
        "User", foreign_keys=[viewer_user_id], backref="viewed_usage_logs"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "brdge_id": self.brdge_id,
            "owner_id": self.owner_id,
            "viewer_user_id": self.viewer_user_id,
            "anonymous_id": self.anonymous_id,
            "agent_message": self.agent_message,
            "started_at": self.started_at.isoformat() if self.started_at else None,
            "ended_at": self.ended_at.isoformat() if self.ended_at else None,
            "duration_minutes": self.duration_minutes,
            "was_interrupted": self.was_interrupted,
        }


class BrdgeScript(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brdge_id = db.Column(db.Integer, db.ForeignKey("brdge.id"), nullable=False)
    content = db.Column(db.JSON)  # Stores the transcript in a flexible JSON format
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default="pending")  # pending, completed, failed
    script_metadata = db.Column(
        db.JSON, nullable=True
    )  # Optional metadata like duration, speaker info

    # Define the relationship here only, with cascade delete
    brdge = db.relationship(
        "Brdge",
        backref=db.backref(
            "transcription_scripts", cascade="all, delete-orphan", lazy="dynamic"
        ),
    )

    def to_dict(self):
        return {
            "id": self.id,
            "brdge_id": self.brdge_id,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "content": self.content or {},  # Return the full content object
            "metadata": self.script_metadata,
        }


class KnowledgeBase(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brdge_id = db.Column(db.Integer, db.ForeignKey("brdge.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    brdge = db.relationship("Brdge", backref="knowledge_entries")


class DocumentKnowledge(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    brdge_id = db.Column(db.Integer, db.ForeignKey("brdge.id"), nullable=False)
    presentation_filename = db.Column(
        db.String(255), nullable=False
    )  # Original filename
    s3_location = db.Column(db.String(255), nullable=False)  # S3 path
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, onupdate=datetime.utcnow)

    # Document metadata
    total_pages = db.Column(db.Integer)
    total_words = db.Column(db.Integer)

    # Extracted content (stored as JSON)
    slide_contents = db.Column(db.JSON)  # Detailed text content per slide
    topics = db.Column(db.JSON)  # Main topics/themes identified
    key_points = db.Column(db.JSON)  # Key points per slide
    entities = db.Column(db.JSON)  # Named entities, terms, definitions

    # Processing status
    status = db.Column(
        db.String(50), default="pending"
    )  # pending, processing, completed, failed
    error_message = db.Column(db.Text)

    # Relationships
    brdge = db.relationship("Brdge", backref="document_knowledge")

    def to_dict(self):
        return {
            "id": self.id,
            "brdge_id": self.brdge_id,
            "presentation_filename": self.presentation_filename,
            "s3_location": self.s3_location,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "total_pages": self.total_pages,
            "total_words": self.total_words,
            "slide_contents": self.slide_contents,
            "topics": self.topics,
            "key_points": self.key_points,
            "entities": self.entities,
            "status": self.status,
            "error_message": self.error_message,
        }


class UserIssues(db.Model):
    __tablename__ = "user_issues"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    message = db.Column(db.Text, nullable=False)
    status = db.Column(
        db.String(20), default="pending"
    )  # pending, in_progress, resolved
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    resolved_at = db.Column(db.DateTime, nullable=True)

    # Relationships
    user = db.relationship("User", backref=db.backref("issues", lazy=True))

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "message": self.message,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "resolved_at": self.resolved_at.isoformat() if self.resolved_at else None,
        }


class Course(db.Model):
    """Represents a course that contains multiple modules (brdges)"""

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    public_id = db.Column(db.String(36), unique=True, nullable=True)
    shareable = db.Column(db.Boolean, default=False)
    thumbnail_url = db.Column(db.String(512), nullable=True)

    # Relationships
    user = db.relationship("User", backref=db.backref("courses", lazy="dynamic"))
    modules = db.relationship(
        "CourseModule", back_populates="course", cascade="all, delete-orphan"
    )

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if not self.public_id:
            self.public_id = str(uuid.uuid4())

    def get_enrollment_count(self):
        """Get the number of active enrollments for this course"""
        return self.enrollments.filter_by(status="active").count()

    def to_dict(self):
        result = {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "user_id": self.user_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "public_id": self.public_id,
            "shareable": self.shareable,
            "thumbnail_url": self.thumbnail_url,
            "modules": [module.to_dict() for module in self.modules],
            "enrollment_count": self.get_enrollment_count(),
        }
        return result


class CourseModule(db.Model):
    """Join table for courses and modules (brdges) with ordering"""

    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)
    brdge_id = db.Column(db.Integer, db.ForeignKey("brdge.id"), nullable=False)
    position = db.Column(
        db.Integer, nullable=False
    )  # For ordering modules within a course
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    description = db.Column(
        db.Text, nullable=True
    )  # Custom description for this module in the course
    thumbnail_url = db.Column(db.String(512), nullable=True)

    # Relationships
    course = db.relationship("Course", back_populates="modules")
    brdge = db.relationship(
        "Brdge", backref=db.backref("course_modules", lazy="dynamic")
    )

    def to_dict(self):
        return {
            "id": self.id,
            "course_id": self.course_id,
            "brdge_id": self.brdge_id,
            "brdge": self.brdge.to_dict(),
            "position": self.position,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "description": self.description,
            "thumbnail_url": self.thumbnail_url,
        }


class Enrollment(db.Model):
    """Tracks user enrollments in courses"""

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default="active")  # active, completed, dropped
    last_accessed_at = db.Column(db.DateTime, default=datetime.utcnow)
    progress = db.Column(db.Float, default=0.0)  # 0-100% course completion

    # Define relationships
    user = db.relationship("User", backref=db.backref("enrollments", lazy="dynamic"))
    course = db.relationship(
        "Course", backref=db.backref("enrollments", lazy="dynamic")
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "course_id": self.course_id,
            "enrolled_at": self.enrolled_at.isoformat() if self.enrolled_at else None,
            "status": self.status,
            "last_accessed_at": (
                self.last_accessed_at.isoformat() if self.last_accessed_at else None
            ),
            "progress": self.progress,
            "user": (
                {"id": self.user.id, "email": self.user.email} if self.user else None
            ),
        }
