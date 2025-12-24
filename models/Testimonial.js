const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
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
    enum: ['Wedding', 'Birthday Party', 'Conference', 'Seminar', 'Sports Entertainment', 'Venue Rental', 'Catering', 'Decorations', 'Webinar', 'Photography', 'Videography', 'Cake', 'Networking Event', 'Other']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  testimonial: {
    type: String,
    required: [true, 'Testimonial is required'],
    trim: true,
    maxlength: [1000, 'Testimonial cannot exceed 1000 characters']
  },
  eventDate: {
    type: Date,
    required: [true, 'Event date is required']
  },
  images: [{
    filename: String,
    originalName: String,
    path: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  isApproved: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Index for better query performance
testimonialSchema.index({ isApproved: 1, isFeatured: 1 });
testimonialSchema.index({ rating: -1 });
testimonialSchema.index({ eventDate: -1 });

module.exports = mongoose.model('Testimonial', testimonialSchema);
