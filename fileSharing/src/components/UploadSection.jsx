import React, { useState } from "react";
import { predictMalware, predictAnomaly } from "../api"; // Import the APIs

function UploadSection() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("malware"); // Default to malware detection
  const [fileName, setFileName] = useState(""); // Display selected file name

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"]; // Add more as needed
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(selectedFile.type)) {
      alert("Unsupported file type. Please upload a PDF, JPEG, or PNG file.");
      return;
    }

    if (selectedFile.size > maxFileSize) {
      alert("File size exceeds the limit of 5MB.");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name); // Save file name for display
    setResult("");
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    if (!mode) {
      alert("Please select a detection mode (Malware or Anomaly).");
      return;
    }

    setProgress(0);
    const formData = new FormData();
    formData.append("file", file);

    try {
      setProgress(50); // Simulate progress
      let response;

      if (mode === "malware") {
        response = await predictMalware(formData); // Call malware detection API
      } else if (mode === "anomaly") {
        response = await predictAnomaly(formData); // Call anomaly detection API
      }

      setResult(response.result || "Prediction complete!"); // Update the result
      setProgress(100);
    } catch (error) {
      console.error("Error during upload:", error);

      if (error.response && error.response.data) {
        setResult(error.response.data.message || "An error occurred during prediction.");
      } else {
        setResult("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <section className="upload" id="upload">
      <h2>Upload Your File</h2>
      <div>
        <label>
          <input
            type="radio"
            name="mode"
            value="malware"
            checked={mode === "malware"}
            onChange={() => setMode("malware")}
          />
          Malware Detection
        </label>
        <label>
          <input
            type="radio"
            name="mode"
            value="anomaly"
            checked={mode === "anomaly"}
            onChange={() => setMode("anomaly")}
          />
          Anomaly Detection
        </label>
      </div>
      <form>
        <input type="file" onChange={handleFileChange} />
        {fileName && <p>Selected File: {fileName}</p>} {/* Display file name */}
        <button type="button" onClick={handleUpload}>
          Upload & Analyze
        </button>
        {progress > 0 && <progress value={progress} max="100"></progress>}
        {result && <p>{result}</p>}
      </form>
    </section>
  );
}

export default UploadSection;
