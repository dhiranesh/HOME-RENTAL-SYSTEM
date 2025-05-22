// Server entry point for development mode only
require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

// Hard-code Cloudinary config to ensure it works
const { v2: cloudinary } = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'dt0tpza9e', 
  api_key: '296186776295691', 
  api_secret: 'SxdNiXzQxpfMBoi_8zuyfBz6y4k',
  secure: true
});

// Set environment variables
process.env.NODE_ENV = 'development';

// Connect to Database
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Initialize Express app
const app = express();

// Wrap in try/catch so server starts even if database connection fails
try {
  connectDB();
} catch (error) {
  console.error('Database connection failed:', error.message);
  console.log('Starting server without database connection...');
}

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://172.20.10.2:3000'], // Allow requests from both localhost and IP address
  credentials: true // Allow cookies to be sent
}));
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data
app.use(cookieParser()); // Parse cookies

// Logging middleware in development
app.use(morgan('dev'));

// Test route to verify API is working
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working correctly!' });
});

// Test route to verify Cloudinary configuration
app.get('/api/cloudinary-test', (req, res) => {
  try {
    // Test Cloudinary by uploading a tiny image
    const testBase64 = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'; // 1x1 transparent GIF
    
    cloudinary.uploader.upload(testBase64, { folder: 'tests', public_id: 'test-ping' }, (error, result) => {
      if (error) {
        return res.status(500).json({ error: 'Cloudinary test upload failed', details: error.message });
      }
      
      res.json({
        success: true,
        message: 'Cloudinary configuration is working',
        testImage: result.secure_url
      });
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Failed to test Cloudinary configuration',
      error: error.message
    });
  }
});

// API Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/reviews', reviewRoutes); // Standalone review routes

// Root route
app.get('/', (req, res) => {
  res.send('API is running in development mode...');
});

// Error Handling Middleware (should be last)
app.use(notFound); // Handle 404 errors
app.use(errorHandler); // Handle all other errors

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
  console.log(`API base URL: http://localhost:${PORT}`);
  console.log(`Cloudinary config: cloud_name=${cloudinary.config().cloud_name}`);
});
