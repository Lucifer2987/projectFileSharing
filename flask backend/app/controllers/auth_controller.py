from flask import Blueprint, app, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from app.middleware.auth_middleware import token_required

auth_blueprint = Blueprint('auth', __name__)

# Mock user database
users = {}

@auth_blueprint.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data['email']
    if email in users:
        return jsonify({"message": "User already exists"}), 400
    hashed_password = generate_password_hash(data['password'], method='sha256')
    users[email] = {'email': email, 'password': hashed_password}
    return jsonify({"message": "User registered successfully"}), 201

@auth_blueprint.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data['email']
    user = users.get(email)
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({"message": "Invalid credentials"}), 401
    token = jwt.encode({'email': email, 'exp': datetime.utcnow() + timedelta(days=1)}, 
                       app.config['JWT_SECRET_KEY'])
    return jsonify({"token": token}), 200

