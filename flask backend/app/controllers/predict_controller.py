from flask import Blueprint, request, jsonify
from app.middleware.auth_middleware import token_required
from app.services.predict_service import PredictService
from functools import wraps

predict_controller = Blueprint("predict_controller", __name__)
predict_service = PredictService()

def handle_options_request(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.method == 'OPTIONS':
            return jsonify({"status": "success"}), 200
        return f(*args, **kwargs)
    return decorated_function

@predict_controller.route("/predict-file/<mode>/1.0", methods=["POST", "OPTIONS"])
@handle_options_request
@token_required
def predict_file(current_user=None, mode=None):
    try:
        if "file" not in request.files:
            return jsonify({
                "status": "error",
                "error": "No file part in the request"
            }), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({
                "status": "error",
                "error": "No file selected"
            }), 400

        # Get prediction based on mode
        if mode == "malware":
            prediction = predict_service.predict_malware(file)
        elif mode == "anomaly":
            prediction = predict_service.predict_anomaly(file)
        else:
            return jsonify({
                "status": "error",
                "error": "Invalid detection mode"
            }), 400

        return jsonify({
            "status": "success",
            "prediction": [prediction],
            "message": "File analyzed successfully"
        }), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500 