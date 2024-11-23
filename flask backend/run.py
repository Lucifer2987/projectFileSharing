from flask import Flask, request, jsonify
import pandas as pd
from app.models.phishing_detection import train_phishing_model, load_phishing_model
from app.models.malware_detection import train_malware_model, load_malware_model
from app.models.anomaly_detection import train_anomaly_model, load_anomaly_model

app = Flask(__name__)

# Route to train the phishing detection model
@app.route('/train-phishing', methods=['POST'])
def train_phishing():
    try:
        accuracy = train_phishing_model()  # This will train the phishing model
        return jsonify({'message': 'Phishing detection model trained successfully', 'accuracy': accuracy})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to load the phishing detection model
@app.route('/predict-phishing', methods=['POST'])
def predict_phishing():
    try:
        model = load_phishing_model()  # This loads the saved model
        if model:
            data = request.json  # Get data from the request body
            # Assume that data is a dictionary that needs to be converted to a DataFrame
            # Preprocess data to match the format of training data
            X_new = pd.DataFrame([data])  # Adjust this line as per your data format
            prediction = model.predict(X_new)
            return jsonify({'prediction': prediction.tolist()})
        else:
            return jsonify({'error': 'Model not found, please train the model first.'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to train the malware detection model
@app.route('/train-malware', methods=['POST'])
def train_malware():
    try:
        accuracy = train_malware_model()  # Train the malware detection model
        return jsonify({'message': 'Malware detection model trained successfully', 'accuracy': accuracy})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to load the malware detection model
@app.route('/predict-malware', methods=['POST'])
def predict_malware():
    try:
        model = load_malware_model()  # Load the trained malware detection model
        if model:
            data = request.json  # Get data from the request body
            # Preprocess and convert data to the right format
            X_new = pd.DataFrame([data])  # Adjust as per your feature data
            prediction = model.predict(X_new)
            return jsonify({'prediction': prediction.tolist()})
        else:
            return jsonify({'error': 'Model not found, please train the model first.'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to train the anomaly detection model
@app.route('/train-anomaly', methods=['POST'])
def train_anomaly():
    try:
        accuracy = train_anomaly_model()  # Train the anomaly detection model
        return jsonify({'message': 'Anomaly detection model trained successfully', 'accuracy': accuracy})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to load the anomaly detection model
@app.route('/predict-anomaly', methods=['POST'])
def predict_anomaly():
    try:
        model = load_anomaly_model()  # Load the trained anomaly detection model
        if model:
            data = request.json  # Get data from the request body
            # Preprocess and convert data to the right format
            X_new = pd.DataFrame([data])  # Adjust as per your feature data
            prediction = model.predict(X_new)
            return jsonify({'prediction': prediction.tolist()})
        else:
            return jsonify({'error': 'Model not found, please train the model first.'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Main entry point for the Flask app
if __name__ == '__main__':
    app.run(debug=True)
