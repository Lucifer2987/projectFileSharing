import axios from "axios";
import { API_BASE_URL } from "./config";

// Helper function to handle API calls (GET/POST)
const handleApiCall = async (method, endpoint, data = null) => {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data, // This is sent for POST/PUT requests
      timeout: 10000, // 10-second timeout
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);

    const errorMessage = error.code === "ECONNABORTED"
      ? "The request took too long. Please try again later."
      : error.response?.data?.message || "An unexpected error occurred. Please try again.";

    throw new Error(errorMessage);
  }
};

// Phishing detection API calls
export const trainPhishing = async () => {
  return await handleApiCall("POST", "/train-phishing");
};

export const predictPhishing = async (data) => {
  if (!data || !(data instanceof FormData)) {
    throw new Error("Invalid data format. Please upload a valid file.");
  }

  return await handleApiCall("POST", "/predict-phishing", data);
};

// Malware detection API calls
export const trainMalware = async () => {
  return await handleApiCall("POST", "/train-malware");
};

export const predictMalware = async (data) => {
  if (!data || !(data instanceof FormData)) {
    throw new Error("Invalid data format. Please upload a valid file.");
  }

  return await handleApiCall("POST", "/predict-malware", data);
};

// Anomaly detection API calls
export const trainAnomaly = async () => {
  return await handleApiCall("POST", "/train-anomaly");
};

export const predictAnomaly = async (data) => {
  if (!data || !(data instanceof FormData)) {
    throw new Error("Invalid data format. Please upload a valid file.");
  }

  return await handleApiCall("POST", "/predict-anomaly", data);
};

// Example GET request to fetch phishing status or other info
export const fetchPhishingStatus = async () => {
  return await handleApiCall("GET", "/phishing-status");
};
