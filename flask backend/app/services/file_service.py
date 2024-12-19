import os
from datetime import datetime, timedelta
from app import db
from app.models.file_model import FileModel
from werkzeug.utils import secure_filename

# Service for handling file-related operations
class FileService:
    UPLOAD_FOLDER = "uploads"  # Folder where files are stored
    ALLOWED_EXTENSIONS = {"pdf", "docx"}  # Allowed file extensions

    def __init__(self):
        if not os.path.exists(self.UPLOAD_FOLDER):
            os.makedirs(self.UPLOAD_FOLDER)

    def allowed_file(self, filename):
        """Check if the file extension is allowed."""
        return "." in filename and filename.rsplit(".", 1)[1].lower() in self.ALLOWED_EXTENSIONS

    def upload_file(self, file, user_id, expiry_date):
        """
        Upload a file to the server.
        :param file: File object from the request
        :param user_id: ID of the user uploading the file
        :param expiry_date: Expiry date for the file
        :return: FileModel instance
        """
        if not file or not self.allowed_file(file.filename):
            raise ValueError("Invalid file type. Only PDF and DOCX files are allowed.")

        filename = secure_filename(file.filename)
        file_path = os.path.join(self.UPLOAD_FOLDER, filename)

        # Save file to the server
        file.save(file_path)

        try:
            # Create database entry
            new_file = FileModel(
                user_id=user_id,
                file_name=filename,
                file_path=file_path,
                expiry_date=expiry_date
            )
            db.session.add(new_file)
            db.session.commit()
            return new_file
        except Exception as e:
            # If database operation fails, delete the uploaded file
            if os.path.exists(file_path):
                os.remove(file_path)
            raise e

    def get_file_history(self, user_id):
        """
        Retrieve file history for a specific user.
        :param user_id: User ID
        :return: List of FileModel entries
        """
        return FileModel.query.filter_by(user_id=user_id).order_by(FileModel.uploaded_on.desc()).all()

    def get_expiring_files(self, hours=24):
        """
        Get files that will expire within the specified hours.
        :param hours: Number of hours to look ahead (default: 24)
        :return: List of FileModel entries
        """
        expiry_threshold = datetime.utcnow() + timedelta(hours=hours)
        return FileModel.query.filter(
            FileModel.expiry_date <= expiry_threshold,
            FileModel.expiry_date > datetime.utcnow()
        ).all()

    def update_expiry_date(self, file_id, new_expiry_date, user_id):
        """
        Update the expiry date of a file.
        :param file_id: ID of the file to update
        :param new_expiry_date: New expiry date in ISO format
        :param user_id: ID of the user making the update
        :return: Updated FileModel instance
        """
        file_entry = FileModel.query.get(file_id)
        if not file_entry:
            raise ValueError("File not found")

        if file_entry.user_id != user_id:
            raise ValueError("Unauthorized to update this file")

        file_entry.expiry_date = datetime.fromisoformat(new_expiry_date)
        db.session.commit()
        return file_entry

    def delete_expired_files(self):
        """
        Delete files that have passed their expiry date.
        :return: Number of files deleted
        """
        expired_files = FileModel.query.filter(
            FileModel.expiry_date <= datetime.utcnow()
        ).all()

        deleted_count = 0
        for file_entry in expired_files:
            try:
                # Delete file from storage
                if os.path.exists(file_entry.file_path):
                    os.remove(file_entry.file_path)

                # Delete entry from the database
                db.session.delete(file_entry)
                deleted_count += 1
            except Exception as e:
                print(f"Error deleting file {file_entry.file_name}: {str(e)}")

        db.session.commit()
        return deleted_count
