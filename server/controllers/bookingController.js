const Booking = require('../models/Booking');
const Property = require('../models/Property');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Authenticated User)
exports.createBooking = asyncHandler(async (req, res) => {
    const { propertyId, startDate, endDate, guests, totalPrice } = req.body;
    const userId = req.user._id; // From authMiddleware

    if (!propertyId || !startDate || !endDate || !totalPrice) {
        res.status(400);
        throw new Error('Missing required booking information.');
    }

    const property = await Property.findById(propertyId);
    if (!property) {
        res.status(404);
        throw new Error('Property not found.');
    }

    // Check for booking conflicts (simple overlap check)
    const existingBooking = await Booking.findOne({
        property: propertyId,
        $or: [
            { startDate: { $lt: new Date(endDate), $gte: new Date(startDate) } },
            { endDate: { $gt: new Date(startDate), $lte: new Date(endDate) } },
            { startDate: { $lte: new Date(startDate) }, endDate: { $gte: new Date(endDate) } }
        ],
        status: { $ne: 'Cancelled' } // Don't conflict with cancelled bookings
    });

    if (existingBooking) {
        res.status(409); // Conflict
        throw new Error('Property is already booked for the selected dates.');
    }

    // Check if the user is trying to book their own property (optional rule)
    if (property.owner.toString() === userId.toString()) {
        res.status(403); // Forbidden
        throw new Error('You cannot book your own property.');
    }

    const booking = new Booking({
        user: userId,
        property: propertyId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        guests: guests ? Number(guests) : 1,
        totalPrice: Number(totalPrice),
        status: 'Pending' // Default status, can be 'Confirmed' if no payment step
    });

    const createdBooking = await booking.save();

    // Add booking to user's bookings array
    await User.findByIdAndUpdate(userId, { $push: { bookings: createdBooking._id } });
    // Add booking to property's bookings array
    await Property.findByIdAndUpdate(propertyId, { $push: { bookings: createdBooking._id } });

    res.status(201).json(createdBooking);
});

// Note: This implementation was moved to line ~150 to avoid duplicate exports
// Previously there was a duplicate getMyBookings function here

// @desc    Get a single booking by ID
// @route   GET /api/bookings/:id
// @access  Private (User who booked or Property Owner or Admin)
exports.getBookingById = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id)
        .populate('property', 'title location pricePerNight owner')
        .populate('user', 'name email avatar');

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    // Check authorization: user who booked, property owner, or admin
    const property = await Property.findById(booking.property._id); // Fetch full property to get owner
    if (!property) {
        res.status(404);
        throw new Error('Associated property not found for this booking.');
    }

    if (booking.user._id.toString() !== req.user._id.toString() && 
        property.owner.toString() !== req.user._id.toString() && 
        req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to view this booking');
    }

    res.json(booking);
});

// @desc    Update booking status (e.g., Confirm, Cancel)
// @route   PUT /api/bookings/:id/status
// @access  Private (Property Owner or Admin for Confirm/Reject, User for Cancel)
exports.updateBookingStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id).populate('property', 'owner');

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    const isPropertyOwner = booking.property.owner.toString() === req.user._id.toString();
    const isBookingUser = booking.user.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    // Logic for who can change to what status
    if (status === 'Cancelled') {
        if (!isBookingUser && !isPropertyOwner && !isAdmin) {
            res.status(403);
            throw new Error('Not authorized to cancel this booking.');
        }
        // Potentially add logic here: e.g., users can only cancel if booking is not too close
    } else if (status === 'Confirmed' || status === 'Completed' || status === 'Pending') {
        if (!isPropertyOwner && !isAdmin) {
            res.status(403);
            throw new Error(`Not authorized to change booking status to ${status}.`);
        }
    } else {
        res.status(400);
        throw new Error('Invalid booking status provided.');
    }

    booking.status = status;
    // Could add logic for refunds or notifications here if status changes to Cancelled

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
});

// @desc    Get bookings for the logged-in user
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = asyncHandler(async (req, res) => {
    // Simplified implementation for testing
    console.log('getMyBookings function called - user:', req.user._id);
    
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate('property', 'title images location pricePerNight type')
            .sort({ createdAt: -1 });
        console.log('Found bookings:', bookings.length);
        res.json(bookings);
    } catch (error) {
        console.error('Error in getMyBookings:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

// @desc    Cancel a booking by the user
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelMyBooking = asyncHandler(async (req, res) => {
    // Placeholder implementation
    res.status(501).json({ message: 'Not Implemented: cancelMyBooking' });
});

// @desc    Get bookings for a property (for owner)
// @route   GET /api/bookings/property/:propertyId
// @access  Private
exports.getBookingsForProperty = asyncHandler(async (req, res) => {
    // Placeholder implementation
    res.status(501).json({ message: 'Not Implemented: getBookingsForProperty' });
});

// @desc    Update booking status (for owner/admin)
// @route   PUT /api/bookings/:id/status
// @access  Private
exports.updateBookingStatus = asyncHandler(async (req, res) => {
    // Placeholder implementation
    res.status(501).json({ message: 'Not Implemented: updateBookingStatus' });
});

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookingsAdmin = asyncHandler(async (req, res) => {
    // Placeholder implementation
    res.status(501).json({ message: 'Not Implemented: getAllBookingsAdmin' });
});

// @desc    Delete a booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin only, or specific logic for user/owner)
// Note: Generally, bookings are cancelled rather than hard deleted.
// This is a more destructive action and might be reserved for admins.
exports.deleteBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
        res.status(404);
        throw new Error('Booking not found');
    }

    // Example: Only admin can delete. Or user can delete if booking is 'Cancelled'.
    if (req.user.role !== 'admin') {
        res.status(403);
        throw new Error('Not authorized to delete this booking. Consider cancelling instead.');
    }

    // Remove booking from user's and property's booking arrays
    await User.findByIdAndUpdate(booking.user, { $pull: { bookings: booking._id } });
    await Property.findByIdAndUpdate(booking.property, { $pull: { bookings: booking._id } });

    await booking.remove(); // or booking.deleteOne() for Mongoose v6+

    res.json({ message: 'Booking removed successfully' });
});

// Ensure all controller functions are exported
module.exports = {
    createBooking: exports.createBooking,
    getMyBookings: exports.getMyBookings,
    getBookingById: exports.getBookingById,
    updateBookingStatus: exports.updateBookingStatus,
    cancelMyBooking: exports.cancelMyBooking,
    getBookingsForProperty: exports.getBookingsForProperty,
    getAllBookingsAdmin: exports.getAllBookingsAdmin,
    // Add any other functions that might be defined in this file but not yet exported
};
