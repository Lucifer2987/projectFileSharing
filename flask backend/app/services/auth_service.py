from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
from flask import current_app
from app.models.user import User
from extensions import db

class AuthService:
    def register_user(self, email, password, username):
        """Register a new user."""
        # Check if user already exists
        if User.query.filter_by(email=email).first():
            raise ValueError("Email already registered")

        if User.query.filter_by(username=username).first():
            raise ValueError("Username already taken")

        # Create new user
        hashed_password = generate_password_hash(password, method='pbkdf2:sha256')
        user = User(email=email, password=hashed_password, username=username)

        try:
            db.session.add(user)
            db.session.commit()
            return user
        except Exception as e:
            db.session.rollback()
            raise Exception("Failed to register user") from e

    def login_user(self, email, password):
        """Login a user and return JWT token."""
        user = User.query.filter_by(email=email).first()
        if not user:
            raise ValueError("Invalid email or password")

        if not check_password_hash(user.password, password):
            raise ValueError("Invalid email or password")

        try:
            token = jwt.encode(
                {
                    'user_id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'exp': datetime.utcnow() + timedelta(days=1)
                },
                current_app.config['JWT_SECRET_KEY'],
                algorithm='HS256'
            )
            return token, user
        except Exception as e:
            raise Exception("Failed to generate token") from e

    def get_user_by_id(self, user_id):
        """Get user by ID."""
        return User.query.get(user_id)

    def get_user_by_email(self, email):
        """Get user by email."""
        return User.query.filter_by(email=email).first() 