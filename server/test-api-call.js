// Simple script to test the properties API endpoint directly
const axios = require('axios');

async function testPropertiesApi() {
  try {
    console.log('Testing GET /api/properties endpoint...');
    console.log('Making request to http://localhost:5000/api/properties');
    const response = await axios.get('http://localhost:5000/api/properties', {
      timeout: 5000 // 5 second timeout
    });
    console.log('Response status:', response.status);
    console.log('Response headers:', response.headers);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
    if (response.data && response.data.properties) {
      console.log(`Successfully retrieved ${response.data.properties.length} properties`);
    } else {
      console.log('No properties array in the response');
    }
  } catch (error) {
    console.error('API call failed:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.data);
      console.error('Status code:', error.response.status);
    }
  }
}

testPropertiesApi();
