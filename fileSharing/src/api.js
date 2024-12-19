import axios from "axios";
import { API_BASE_URL } from "./config";

// Helper function to handle API calls (GET/POST)
const handleApiCall = async (method, endpoint, data = null) => {
  try {
    const token = localStorage.getItem('token');
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      withCredentials: true,
      timeout: 10000
    };

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error calling ${endpoint}:`, error);
    throw error;
  }
};

// ===================== User Authentication API Calls =====================
export const loginUser = async (email, password) => {
  return await handleApiCall("POST", "/auth/login", { email, password });
};

export const registerUser = async (userData) => {
  return await handleApiCall("POST", "/auth/register", userData);
};

export const checkAuthStatus = async () => {
  return await handleApiCall("GET", "/check_auth");
};

// ===================== Phishing Detection API Calls =====================
export const trainPhishing = async (version) => {
  if (!version) throw new Error("Version is required for training phishing model.");
  return await handleApiCall("POST", `/train-phishing/${version}`);
};

export const predictPhishing = async (data, version) => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid input. Please provide valid phishing data.");
  }
  return await handleApiCall("POST", `/predict-phishing/${version}`, data);
};

// ===================== Malware Detection API Calls =====================
export const trainMalware = async (version) => {
  if (!version) throw new Error("Version is required for training malware model.");
  return await handleApiCall("POST", `/train-malware/${version}`);
};

export const predictMalware = async (data, version) => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid input. Please provide valid malware data.");
  }
  return await handleApiCall("POST", `/predict-malware/${version}`, data);
};

// ===================== Anomaly Detection API Calls =====================
export const trainAnomaly = async (version) => {
  if (!version) throw new Error("Version is required for training anomaly model.");
  return await handleApiCall("POST", `/train-anomaly/${version}`);
};

export const predictAnomaly = async (data, version) => {
  if (!data || typeof data !== "object") {
    throw new Error("Invalid input. Please provide valid anomaly data.");
  }
  return await handleApiCall("POST", `/predict-anomaly/${version}`, data);
};

// ===================== General API Calls =====================
export const listModels = async () => {
  return await handleApiCall("GET", "/list-models");
};

export const deleteModel = async (modelType, version) => {
  if (!modelType || !version) {
    throw new Error("Model type and version are required for deletion.");
  }
  return await handleApiCall("DELETE", `/delete-model/${modelType}/${version}`);
};

// Health Check
export const checkHealth = async () => {
  return await handleApiCall("GET", "/health");
};
