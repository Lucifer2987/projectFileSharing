import React, { useState } from "react";
import { predictMalware, predictAnomaly } from "../api"; // Import the APIs

function UploadSection() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState("");
  const [mode, setMode] = useState("malware"); // Default to malware detection
  const [fileName, setFileName] = useState(""); // Display selected file name
  const [error, setError] = useState(""); // Track errors

  // Handle file selection and validation
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Unsupported file type. Please upload a PDF, JPEG, or PNG file.");
      return;
    }

    if (selectedFile.size > maxFileSize) {
      setError("File size exceeds the limit of 5MB.");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError(""); // Clear any previous errors
    setResult(""); // Reset result
  };

  // Handle file upload and API interaction
  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    setProgress(0);
    const formData = new FormData();
    formData.append("file", file);

    try {
      setProgress(25);
      let response;

      if (mode === "malware") {
        response = await predictMalware(formData);
      } else {
        response = await predictAnomaly(formData);
      }

      setProgress(75);
      setResult(response.result || "Prediction complete!");
      setError(""); // Clear any previous errors
      setProgress(100);
    } catch (error) {
      console.error("Error during upload:", error);
      setResult("");
      setError(
        error.response?.data?.message ||
          "An unexpected error occurred. Please try again."
      );
      setProgress(0);
    }
  };

  return (
    <section className="upload" id="upload">
      <h2>Upload Your File</h2>

      {/* Mode Selection */}
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

      {/* File Upload Section */}
      <form>
        <div className="file-upload">
          <label htmlFor="file">Select File (Max: 5MB, PDF/JPEG/PNG):</label>
          <input type="file" id="file" onChange={handleFileChange} />
          {fileName && <p>Selected File: <strong>{fileName}</strong></p>}
        </div>

        {error && <p className="error">{error}</p>} {/* Display errors */}

        <button type="button" onClick={handleUpload} disabled={!file}>
          Upload & Analyze
        </button>

        {/* Progress Bar */}
        {progress > 0 && (
          <progress value={progress} max="100">
            {progress}%
          </progress>
        )}

        {/* Display Result */}
        {result && <p className="success">{result}</p>}
      </form>
    </section>
  );
}

export default UploadSection;
