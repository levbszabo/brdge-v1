# app.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///brdges.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")
# Use an environment variable in production

db = SQLAlchemy(app)

# Import routes after initializing db to avoid circular imports
from routes import *

# Create an application context
with app.app_context():
    # Initialize the database
    db.create_all()

if __name__ == "__main__":
    app.run(debug=True)
