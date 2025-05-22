import React, { useState } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
// ...existing imports...

const RentYourPlace = () => {
  // Added required fields to match the Property model
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    image: ''
  });
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // If using a proxy or an env variable for API URL, adjust accordingly.
      await axios.post('/api/properties', formData);
      setSuccess('Property added successfully!');
      setError('');
      setFormData({
        name: '',
        location: '',
        price: '',
        type: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        description: '',
        image: ''
      });
    } catch (err) {
      console.error('Error response:', err.response?.data || err.message);
      setError('Could not create property. Please try again.');
      setSuccess('');
    }
  };

  return (
    <>
      <Header />
      <Navbar />
      <main>
        {/* ...existing main content... */}
        <section className="add-property-section">
          <h2>Add Your Property</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Property Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            {/* Added missing fields */}
            <div className="form-group">
              <label>Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Property Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="">Select Type</option>
                <option value="Apartment">Apartment</option>
                <option value="House">House</option>
                <option value="Villa">Villa</option>
                <option value="Condo">Condo</option>
              </select>
            </div>
            <div className="form-group">
              <label>Bedrooms</label>
              <input
                type="number"
                name="bedrooms"
                value={formData.bedrooms}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Bathrooms</label>
              <input
                type="number"
                name="bathrooms"
                value={formData.bathrooms}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Area (sq ft)</label>
              <input
                type="number"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>
            <div className="form-group">
              <label>Image URL</label>
              <input
                type="text"
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Add Property</button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default RentYourPlace;
