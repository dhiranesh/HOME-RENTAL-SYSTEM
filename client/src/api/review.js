import axios from 'axios';

// review API functions

const API_URL = '/api/reviews'; // Assuming your backend routes are prefixed with /api

// Add a review for a property
export const addReview = async (propertyId, reviewData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    // The route format should match the backend API route format
    // The current implementation expects /api/reviews with propertyId in request body
    reviewData.propertyId = propertyId; // Ensure propertyId is included in the request body
    const response = await axios.post(API_URL, reviewData, config);
    return response.data;
  } catch (error) {
    console.error(`Error adding review for property ${propertyId}:`, error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Get reviews for a property
export const getPropertyReviews = async (propertyId) => {
  try {
    const response = await axios.get(`${API_URL}/property/${propertyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews for property ${propertyId}:`, error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Get reviews by a user
export const getUserReviews = async (userId, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${API_URL}/user/${userId}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching reviews by user ${userId}:`, error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Update a review
export const updateReview = async (reviewId, reviewData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.put(`${API_URL}/${reviewId}`, reviewData, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating review ${reviewId}:`, error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Delete a review
export const deleteReview = async (reviewId, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.delete(`${API_URL}/${reviewId}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error deleting review ${reviewId}:`, error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};
