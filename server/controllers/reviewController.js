const Review = require('../models/Review');
const Property = require('../models/Property');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Add a new review to a property
// @route   POST /api/properties/:propertyId/reviews
// @access  Private (Authenticated User who has booked/stayed - further validation might be needed)
exports.addReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const { propertyId } = req.params;
    const userId = req.user._id;

    if (!rating || !comment) {
        res.status(400);
        throw new Error('Rating and comment are required.');
    }

    const property = await Property.findById(propertyId);
    if (!property) {
        res.status(404);
        throw new Error('Property not found.');
    }

    // Check if user has already reviewed this property
    const existingReview = await Review.findOne({ property: propertyId, user: userId });
    if (existingReview) {
        res.status(400);
        throw new Error('You have already reviewed this property.');
    }

    // Optional: Check if the user has actually booked or stayed at the property
    // This would require checking Booking records. For simplicity, this is omitted here,
    // but in a real app, you'd want to verify this to prevent fake reviews.
    // const hasBooked = await Booking.findOne({ property: propertyId, user: userId, status: 'Completed' });
    // if (!hasBooked) {
    //     res.status(403);
    //     throw new Error('You can only review properties you have stayed at.');
    // }

    const review = new Review({
        user: userId,
        property: propertyId,
        rating: Number(rating),
        comment
    });

    const createdReview = await review.save();

    // Add review to property's reviews array
    property.reviews.push(createdReview._id);
    // Recalculate average rating for the property
    const reviewsForProperty = await Review.find({ property: propertyId });
    property.numReviews = reviewsForProperty.length;
    property.rating = reviewsForProperty.reduce((acc, item) => item.rating + acc, 0) / reviewsForProperty.length;
    await property.save();

    // Add review to user's reviews array
    await User.findByIdAndUpdate(userId, { $push: { reviews: createdReview._id } });

    res.status(201).json(createdReview);
});

// @desc    Get all reviews for a property
// @route   GET /api/properties/:propertyId/reviews
// @route   GET /api/reviews/property/:propertyId
// @access  Public
exports.getPropertyReviews = asyncHandler(async (req, res) => {
    const propertyId = req.params.propertyId || req.params.id;
    
    try {
        const reviews = await Review.find({ property: propertyId })
            .populate('user', 'name avatar') // Populate user details for each review
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(404);
        throw new Error(`Reviews not found for property: ${propertyId}`);
    }
});

// @desc    Get all reviews by a user
// @route   GET /api/reviews/myreviews
// @access  Private
exports.getUserReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ user: req.user._id })
        .populate('property', 'title images location') // Populate property details for each review
        .sort({ createdAt: -1 });
    res.json(reviews);
});

// @desc    Get reviews by a specific user ID
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviewsById = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    
    try {
        const reviews = await Review.find({ user: userId })
            .populate('property', 'title images location') // Populate property details for each review
            .sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(404);
        throw new Error(`Reviews not found for user: ${userId}`);
    }
});

// @desc    Get a review by ID
// @route   GET /api/reviews/:reviewId
// @access  Public
exports.getReviewById = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    
    try {
        const review = await Review.findById(reviewId)
            .populate('user', 'name avatar')
            .populate('property', 'title images location');
            
        if (!review) {
            res.status(404);
            throw new Error(`Review not found with id: ${reviewId}`);
        }
        
        res.json(review);
    } catch (error) {
        res.status(404);
        throw new Error(`Review not found with id: ${reviewId}`);
    }
});

// @desc    Update a review
// @route   PUT /api/reviews/:reviewId
// @access  Private (Owner of the review)
exports.updateReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        res.status(404);
        throw new Error('Review not found.');
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to update this review.');
    }

    review.rating = rating !== undefined ? Number(rating) : review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();

    // If rating was updated, recalculate property's average rating
    if (rating !== undefined) {
        const property = await Property.findById(review.property);
        if (property) {
            const reviewsForProperty = await Review.find({ property: review.property });
            property.rating = reviewsForProperty.reduce((acc, item) => item.rating + acc, 0) / reviewsForProperty.length;
            await property.save();
        }
    }

    res.json(updatedReview);
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:reviewId
// @access  Private (Owner of the review or Admin)
exports.deleteReview = asyncHandler(async (req, res) => {
    // Placeholder implementation
    res.status(501).json({ message: 'Not Implemented: deleteReview' });
});

// Ensure all controller functions are exported
module.exports = {
    addReview: exports.addReview,
    getPropertyReviews: exports.getPropertyReviews,
    getUserReviews: exports.getUserReviews,
    getUserReviewsById: exports.getUserReviewsById,
    getReviewById: exports.getReviewById,
    updateReview: exports.updateReview,
    deleteReview: exports.deleteReview,
};
