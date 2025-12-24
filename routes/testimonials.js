const express = require('express');
const router = express.Router();
const Testimonial = require('../models/Testimonial');

// GET all approved testimonials (public)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, eventType, featured } = req.query;
    
    const filter = { isApproved: true };
    if (eventType) filter.eventType = eventType;
    if (featured === 'true') filter.isFeatured = true;
    
    const testimonials = await Testimonial.find(filter)
      .sort({ isFeatured: -1, rating: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await Testimonial.countDocuments(filter);
    
    res.json({
      success: true,
      data: testimonials,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials',
      error: error.message
    });
  }
});

// GET featured testimonials
router.get('/featured', async (req, res) => {
  try {
    const testimonials = await Testimonial.find({ 
      isApproved: true, 
      isFeatured: true 
    })
    .sort({ rating: -1, createdAt: -1 })
    .limit(6)
    .exec();
    
    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching featured testimonials',
      error: error.message
    });
  }
});

// POST new testimonial
router.post('/', async (req, res) => {
  try {
    const testimonialData = {
      name: req.body.name,
      email: req.body.email,
      eventType: req.body.eventType,
      rating: req.body.rating,
      testimonial: req.body.testimonial,
      eventDate: req.body.eventDate
    };
    
    const testimonial = new Testimonial(testimonialData);
    await testimonial.save();
    
    res.status(201).json({
      success: true,
      message: 'Thank you for your testimonial! It will be reviewed and published soon.',
      data: {
        id: testimonial._id,
        name: testimonial.name,
        rating: testimonial.rating,
        status: 'pending_approval'
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to submit testimonial',
      error: error.message
    });
  }
});

// PUT approve testimonial (admin only)
router.put('/:id/approve', async (req, res) => {
  try {
    const { isApproved, isFeatured } = req.body;
    
    const updateData = {};
    if (isApproved !== undefined) updateData.isApproved = isApproved;
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    
    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating testimonial',
      error: error.message
    });
  }
});

// GET testimonial statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalTestimonials = await Testimonial.countDocuments();
    const approvedTestimonials = await Testimonial.countDocuments({ isApproved: true });
    const pendingTestimonials = await Testimonial.countDocuments({ isApproved: false });
    const featuredTestimonials = await Testimonial.countDocuments({ isFeatured: true });
    
    const averageRating = await Testimonial.aggregate([
      { $match: { isApproved: true } },
      { $group: { _id: null, avgRating: { $avg: '$rating' } } }
    ]);
    
    const ratingDistribution = await Testimonial.aggregate([
      { $match: { isApproved: true } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: -1 } }
    ]);
    
    const eventTypeStats = await Testimonial.aggregate([
      { $match: { isApproved: true } },
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 },
          avgRating: { $avg: '$rating' }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalTestimonials,
        approvedTestimonials,
        pendingTestimonials,
        featuredTestimonials,
        averageRating: averageRating[0]?.avgRating || 0,
        ratingDistribution,
        eventTypeStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonial statistics',
      error: error.message
    });
  }
});

module.exports = router;
