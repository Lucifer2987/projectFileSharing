import React from "react";

function Hero({ showLogin }) {
  return (
    // <section className="hero">
    //   <h2>Share Files Securely and Efficiently</h2>
    //   <p>Upload, share, and set expiration for files. Keep your data safe with AI-powered risk detection.</p>
    //   <button onClick={showLogin}>Get Started</button>
    // </section>
    <section className="hero">
        <div className="hero-content">
            <h1>Securely Share Your Files</h1>
            <p>Easily upload, share, and protect your files with advanced AI-powered security.</p>
            <button onClick="scrollToUpload()">Get Started</button>
        </div>
        <div className="hero-image">
            <img src="secure-file-sharing.png" alt="Secure File Sharing" />
        </div>
    </section>

  );
}

export default Hero;
