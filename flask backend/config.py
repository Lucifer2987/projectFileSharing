import os
from datetime import timedelta

class Config:
    # Basic Flask config
    SECRET_KEY = os.environ.get('SECRET_KEY', 'your-secret-key-here')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-jwt-secret-key-here')
    
    # Database config
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL', 'sqlite:///app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # JWT config
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=1)
    
    # CORS config
    FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    
    # File upload config
    MAX_CONTENT_LENGTH = 5 * 1024 * 1024  # 5MB max file size
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    ALLOWED_EXTENSIONS = {'pdf', 'docx'}

    # Session Configuration
    SESSION_TYPE = 'filesystem'
    PERMANENT_SESSION_LIFETIME = timedelta(days=1)
    SESSION_COOKIE_SECURE = False
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_NAME = 'session'

    # Logging Configuration
    LOG_DIR = os.path.join(os.getcwd(), "logs")
    LOGGING_LEVEL = "INFO"
    LOGGING_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    @staticmethod
    def ensure_upload_folder():
        if not os.path.exists(Config.UPLOAD_FOLDER):
            os.makedirs(Config.UPLOAD_FOLDER)

    @staticmethod
    def init_app(app):
        # Ensure the instance folder exists
        os.makedirs(app.instance_path, exist_ok=True)
        
        # Ensure the uploads folder exists
        Config.ensure_upload_folder()
        
        # Ensure the logs folder exists
        if not os.path.exists(Config.LOG_DIR):
            os.makedirs(Config.LOG_DIR)

Config.ensure_upload_folder()