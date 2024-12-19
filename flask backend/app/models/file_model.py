from app import db
from datetime import datetime

class FileModel(db.Model):
    __tablename__ = 'files'

    id = db.Column(db.Integer, primary_key=True)  # Unique file ID
    user_id = db.Column(db.Integer, nullable=False)  # User ID who uploaded the file
    file_name = db.Column(db.String(255), nullable=False)  # File name
    file_path = db.Column(db.String(512), nullable=False)  # File path in storage
    uploaded_on = db.Column(db.DateTime, default=datetime.utcnow)  # Upload timestamp
    expiry_date = db.Column(db.DateTime, nullable=True)  # File expiry date

    def __init__(self, user_id, file_name, file_path, expiry_date=None):
        self.user_id = user_id
        self.file_name = file_name
        self.file_path = file_path
        self.expiry_date = expiry_date

    def to_dict(self):
        """Convert the file object to a dictionary for JSON responses."""
        return {
            "id": self.id,
            "fileName": self.file_name,
            "filePath": self.file_path,
            "uploadedOn": self.uploaded_on.isoformat(),
            "expiryDate": self.expiry_date.isoformat() if self.expiry_date else None
        }
