// API Test File for Properties
const axios = require('axios');

async function testPropertiesAPI() {
  try {
    console.log('Fetching properties from API...');
    const response = await axios.get('http://localhost:5000/api/properties');
    console.log('API Response:', JSON.stringify(response.data, null, 2));
    
    // Test data structure
    if (response.data && response.data.properties) {
      console.log('Properties found:', response.data.properties.length);
      console.log('Sample property:', response.data.properties[0]);
    } else {
      console.log('Unexpected response format:', response.data);
    }
  } catch (error) {
    console.error('Error fetching properties:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
  }
}

// Execute the test
testPropertiesAPI();
