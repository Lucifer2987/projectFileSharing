from functools import wraps
from flask import request, jsonify
import jwt
from flask import current_app
from app.services.auth_service import AuthService

auth_service = AuthService()

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        # Check if token is in headers
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({'error': 'Invalid token format'}), 401

        if not token:
            return jsonify({'error': 'Token is missing'}), 401

        try:
            # Decode token
            data = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            
            # Get user from database
            current_user = auth_service.get_user_by_id(data['user_id'])
            if not current_user:
                return jsonify({'error': 'Invalid token'}), 401

            # Add user to kwargs
            kwargs['current_user'] = current_user
            
            return f(*args, **kwargs)
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token'}), 401
        except Exception as e:
            return jsonify({'error': str(e)}), 500

    return decorated
