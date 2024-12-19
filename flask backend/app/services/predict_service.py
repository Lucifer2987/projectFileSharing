import os
import random  # For demo purposes

class PredictService:
    def __init__(self):
        self.upload_dir = os.path.join(os.getcwd(), 'uploads')
        if not os.path.exists(self.upload_dir):
            os.makedirs(self.upload_dir)

    def predict_malware(self, file):
        """
        Analyze file for malware.
        For demo purposes, returns a random boolean.
        True means safe, False means potential malware detected.
        """
        try:
            # Save file temporarily for analysis
            temp_path = os.path.join(self.upload_dir, file.filename)
            file.save(temp_path)
            
            # Demo: Random prediction (True = safe, False = malware detected)
            prediction = random.choice([True, True, True, False])  # 75% chance of being safe
            
            # Clean up
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
            return prediction
        except Exception as e:
            if os.path.exists(temp_path):
                os.remove(temp_path)
            raise Exception(f"Error analyzing file for malware: {str(e)}")

    def predict_anomaly(self, file):
        """
        Analyze file for anomalies.
        For demo purposes, returns a random boolean.
        True means normal, False means anomaly detected.
        """
        try:
            # Save file temporarily for analysis
            temp_path = os.path.join(self.upload_dir, file.filename)
            file.save(temp_path)
            
            # Demo: Random prediction (True = normal, False = anomaly detected)
            prediction = random.choice([True, True, False])  # 66% chance of being normal
            
            # Clean up
            if os.path.exists(temp_path):
                os.remove(temp_path)
                
            return prediction
        except Exception as e:
            if os.path.exists(temp_path):
                os.remove(temp_path)
            raise Exception(f"Error analyzing file for anomalies: {str(e)}") 