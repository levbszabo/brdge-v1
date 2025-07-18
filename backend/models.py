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

    # Simplified Account Details for Open Source
    account_type = db.Column(db.String(20), default="open_source")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Usage Stats (for analytics, no restrictions)
    total_brdges = db.Column(db.Integer, default=0)
    storage_used = db.Column(db.Float, default=0.0)  # in MB
    last_activity = db.Column(db.DateTime)

    def to_dict(self):
        return {
            "account_type": self.account_type,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "usage_stats": {
                "total_brdges": self.total_brdges,
                "storage_used": self.storage_used,
                "last_activity": (
                    self.last_activity.isoformat() if self.last_activity else None
                ),
            },
        }


class Brdge(db.Model):
    __tablename__ = "brdge"  # Explicitly set table name if needed
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
    bridge_type = db.Column(db.String(50), nullable=False, default="course")
    additional_instructions = db.Column(db.Text, nullable=True)
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
            "bridge_type": self.bridge_type,
            "additional_instructions": self.additional_instructions,
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
    marketplace = db.Column(
        db.Boolean, default=False
    )  # Indicates if the course should be shown in the marketplace
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
            "marketplace": self.marketplace,
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
        result = {
            "id": self.id,
            "course_id": self.course_id,
            "brdge_id": self.brdge_id,
            "brdge": self.brdge.to_dict(),
            "position": self.position,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "description": self.description,
            "thumbnail_url": self.thumbnail_url,
        }

        # Add access_level from permissions if available
        if hasattr(self, "permissions") and self.permissions:
            result["access_level"] = self.permissions.access_level
            # Add convenience boolean for public access
            result["is_public"] = self.permissions.access_level == "public"
        else:
            result["access_level"] = "enrolled"  # Default
            result["is_public"] = False

        return result

    def get_access_level(self):
        """Get the access level with default fallback"""
        permission = ModulePermissions.query.filter_by(course_module_id=self.id).first()
        return permission.access_level if permission else "enrolled"

    def can_access(self, user=None):
        """Check if a user can access this module

        Args:
            user: The user to check access for, or None for unauthenticated user

        Returns:
            bool: True if the user can access this module
        """
        access_level = self.get_access_level()

        # Public modules are accessible to everyone
        if access_level == "public":
            return True

        # Other access levels require authentication
        if not user:
            return False

        # Module creators always have access
        if self.brdge.user_id == user.id:
            return True

        # Check enrollment for other access levels
        enrollment = Enrollment.query.filter_by(
            user_id=user.id, course_id=self.course_id, status="active"
        ).first()

        if not enrollment:
            return False

        # Enrolled level just requires enrollment
        if access_level == "enrolled":
            return True

        # Premium level requires premium access
        if access_level == "premium":
            return getattr(enrollment, "has_premium_access", False)

        return False


class Enrollment(db.Model):
    """Tracks user enrollments in courses"""

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey("course.id"), nullable=False)
    enrolled_at = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default="active")  # active, completed, dropped
    last_accessed_at = db.Column(db.DateTime, default=datetime.utcnow)
    progress = db.Column(db.Float, default=0.0)  # 0-100% course completion
    has_premium_access = db.Column(
        db.Boolean, default=False
    )  # New field for premium access

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
            "has_premium_access": self.has_premium_access,
            "user": (
                {"id": self.user.id, "email": self.user.email} if self.user else None
            ),
        }


