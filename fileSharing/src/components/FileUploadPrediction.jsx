import React, { useState } from "react";
import axios from "axios";

function FileUploadPrediction() {
    const [file, setFile] = useState(null);
    const [mode, setMode] = useState("malware"); // Either 'malware' or 'anomaly'
    const [version, setVersion] = useState("1.0"); // Default model version
    const [result, setResult] = useState("");

    // Handle file selection
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    // Handle prediction submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please upload a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await axios.post(
                `http://localhost:5000/predict-file/${mode}/${version}`,
                formData,
                {
                    headers: {
                        "Authorization": `Bearer YOUR_ACCESS_TOKEN`, // Replace with actual token
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setResult(JSON.stringify(response.data, null, 2));
        } catch (error) {
            console.error("Error during prediction:", error);
            alert("Prediction failed. Please check the console for details.");
        }
    };

    return (
        <div>
            <h2>File Upload for Prediction</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Select Prediction Mode:
                    <select value={mode} onChange={(e) => setMode(e.target.value)}>
                        <option value="malware">Malware Detection</option>
                        <option value="anomaly">Anomaly Detection</option>
                    </select>
                </label>
                <br />
                <label>
                    Model Version:
                    <input
                        type="text"
                        value={version}
                        onChange={(e) => setVersion(e.target.value)}
                        placeholder="e.g., 1.0"
                    />
                </label>
                <br />
                <label>
                    Upload File:
                    <input type="file" onChange={handleFileChange} />
                </label>
                <br />
                <button type="submit">Submit</button>
            </form>
            {result && (
                <div>
                    <h3>Prediction Result:</h3>
                    <pre>{result}</pre>
                </div>
            )}
        </div>
    );
}

export default FileUploadPrediction;
