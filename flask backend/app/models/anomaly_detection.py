import os
import pandas as pd
import joblib
from sklearn.ensemble import IsolationForest
from sklearn.preprocessing import StandardScaler

# Path to save the trained anomaly detection model
MODEL_PATH = os.path.join("app", "models", "anomaly_model.pkl")

def train_anomaly_model():
    """
    Train the anomaly detection model using Isolation Forest.
    """
    try:
        # Load dataset
        dataset_path = os.path.join("app", "datasets", "ai4i_2020_dataset.csv")
        data = pd.read_csv(dataset_path)

        # Check if the dataset is loaded correctly
        if data.empty:
            raise ValueError("Dataset is empty. Please check the data source.")

        # Preprocess dataset: Select numeric columns and scale the data
        numeric_features = data.select_dtypes(include=["float64", "int64"])
        if numeric_features.empty:
            raise ValueError("No numeric columns found for anomaly detection.")

        # Scale features to standardize them
        scaler = StandardScaler()
        scaled_data = scaler.fit_transform(numeric_features)

        # Initialize Isolation Forest for anomaly detection
        model = IsolationForest(contamination=0.1, random_state=42)
        model.fit(scaled_data)

        # Save the trained model and scaler as a dictionary
        joblib.dump({"model": model, "scaler": scaler}, MODEL_PATH)

        return "Anomaly detection model trained and saved successfully."
    
    except Exception as e:
        raise Exception(f"Error during model training: {str(e)}")

def load_anomaly_model():
    """
    Load the trained anomaly detection model from the file.
    """
    try:
        if os.path.exists(MODEL_PATH):
            return joblib.load(MODEL_PATH)
        else:
            return None
    except Exception as e:
        raise Exception(f"Error loading model: {str(e)}")

def predict_anomaly(input_data):
    """
    Predict anomalies for the given input data.
    :param input_data: Dictionary containing the data to be evaluated
    :return: Prediction result (1: Normal, -1: Anomaly)
    """
    try:
        # Load the trained model and scaler
        model_data = load_anomaly_model()
        if model_data is None:
            raise Exception("Anomaly detection model not found. Please train the model first.")

        model = model_data["model"]
        scaler = model_data["scaler"]

        # Convert input data to a DataFrame and preprocess it using the scaler
        input_df = pd.DataFrame([input_data])
        scaled_input = scaler.transform(input_df)

        # Predict anomaly (1: Normal, -1: Anomaly)
        prediction = model.predict(scaled_input)

        return prediction[0]  # Return a single prediction result
    
    except Exception as e:
        raise Exception(f"Error during anomaly prediction: {str(e)}")
