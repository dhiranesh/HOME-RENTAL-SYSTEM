const mongoose = require('mongoose');

// Booking model
const bookingSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Booking must belong to a property'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must belong to a user'],
  },
  owner: { // Denormalized owner of the property for easier access control/querying
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Booking must have a property owner specified']
  },
  startDate: {
    type: Date,
    required: [true, 'Please provide a start date for the booking'],
  },
  endDate: {
    type: Date,
    required: [true, 'Please provide an end date for the booking'],
  },
  guests: {
    type: Number,
    required: [true, 'Please specify the number of guests'],
    min: [1, 'Number of guests must be at least 1'],
  },
  totalPrice: {
    type: Number,
    required: [true, 'Total price for the booking is required'],
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed', 'Rejected'],
    default: 'Pending',
  },
  paymentInfo: {
    id: String, // e.g., Stripe payment intent ID
    status: String,
  },
}, {
  timestamps: true,
});

// Validate that endDate is after startDate
bookingSchema.pre('save', function (next) {
  if (this.endDate <= this.startDate) {
    next(new Error('End date must be after start date'));
  } else {
    next();
  }
});

// Index for querying bookings by property and user
bookingSchema.index({ property: 1, user: 1 });
bookingSchema.index({ startDate: 1, endDate: 1 }); // For checking date overlaps
bookingSchema.index({ owner: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
