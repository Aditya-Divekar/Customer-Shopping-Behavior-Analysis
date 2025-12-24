const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// GET all events (admin only in production)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, eventType, sortBy = 'eventDate' } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (eventType) filter.eventType = eventType;
    
    const events = await Event.find(filter)
      .sort({ [sortBy]: 1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await Event.countDocuments(filter);
    
    res.json({
      success: true,
      data: events,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
});

// GET single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      data: event
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
});

// POST new event registration
router.post('/', async (req, res) => {
  try {
    const eventData = {
      name: req.body.name,
      mobile: req.body.mobile,
      email: req.body.email,
      eventType: req.body.eventType || 'Other',
      eventDate: req.body.eventDate,
      venue: req.body.venue,
      guestCount: req.body.guestCount,
      budget: req.body.budget,
      additionalInfo: req.body.additionalInfo
    };
    
    const event = new Event(eventData);
    await event.save();
    
    res.status(201).json({
      success: true,
      message: 'Event registration successful! We will contact you soon.',
      data: {
        id: event._id,
        name: event.name,
        eventType: event.eventType,
        eventDate: event.eventDate,
        status: event.status
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Event registration failed',
      error: error.message
    });
  }
});

// PUT update event status (admin only)
router.put('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const updateData = { status };
    if (notes) {
      updateData.$push = {
        notes: {
          content: notes,
          createdAt: new Date(),
          createdBy: req.body.userId || 'admin'
        }
      };
    }
    
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Event status updated successfully',
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating event status',
      error: error.message
    });
  }
});

// GET event statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const pendingEvents = await Event.countDocuments({ status: 'pending' });
    const confirmedEvents = await Event.countDocuments({ status: 'confirmed' });
    const completedEvents = await Event.countDocuments({ status: 'completed' });
    
    const eventTypesStats = await Event.aggregate([
      {
        $group: {
          _id: '$eventType',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    
    const monthlyStats = await Event.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$eventDate' },
            month: { $month: '$eventDate' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } },
      { $limit: 12 }
    ]);
    
    res.json({
      success: true,
      data: {
        totalEvents,
        pendingEvents,
        confirmedEvents,
        completedEvents,
        eventTypesStats,
        monthlyStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
});

module.exports = router;
