import React from "react";

function Hero({ scrollToUpload }) {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>Securely Share Your Files</h1>
        <p>Easily upload, share, and protect your files with advanced AI-powered security.</p>
        <button onClick={scrollToUpload}>Get Started</button>
      </div>
      <div className="hero-image">
        <img src="../src/assets/secure-file-sharing.png" alt="Secure File Sharing" />
      </div>
    </section>
  );
}

export default Hero;
