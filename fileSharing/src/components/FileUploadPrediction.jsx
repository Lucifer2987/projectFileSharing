import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./UploadSection.css";

function FileUploadPrediction() {
    const [file, setFile] = useState(null);
    const [mode, setMode] = useState("malware"); // Either 'malware' or 'anomaly'
    const [result, setResult] = useState("");
    const [error, setError] = useState("");
    const [progress, setProgress] = useState(0);
    const { isLoggedIn } = useContext(AuthContext);
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Handle file selection
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
        const maxFileSize = 5 * 1024 * 1024; // 5MB

        if (!selectedFile) return;

        if (!allowedTypes.includes(selectedFile.type)) {
            setError("Unsupported file type. Please upload a PDF or DOCX file.");
            setFile(null);
            return;
        }

        if (selectedFile.size > maxFileSize) {
            setError("File size exceeds the limit of 5MB.");
            setFile(null);
            return;
        }

        setFile(selectedFile);
        setError("");
        setResult("");
    };

    // Handle file upload
    const handleUpload = async () => {
        if (!isLoggedIn) {
            setError("Please log in to upload files.");
            return;
        }

        if (!file) {
            setError("Please upload a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setProgress(25);
            const token = localStorage.getItem('token');
            
            // First, upload the file
            const uploadResponse = await axios.post(
                'http://localhost:5000/api/files/upload',
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true
                }
            );

            setProgress(50);

            // Then, analyze the file
            const analysisResponse = await axios.post(
                `http://localhost:5000/predict-${mode}`,
                formData,
                {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true
                }
            );

            setProgress(75);
            
            if (analysisResponse.data.status === 'success') {
                setResult(analysisResponse.data.prediction ? "File is safe!" : "Warning: Potential threat detected!");
                setError("");
                
                // Update uploaded files list
                setUploadedFiles(prev => [...prev, {
                    id: uploadResponse.data.file_id,
                    name: uploadResponse.data.file_name,
                    uploadedAt: new Date().toLocaleString(),
                    status: analysisResponse.data.prediction ? "Safe" : "Potential Threat"
                }]);
            } else {
                setError(analysisResponse.data.message || "Analysis failed. Please try again.");
                setResult("");
            }
            
            setProgress(100);
        } catch (error) {
            console.error("Error during upload/analysis:", error);
            setError(error.response?.data?.message || "An unexpected error occurred. Please try again.");
            setResult("");
            setProgress(0);
        }
    };

    return (
        <div className="upload-container">
            <h2>File Upload & Analysis</h2>
            <div className="mode-selection">
                <label>
                    <input
                        type="radio"
                        name="mode"
                        value="malware"
                        checked={mode === "malware"}
                        onChange={(e) => setMode(e.target.value)}
                    />
                    Malware Detection
                </label>
                <label>
                    <input
                        type="radio"
                        name="mode"
                        value="anomaly"
                        checked={mode === "anomaly"}
                        onChange={(e) => setMode(e.target.value)}
                    />
                    Anomaly Detection
                </label>
            </div>

            <div className="file-upload">
                <label htmlFor="file">Select File (Max: 5MB, PDF/DOCX only):</label>
                <input 
                    type="file" 
                    id="file" 
                    onChange={handleFileChange}
                    accept=".pdf,.docx"
                />
                {file && <p>Selected File: <strong>{file.name}</strong></p>}
            </div>

            {error && <p className="error">{error}</p>}

            <button onClick={handleUpload} disabled={!file || !isLoggedIn}>
                {!isLoggedIn ? "Please Log In to Upload" : "Upload & Analyze"}
            </button>

            {progress > 0 && (
                <progress value={progress} max="100">
                    {progress}%
                </progress>
            )}

            {result && <p className="success">{result}</p>}

            {/* Display uploaded files */}
            {uploadedFiles.length > 0 && (
                <div className="uploaded-files">
                    <h3>Uploaded Files</h3>
                    <ul>
                        {uploadedFiles.map(file => (
                            <li key={file.id}>
                                <span>{file.name}</span>
                                <span>{file.uploadedAt}</span>
                                <span className={file.status === "Safe" ? "safe" : "warning"}>
                                    {file.status}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default FileUploadPrediction;
