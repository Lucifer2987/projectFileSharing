from flask import Blueprint, request, jsonify
from app.services.auth_service import AuthService
from app.middleware.auth_middleware import token_required
from functools import wraps

auth_controller = Blueprint("auth_controller", __name__)
auth_service = AuthService()

def handle_options_request(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == 'OPTIONS':
            return jsonify({"status": "success"}), 200
        return f(*args, **kwargs)
    return decorated_function

@auth_controller.route("/auth/register", methods=["POST", "OPTIONS"])
@handle_options_request
def register():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")
        username = data.get("username")

        if not email or not password or not username:
            return jsonify({"error": "Missing required fields"}), 400

        # Register user
        user = auth_service.register_user(email, password, username)
        return jsonify({
            "message": "User registered successfully",
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username
            }
        }), 201

    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Registration failed"}), 500

@auth_controller.route("/auth/login", methods=["POST", "OPTIONS"])
@handle_options_request
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            return jsonify({"error": "Missing email or password"}), 400

        # Login user
        token, user = auth_service.login_user(email, password)
        return jsonify({
            "token": token,
            "user": {
                "id": user.id,
                "email": user.email,
                "username": user.username
            }
        }), 200

    except ValueError as e:
        return jsonify({"error": str(e)}), 401
    except Exception as e:
        return jsonify({"error": "Login failed"}), 500

@auth_controller.route("/auth/check", methods=["GET", "OPTIONS"])
@handle_options_request
@token_required
def check_auth(current_user=None):
    try:
        return jsonify({
            "isAuthenticated": True,
            "user": {
                "id": current_user.id,
                "email": current_user.email,
                "username": current_user.username
            }
        }), 200
    except Exception as e:
        return jsonify({"error": "Authentication check failed"}), 500

@auth_controller.route("/auth/logout", methods=["POST", "OPTIONS"])
@handle_options_request
@token_required
def logout(current_user=None):
    try:
        # In a token-based system, the client is responsible for removing the token
        return jsonify({"message": "Logged out successfully"}), 200
    except Exception as e:
        return jsonify({"error": "Logout failed"}), 500