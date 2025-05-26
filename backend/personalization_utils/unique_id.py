import string
import random
import time
import sys
import os
import uuid
import secrets

# Add parent directory to path to import from correct location
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import PersonalizationRecord


def generate_unique_id(length=12):
    """
    Generate a unique, URL-safe ID for personalization records

    Args:
        length: Length of the generated ID (default 12)

    Returns:
        String: Unique ID that doesn't exist in the database
    """
    # Characters for URL-safe IDs (avoiding confusing characters like 0, O, l, I)
    characters = string.ascii_letters + string.digits
    safe_characters = "".join(c for c in characters if c not in "0OlI1")

    max_attempts = 100

    for _ in range(max_attempts):
        # Generate random string
        unique_id = "".join(secrets.choice(safe_characters) for _ in range(length))

        # Check if it already exists
        existing = PersonalizationRecord.query.filter_by(unique_id=unique_id).first()
        if not existing:
            return unique_id

    # Fallback to UUID if we can't generate a unique short ID
    return str(uuid.uuid4()).replace("-", "")[:length]


def generate_uuid():
    """
    Generate a standard UUID4 string

    Returns:
        String: UUID4 string
    """
    return str(uuid.uuid4())


def validate_unique_id(unique_id: str) -> bool:
    """
    Validate that a unique ID follows the expected format

    Args:
        unique_id: The ID to validate

    Returns:
        True if valid, False otherwise
    """
    if not unique_id or not isinstance(unique_id, str):
        return False

    # Check length (8-12 characters is reasonable)
    if len(unique_id) < 6 or len(unique_id) > 12:
        return False

    # Check characters (alphanumeric only)
    if not unique_id.isalnum():
        return False

    return True


def batch_generate_unique_ids(count: int) -> list:
    """
    Generate multiple unique IDs at once, ensuring no duplicates

    Args:
        count: Number of IDs to generate

    Returns:
        List of unique ID strings
    """
    ids = set()

    # Get all existing IDs to avoid collisions
    existing_ids = set(
        record.unique_id
        for record in PersonalizationRecord.query.with_entities(
            PersonalizationRecord.unique_id
        ).all()
    )

    while len(ids) < count:
        new_id = generate_unique_id()
        if new_id not in existing_ids and new_id not in ids:
            ids.add(new_id)

    return list(ids)
