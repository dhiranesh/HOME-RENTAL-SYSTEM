const mongoose = require('mongoose');

// Review model
const reviewSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Review must belong to a property'],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Review must be from a user'],
  },
  booking: { // Optional: Link review to a specific booking for verification
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating must be at most 5'],
  },
  comment: {
    type: String,
    required: [true, 'Please provide a comment'],
    trim: true,
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
}, {
  timestamps: true,
});

// Prevent a user from reviewing the same property multiple times (unless tied to different bookings, if that logic is desired)
// If a user can review a property only once, regardless of bookings:
reviewSchema.index({ property: 1, user: 1 }, { unique: true });

// If a user can review after each booking (more complex, might need to adjust unique index or add other logic):
// reviewSchema.index({ property: 1, user: 1, booking: 1 }, { unique: true });

// Static method to calculate average rating for a property
reviewSchema.statics.calculateAverageRating = async function(propertyId) {
    const obj = await this.aggregate([
        {
            $match: { property: propertyId }
        },
        {
            $group: {
                _id: '$property',
                averageRating: { $avg: '$rating' },
                numReviews: { $sum: 1 }
            }
        }
    ]);

    try {
        await mongoose.model('Property').findByIdAndUpdate(propertyId, {
            rating: obj[0] ? Math.round(obj[0].averageRating * 10) / 10 : 0, // Round to one decimal place
            numReviews: obj[0] ? obj[0].numReviews : 0
        });
    } catch (err) {
        console.error(err);
    }
};

// Call calculateAverageRating after save
reviewSchema.post('save', function() {
    this.constructor.calculateAverageRating(this.property);
});

// Call calculateAverageRating before remove (or after, depending on Mongoose version and hook availability for delete operations)
// Using a pre-hook for findOneAndRemove, findOneAndDelete, etc.
reviewSchema.pre(/^findOneAnd/, async function(next) {
    // `this` is the query object. We need to get the document to access its fields.
    // Store the document on the query object so we can access it in the post hook.
    this.docToUpdate = await this.model.findOne(this.getQuery());
    next();
});

reviewSchema.post(/^findOneAnd/, async function() {
    // this.docToUpdate might be null if the document wasn't found.
    if (this.docToUpdate) {
        // Access the constructor from the docToUpdate to call the static method.
        await this.docToUpdate.constructor.calculateAverageRating(this.docToUpdate.property);
    }
});


module.exports = mongoose.model('Review', reviewSchema);
