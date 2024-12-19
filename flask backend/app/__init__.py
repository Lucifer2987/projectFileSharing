from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from extensions import db

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Initialize extensions
    db.init_app(app)
    CORS(app, 
         resources={
             r"/*": {
                 "origins": [app.config['FRONTEND_URL']],
                 "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
                 "allow_headers": ["Content-Type", "Authorization"],
                 "supports_credentials": True,
                 "expose_headers": ["Content-Type", "Authorization"]
             }
         })
    JWTManager(app)

    with app.app_context():
        # Import blueprints inside app context to avoid circular imports
        from app.controllers.auth_controller import auth_controller
        from app.controllers.file_controller import file_controller
        from app.controllers.predict_controller import predict_controller

        # Register blueprints
        app.register_blueprint(auth_controller)
        app.register_blueprint(file_controller)
        app.register_blueprint(predict_controller)

        # Create database tables
        db.create_all()

        # Initialize app configuration
        from config import Config
        Config.init_app(app)

        # Setup basic routes
        @app.route('/health')
        def health_check():
            return {'status': 'healthy'}, 200

    return app
