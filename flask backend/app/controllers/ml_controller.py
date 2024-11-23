import arff
import os
import pandas as pd
from flask import Blueprint, request, jsonify
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib

ml_controller = Blueprint("ml_controller", __name__)

# Paths to datasets
PHISHING_DATASET_PATH = os.path.join("datasets", "Training Dataset.arff")

# Models storage
PHISHING_MODEL_PATH = os.path.join("models", "phishing_model.pkl")

# Load and preprocess phishing dataset
def load_phishing_dataset():
    with open(PHISHING_DATASET_PATH, "r") as f:
        data = arff.load(f)
    df = pd.DataFrame(data["data"], columns=[attr[0] for attr in data["attributes"]])
    X = df.iloc[:, :-1]  # Features (all columns except the last one)
    y = df.iloc[:, -1]   # Target (last column)
    return X, y

# Train phishing detection model
def train_phishing_model():
    X, y = load_phishing_dataset()
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)
    model = RandomForestClassifier()
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    joblib.dump(model, PHISHING_MODEL_PATH)
    return {"accuracy": accuracy}

@ml_controller.route("/train-phishing", methods=["POST"])
def train_phishing():
    result = train_phishing_model()
    return jsonify({"message": "Phishing model trained", "accuracy": result["accuracy"]}), 200

@ml_controller.route("/predict-phishing", methods=["POST"])
def predict_phishing():
    if not os.path.exists(PHISHING_MODEL_PATH):
        return jsonify({"error": "Phishing model not trained"}), 400

    model = joblib.load(PHISHING_MODEL_PATH)
    features = request.json.get("features")
    if not features:
        return jsonify({"error": "Features are required"}), 400

    prediction = model.predict([features])
    return jsonify({"prediction": prediction[0]}), 200
