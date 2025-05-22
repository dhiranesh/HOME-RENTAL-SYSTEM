import axios from 'axios';

// Get the user's token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create a new purchase for a property
export const createPurchase = async (propertyId) => {
  try {
    const response = await axios.post('/api/purchases', 
      { propertyId },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error creating purchase:', error.response?.data || error.message);
    throw error;
  }
};

// Get all purchases for the logged-in user
export const getMyPurchases = async () => {
  try {
    const response = await axios.get('/api/purchases/my', 
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching purchases:', error.response?.data || error.message);
    throw error;
  }
};

// Cancel a purchase
export const cancelPurchase = async (purchaseId) => {
  try {
    const response = await axios.delete(`/api/purchases/${purchaseId}`, 
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error) {
    console.error('Error canceling purchase:', error.response?.data || error.message);
    throw error;
  }
};
