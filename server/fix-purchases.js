const express = require('express');
const app = express();

// Direct test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test route working!' });
});

// Set up purchases routes
const router = express.Router();

router.get('/test', (req, res) => {
  res.json({ message: 'Purchases test route working!' });
});

app.use('/api/purchases', router);

app.listen(5001, () => {
  console.log('Test server running on port 5001');
});
