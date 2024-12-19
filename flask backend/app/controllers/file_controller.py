from flask import Blueprint, request, jsonify
from app.services.file_service import FileService
from app.middleware.auth_middleware import token_required
import os
from datetime import datetime, timedelta
from functools import wraps

file_controller = Blueprint("file_controller", __name__)
file_service = FileService()

def handle_options_request(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == 'OPTIONS':
            return jsonify({"status": "success"}), 200
        return f(*args, **kwargs)
    return decorated_function

# Route to upload a file
@file_controller.route("/api/files/upload", methods=["POST", "OPTIONS"])
@handle_options_request
@token_required
def upload_file(current_user=None):
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file part in the request"}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "No file selected"}), 400

        # Get expiry date from form data
        expiry_date = request.form.get("expiry_date")
        if not expiry_date:
            return jsonify({"error": "Expiry date is required"}), 400

        # Validate expiry date
        try:
            expiry_date = datetime.fromisoformat(expiry_date)
            min_date = datetime.utcnow() + timedelta(days=1)
            max_date = datetime.utcnow() + timedelta(days=14)

            if expiry_date < min_date or expiry_date > max_date:
                return jsonify({"error": "Expiry date must be between 1 and 14 days from now"}), 400
        except ValueError:
            return jsonify({"error": "Invalid expiry date format"}), 400

        # Upload file using service
        uploaded_file = file_service.upload_file(file, current_user.id, expiry_date)

        return jsonify({
            "status": "success",
            "message": "File uploaded successfully",
            "file": {
                "id": uploaded_file.id,
                "file_name": uploaded_file.file_name,
                "expiry_date": uploaded_file.expiry_date.isoformat()
            }
        }), 201

    except ValueError as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 400
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500

# Route to fetch file history
@file_controller.route("/api/files/history", methods=["GET", "OPTIONS"])
@handle_options_request
@token_required
def get_file_history(current_user=None):
    try:
        files = file_service.get_file_history(current_user.id)
        return jsonify({
            "files": [file.to_dict() for file in files]
        }), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve file history"}), 500

# Route to get expiring files
@file_controller.route("/api/files/expiring", methods=["GET", "OPTIONS"])
@handle_options_request
@token_required
def get_expiring_files(current_user=None):
    try:
        # Get files expiring in the next 24 hours
        expiring_files = file_service.get_expiring_files(hours=24)
        return jsonify([file.to_dict() for file in expiring_files]), 200
    except Exception as e:
        return jsonify({"error": "Failed to retrieve expiring files"}), 500

# Route to update file expiry date
@file_controller.route("/api/files/<int:file_id>/update-expiry", methods=["PUT", "OPTIONS"])
@handle_options_request
@token_required
def update_file_expiry(current_user=None, file_id=None):
    try:
        data = request.get_json()
        new_expiry_date = data.get("expiry_date")

        if not new_expiry_date:
            return jsonify({"error": "Expiry date is required"}), 400

        # Validate expiry date
        try:
            expiry_date = datetime.fromisoformat(new_expiry_date)
            min_date = datetime.utcnow() + timedelta(days=1)
            max_date = datetime.utcnow() + timedelta(days=14)

            if expiry_date < min_date or expiry_date > max_date:
                return jsonify({"error": "Expiry date must be between 1 and 14 days from now"}), 400
        except ValueError:
            return jsonify({"error": "Invalid expiry date format"}), 400

        updated_file = file_service.update_expiry_date(file_id, new_expiry_date, current_user.id)
        return jsonify({
            "message": "Expiry date updated successfully",
            "file": updated_file.to_dict()
        }), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Failed to update expiry date"}), 500

# Route to delete expired files
@file_controller.route("/api/files/cleanup", methods=["DELETE", "OPTIONS"])
@handle_options_request
@token_required
def delete_expired_files(current_user=None):
    try:
        deleted_count = file_service.delete_expired_files()
        return jsonify({
            "message": f"Successfully deleted {deleted_count} expired files",
            "deleted_count": deleted_count
        }), 200
    except Exception as e:
        return jsonify({"error": "Failed to delete expired files"}), 500
