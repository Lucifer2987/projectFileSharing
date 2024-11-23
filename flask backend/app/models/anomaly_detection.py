import pandas as pd
from sklearn.ensemble import IsolationForest

def train_anomaly_model():
    # Load the anomaly detection dataset
    df = pd.read_csv('app/datasets/ai4i_2020_dataset.csv')
    X = df.iloc[:, :-1].values  # Exclude the target column (if present)

    # Train Isolation Forest
    model = IsolationForest(contamination=0.1)
    model.fit(X)
    return model

anomaly_model = train_anomaly_model()
