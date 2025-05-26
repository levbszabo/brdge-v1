import csv
import io
from typing import List, Dict, Any
import logging
import sys
import os
from datetime import datetime

# Add parent directory to path to import from correct location
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import PersonalizationRecord, db
from personalization_utils.unique_id import generate_unique_id

logger = logging.getLogger(__name__)


def process_csv_upload(file, template):
    """
    Process uploaded CSV file and create personalization records

    Args:
        file: Uploaded CSV file object
        template: PersonalizationTemplate instance

    Returns:
        List of created PersonalizationRecord instances
    """
    # Read CSV content
    file.seek(0)  # Reset file pointer
    content = file.read().decode("utf-8")
    csv_reader = csv.DictReader(io.StringIO(content))

    # Get expected column names from template
    expected_columns = [col["name"] for col in template.columns]

    # Validate CSV headers
    csv_headers = csv_reader.fieldnames
    if not csv_headers:
        raise ValueError("CSV file appears to be empty or invalid")

    # Check if required columns are present
    missing_columns = set(expected_columns) - set(csv_headers)
    if missing_columns:
        raise ValueError(f"Missing required columns: {', '.join(missing_columns)}")

    created_records = []
    row_number = 1

    try:
        for row in csv_reader:
            row_number += 1

            # Extract only the expected columns
            record_data = {}
            for col_name in expected_columns:
                record_data[col_name] = row.get(col_name, "").strip()

            # Skip empty rows
            if not any(record_data.values()):
                continue

            # Generate unique ID
            unique_id = generate_unique_id()

            # Extract email if present
            email = record_data.get("email", "")

            # Create record
            record = PersonalizationRecord(
                template_id=template.id,
                unique_id=unique_id,
                data=record_data,
                email=email,
            )

            db.session.add(record)
            created_records.append(record)

        # Commit all records
        db.session.commit()

        logger.info(
            f"Successfully created {len(created_records)} personalization records from CSV"
        )
        return created_records

    except Exception as e:
        db.session.rollback()
        logger.error(f"Error processing CSV at row {row_number}: {str(e)}")
        raise ValueError(f"Error processing CSV at row {row_number}: {str(e)}")


def detect_column_types(fieldnames: List[str]) -> Dict[str, str]:
    """
    Auto-detect column types based on column names

    Args:
        fieldnames: List of column names from CSV

    Returns:
        Dict mapping column names to suggested types
    """
    column_types = {}

    for field in fieldnames:
        field_lower = field.lower().strip()

        # Email detection
        if any(term in field_lower for term in ["email", "e-mail", "mail"]):
            column_types[field] = "email"
        # Name detection
        elif any(
            term in field_lower
            for term in ["name", "firstname", "lastname", "full_name"]
        ):
            column_types[field] = "text"
        # Company detection
        elif any(
            term in field_lower for term in ["company", "organization", "employer"]
        ):
            column_types[field] = "text"
        # Role/Title detection
        elif any(term in field_lower for term in ["role", "title", "position", "job"]):
            column_types[field] = "text"
        # Industry detection
        elif any(term in field_lower for term in ["industry", "sector", "vertical"]):
            column_types[field] = "select"
        # Number detection
        elif any(
            term in field_lower
            for term in ["revenue", "size", "employees", "count", "number", "amount"]
        ):
            column_types[field] = "number"
        # Default to text
        else:
            column_types[field] = "text"

    return column_types


def extract_email(data: Dict[str, Any]) -> str:
    """
    Extract email from row data

    Args:
        data: Row data dictionary

    Returns:
        Email address if found, empty string otherwise
    """
    # Check common email field names
    email_fields = ["email", "e-mail", "mail", "email_address", "emailaddress"]

    for key, value in data.items():
        if key.lower().strip() in email_fields and value:
            return value.strip().lower()

    # If no dedicated email field, check if any value looks like an email
    import re

    email_pattern = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"

    for value in data.values():
        if value and isinstance(value, str) and re.match(email_pattern, value.strip()):
            return value.strip().lower()

    return ""


def validate_csv_structure(file, expected_columns: List[str] = None) -> Dict[str, Any]:
    """
    Validate CSV file structure before processing

    Args:
        file: The uploaded file object
        expected_columns: Optional list of expected column names

    Returns:
        Dict with validation results
    """
    try:
        content = file.read()
        file.seek(0)  # Reset file pointer for later use

        # Try to decode
        try:
            text_content = content.decode("utf-8")
        except UnicodeDecodeError:
            text_content = content.decode("latin-1")

        csv_file = io.StringIO(text_content)
        reader = csv.DictReader(csv_file)

        if not reader.fieldnames:
            return {
                "valid": False,
                "error": "CSV file appears to be empty or has no headers",
            }

        # Count rows
        row_count = sum(1 for row in reader if any(row.values()))

        validation_result = {
            "valid": True,
            "columns": reader.fieldnames,
            "row_count": row_count,
            "detected_types": detect_column_types(reader.fieldnames),
        }

        # Check if expected columns are present
        if expected_columns:
            missing_columns = set(expected_columns) - set(reader.fieldnames)
            if missing_columns:
                validation_result["warning"] = (
                    f"Missing expected columns: {', '.join(missing_columns)}"
                )

        return validation_result

    except Exception as e:
        return {"valid": False, "error": f"Failed to parse CSV: {str(e)}"}
