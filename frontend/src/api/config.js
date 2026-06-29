// src/api/config.js

const BASE_URL = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

const API_ENDPOINTS = {
  // Authentication
  LOGIN: `${BASE_URL}/login/`,
  REGISTER: `${BASE_URL}/register/`,
  LOGOUT: `${BASE_URL}/logout/`,
  PASSWORD_RESET: `${BASE_URL}/password-reset/`,

  // User Profile
  PROFILE: `${BASE_URL}/profile/`,

  // Reports and Images
  REPORTS: `${BASE_URL}/diagnoses/`,
  IMAGES: `${BASE_URL}/diagnoses/`,
  IMAGE_UPLOAD: `${BASE_URL}/images/upload/`,
  DIAGNOSES: () => `${BASE_URL}/diagnoses/`,
};

// Axios default configuration
const axiosConfig = {
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
};

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export { API_ENDPOINTS, axiosConfig, getAuthHeader };
export default BASE_URL;
