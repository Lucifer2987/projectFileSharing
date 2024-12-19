import arff
import os
import pandas as pd
from flask import Blueprint, request, jsonify, current_app
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.metrics import accuracy_score
import joblib
import logging
from datetime import datetime
from app.middleware.auth_middleware import token_required

ml_blueprint = Blueprint("ml_blueprint", __name__)

# Base directory setup for consistent paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASETS_DIR = os.path.join(BASE_DIR, "..", "datasets")
MODELS_DIR = os.path.join(BASE_DIR, "..", "models")

# Paths to datasets
PHISHING_DATASET_PATH = os.path.join(DATASETS_DIR, "Training Dataset.arff")
ANOMALY_DATASET_PATH = os.path.join(DATASETS_DIR, "ai4i_2020_dataset.csv")
MALWARE_DATASET_PATH = os.path.join(DATASETS_DIR, "malwaredetection.csv")

# Models storage
PHISHING_MODEL_PATH = os.path.join(MODELS_DIR, "phishing_model.pkl")
ANOMALY_MODEL_PATH = os.path.join(MODELS_DIR, "anomaly_model.pkl")
MALWARE_MODEL_PATH = os.path.join(MODELS_DIR, "malware_model.pkl")

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ======= HELPER FUNCTIONS =======
def check_and_remove_model(model_path):
    """Check if model exists and remove it before retraining."""
    if os.path.exists(model_path):
        os.remove(model_path)
        logger.info(f"Existing model at {model_path} removed.")


def validate_features(features, expected_length):
    """Validate input features."""
    if not isinstance(features, list) or len(features) != expected_length:
        return False
    if not all(isinstance(f, (int, float)) for f in features):
        return False
    return True


def save_model(model, model_path):
    """Save model to disk."""
    joblib.dump(model, model_path)
    logger.info(f"Model saved to {model_path}")


def perform_cross_validation(model, X, y):
    """Perform cross-validation to assess model performance."""
    cv_scores = cross_val_score(model, X, y, cv=5, scoring="accuracy")  # 5-fold CV
    return cv_scores.mean()


