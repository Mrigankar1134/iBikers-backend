const express = require('express');
const router = express.Router();
const Bike = require('../models/Bike');

// Get all bikes
router.get('/', async (req, res) => {
  try {
    const bikes = await Bike.find();
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get bike by ID
router.get('/:id', async (req, res) => {
  try {
    const bike = await Bike.findById(req.params.id);
    if (!bike) return res.status(404).json({ message: 'Bike not found' });
    res.json(bike);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Filter bikes by location and availability
router.get('/filter', async (req, res) => {
  try {
    const { location, isAvailable } = req.query;
    const filter = {};
    
    if (location) filter.locations = location;
    if (isAvailable) filter.isAvailable = isAvailable === 'true';
    
    const bikes = await Bike.find(filter);
    res.json(bikes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;