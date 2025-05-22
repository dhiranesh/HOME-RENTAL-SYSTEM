import axios from 'axios';

const API_URL = '/api/users'; // Assuming your backend routes are prefixed with /api

// Get user profile
export const getUserProfile = async (userId, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${API_URL}/${userId}/profile`, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching profile for user ${userId}:`, error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.put(`/api/users/profile`, profileData, config);
    return response.data;
  } catch (error) {
    console.error('Error updating profile:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Get all users (admin only)
export const getAllUsers = async (token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.get(API_URL, config); // Route typically /api/users
    return response.data;
  } catch (error) {
    console.error('Error fetching all users:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Update user role (admin only)
export const updateUserRole = async (userId, role, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.put(`${API_URL}/${userId}/role`, { role }, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating role for user ${userId}:`, error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Delete a user (admin only)
export const deleteUser = async (userId, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.delete(`${API_URL}/${userId}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Get user listings (properties listed by the user)
export const getUserListings = async (userId, token) => {
    try {
        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        };
        // This might be /api/users/:userId/properties or /api/properties?ownerId=:userId
        // Adjust based on your backend API design.
        const response = await axios.get(`${API_URL}/${userId}/properties`, config);
        return response.data;
    } catch (error) {
        console.error(`Error fetching listings for user ${userId}:`, error.response?.data?.message || error.message);
        throw error.response?.data || error;
    }
};
