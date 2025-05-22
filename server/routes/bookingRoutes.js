const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getBookingById,
    updateBookingStatus, // For owner/admin to confirm/cancel
    cancelMyBooking,     // For user to cancel their own pending booking
    getBookingsForProperty, // For property owner
    getAllBookingsAdmin    // For admin
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

// IMPORTANT: Order of routes matters - put specific routes first!
// Debug routes first (no auth)
router.get('/debug', (req, res) => {
    res.json({ message: 'Booking routes debug endpoint is working!' });
});

// Simple test route for my-bookings without auth
router.get('/my-bookings-test', (req, res) => {
    res.json({ message: 'My bookings test endpoint is working!', bookings: [] });
});

// Authenticated user routes
router.post('/', protect, createBooking);

// IMPORTANT: Keep this route handler last if other routes have overlapping path patterns
router.get('/my-bookings', protect, function(req, res) {
    console.log('Direct my-bookings handler called');
    res.json({ 
        message: 'Direct handler working', 
        date: new Date().toISOString(),
        bookings: []
    });
});
router.get('/:id', protect, getBookingById); // User can get their own, owner/admin can get any
router.put('/:id/cancel', protect, cancelMyBooking); // User cancels their own booking

// Property owner / Admin routes
router.get('/property/:propertyId', protect, getBookingsForProperty); // Owner sees bookings for their property
router.put('/:id/status', protect, updateBookingStatus); // Owner/Admin updates status (e.g., confirm, reject)

// Admin specific routes
router.get('/', protect, authorize(['admin']), getAllBookingsAdmin);

module.exports = router;
