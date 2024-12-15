import React from "react"; // Ensure React is imported for JSX
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx"; // Main App component
import "./index.css"; // Global styles (if any)

// Render the root React application
const rootElement = document.getElementById("root"); // Ensure "root" exists in your HTML file
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error("Root element not found. Please check your index.html file.");
}
