from flask import Blueprint
from app.controllers.auth_controller import auth_blueprint
from app.controllers.ml_controller import ml_blueprint

def setup_routes(app):
    app.register_blueprint(auth_blueprint, url_prefix="/auth")
    app.register_blueprint(ml_blueprint, url_prefix="/ml")
