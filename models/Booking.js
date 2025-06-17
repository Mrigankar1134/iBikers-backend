const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  duration: {
    type: String,
    enum: ['hourly', 'fullDay'],
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  pickupLocation: {
    type: String,
    required: true
  },
  bikeName: {
    type: String,
    required: true
  },
  // License information is not stored in the database
  // Only sent via email
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Booking', BookingSchema);