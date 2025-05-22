require('dotenv').config(); // Load environment variables from .env file in the current directory
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Initialize Express app
const app = express();

// Connect to Database
connectDB().catch(err => {
  console.error('Database connection failed:', err.message);
  console.log('Continuing without database connection...');
});

// Middleware
app.use(cors({
    origin: '*', // Allow all origins temporarily for debugging
    credentials: true // Allow cookies to be sent
}));
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for URL-encoded data
app.use(cookieParser()); // Parse cookies

// Logging middleware (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Hard-coded endpoints for testing BEFORE any router mounting
app.get('/api/hard-coded-test', (req, res) => {
  res.json({ message: 'Hard-coded test endpoint is working!', date: new Date().toISOString() });
});

app.get('/api/bookings/hard-test', (req, res) => {
  res.json({ message: 'Hard-coded bookings test endpoint is working!', date: new Date().toISOString() });
});

// API Routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const propertyRoutes = require('./routes/propertyRoutes'); // Corrected property routes
const bookingRoutes = require('./routes/bookingRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

// Directly create router for purchases to avoid module loading issues
const purchaseRoutes = express.Router();
const { protect } = require('./middleware/authMiddleware');
const purchaseController = require('./controllers/purchaseController');

// Set up purchase routes directly
purchaseRoutes.post('/', protect, purchaseController.createPurchase);
purchaseRoutes.get('/my', protect, purchaseController.getMyPurchases);
purchaseRoutes.delete('/:id', protect, purchaseController.cancelPurchase);
purchaseRoutes.get('/test', (req, res) => {
  res.json({ message: 'Purchase routes test working!' });
});

// Direct API routes for testing
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working correctly!' });
});

// Direct booking test route for debugging
app.get('/api/booking-test-direct', (req, res) => {
  res.json({ message: 'Direct booking test route is working!' });
});

// Direct my-bookings test route for debugging
app.get('/api/my-bookings-test', (req, res) => {
  res.json({ message: 'My bookings test route is working!', bookings: [] });
});

// Fallback properties endpoint for testing
app.get('/api/properties-test', (req, res) => {
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

// API Routes - wrapped in try/catch for safety
try {
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/properties', propertyRoutes); // Use the correct property routes
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/reviews', reviewRoutes); // Standalone review routes
  app.use('/api/purchases', purchaseRoutes); // Using purchases.js
  
  // Direct override for my-bookings testing
  app.get('/api/bookings/my-bookings', (req, res) => {
    res.json({ 
      message: 'Direct my-bookings test endpoint working',
      date: new Date().toISOString(),
      bookings: [] 
    });
  });
} catch (error) {
  console.error('Error setting up API routes:', error);
}

// Simplified route handling based on environment
if (process.env.NODE_ENV === 'production') {
    // Set static folder for production
    app.use(express.static(path.join(__dirname, '../client/build')));

    // All non-API routes serve React frontend in production
    app.get('*', (req, res, next) => {
      // Only handle non-API routes with the frontend
      if (!req.url.startsWith('/api/')) {
        return res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
      }
      next();
    });
} else {
    app.get('/', (req, res) => {
        res.send('API is running...');
    });
}

// Error Handling Middleware (should be last)
app.use(notFound); // Handle 404 errors
app.use(errorHandler); // Handle all other errors

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
