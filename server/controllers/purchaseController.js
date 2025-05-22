const Purchase = require('../models/Purchase');
const Property = require('../models/Property');

// POST /api/purchases
exports.createPurchase = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });
    const purchase = new Purchase({ property: propertyId, user: req.user._id });
    await purchase.save();
    res.status(201).json(purchase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/purchases/my
exports.getMyPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ user: req.user._id }).populate('property');
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/purchases/:id
exports.cancelPurchase = async (req, res) => {
  try {
    const purchase = await Purchase.findOne({ _id: req.params.id, user: req.user._id });
    if (!purchase) return res.status(404).json({ message: 'Purchase not found' });
    await Purchase.deleteOne({ _id: req.params.id });
    res.json({ message: 'Purchase cancelled' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
