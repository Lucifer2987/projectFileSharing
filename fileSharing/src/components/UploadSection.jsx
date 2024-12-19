import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { addDays, format, isWithinInterval } from 'date-fns';
import "./UploadSection.css";

function UploadSection() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState("");
  const [progress, setProgress] = useState(0);
  const [mode, setMode] = useState("malware"); // "malware" or "anomaly"
  const [expiryDate, setExpiryDate] = useState("");
  const { isLoggedIn } = useAuth();

  // Calculate min and max dates for expiry
  const today = new Date();
  const minDate = addDays(today, 1);
  const maxDate = addDays(today, 14);

  // Format dates for the datetime-local input
  const formatForInput = (date) => {
    return format(date, "yyyy-MM-dd'T'HH:mm");
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    if (!selectedFile) return;

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Unsupported file type. Please upload a PDF or DOCX file.");
      setFile(null);
      setFileName("");
      return;
    }

    if (selectedFile.size > maxFileSize) {
      setError("File size exceeds the limit of 5MB.");
      setFile(null);
      setFileName("");
      return;
    }

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setError("");
    setResult("");
  };

  const handleExpiryDateChange = (e) => {
    const selectedDate = new Date(e.target.value);
    
    if (isWithinInterval(selectedDate, { start: minDate, end: maxDate })) {
      setExpiryDate(e.target.value);
      setError("");
    } else {
      setError("Please select a date between tomorrow and 14 days from now");
      setExpiryDate("");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first.");
      return;
    }

    if (!expiryDate) {
      setError("Please set an expiry date for the file.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError("Please log in to upload files.");
      return;
    }

    setProgress(0);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("expiry_date", expiryDate);

    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      },
      withCredentials: true
    };

    try {
      setProgress(25);

      // Upload file
      const uploadResponse = await axios.post(
        'http://localhost:5000/api/files/upload',
        formData,
        config
      );

      if (uploadResponse.status !== 201 || uploadResponse.data.status === 'error') {
        throw new Error(uploadResponse.data.error || "Upload failed");
      }

      setProgress(50);

      // Analyze file
      const analysisResponse = await axios.post(
        `http://localhost:5000/predict-file/${mode}/1.0`,
        formData,
        config
      );

      setProgress(75);

      if (analysisResponse.data.status === 'success') {
        const analysisResult = analysisResponse.data.prediction[0];
        setResult(
          `File uploaded successfully! Analysis result: ${
            analysisResult 
              ? `Safe - No ${mode} detected` 
              : `Warning - Potential ${mode} detected!`
          }`
        );
        setError("");
        
        // Reset form
        setFile(null);
        setFileName("");
        setExpiryDate("");
        const fileInput = document.getElementById('file');
        if (fileInput) {
          fileInput.value = '';
        }
      } else {
        throw new Error(analysisResponse.data.error || "Analysis failed");
      }

      setProgress(100);
    } catch (error) {
      console.error('Upload error:', error);
      setError(error.message || "Failed to upload and analyze file.");
      setProgress(0);
    }
  };

  return (
    <section className="upload" id="upload" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <div className="upload-container">
        <h2 style={{ marginBottom: '1.5rem', color: '#333' }}>Upload & Analyze Your File</h2>

        <div className="detection-mode" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1rem', color: '#555' }}>Select Detection Mode:</h3>
          <div style={{ 
            display: 'flex', 
            gap: '2rem', 
            justifyContent: 'center',
            marginBottom: '1rem' 
          }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: mode === 'malware' ? '#e3f2fd' : 'transparent'
            }}>
              <input
                type="radio"
                name="detectionMode"
                value="malware"
                checked={mode === 'malware'}
                onChange={(e) => setMode(e.target.value)}
              />
              Malware Detection
            </label>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              cursor: 'pointer',
              padding: '0.5rem 1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: mode === 'anomaly' ? '#e3f2fd' : 'transparent'
            }}>
              <input
                type="radio"
                name="detectionMode"
                value="anomaly"
                checked={mode === 'anomaly'}
                onChange={(e) => setMode(e.target.value)}
              />
              Anomaly Detection
            </label>
          </div>
        </div>

        <div className="file-upload">
          <label htmlFor="file" style={{ fontSize: '1.1rem' }}>Select File (Max: 5MB, PDF/DOCX only):</label>
          <input 
            type="file" 
            id="file" 
            onChange={handleFileChange}
            accept=".pdf,.docx"
            style={{ 
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              width: '100%',
              marginTop: '0.5rem'
            }}
          />
          {fileName && (
            <p style={{ marginTop: '0.5rem', color: '#666' }}>
              Selected File: <strong>{fileName}</strong>
            </p>
          )}
        </div>

        <div className="expiry-input" style={{ marginTop: '1.5rem' }}>
          <label htmlFor="expiry" style={{ fontSize: '1.1rem', display: 'block', marginBottom: '0.5rem' }}>
            Set Expiry Date (1-14 days):
          </label>
          <div style={{ marginBottom: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
            Valid range: {format(minDate, 'MMM dd, yyyy HH:mm')} to {format(maxDate, 'MMM dd, yyyy HH:mm')}
          </div>
          <input
            type="datetime-local"
            id="expiry"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            min={formatForInput(minDate)}
            max={formatForInput(maxDate)}
            disabled={!isLoggedIn || !file}
            style={{ 
              padding: '1rem',
              border: '1px solid #ddd',
              borderRadius: '4px',
              width: '100%',
              marginTop: '0.5rem',
              backgroundColor: !isLoggedIn || !file ? '#f5f5f5' : 'white'
            }}
          />
          {!isLoggedIn && (
            <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Please log in to set expiry date
            </div>
          )}
          {isLoggedIn && !file && (
            <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Please select a file first
            </div>
          )}
        </div>

        {error && (
          <p className="error" style={{ 
            marginTop: '1rem',
            padding: '0.75rem',
            borderRadius: '4px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            fontSize: '0.9rem'
          }}>
            {error}
          </p>
        )}

        <button 
          onClick={handleUpload} 
          disabled={!file || !isLoggedIn || !expiryDate}
          style={{
            marginTop: '1rem',
            padding: '1rem 2rem',
            fontSize: '1.1rem'
          }}
        >
          {!isLoggedIn ? "Please Log In to Upload" : `Upload & Analyze for ${mode.charAt(0).toUpperCase() + mode.slice(1)}`}
        </button>

        {progress > 0 && (
          <div style={{ marginTop: '1rem' }}>
            <progress value={progress} max="100">
              {progress}%
            </progress>
            <p style={{ marginTop: '0.5rem', color: '#666' }}>
              Progress: {progress}%
            </p>
          </div>
        )}

        {result && <p className="success">{result}</p>}
      </div>
    </section>
  );
}

export default UploadSection;
