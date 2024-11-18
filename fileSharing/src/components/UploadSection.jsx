import React, { useState } from "react";

function UploadSection() {
  const [progress, setProgress] = useState(0);

  const handleUpload = () => {
    let uploadProgress = 0;
    setProgress(0);

    const interval = setInterval(() => {
      uploadProgress += 10;
      setProgress(uploadProgress);

      if (uploadProgress >= 100) {
        clearInterval(interval);
        alert("Files uploaded successfully!");
      }
    }, 300);
  };

  return (
    <section className="upload" id="upload">
      <h2>Upload Your File</h2>
      <form>
        <input type="file" />
        <input type="text" placeholder="Recipient Email" />
        <input type="date" />
        <button type="button" onClick={handleUpload}>
          Upload & Share
        </button>
        {progress > 0 && <progress value={progress} max="100"></progress>}
      </form>
    </section>
  );
}

export default UploadSection;
