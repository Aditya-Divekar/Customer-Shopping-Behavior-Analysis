const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// GET all contact messages (admin only)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, status, priority } = req.query;
    
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    
    const total = await Contact.countDocuments(filter);
    
    res.json({
      success: true,
      data: contacts,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact messages',
      error: error.message
    });
  }
});

// GET contact statistics (must be before /:id route)
router.get('/stats/overview', async (req, res) => {
  try {
    const totalMessages = await Contact.countDocuments();
    const newMessages = await Contact.countDocuments({ status: 'new' });
    const readMessages = await Contact.countDocuments({ status: 'read' });
    const repliedMessages = await Contact.countDocuments({ status: 'replied' });
    
    const priorityStats = await Contact.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const dailyStats = await Contact.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
      { $limit: 30 }
    ]);
    
    res.json({
      success: true,
      data: {
        totalMessages,
        newMessages,
        readMessages,
        repliedMessages,
        priorityStats,
        dailyStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact statistics',
      error: error.message
    });
  }
});

// GET single contact message
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact message',
      error: error.message
    });
  }
});

// POST new contact message
router.post('/', async (req, res) => {
  try {
    const contactData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      subject: req.body.subject,
      message: req.body.message,
      priority: req.body.priority || 'medium'
    };
    
    const contact = new Contact(contactData);
    await contact.save();
    
    res.status(201).json({
      success: true,
      message: 'Thank you for contacting us! We will get back to you soon.',
      data: {
        id: contact._id,
        name: contact.name,
        subject: contact.subject,
        status: contact.status
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// PUT update contact status
router.put('/:id/status', async (req, res) => {
  try {
    const { status, response, priority } = req.body;
    
    const updateData = { status };
    if (response) {
      updateData.response = {
        content: response,
        respondedAt: new Date(),
        respondedBy: req.body.userId || 'admin'
      };
    }
    if (priority) updateData.priority = priority;
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact message not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Contact status updated successfully',
      data: contact
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating contact status',
      error: error.message
    });
  }
});

module.exports = router;
