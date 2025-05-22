import axios from 'axios';

const API_URL = '/api/bookings'; // Assuming your backend routes are prefixed with /api

// Create a new booking
export const createBooking = async (bookingData, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.post(API_URL, bookingData, config);
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Get bookings for a user
export const getUserBookings = async (userId, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    // Assuming an endpoint like /api/bookings/user/:userId or a query param
    const response = await axios.get(`${API_URL}/user/${userId}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching bookings for user ${userId}:`, error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Get bookings for a property (potentially for admin or property owner)
export const getPropertyBookings = async (propertyId, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${API_URL}/property/${propertyId}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching bookings for property ${propertyId}:`, error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Cancel a booking
export const cancelBooking = async (bookingId, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    // Assuming a DELETE request or a PUT/PATCH to update status
    const response = await axios.patch(`${API_URL}/${bookingId}/cancel`, {}, config);
    return response.data;
  } catch (error) {
    console.error(`Error cancelling booking ${bookingId}:`, error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Get a single booking by ID
export const getBookingById = async (bookingId, token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${API_URL}/${bookingId}`, config);
    return response.data;
  } catch (error) {
    console.error(`Error fetching booking ${bookingId}:`, error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Update booking status (e.g., admin confirming a booking)
export const updateBookingStatus = async (bookingId, status, token) => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.patch(`${API_URL}/${bookingId}/status`, { status }, config);
    return response.data;
  } catch (error) {
    console.error(`Error updating status for booking ${bookingId}:`, error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};

// Get bookings for the logged-in user (using the my-bookings endpoint)
export const getMyBookings = async (token) => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    };
    const response = await axios.get(`${API_URL}/my-bookings`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching your bookings:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};
