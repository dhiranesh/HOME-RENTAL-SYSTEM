const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createPurchase, getMyPurchases, cancelPurchase } = require('../controllers/purchaseController');

router.post('/', protect, createPurchase);
router.get('/my', protect, getMyPurchases);
router.delete('/:id', protect, cancelPurchase);

// Test route to verify purchaseRoutes is loaded
router.get('/test', (req, res) => {
  res.json({ message: 'purchaseRoutes is working!' });
});

module.exports = router;
