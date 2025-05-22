import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createProperty } from '../api/property'; // Assuming this API function handles image uploads or image URLs

const RentPage = () => {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '', // Changed from title
    description: '',
    type: 'Apartment', // Default type
    location: '', // Changed from address, city, country to single location string
    price: '', // Changed from pricePerNight
    bedrooms: '',
    bathrooms: '',
    area: '', // Added area
    image: '', // Added image for single image URL
    amenities: [],
    guests: '', // Retained guests as it was in original client state
  });
  const [amenityInput, setAmenityInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <p className="text-lg text-gray-700 mb-4">Please <a href='/login' className='text-indigo-600 hover:underline'>log in</a> to list your property.</p>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAmenity = () => {
    if (amenityInput.trim() && !formData.amenities.includes(amenityInput.trim())) {
      setFormData(prev => ({ ...prev, amenities: [...prev.amenities, amenityInput.trim()] }));
      setAmenityInput('');
    }
  };

  const handleRemoveAmenity = (amenityToRemove) => {
    setFormData(prev => ({ 
      ...prev, 
      amenities: prev.amenities.filter(amenity => amenity !== amenityToRemove) 
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    // Basic validation
    if (!formData.name || !formData.description || !formData.type || !formData.location || !formData.price || !formData.bedrooms || !formData.bathrooms || !formData.area || !formData.image) {
      setError('Please fill in all required fields: Name, Description, Type, Location, Price, Bedrooms, Bathrooms, Area, and Image URL.');
      setLoading(false);
      return;
    }

    try {
      const propertyData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        location: formData.location,
        price: Number(formData.price),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        area: Number(formData.area),
        image: formData.image,
        amenities: formData.amenities,
        guests: formData.guests ? Number(formData.guests) : undefined, // Keep optional guests
        owner: user._id, // Attach owner ID
      };

      const newProperty = await createProperty(propertyData, token);
      setSuccess(true);
      setLoading(false);
      // Clear form or redirect
      setTimeout(() => {
        navigate(`/properties/${newProperty._id}`); // Navigate to the new property's detail page
      }, 1500);

    } catch (err) {
      console.error('Failed to create property:', err);
      setError(err.message || 'Could not create property. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center">List Your Property</h1>
      {success && <p className="bg-green-100 text-green-700 p-3 rounded mb-4">Property listed successfully! Redirecting...</p>}
      {error && <p className="bg-red-100 text-red-500 p-3 rounded mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" id="description" rows="4" value={formData.description} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">Property Type</label>
            <select name="type" id="type" value={formData.type} onChange={handleChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500">
              <option>Apartment</option>
              <option>House</option>
              <option>Condo</option>
              <option>Villa</option>
              <option>Cabin</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price ($)</label>
            <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="1" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location (e.g., City, Country or Full Address)</label>
          <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">Bedrooms</label>
            <input type="number" name="bedrooms" id="bedrooms" value={formData.bedrooms} onChange={handleChange} min="0" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">Bathrooms</label>
            <input type="number" name="bathrooms" id="bathrooms" value={formData.bathrooms} onChange={handleChange} min="0" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="area" className="block text-sm font-medium text-gray-700">Area (sq ft)</label>
            <input type="number" name="area" id="area" value={formData.area} onChange={handleChange} min="0" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
          <div>
            <label htmlFor="guests" className="block text-sm font-medium text-gray-700">Max Guests</label>
            <input type="number" name="guests" id="guests" value={formData.guests} onChange={handleChange} min="1" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input type="url" name="image" id="image" value={formData.image} onChange={handleChange} required placeholder="https://example.com/image.jpg" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Amenities</label>
          <div className="flex items-center mt-1">
            <input 
              type="text" 
              value={amenityInput} 
              onChange={(e) => setAmenityInput(e.target.value)} 
              placeholder="e.g., Wifi, Pool, Air Conditioning"
              className="flex-grow border-gray-300 rounded-l-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button type="button" onClick={handleAddAmenity} className="bg-indigo-500 text-white px-4 py-2 rounded-r-md hover:bg-indigo-600">Add</button>
          </div>
          <ul className="mt-2 space-x-2 space-y-2">
            {formData.amenities.map(amenity => (
              <li key={amenity} className="inline-flex items-center bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
                {amenity}
                <button type="button" onClick={() => handleRemoveAmenity(amenity)} className="ml-2 text-red-500 hover:text-red-700">&times;</button>
              </li>
            ))}
          </ul>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          {loading ? 'Submitting Property...' : 'List My Property'}
        </button>
      </form>
    </div>
  );
};

export default RentPage;
