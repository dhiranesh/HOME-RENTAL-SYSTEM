// Script to test API endpoints
const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Helper function to log responses
const logResponse = (title, data) => {
  console.log(`\n======== ${title} ========`);
  console.log(JSON.stringify(data, null, 2));
};

// Test functions
async function login() {
  try {
    console.log('Attempting login...');
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: 'testnew@example.com',
      password: 'password123'
    });
    
    authToken = response.data.token;
    logResponse('LOGIN SUCCESS', response.data);
    return authToken;
  } catch (error) {
    console.error('Login failed:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function createProperty() {
  try {
    const propertyData = {
      title: 'Test Property',
      description: 'A test property created via API',
      type: 'Apartment',
      address: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        country: 'Test Country'
      },
      location: {
        coordinates: [77.00, 28.00]  // [longitude, latitude]
      },
      pricePerNight: 1500,
      bedrooms: 2,
      bathrooms: 1,      area: 1200,
      guests: 4,
      amenities: ['Wifi', 'Parking']
    };
    
    const response = await axios.post(`${API_BASE_URL}/properties`, propertyData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    logResponse('CREATE PROPERTY SUCCESS', response.data);
    return response.data;
  } catch (error) {
    console.error('Create property failed:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function testPropertyEndpoint() {
  try {
    const response = await axios.get(`${API_BASE_URL}/properties-test`);
    logResponse('PROPERTY TEST ENDPOINT', response.data);
    return response.data;
  } catch (error) {
    console.error('Property test endpoint failed:', error.response ? error.response.data : error.message);
    throw error;
  }
}

async function testBasicEndpoint() {
  try {
    const response = await axios.get(`${API_BASE_URL}/test`);
    logResponse('BASIC TEST ENDPOINT', response.data);
    return response.data;
  } catch (error) {
    console.error('Basic test endpoint failed:', error.response ? error.response.data : error.message);
    throw error;
  }
}

// Main execution
async function runTests() {
  try {
    await login();
    await createProperty();
    try { await testPropertyEndpoint(); } catch (e) { /* Ignore errors */ }
    try { await testBasicEndpoint(); } catch (e) { /* Ignore errors */ }
    
    console.log('\n======== ALL TESTS COMPLETED ========');
  } catch (error) {
    console.error('Test execution failed:', error);
  }
}

runTests();
