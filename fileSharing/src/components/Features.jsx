import React from "react";

function Features() {
  return (
    <section className="features" id="features">
      <h2>Our Features</h2>
      <div className="feature-card">
        <h3>Upload & Share</h3>
        <p>Upload documents, videos, or photos easily and share with anyone via a secure link.</p>
      </div>
      <div className="feature-card">
        <h3>File Expiration</h3>
        <p>Set custom expiration dates to auto-delete files and ensure time-limited access.</p>
      </div>
      <div className="feature-card">
        <h3>AI Security & Detection</h3>
        <p>Detect suspicious activities with real-time anomaly detection and risk assessment.</p>
      </div>
    </section>
  );
}

export default Features;
