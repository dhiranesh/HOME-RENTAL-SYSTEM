const express = require('express');
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Booking routes test endpoint is working!' });
});

router.get('/my-bookings-test', (req, res) => {
  res.json({ message: 'My bookings test endpoint is working!' });
});

module.exports = router;
