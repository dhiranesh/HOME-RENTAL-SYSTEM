const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams allows us to get :propertyId from parent router
const {
    addReview,
    getPropertyReviews,
    getUserReviews,
    getReviewById,
    updateReview,
    deleteReview,
    getUserReviewsById
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Routes for reviews related to a specific property (e.g., /api/properties/:propertyId/reviews)
// Test route to debug
router.get('/test', (req, res) => {
  res.json({ message: 'Review routes test endpoint working', success: true });
});

// IMPORTANT: Route order matters - specific routes must come before parameter routes
// Route for getting reviews by property ID - MUST come before /:reviewId
router.get('/property/:propertyId', getPropertyReviews);

// Route for getting user-specific reviews - MUST come before /:reviewId
// Get reviews made by the logged-in user
router.get('/user', protect, getUserReviews);
// Get reviews by a specific user ID
router.get('/user/:userId', getUserReviewsById);

// Routes for base property operations
router.route('/')
    .post(protect, addReview) // User must be logged in to add a review
    .get(getPropertyReviews); // Publicly viewable reviews for a property

// Routes for a specific review - Must come last as it has a dynamic parameter
router.route('/:reviewId')
    .get(getReviewById) // Publicly viewable
    .put(protect, updateReview) // User can update their own review
    .delete(protect, deleteReview); // User can delete their own review, or admin

module.exports = router;
