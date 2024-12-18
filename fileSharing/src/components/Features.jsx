import React from "react";

function Features() {
  return (
    <section className="features" id="features">
      <h2>Our Features</h2>
      <div className="feature-card">
        <img src="../src/assets/upload.png" alt="Upload" />
        <h3>Upload & Share</h3>
        <p>
          Easily upload documents, videos, or photos and share them securely via unique, protected links.
        </p>
      </div>
      <div className="feature-card">
        <img src="../src/assets/file-expiry.png" alt="File Expiration" />
        <h3>File Expiration</h3>
        <p>
          Set custom expiration dates to ensure temporary access, providing an additional layer of security.
        </p>
      </div>
      <div className="feature-card">
        <img src="../src/assets/malware.png" alt="Malware Detection" />
        <h3>AI-Powered Malware Detection</h3>
        <p>
          Automatically scan uploaded files for malware to protect your system and ensure safe file sharing.
        </p>
      </div>
      <div className="feature-card">
        <img src="../src/assets/phishing.png" alt="Phishing Attack Prevention" />
        <h3>Phishing Attack Prevention</h3>
        <p>
          Detect and block phishing attempts in shared links, emails, and attachments to protect users.
        </p>
      </div>
      <div className="feature-card">
        <img src="../src/assets/anomaly.png" alt="Anomaly Detection" />
        <h3>Real-Time Anomaly Detection</h3>
        <p>
          Continuously monitor file access to identify unusual or suspicious activities, preventing data breaches.
        </p>
      </div>
      <div className="feature-card">
        <img src="../src/assets/handling-n-validation.png" alt="Error Handling & Validation" />
        <h3>Error Handling & Validation</h3>
        <p>
          Ensure smooth operations with robust error handling and validation, reducing disruptions and improving reliability.
        </p>
      </div>
    </section>
  );
}

export default Features;
