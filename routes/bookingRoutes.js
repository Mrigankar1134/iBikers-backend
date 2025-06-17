const express = require('express');
const router = express.Router();
const multer = require('multer');
const Booking = require('../models/Booking');
const Bike = require('../models/Bike');
const { sendBookingConfirmation } = require('../services/emailService');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Create a new booking with file uploads
router.post('/', upload.fields([
  { name: 'license', maxCount: 1 },
  { name: 'payment', maxCount: 1 }
]), async (req, res) => {
  try {
    const { bikeName, name, phone, date, time, duration, location, totalCost } = req.body;
    
    // No need to check bike availability since we're using bikeName directly
    
    // Check if files were uploaded (required for email but not stored in DB)
    if (!req.files || !req.files.license || !req.files.payment) {
      return res.status(400).json({ message: 'License and payment screenshot are required for verification but will not be stored' });
    }
    
    // Create new booking
    const booking = new Booking({
      name, // Customer name
      phone, // Customer phone number
      startDate: new Date(date + 'T' + time),
      duration,
      totalCost,
      pickupLocation: location,
      bikeName // Bike name instead of ID
      // License image is not stored in the database, only sent via email
    });
    
    // Save the booking directly
    const newBooking = await booking.save();
    
    // Send email with booking details
    try {
      await sendBookingConfirmation(
        { ...req.body, totalCost },
        {
          license: req.files.license[0],
          payment: req.files.payment[0]
        }
      );
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      // Continue with the booking process even if email fails
    }
    
    res.status(201).json(newBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all bookings (no longer filtering by userId since it's not in the schema)
router.get('/all', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update booking status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    booking.status = status;
    
    // If booking is cancelled or completed, make bike available again
    if (status === 'cancelled' || status === 'completed') {
      const bike = await Bike.findById(booking.bikeId);
      if (bike) {
        bike.isAvailable = true;
        await bike.save();
      }
    }
    
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;