class ModulePermissions(db.Model):
    """Controls access levels for modules within courses"""

    id = db.Column(db.Integer, primary_key=True)
    course_module_id = db.Column(
        db.Integer, db.ForeignKey("course_module.id"), nullable=False
    )
    access_level = db.Column(
        db.String(20), default="enrolled", nullable=False
    )  # public, enrolled, premium
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationship to CourseModule
    course_module = db.relationship(
        "CourseModule", backref=db.backref("permissions", uselist=False)
    )

    def to_dict(self):
        return {
            "id": self.id,
            "course_module_id": self.course_module_id,
            "access_level": self.access_level,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class ConversationLogs(db.Model):
    """Logs individual messages from both agents and users within a Brdge interaction"""

    __tablename__ = "conversation_logs"

    id = db.Column(db.Integer, primary_key=True)
    brdge_id = db.Column(db.Integer, db.ForeignKey("brdge.id"), nullable=True)
    owner_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    viewer_user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    anonymous_id = db.Column(db.String(255), nullable=True)
    session_id = db.Column(
        db.String(255), nullable=True, index=True
    )  # For funnel sessions
    role = db.Column(
        db.Enum("agent", "user", name="conv_role_enum"), nullable=False
    )  # Added name for enum type
    message = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    was_interrupted = db.Column(db.Boolean, default=False)
    duration_minutes = db.Column(db.Float, nullable=True)
    # Add personalization record reference
    personalization_record_id = db.Column(
        db.Integer, db.ForeignKey("personalization_record.id"), nullable=True
    )

    # Relationships (adjust backref names as needed to avoid conflicts)
    brdge = db.relationship(
        "Brdge", backref=db.backref("conversation_logs", lazy="dynamic")
    )
    owner = db.relationship(
        "User",
        foreign_keys=[owner_id],
        backref=db.backref("owned_conversation_logs", lazy="dynamic"),
    )
    viewer = db.relationship(
        "User",
        foreign_keys=[viewer_user_id],
        backref=db.backref("viewed_conversation_logs", lazy="dynamic"),
    )
    # Add new relationship
    personalization_record = db.relationship(
        "PersonalizationRecord", backref="conversation_logs"
    )

    def to_dict(self):
        return {
            "id": self.id,
            "brdge_id": self.brdge_id,
            "owner_id": self.owner_id,
            "viewer_user_id": self.viewer_user_id,
            "anonymous_id": self.anonymous_id,
            "session_id": self.session_id,
            "role": self.role,
            "message": self.message,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
            "was_interrupted": self.was_interrupted,
            "duration_minutes": self.duration_minutes,
            "personalization_record_id": self.personalization_record_id,
        }


class PersonalizationTemplate(db.Model):
    """Stores personalization schema for a bridge"""

    __tablename__ = "personalization_template"

    id = db.Column(db.Integer, primary_key=True)
    brdge_id = db.Column(db.Integer, db.ForeignKey("brdge.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    columns = db.Column(db.JSON, nullable=False)  # Column definitions with usage notes
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    is_active = db.Column(db.Boolean, default=True)

    # Relationships
    brdge = db.relationship("Brdge", backref="personalization_templates")

    def to_dict(self):
        return {
            "id": self.id,
            "brdge_id": self.brdge_id,
            "name": self.name,
            "columns": self.columns,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "is_active": self.is_active,
        }


class PersonalizationRecord(db.Model):
    """Stores individual personalization data"""

    __tablename__ = "personalization_record"

    id = db.Column(db.Integer, primary_key=True)
    template_id = db.Column(
        db.Integer, db.ForeignKey("personalization_template.id"), nullable=False
    )
    unique_id = db.Column(
        db.String(12), unique=True, nullable=False, index=True
    )  # Short unique ID for URL
    data = db.Column(db.JSON, nullable=False)  # Actual personalization data
    email = db.Column(db.String(255), index=True)  # For quick lookup
    record_metadata = db.Column(
        db.JSON, nullable=True
    )  # Security and tracking metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_accessed = db.Column(db.DateTime)
    access_count = db.Column(db.Integer, default=0)

    # Relationships
    template = db.relationship("PersonalizationTemplate", backref="records")

    def to_dict(self):
        return {
            "id": self.id,
            "template_id": self.template_id,
            "unique_id": self.unique_id,
            "data": self.data,
            "email": self.email,
            "record_metadata": self.record_metadata,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "last_accessed": (
                self.last_accessed.isoformat() if self.last_accessed else None
            ),
            "access_count": self.access_count,
        }


class ServiceLead(db.Model):
    """Tracks potential customers from the services page"""

    __tablename__ = "service_leads"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    email = db.Column(db.String(255), nullable=False)
    has_existing_course = db.Column(db.Boolean, nullable=False)
    course_topic = db.Column(db.Text, nullable=True)
    status = db.Column(
        db.String(20), default="new"
    )  # new, contacted, qualified, converted
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    contacted_at = db.Column(db.DateTime, nullable=True)
    notes = db.Column(db.Text, nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "has_existing_course": self.has_existing_course,
            "course_topic": self.course_topic,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "contacted_at": (
                self.contacted_at.isoformat() if self.contacted_at else None
            ),
            "notes": self.notes,
        }


class JobApplication(db.Model):
    __tablename__ = "job_applications"

    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(
        db.String(255), nullable=False
    )  # Corresponds to job.id in frontend (can be string or int)
    job_title = db.Column(db.String(200), nullable=False)
    name = db.Column(db.String(150), nullable=False)
    email = db.Column(db.String(150), nullable=False)
    resume_filename = db.Column(
        db.String(255), nullable=True
    )  # Can store temp name or future S3 key
    status = db.Column(
        db.String(50), default="submitted"
    )  # e.g., submitted, under review, rejected, hired
    submitted_at = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.Text, nullable=True)  # For internal notes

    def to_dict(self):
        return {
            "id": self.id,
            "job_id": self.job_id,
            "job_title": self.job_title,
            "name": self.name,
            "email": self.email,
            "resume_filename": self.resume_filename,
            "status": self.status,
            "submitted_at": (
                self.submitted_at.isoformat() if self.submitted_at else None
            ),
            "notes": self.notes,
        }


class ResumeAnalysis(db.Model):
    __tablename__ = "resume_analyses"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)
    session_id = db.Column(db.String(255), nullable=True)  # For anonymous users
    filename = db.Column(db.String(255), nullable=False)
    file_size = db.Column(db.Integer, nullable=False)
    s3_key = db.Column(db.String(255), nullable=False)
    analysis_status = db.Column(
        db.String(50), default="pending"
    )  # pending, processing, completed, failed
    analysis_results = db.Column(
        db.JSON, nullable=True
    )  # JSON instead of JSONB for MySQL
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    user = db.relationship(
        "User", backref=db.backref("resume_analyses", lazy="dynamic")
    )

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "session_id": self.session_id,
            "filename": self.filename,
            "file_size": self.file_size,
            "s3_key": self.s3_key,
            "analysis_status": self.analysis_status,
            "analysis_results": self.analysis_results,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class CareerLead(db.Model):
    """Tracks leads from the career accelerator page with comprehensive data"""

    __tablename__ = "career_leads"

    id = db.Column(db.Integer, primary_key=True)

    # Basic contact information
    name = db.Column(db.String(255), nullable=True)
    email = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(50), nullable=True)
    linkedin_url = db.Column(db.String(500), nullable=True)

    # Job search details
    target_job_title = db.Column(db.String(255), nullable=True)
    biggest_challenge = db.Column(db.Text, nullable=True)

    # Source and urgency
    source = db.Column(
        db.String(100), default="career_accelerator"
    )  # 'lead_form', 'cta_strategy_activation', etc.
    urgency = db.Column(db.String(50), nullable=True)  # 'asap', '1-3months', etc.

    # Resume file storage
    resume_s3_key = db.Column(
        db.String(512), nullable=True
    )  # S3 key for uploaded resume
    resume_s3_url = db.Column(
        db.String(1024), nullable=True
    )  # Full S3 URL for easy access

    # AI Analysis IDs for linking
    resume_analysis_id = db.Column(
        db.Integer, db.ForeignKey("resume_analyses.id"), nullable=True
    )
    personalization_id = db.Column(
        db.String(255), nullable=True
    )  # The unique ID from PersonalizationRecord

    # User's finalized goals and ticket data
    finalized_goals = db.Column(
        db.JSON, nullable=True
    )  # target_roles, target_locations, salary_goal, notes
    career_ticket_data = db.Column(
        db.JSON, nullable=True
    )  # Full generated ticket content

    # Lead management
    status = db.Column(
        db.String(20), default="new"
    )  # new, contacted, qualified, converted, closed
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    contacted_at = db.Column(db.DateTime, nullable=True)
    converted_at = db.Column(db.DateTime, nullable=True)
    notes = db.Column(db.Text, nullable=True)

    # Relationships
    resume_analysis = db.relationship("ResumeAnalysis", backref="career_leads")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "linkedin_url": self.linkedin_url,
            "target_job_title": self.target_job_title,
            "biggest_challenge": self.biggest_challenge,
            "resume_s3_key": self.resume_s3_key,
            "resume_s3_url": self.resume_s3_url,
            "source": self.source,
            "urgency": self.urgency,
            "resume_analysis_id": self.resume_analysis_id,
            "personalization_id": self.personalization_id,
            "finalized_goals": self.finalized_goals,
            "career_ticket_data": self.career_ticket_data,
            "status": self.status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "contacted_at": (
                self.contacted_at.isoformat() if self.contacted_at else None
            ),
            "converted_at": (
                self.converted_at.isoformat() if self.converted_at else None
            ),
            "notes": self.notes,
        }


