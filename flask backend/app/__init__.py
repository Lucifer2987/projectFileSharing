from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.routes import setup_routes

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Initialize extensions
    CORS(app)
    JWTManager(app)

    # Setup routes
    setup_routes(app)

    return app
