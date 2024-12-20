import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import arff  # ARFF file reader

# Function to load and preprocess the ARFF file
def load_data(file_path):
    """
    Load and preprocess the ARFF dataset.
    """
    data, meta = arff.loadarff(file_path)
    
    # Convert ARFF data to DataFrame
    df = pd.DataFrame(data)
    
    # Convert byte data to string if necessary (for non-numeric columns)
    for column in df.select_dtypes(include=[np.object]).columns:
        df[column] = df[column].str.decode('utf-8')

    return df

# Function to train the phishing detection model
def train_phishing_model():
    """
    Train the phishing detection model and save it.
    """
    try:
        # Load and preprocess the ARFF dataset
        df = load_data('app/datasets/Training Dataset.arff')

        if df.empty:
            raise ValueError("Dataset is empty. Please check the data source.")

        # Assuming the label is in the last column, and features are all others
        X = df.iloc[:, :-1]  # All columns except the last (features)
        y = df.iloc[:, -1]   # Last column (the label)

        # Handle missing values (fill with the mean or mode depending on the feature)
        X = X.fillna(X.mean())  # Numerical columns: fill with mean
        y = y.fillna(y.mode()[0])  # Label column: fill with mode (most frequent)

        # Convert categorical variables to dummy/indicator variables
        X = pd.get_dummies(X, drop_first=True)  # Avoid multicollinearity

        # Split the data into training and testing sets
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

        # Initialize the RandomForestClassifier (or use your preferred model)
        model = RandomForestClassifier(n_estimators=100, random_state=42)

        # Train the model
        model.fit(X_train, y_train)

        # Predict on the test set
        y_pred = model.predict(X_test)

        # Evaluate the model
        accuracy = accuracy_score(y_test, y_pred)
        print(f'Phishing Detection Model Accuracy: {accuracy * 100:.2f}%')

        # Save the trained model as a pickle file
        model_path = 'app/models/phishing_model.pkl'
        joblib.dump(model, model_path)

        return accuracy

    except Exception as e:
        print(f"Error during model training: {str(e)}")
        return None

# Function to load the saved phishing model for inference
def load_phishing_model():
    """
    Load the trained phishing detection model for inference.
    """
    try:
        model_path = 'app/models/phishing_model.pkl'
        model = joblib.load(model_path)
        return model
    except FileNotFoundError:
        print("Model not found. Please train the model first.")
        return None
    except Exception as e:
        print(f"Error loading model: {str(e)}")
        return None