def perform_grid_search(model, X, y):
    """Perform grid search for hyperparameter tuning."""
    param_grid = {
        'n_estimators': [50, 100, 200],
        'max_depth': [10, 20, None],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
    grid_search = GridSearchCV(estimator=model, param_grid=param_grid, cv=5, scoring='accuracy', n_jobs=-1, verbose=1)
    grid_search.fit(X, y)
    logger.info(f"Best parameters from grid search: {grid_search.best_params_}")
    return grid_search.best_estimator_


# ======= PHISHING DETECTION =======
def load_phishing_dataset():
    with open(PHISHING_DATASET_PATH, "r") as f:
        data = arff.load(f)
    df = pd.DataFrame(data["data"], columns=[attr[0] for attr in data["attributes"]])
    X = df.iloc[:, :-1]
    y = df.iloc[:, -1]
    return X, y


def train_phishing_model():
    check_and_remove_model(PHISHING_MODEL_PATH)
    X, y = load_phishing_dataset()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

    # Hyperparameter tuning: Perform grid search for best model
    model = RandomForestClassifier(random_state=42)
    tuned_model = perform_grid_search(model, X_train, y_train)

    # Evaluate model
    y_pred = tuned_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    # Cross-validation performance
    cross_val_accuracy = perform_cross_validation(tuned_model, X, y)

    save_model(tuned_model, PHISHING_MODEL_PATH)

    return {
        "accuracy": accuracy,
        "cross_val_accuracy": cross_val_accuracy,
        "model_path": PHISHING_MODEL_PATH
    }


@ml_blueprint.route("/train-phishing", methods=["POST"])
@token_required
def train_phishing(decoded_token):
    result = train_phishing_model()
    return jsonify({
        "message": "Phishing model trained successfully!",
        "accuracy": result["accuracy"],
        "cross_val_accuracy": result["cross_val_accuracy"],
        "model_path": result["model_path"]
    }), 200


@ml_blueprint.route("/predict-phishing", methods=["POST"])
@token_required
def predict_phishing(decoded_token):
    if not os.path.exists(PHISHING_MODEL_PATH):
        return jsonify({"error": "Phishing model not trained"}), 400

    model = joblib.load(PHISHING_MODEL_PATH)
    features = request.json.get("features")
    if not validate_features(features, expected_length=model.n_features_in_):
        return jsonify({"error": "Invalid features. Provide correct input length and type."}), 400

    prediction = model.predict([features])
    return jsonify({"prediction": prediction[0]}), 200


# ======= ANOMALY DETECTION =======
def load_anomaly_dataset():
    df = pd.read_csv(ANOMALY_DATASET_PATH)
    X = df.drop(columns=["Machine failure"])
    y = df["Machine failure"]
    return X, y


def train_anomaly_model():
    check_and_remove_model(ANOMALY_MODEL_PATH)
    X, y = load_anomaly_dataset()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

    model = RandomForestClassifier(random_state=42)
    tuned_model = perform_grid_search(model, X_train, y_train)

    y_pred = tuned_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    cross_val_accuracy = perform_cross_validation(tuned_model, X, y)

    save_model(tuned_model, ANOMALY_MODEL_PATH)

    return {
        "accuracy": accuracy,
        "cross_val_accuracy": cross_val_accuracy,
        "model_path": ANOMALY_MODEL_PATH
    }


@ml_blueprint.route("/train-anomaly", methods=["POST"])
@token_required
def train_anomaly(decoded_token):
    result = train_anomaly_model()
    return jsonify({
        "message": "Anomaly detection model trained successfully!",
        "accuracy": result["accuracy"],
        "cross_val_accuracy": result["cross_val_accuracy"],
        "model_path": result["model_path"]
    }), 200


@ml_blueprint.route("/predict-anomaly", methods=["POST"])
@token_required
def predict_anomaly(decoded_token):
    if not os.path.exists(ANOMALY_MODEL_PATH):
        return jsonify({"error": "Anomaly detection model not trained"}), 400

    model = joblib.load(ANOMALY_MODEL_PATH)
    features = request.json.get("features")
    if not validate_features(features, expected_length=model.n_features_in_):
        return jsonify({"error": "Invalid features. Provide correct input length and type."}), 400

    prediction = model.predict([features])
    return jsonify({"prediction": prediction[0]}), 200


# ======= MALWARE DETECTION =======
def load_malware_dataset():
    df = pd.read_csv(MALWARE_DATASET_PATH)
    X = df.drop(columns=["Label"])
    y = df["Label"]
    return X, y


def train_malware_model():
    check_and_remove_model(MALWARE_MODEL_PATH)
    X, y = load_malware_dataset()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

    model = RandomForestClassifier(random_state=42)
    tuned_model = perform_grid_search(model, X_train, y_train)

    y_pred = tuned_model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)

    cross_val_accuracy = perform_cross_validation(tuned_model, X, y)

    save_model(tuned_model, MALWARE_MODEL_PATH)

    return {
        "accuracy": accuracy,
        "cross_val_accuracy": cross_val_accuracy,
        "model_path": MALWARE_MODEL_PATH
    }


@ml_blueprint.route("/train-malware", methods=["POST"])
@token_required
def train_malware(decoded_token):
    result = train_malware_model()
    return jsonify({
        "message": "Malware detection model trained successfully!",
        "accuracy": result["accuracy"],
        "cross_val_accuracy": result["cross_val_accuracy"],
        "model_path": result["model_path"]
    }), 200


@ml_blueprint.route("/predict-malware", methods=["POST"])
@token_required
def predict_malware(decoded_token):
    if not os.path.exists(MALWARE_MODEL_PATH):
        return jsonify({"error": "Malware detection model not trained"}), 400

    model = joblib.load(MALWARE_MODEL_PATH)
    features = request.json.get("features")
    if not validate_features(features, expected_length=model.n_features_in_):
        return jsonify({"error": "Invalid features. Provide correct input length and type."}), 400

    prediction = model.predict([features])
    return jsonify({"prediction": prediction[0]}), 200
