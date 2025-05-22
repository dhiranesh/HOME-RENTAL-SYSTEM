const express = require('express');
const router = express.Router();
const Property = require('../models/Property');

// GET all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find();
    res.status(200).json(properties);
  } catch (err) {
    console.error('Error fetching properties:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// POST a new property
router.post('/', async (req, res) => {
  try {
    const {
      name,
      location,
      price,
      type,
      bedrooms,
      bathrooms,
      area,
      description,
      image
    } = req.body;

    const newProperty = new Property({
      name,
      location,
      price,
      type,
      bedrooms,
      bathrooms,
      area,
      description,
      image
    });

    const savedProperty = await newProperty.save();
    res.status(201).json(savedProperty);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;