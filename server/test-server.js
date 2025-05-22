require('dotenv').config({ path: '../.env' });
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working correctly!' });
});

// Properties test route
app.get('/api/properties', (req, res) => {
  res.json({ 
    properties: [
      { 
        _id: 'test1', 
        title: 'Test Property',
        description: 'A nice test property',
        pricePerNight: 100,
        address: {
          city: 'Test City',
          country: 'Test Country'
        },
        images: ['https://via.placeholder.com/350x150']
      }
    ],
    page: 1,
    pages: 1,
    count: 1
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(Test server running on port );
});