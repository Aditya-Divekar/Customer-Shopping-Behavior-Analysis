const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid mobile number']
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  eventType: {
    type: String,
    required: [true, 'Event type is required'],
    enum: ['Wedding', 'Birthday Party', 'Conference', 'Seminar', 'Sports Entertainment', 'Venue Rental', 'Catering', 'Decorations', 'Webinar', 'Photography', 'Videography', 'Cake', 'Networking Event', 'Other'],
    default: 'Other'
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required'],
    validate: {
      validator: function(date) {
        return date >= new Date();
      },
      message: 'Event date must be in the future'
    }
  },
  venue: {
    type: String,
    required: [true, 'Venue is required'],
    trim: true,
    maxlength: [200, 'Venue cannot exceed 200 characters']
  },
  guestCount: {
    type: Number,
    min: [1, 'Guest count must be at least 1'],
    max: [10000, 'Guest count cannot exceed 10000']
  },
  budget: {
    type: String,
    trim: true
  },
  additionalInfo: {
    type: String,
    trim: true,
    maxlength: [1000, 'Additional information cannot exceed 1000 characters']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  notes: [{
    content: String,
    createdAt: { type: Date, default: Date.now },
    createdBy: String
  }],
  images: [{
    filename: String,
    originalName: String,
    path: String,
    uploadedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Index for better query performance
eventSchema.index({ eventDate: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ eventType: 1 });

module.exports = mongoose.model('Event', eventSchema);