class AdminUser(db.Model):
    """Admin users with role-based permissions"""

    __tablename__ = "admin_users"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    role = db.Column(
        db.String(50), default="fulfillment", nullable=False
    )  # admin, fulfillment, support
    permissions = db.Column(db.JSON, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    user = db.relationship("User", backref="admin_profile")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "role": self.role,
            "permissions": self.permissions,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "user": (
                {"id": self.user.id, "email": self.user.email} if self.user else None
            ),
        }


class Offer(db.Model):
    """Service offerings/packages"""

    __tablename__ = "offers"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    slug = db.Column(db.String(100), unique=True, nullable=False)
    description = db.Column(db.Text, nullable=True)
    price_cents = db.Column(db.Integer, nullable=False)
    deliverables = db.Column(db.JSON, nullable=True)  # List of expected deliverables
    timeline_days = db.Column(db.Integer, default=3)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    orders = db.relationship("Order", backref="offer", lazy="dynamic")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "slug": self.slug,
            "description": self.description,
            "price_cents": self.price_cents,
            "price_dollars": self.price_cents / 100 if self.price_cents else 0,
            "deliverables": self.deliverables or [],
            "timeline_days": self.timeline_days,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class Order(db.Model):
    """Client orders for services"""

    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    client_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    offer_id = db.Column(db.Integer, db.ForeignKey("offers.id"), nullable=False)
    status = db.Column(
        db.String(50), default="new", nullable=False
    )  # new, in_progress, delivered, completed
    order_date = db.Column(db.DateTime, default=datetime.utcnow)
    due_date = db.Column(db.DateTime, nullable=True)
    payment_status = db.Column(db.String(50), default="pending")
    payment_amount_cents = db.Column(db.Integer, nullable=True)
    stripe_payment_id = db.Column(db.String(255), nullable=True)
    service_ticket = db.Column(db.JSON, nullable=True)  # AI-generated ticket data
    deliverables = db.Column(db.JSON, nullable=True)  # S3 URLs for uploaded files
    internal_notes = db.Column(db.Text, nullable=True)

    # NEW FULFILLMENT FIELDS
    welcome_bridge_id = db.Column(
        db.Integer, db.ForeignKey("brdge.id"), nullable=True
    )  # Selected welcome video bridge
    intelligence_data = db.Column(
        db.JSON, nullable=True
    )  # Processed CSV intelligence data
    fulfillment_metadata = db.Column(
        db.JSON, nullable=True
    )  # Additional fulfillment tracking

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    client = db.relationship("User", backref="orders")
    welcome_bridge = db.relationship(
        "Brdge", foreign_keys=[welcome_bridge_id], backref="welcome_orders"
    )
    order_deliverables = db.relationship(
        "OrderDeliverable", backref="order", cascade="all, delete-orphan"
    )
    client_progress = db.relationship(
        "ClientProgress", backref="order", cascade="all, delete-orphan"
    )

    def calculate_due_date(self):
        """Calculate due date based on offer timeline"""
        if self.offer and self.offer.timeline_days:
            from datetime import timedelta

            return self.order_date + timedelta(days=self.offer.timeline_days)
        return None

    def get_progress_percentage(self):
        """Calculate completion percentage based on deliverables"""
        if not self.offer or not self.offer.deliverables:
            return 0

        total_deliverables = len(self.offer.deliverables)
        completed_deliverables = len(self.order_deliverables)

        return (
            min(100, (completed_deliverables / total_deliverables) * 100)
            if total_deliverables > 0
            else 0
        )

    def to_dict(
        self,
        include_client=True,
        include_service_ticket=False,
        include_fulfillment=False,
    ):
        result = {
            "id": self.id,
            "client_id": self.client_id,
            "offer_id": self.offer_id,
            "status": self.status,
            "order_date": self.order_date.isoformat() if self.order_date else None,
            "due_date": self.due_date.isoformat() if self.due_date else None,
            "payment_status": self.payment_status,
            "payment_amount_cents": self.payment_amount_cents,
            "payment_amount_dollars": (
                self.payment_amount_cents / 100 if self.payment_amount_cents else 0
            ),
            "stripe_payment_id": self.stripe_payment_id,
            "deliverables": self.deliverables or {},
            "internal_notes": self.internal_notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "progress_percentage": self.get_progress_percentage(),
        }

        if include_client and self.client:
            result["client"] = {"id": self.client.id, "email": self.client.email}

        if self.offer:
            result["offer"] = self.offer.to_dict()

        if include_service_ticket:
            result["service_ticket"] = self.service_ticket

        if include_fulfillment:
            result["welcome_bridge_id"] = self.welcome_bridge_id
            result["intelligence_data"] = self.intelligence_data
            result["fulfillment_metadata"] = self.fulfillment_metadata
            if self.welcome_bridge:
                result["welcome_bridge"] = self.welcome_bridge.to_dict()

        return result


