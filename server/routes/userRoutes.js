const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    uploadUserAvatar,
    deleteUserAvatar,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Protected routes for logged-in user's own profile
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/profile/avatar')
    .post(protect, uploadUserAvatar) // Upload or replace avatar
    .delete(protect, deleteUserAvatar); // Delete avatar

// Admin routes - protected and authorized for 'admin' role
router.route('/')
    .get(protect, authorize(['admin']), getAllUsers);

router.route('/:id')
    .get(protect, authorize(['admin']), getUserById)
    .put(protect, authorize(['admin']), updateUser) // Admin can update any user
    .delete(protect, authorize(['admin']), deleteUser); // Admin can delete any user

module.exports = router;
