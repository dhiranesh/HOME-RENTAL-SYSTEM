import axios from 'axios';

const API_URL = '/api/properties'; // Assuming your backend routes are prefixed with /api

// Get all properties (with optional query parameters for filtering, searching, pagination)
export const getAllProperties = async (params) => {
  try {
    const response = await axios.get(API_URL, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching properties:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Get a single property by its ID
export const getPropertyById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching property ${id}:`, error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Create a new property
export const createProperty = async (propertyData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.post(API_URL, propertyData, config);
    return response.data;
  } catch (error) {
    console.error('Error creating property:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Update an existing property
export const updateProperty = async (id, propertyData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.put(`${API_URL}/${id}`, propertyData, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating property ${id}:`, error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Delete a property
export const deleteProperty = async (id, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.delete(`${API_URL}/${id}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error deleting property ${id}:`, error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Add other property-related API functions as needed, e.g., search, filter, image upload handling (if client-side)
