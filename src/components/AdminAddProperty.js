import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AdminAddProperty.css';

const AdminAddProperty = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    type: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    description: '',
    image: '',
    amenities: [],
    status: 'Available'
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // New state for search and listing properties
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch property list on initial render
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axios.get('/api/properties');
        setProperties(response.data);
      } catch (err) {
        console.error('Error fetching properties:', err);
      }
    };
    fetchProperties();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData({ ...formData, amenities: [...formData.amenities, value] });
    } else {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter(amenity => amenity !== value)
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/properties', formData);
      setSuccess('Property added successfully!');
      setError('');
      // Prepend the new property to the list
      setProperties([response.data, ...properties]);
      // ...existing code to reset form state...
      setFormData({
        name: '',
        location: '',
        price: '',
        type: '',
        bedrooms: '',
        bathrooms: '',
        area: '',
        description: '',
        image: '',
        amenities: [],
        status: 'Available'
      });
      setTimeout(() => {
        navigate('/rent-your-place');
      }, 2000);
    } catch (err) {
      setError('Error adding property. Please try again.');
      setSuccess('');
      console.error('Error adding property:', err);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter properties for fast search performance
  const filteredProperties = useMemo(() => {
    return properties.filter(property =>
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [properties, searchTerm]);

  return (
    <div className="rent-your-place-container">
      <h2>Add Your Own Property</h2>
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      <form onSubmit={handleSubmit} className="property-form">
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

        <div className="form-row">
          <div className="form-group">
            <label>Price (per month)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Type</label>
            <select name="type" value={formData.type} onChange={handleChange} required>
              <option value="">Select Type</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Condo">Condo</option>
            </select>
          </div>
        </div>

        <div className="form-row">
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

        <div className="form-group">
          <label>Amenities</label>
          <div className="amenities-checkboxes">
            <label>
              <input type="checkbox" value="Air Conditioning" onChange={handleAmenitiesChange} />
              Air Conditioning
            </label>
            <label>
              <input type="checkbox" value="Parking" onChange={handleAmenitiesChange} />
              Parking
            </label>
            <label>
              <input type="checkbox" value="Swimming Pool" onChange={handleAmenitiesChange} />
              Swimming Pool
            </label>
            <label>
              <input type="checkbox" value="Gym" onChange={handleAmenitiesChange} />
              Gym
            </label>
            <label>
              <input type="checkbox" value="Security" onChange={handleAmenitiesChange} />
              Security
            </label>
            <label>
              <input type="checkbox" value="Balcony" onChange={handleAmenitiesChange} />
              Balcony
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn">Add Property</button>
      </form>

      <hr />

      <div className="property-search">
        <h2>Search Properties</h2>
        <input
          type="text"
          placeholder="Search by name or location..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
      
      <div className="property-list">
        <h2>Property Listings</h2>
        {filteredProperties.length > 0 ? (
          filteredProperties.map(property => (
            <div key={property._id} className="property-card">
              <img src={property.image} alt={property.name} className="property-image" />
              <div className="property-info">
                <h3>{property.name}</h3>
                <p>{property.location}</p>
                <p>${property.price} / month</p>
              </div>
            </div>
          ))
        ) : (
          <p>No properties found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminAddProperty;
