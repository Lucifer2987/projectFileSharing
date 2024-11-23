from flask import request, jsonify
import jwt
from functools import wraps
from config import Config

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        if not token:
            return jsonify({"message": "Token is missing!"}), 401
        try:
            data = jwt.decode(token, Config.JWT_SECRET_KEY, algorithms=["HS256"])
        except:
            return jsonify({"message": "Invalid token!"}), 401
        return f(*args, **kwargs)
    return decorated
