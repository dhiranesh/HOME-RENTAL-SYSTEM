import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getPropertyById } from '../api/property';
import { getPropertyReviews, addReview } from '../api/review';
import { createBooking } from '../api/booking';
import { createPurchase, getMyPurchases, cancelPurchase } from '../api/purchase';
import ReviewList from '../components/ReviewList';
import axios from 'axios';

// Placeholder for image carousel or gallery if you have multiple images
const ImageGallery = ({ images, image }) => {
  // Handle both old schema (images array) and new schema (single image string)
  if (image) {
    // New schema - single image URL
    return <img src={image} alt="Property" className="w-full h-64 object-cover rounded-lg shadow-lg mb-6" />;
  } else if (images && images.length > 0) {
    // Old schema - array of images
    return <img src={images[0].url || images[0] || 'https://via.placeholder.com/800x400?text=Property+Image'} 
                alt="Property" className="w-full h-64 object-cover rounded-lg shadow-lg mb-6" />;
  } else {
    // No images available
    return <div className="bg-gray-200 h-64 w-full flex items-center justify-center text-gray-500 rounded">No Image Available</div>;
  }
};

const PropertyDetailPage = () => {
  const { id: propertyId } = useParams(); // Changed to destructure 'id' as 'propertyId'
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [property, setProperty] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // For new review
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);

  // For booking
  const [selectedDates, setSelectedDates] = useState({ startDate: null, endDate: null });
  const [bookingError, setBookingError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Add buy state
  const [isBought, setIsBought] = useState(false);

  useEffect(() => {
  // Check if this property is already bought by the user
    const checkBought = async () => {
      if (!isAuthenticated) return;
      try {
        const purchases = await getMyPurchases();
        const found = purchases.find(p => p.property._id === property._id);
        setIsBought(!!found);
      } catch (error) {
        console.error('Error checking if property is bought:', error);
      }
    };
    if (property && property._id) checkBought();
  }, [property, isAuthenticated]);

  const handleBuy = async () => {
    try {
      await createPurchase(property._id);
      setIsBought(true);
    } catch (err) {
      alert('Failed to buy property: ' + (err.response?.data?.message || err.message));
    }
  };
  
  const handleCancelBuy = async () => {
    try {
      const purchases = await getMyPurchases();
      const purchase = purchases.find(p => p.property._id === property._id);
      if (purchase) {
        await cancelPurchase(purchase._id);
        setIsBought(false);
      }
    } catch (err) {
      alert('Failed to cancel purchase: ' + (err.response?.data?.message || err.message));
    }
  };

  console.log('PropertyDetailPage: propertyId from useParams:', JSON.stringify(propertyId));

  useEffect(() => {
    console.log('PropertyDetailPage: propertyId in useEffect for fetch:', JSON.stringify(propertyId));
    const fetchPropertyAndReviews = async () => {
      setLoading(true);
      setError('');
      try {
        console.log('Attempting to fetch property with ID:', propertyId); // Log just before the API call
        const propertyData = await getPropertyById(propertyId);
        setProperty(propertyData); 
        
        if (propertyData) {
          console.log('Property data fetched, attempting to fetch reviews for ID:', propertyId); // Log before fetching reviews
          const reviewsData = await getPropertyReviews(propertyId);
          setReviews(reviewsData || []);
        } else {
          console.log('Property data was null or undefined after fetch.');
        }
      } catch (err) {
        console.error('Failed to fetch property details or reviews:', err);
        setError(err.message || 'Could not load property details.');
      }
      setLoading(false);
    };

    if (propertyId) { // Only fetch if propertyId is present
      fetchPropertyAndReviews();
    } else {
      console.log('PropertyId is missing, not fetching data.');
      setLoading(false); // Stop loading if no ID
      setError('Property ID is missing.'); // Optionally set an error
    }
  }, [propertyId]); // Dependency array
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setReviewError('Please log in to submit a review.');
      return;
    }
    if (rating === 0 || !comment.trim()) {
      setReviewError('Please provide a rating and a comment.');
      return;
    }
    setReviewLoading(true);
    setReviewError('');
    try {
      // Use normalized property ID
      if (!normalizedProperty || !normalizedProperty.id) {
        setReviewError('Property details not available to submit review.');
        setReviewLoading(false);
        return;
      }
      const newReview = await addReview(normalizedProperty.id, { rating, comment }, token);
      setReviews([newReview, ...reviews]); // Add new review to the top
      setRating(0);
      setComment('');
    } catch (err) {
      console.error('Failed to submit review:', err);
      setReviewError(err.message || 'Could not submit review.');
    }
    setReviewLoading(false);
  };

  // const handleDateSelect = (date) => {
  //   // This is a simplified date selection for a single date.
  //   // For a range, BookingCalendar would need to handle `select` event and pass startDate & endDate.
  //   // For now, let's assume we are selecting a start date and booking for a fixed number of nights or user inputs end date.
  //   // This needs to be more robust for actual start/end date selection.
  //   console.log('Date selected:', date);
  //   setSelectedDates({ startDate: date, endDate: null }); // Placeholder, adapt based on BookingCalendar
  //   setBookingError('');
  //   setBookingSuccess(false);
  // };
  // const handleBookingSubmit = async () => {
  //   if (!isAuthenticated) {
  //     setBookingError('Please log in to book this property.');
  //     return;
  //   }
  //   if (!selectedDates.startDate) { // Add check for endDate if using range
  //     setBookingError('Please select a booking date/range.');
  //     return;
  //   }
  //   // Use normalized property data
  //   if (!normalizedProperty || typeof normalizedProperty.price === 'undefined') {
  //       setBookingError('Property details or price not available for booking.');
  //       return;
  //   }
  //   setBookingLoading(true);
  //   setBookingError('');
  //   setBookingSuccess(false);

  //   const bookingStartDate = new Date(selectedDates.startDate);
  //   const bookingEndDate = new Date(bookingStartDate);
  //   bookingEndDate.setDate(bookingStartDate.getDate() + 3); // Booking for 3 nights

  //   const bookingData = {
  //     propertyId: normalizedProperty.id, // Use normalized ID
  //     startDate: bookingStartDate.toISOString().split('T')[0],
  //     endDate: bookingEndDate.toISOString().split('T')[0],
  //     totalPrice: normalizedProperty.price * 3, // Use normalized price
  //   };

  //   try {
  //     await createBooking(bookingData, token);
  //     setBookingSuccess(true);
  //     setSelectedDates({ startDate: null, endDate: null });
  //   } catch (err) {
  //     console.error('Failed to create booking:', err);
  //     setBookingError(err.message || 'Could not complete booking. The property might not be available for the selected dates.');
  //   }
  //   setBookingLoading(false);
  // };

  // Simulate buy/cancel logic (replace with real API in production)
  // const handleBuy = () => {
  //   setIsBought(true);
  // };
  // const handleCancelBuy = () => {
  //   setIsBought(false);
  // };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">Loading property details...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (!property) {
    return <div className="container mx-auto p-4 text-center">Property not found or failed to load.</div>;
  }
  // Normalize property data to handle both old and new schema
  const normalizedProperty = {
    id: property._id,
    title: property.name || property.title || 'Unnamed Property',
    description: property.description || 'No description available.',
    location: property.location || 
      (property.address ? `${property.address.city}, ${property.address.country}` : 'Location not specified'),
    price: property.price || property.pricePerNight || 0,    imageUrl: property.image || 
      (property.images && property.images.length > 0 ? 
        (property.images[0].url || property.images[0]) : 
        'https://placehold.co/800x400/EFEFEF/999999?text=Property+Image'),
    type: property.type || 'Not specified',
    bedrooms: property.bedrooms !== undefined ? property.bedrooms : 'N/A',
    bathrooms: property.bathrooms !== undefined ? property.bathrooms : 'N/A',
    area: property.area !== undefined ? property.area : null,
    guests: property.guests !== undefined ? property.guests : null,
    amenities: property.amenities || [],
    owner: property.owner || null
  };
  
  console.log('Normalized property:', normalizedProperty);

  return (
    <div className="container mx-auto p-4">
      <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-indigo-600 hover:text-indigo-800 mb-4 inline-block">&larr; Back</Link>
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <img src={normalizedProperty.imageUrl} alt={normalizedProperty.title} className="w-full h-auto md:h-96 object-cover rounded-t-lg shadow-lg mb-6" />
        <div className="p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{normalizedProperty.title}</h1>
          <p className="text-gray-600 text-lg mb-4">{normalizedProperty.location}</p>
          
          <div className="mb-6 pb-6 border-b">
            <h2 className="text-2xl font-semibold text-gray-700 mb-3">About this property</h2>
            <p className="text-gray-700 whitespace-pre-line">{normalizedProperty.description}</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div><span className="font-semibold">Type:</span> {normalizedProperty.type}</div>
              <div><span className="font-semibold">Price:</span> ${normalizedProperty.price}/night</div>
              <div><span className="font-semibold">Bedrooms:</span> {normalizedProperty.bedrooms}</div>
              <div><span className="font-semibold">Bathrooms:</span> {normalizedProperty.bathrooms}</div>
              {normalizedProperty.area && <div><span className="font-semibold">Area:</span> {normalizedProperty.area} sq ft</div>}
              {normalizedProperty.guests && <div><span className="font-semibold">Max Guests:</span> {normalizedProperty.guests}</div>}
            </div>
          </div>          {normalizedProperty.amenities && normalizedProperty.amenities.length > 0 && (
            <div className="mb-6 pb-6 border-b">
              <h2 className="text-2xl font-semibold text-gray-700 mb-3">Amenities</h2>
              <ul className="list-disc list-inside grid grid-cols-2 md:grid-cols-3 gap-2 text-gray-700">
                {normalizedProperty.amenities.map((amenity, index) => <li key={index}>{amenity}</li>)}
              </ul>
            </div>
          )}          {/* Booking Section */}
          {isAuthenticated && normalizedProperty.owner && user && normalizedProperty.owner !== user._id && (
            <div className="mb-6 p-6 bg-gray-50 rounded-lg shadow">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Book this Property</h2>
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={() => navigate(`/booking/${property._id}`)}
              >
                Book Now
              </button>
            </div>
          )}
          {!isAuthenticated && (
             <div className="mb-6 p-6 bg-gray-100 rounded-lg text-center">
                <p className="text-gray-700">Please <Link to={`/login?redirect=/properties/${propertyId}`} className="text-indigo-600 hover:underline">login</Link> or <Link to={`/register?redirect=/properties/${propertyId}`} className="text-indigo-600 hover:underline">register</Link> to book this property or leave a review.</p>
            </div>
          )}          {isAuthenticated && normalizedProperty.owner?._id === user?._id && (
            <div className="mb-6 p-4 bg-blue-100 text-blue-700 rounded-lg">
              <p>This is your property. You cannot book it. <Link to={`/listings/edit/${propertyId}`} className="font-semibold hover:underline">Edit Listing</Link></p>
            </div>
          )}          {/* Reviews Section */}
          {property && (
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">Reviews ({reviews.length})</h2>
              {isAuthenticated && property.owner?._id !== user?._id && (
                <form onSubmit={handleReviewSubmit} className="mb-6 p-4 bg-gray-50 rounded-lg shadow">
                  <h3 className="text-xl font-semibold mb-2">Leave a Review</h3>
                  {reviewError && <p className="text-red-500 text-sm mb-2">{reviewError}</p>}
                  <div className="mb-3">
                    <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
                    <select 
                      id="rating" 
                      value={rating} 
                      onChange={(e) => setRating(Number(e.target.value))} 
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="0" disabled>Select a rating</option>
                      <option value="1">1 - Poor</option>
                      <option value="2">2 - Fair</option>
                      <option value="3">3 - Good</option>
                      <option value="4">4 - Very Good</option>
                      <option value="5">5 - Excellent</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
                    <textarea 
                      id="comment" 
                      rows="3" 
                      value={comment} 
                      onChange={(e) => setComment(e.target.value)} 
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Share your experience..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={reviewLoading}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                  >
                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              )}
              <ReviewList reviews={reviews} />
              {reviews.length === 0 && <p className="text-gray-600">No reviews yet for this property.</p>}
            </div>
          )}          {/* Property Owner Info - Basic */}
          {normalizedProperty.owner && (
            <div className="pt-6 border-t">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">Hosted by {normalizedProperty.owner.name || 'Owner'}</h2>
              {/* Add more owner details or link to owner profile if available */}
              {/* <p className="text-gray-600">Member since {new Date(normalizedProperty.owner.createdAt).toLocaleDateString()}</p> */}
            </div>
          )}
          {/* Buy/Cancel Section */}
          {isAuthenticated && !isBought && (
            <div className="mb-6 p-6 bg-green-50 rounded-lg shadow flex flex-col items-center">
              <button
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline mb-2"
                onClick={handleBuy}
              >
                Buy Now
              </button>
            </div>
          )}
          {isAuthenticated && isBought && (
            <div className="mb-6 p-6 bg-yellow-50 rounded-lg shadow flex flex-col items-center">
              <div className="mb-2 text-green-700 font-semibold">You have bought this property!</div>
              <button
                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleCancelBuy}
              >
                Cancel Purchase
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
