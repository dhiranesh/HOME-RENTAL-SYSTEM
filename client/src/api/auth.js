import axios from 'axios';

// Define the base URL for your API. This might come from an environment variable.
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth'; // Adjust port if your backend runs elsewhere

/**
 * Registers a new user.
 * @param {object} userData - The user's registration data (e.g., name, email, password).
 * @returns {Promise<object>} The server's response.
 */
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    // If registration is successful, the backend might return user data and a token.
    // You might want to store the token in localStorage here or in AuthContext.
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    // Handle errors (e.g., display a message to the user)
    // Axios wraps the error response in error.response
    throw error.response ? error.response.data : new Error('Registration failed');
  }
};

/**
 * Logs in an existing user.
 * @param {object} credentials - The user's login credentials (e.g., email, password).
 * @returns {Promise<object>} The server's response.
 */
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    // If login is successful, the backend will likely return user data and a token.
    // Store the token in localStorage for subsequent authenticated requests.
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Login failed');
  }
};

/**
 * Logs out the current user.
 * This typically involves removing the token from local storage.
 */
export const logoutUser = () => {
  localStorage.removeItem('token');
  // You might also want to redirect the user to the login page or update auth context.
  // No API call is strictly necessary for basic JWT logout on the client-side,
  // unless your backend implements server-side session invalidation.
};

/**
 * Optional: Function to get the current authentication token.
 * @returns {string|null} The token or null if not found.
 */
export const getToken = () => {
  return localStorage.getItem('token');
};

/**
 * Fetches the current user's profile.
 * This is typically called after login to get user details.
 * @returns {Promise<object|null>} The user profile data or null if not authenticated.
 */
export const getCurrentUser = async () => {
  const token = getToken();
  if (!token) return null;
  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to fetch current user', error);
    logoutUser(); // If token is invalid or expired, log out
    return null;
  }
};
