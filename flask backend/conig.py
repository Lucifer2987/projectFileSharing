import os

class Config:
    # General Configuration
    SECRET_KEY = os.environ.get("SECRET_KEY", "supersecretkey")
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "2f43f2b7727aef080232e2d99cbd3facaea0f9af5a4d6bee45be08d856d2ae3f0152bbb91cc9ad1a1bc9e53f5a1b72d1f807767ae9cd62cb34166c6b1f85036cfb7a478e179d68d4b8d102908da3068c4fba595212c8f5384165e5fae2d56c0f082e87d0207f925833c6a29c3b11f7f5401f7bdca58dd7a2064d5e752ffc8fefbbcbb03d7e5da68269321c57f10a007aee255f02a48ff0b1c02975a77a9482b181efadca01d28f38197ae336714be5c416deee9d052ee6fd9ea09659aac9446e76d34201876fbdbe59c9e1ca8c5cb041e54690f09b5f2cfdde828ce9a5ebfa120eb9e3bdd4f3077c843a0be543f7806ff5e31a0eb0e631cf9a0de31faf1dbd55")

    # File Upload Configurations
    UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024  # 16MB limit
    ALLOWED_EXTENSIONS = {'txt', 'csv', 'json', 'xlsx', 'arff'}

    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.environ.get("SQLALCHEMY_DATABASE_URI", "sqlite:///site.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Logging Configuration
    LOG_DIR = os.path.join(os.getcwd(), "logs")
    LOGGING_LEVEL = "INFO"
    LOGGING_FORMAT = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"

    # JWT Configuration
    JWT_ACCESS_TOKEN_EXPIRES = int(os.environ.get("JWT_ACCESS_TOKEN_EXPIRES", 3600))  # 1 hour

    # Frontend URL for CORS
    FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')

    # Ensure uploads directory exists
    @staticmethod
    def ensure_upload_folder():
        if not os.path.exists(Config.UPLOAD_FOLDER):
            os.makedirs(Config.UPLOAD_FOLDER)

Config.ensure_upload_folder()
