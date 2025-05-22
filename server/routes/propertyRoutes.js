const express = require('express');
const router = express.Router();
const {
    createProperty,
    getAllProperties,
    getPropertyById,
    updateProperty,
    deleteProperty,
    uploadPropertyImages,
    deletePropertyImage,
    getPropertiesByUser,
    getPropertiesByLocation
} = require('../controllers/propertyController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllProperties);
// Important: Route order matters - specific routes must come before parameter routes
router.get('/location', getPropertiesByLocation); // e.g., /location?lat=xx&lng=yy&distance=zz
router.get('/my-listings', protect, getPropertiesByUser); // Get properties listed by logged-in user

// This must come last - it's a parameter route that would match any other path
router.get('/:id', getPropertyById);

// Protected routes for authenticated users
router.post('/', protect, createProperty);

// Protected and authorized routes (e.g., only owner or admin can modify/delete)
router.put('/:id', protect, updateProperty); // Add specific authorization in controller
router.delete('/:id', protect, deleteProperty); // Add specific authorization in controller

// Image management routes
router.put('/:id/images', protect, uploadPropertyImages); // Add specific authorization in controller
router.delete('/:id/images/:imageId', protect, deletePropertyImage); // Add specific authorization in controller

module.exports = router;
