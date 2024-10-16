# app.py
from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
import os

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
CORS(app)

db = SQLAlchemy(app)

# Import routes after initializing db to avoid circular imports
from routes import *

# Create an application context
with app.app_context():
    # Initialize the database
    db.create_all()


@app.errorhandler(413)
def request_entity_too_large(error):
    return jsonify({"error": "File too large. Maximum size is 16 MB."}), 413


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