class OrderDeliverable(db.Model):
    """Individual deliverable files for orders"""

    __tablename__ = "order_deliverables"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    deliverable_type = db.Column(
        db.String(100), nullable=False
    )  # resume_tuneup, opportunity_matrix, etc.
    file_name = db.Column(db.String(255), nullable=False)
    s3_key = db.Column(db.String(512), nullable=False)
    s3_url = db.Column(db.String(1024), nullable=True)
    file_size = db.Column(db.Integer, nullable=True)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)
    uploaded_by = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)

    # Relationships
    uploader = db.relationship("User", backref="uploaded_deliverables")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "deliverable_type": self.deliverable_type,
            "file_name": self.file_name,
            "s3_key": self.s3_key,
            "s3_url": self.s3_url,
            "file_size": self.file_size,
            "uploaded_at": self.uploaded_at.isoformat() if self.uploaded_at else None,
            "uploaded_by": self.uploaded_by,
            "uploader": (
                {"id": self.uploader.id, "email": self.uploader.email}
                if self.uploader
                else None
            ),
        }


class ClientProgress(db.Model):
    """Track client progress through their action plan"""

    __tablename__ = "client_progress"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    module_name = db.Column(
        db.String(100), nullable=False
    )  # action_plan, core_assets, etc.
    task_id = db.Column(db.String(100), nullable=False)
    completed = db.Column(db.Boolean, default=False)
    completed_at = db.Column(db.DateTime, nullable=True)
    notes = db.Column(db.Text, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "module_name": self.module_name,
            "task_id": self.task_id,
            "completed": self.completed,
            "completed_at": (
                self.completed_at.isoformat() if self.completed_at else None
            ),
            "notes": self.notes,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class IntelligenceTemplate(db.Model):
    """Stores intelligence data schema for an order (similar to PersonalizationTemplate but for leads/intelligence)"""

    __tablename__ = "intelligence_template"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    columns = db.Column(db.JSON, nullable=False)  # Column definitions with AI analysis
    source_files = db.Column(db.JSON, nullable=True)  # Track uploaded CSV files
    analysis_metadata = db.Column(db.JSON, nullable=True)  # Gemini analysis results
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )
    is_active = db.Column(db.Boolean, default=True)

    # Relationships
    order = db.relationship("Order", backref="intelligence_templates")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "name": self.name,
            "columns": self.columns,
            "source_files": self.source_files,
            "analysis_metadata": self.analysis_metadata,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "is_active": self.is_active,
        }


