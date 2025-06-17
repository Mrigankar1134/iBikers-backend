const mongoose = require('mongoose');

const BikeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
  },
  locations: [{
    type: String,
    required: true
  }],
  pricing: {
    hourly: {
      type: Number,
      required: true
    },
    halfDay: {
      type: Number,
      required: true
    },
    fullDay: {
      type: Number,
      required: true
    }
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  // No additional features needed
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Bike', BikeSchema);