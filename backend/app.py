# app.py
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
)
from werkzeug.middleware.proxy_fix import ProxyFix
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_HOST = os.getenv("DB_HOST")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_NAME")

app = Flask(__name__)
# app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///brdges.db"
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"mysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
# Use an environment variable in production
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB


# Use ProxyFix
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1, x_prefix=1)

# Enable CORS for all origins
CORS(app, resources={r"/api/*": {"origins": "*"}})

db = SQLAlchemy(app)
migrate = Migrate(app, db)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = os.environ.get(
    "JWT_SECRET_KEY", "your-secret-key"
)  # Make sure this is set
jwt = JWTManager(app)

# Import routes after initializing db to avoid circular imports
from routes import *

# Create an application context
with app.app_context():
    # Initialize the database
    db.create_all()


@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({"error": "File too large. Maximum size is 16 MB."}), 413


@app.cli.command("reset-db")
def reset_db():
    """Drop all tables and recreate them."""
    with app.app_context():
        db.drop_all()
        db.create_all()
        print("Database reset successfully.")


# Note: All routes are now defined in routes.py to avoid duplicates


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