class IntelligenceRecord(db.Model):
    """Stores individual intelligence data records"""

    __tablename__ = "intelligence_record"

    id = db.Column(db.Integer, primary_key=True)
    template_id = db.Column(
        db.Integer, db.ForeignKey("intelligence_template.id"), nullable=False
    )
    data = db.Column(db.JSON, nullable=False)  # Actual intelligence data
    source_row = db.Column(db.Integer, nullable=True)  # Row number from CSV
    source_file = db.Column(db.String(255), nullable=True)  # Source filename
    confidence_score = db.Column(
        db.Float, nullable=True
    )  # AI confidence in data quality
    validation_status = db.Column(
        db.String(50), default="pending"
    )  # pending, validated, flagged
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    template = db.relationship("IntelligenceTemplate", backref="records")

    def to_dict(self):
        return {
            "id": self.id,
            "template_id": self.template_id,
            "data": self.data,
            "source_row": self.source_row,
            "source_file": self.source_file,
            "confidence_score": self.confidence_score,
            "validation_status": self.validation_status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class OutreachTemplate(db.Model):
    """Stores outreach templates for an order"""

    __tablename__ = "outreach_templates"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    subject = db.Column(db.String(500), nullable=True)  # For email templates
    content = db.Column(db.Text, nullable=False)
    template_type = db.Column(
        db.String(50), nullable=False, default="email"
    )  # email, linkedin, phone
    position = db.Column(db.Integer, default=0)  # For ordering templates
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    order = db.relationship("Order", backref="outreach_templates")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "title": self.title,
            "subject": self.subject,
            "content": self.content,
            "template_type": self.template_type,
            "position": self.position,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }


class FulfillmentLog(db.Model):
    """Tracks fulfillment actions and changes for audit trail"""

    __tablename__ = "fulfillment_logs"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(
        db.Integer, db.ForeignKey("orders.id"), nullable=True
    )  # Allow NULL for deletion logs
    admin_user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    action_type = db.Column(
        db.String(100), nullable=False
    )  # bridge_selected, csv_uploaded, intelligence_processed, order_deleted
    action_data = db.Column(db.JSON, nullable=True)  # Details of the action
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    order = db.relationship("Order", backref="fulfillment_logs")
    admin_user = db.relationship("User", backref="fulfillment_actions")

    def to_dict(self):
        return {
            "id": self.id,
            "order_id": self.order_id,
            "admin_user_id": self.admin_user_id,
            "action_type": self.action_type,
            "action_data": self.action_data,
            "timestamp": self.timestamp.isoformat() if self.timestamp else None,
        }
