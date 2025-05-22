const User = require('../models/User');
const Property = require('../models/Property');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const asyncHandler = require('express-async-handler');
const { cloudinaryUploadImg, cloudinaryDeleteImg } = require('../config/cloudinary');
const fs = require('fs');

// @desc    Get user profile (current user)
// @route   GET /api/users/profile
// @access  Private
exports.getUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
        .select('-password')
        .populate('listings', 'title type images location pricePerNight rating numReviews')
        .populate({
            path: 'bookings',
            select: 'property startDate endDate totalPrice status',
            populate: { path: 'property', select: 'title images location' }
        })
        .populate({
            path: 'reviews',
            select: 'property rating comment createdAt',
            populate: { path: 'property', select: 'title images' }
        });

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user profile (current user)
// @route   PUT /api/users/profile
// @access  Private
exports.updateUserProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email; // Consider email verification if changed
    if (req.body.password) {
        user.password = req.body.password; // Hashing is handled by pre-save hook
    }

    // Handle avatar upload
    if (req.file) { // Assuming single file upload with field name 'avatar'
        try {
            // Delete old avatar if it exists and is a Cloudinary URL
            if (user.avatar && user.avatar.startsWith('http://res.cloudinary.com')) {
                const parts = user.avatar.split('/');
                const publicIdWithExtension = parts.slice(parts.indexOf('upload') + 2).join('/');
                const publicId = publicIdWithExtension.substring(0, publicIdWithExtension.lastIndexOf('.'));
                if (publicId) {
                    await cloudinaryDeleteImg(publicId);
                }
            }

            const { path } = req.file;
            const newAvatar = await cloudinaryUploadImg(path, 'user_avatars'); // 'user_avatars' folder
            user.avatar = newAvatar.url;
            fs.unlinkSync(path); // Remove temp file
        } catch (error) {
            res.status(500);
            throw new Error('Image upload failed: ' + error.message);
        }
    }

    const updatedUser = await user.save();

    res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        token: req.body.password ? undefined : req.headers.authorization.split(' ')[1], // Send existing token if password not changed
        // If password changed, client should ideally re-login or token should be re-issued if session needs to persist with new credentials immediately.
        // For simplicity, we don't re-issue token here on password change alone.
    });
});

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
});

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
        .select('-password')
        .populate('listings', 'title type images location pricePerNight rating numReviews')
        .populate({
            path: 'bookings',
            select: 'property startDate endDate totalPrice status',
            populate: { path: 'property', select: 'title images location' }
        })
        .populate({
            path: 'reviews',
            select: 'property rating comment createdAt',
            populate: { path: 'property', select: 'title images' }
        });

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user (Admin only)
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = asyncHandler(async (req, res) => {
    // Placeholder implementation
    res.status(501).json({ message: 'Not Implemented: updateUser' });
});

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = asyncHandler(async (req, res) => {
    // Placeholder implementation
    res.status(501).json({ message: 'Not Implemented: deleteUser' });
});

// @desc    Upload user avatar
// @route   POST /api/users/profile/avatar
// @access  Private
exports.uploadUserAvatar = asyncHandler(async (req, res) => {
    // Placeholder implementation
    res.status(501).json({ message: 'Not Implemented: uploadUserAvatar' });
});

// @desc    Delete user avatar
// @route   DELETE /api/users/profile/avatar
// @access  Private
exports.deleteUserAvatar = asyncHandler(async (req, res) => {
    // Placeholder implementation
    res.status(501).json({ message: 'Not Implemented: deleteUserAvatar' });
});

// Ensure all functions are exported if not already
module.exports = {
    getUserProfile: exports.getUserProfile,
    updateUserProfile: exports.updateUserProfile,
    getAllUsers: exports.getAllUsers,
    getUserById: exports.getUserById,
    updateUser: exports.updateUser,
    deleteUser: exports.deleteUser,
    uploadUserAvatar: exports.uploadUserAvatar,
    deleteUserAvatar: exports.deleteUserAvatar,
    // Add any other functions that might be defined in this file but not yet exported
};
