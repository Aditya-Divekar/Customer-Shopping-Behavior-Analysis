const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001; // Using port 3001 to avoid conflicts

// Security middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// In-memory storage for demo
let events = [];
let contacts = [];
let testimonials = [];

// Load sample data
try {
  const sampleEvents = require('./data/sample-events.json');
  const sampleContacts = require('./data/sample-contacts.json');
  const sampleTestimonials = require('./data/sample-testimonials.json');
  
  events = sampleEvents;
  contacts = sampleContacts;
  testimonials = sampleTestimonials;
  
  console.log('✅ Sample data loaded successfully');
} catch (error) {
  console.log('⚠️  Sample data not found, starting with empty arrays');
}

// Routes
// Events API
app.get('/api/events', (req, res) => {
  res.json({
    success: true,
    data: events,
    message: 'Events retrieved successfully (Demo mode - data stored in memory)'
  });
});

app.post('/api/events', (req, res) => {
  try {
    const eventData = {
      ...req.body,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    events.push(eventData);
    
    console.log('📝 New event registered:', eventData.name, eventData.eventType);
    
    res.status(201).json({
      success: true,
      message: 'Event registered successfully! We will contact you soon.',
      data: {
        id: eventData.id,
        name: eventData.name,
        eventType: eventData.eventType,
        status: eventData.status
      }
    });
  } catch (error) {
    console.error('❌ Event registration error:', error);
    res.status(400).json({
      success: false,
      message: 'Event registration failed',
      error: error.message
    });
  }
});

// Contact API
app.post('/api/contact', (req, res) => {
  try {
    const contactData = {
      ...req.body,
      id: Date.now().toString(),
      status: 'new',
      priority: 'medium',
      createdAt: new Date().toISOString()
    };
    
    contacts.push(contactData);
    
    console.log('📧 New contact message:', contactData.name, contactData.subject);
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you within 24 hours.',
      data: {
        id: contactData.id,
        name: contactData.name,
        subject: contactData.subject,
        status: contactData.status
      }
    });
  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to send message',
      error: error.message
    });
  }
});

// Testimonials API
app.get('/api/testimonials/featured', (req, res) => {
  const featuredTestimonials = testimonials.filter(t => t.isApproved && t.isFeatured);
  
  res.json({
    success: true,
    data: featuredTestimonials
  });
});

app.post('/api/testimonials', (req, res) => {
  try {
    const testimonialData = {
      ...req.body,
      id: Date.now().toString(),
      isApproved: false,
      isFeatured: false,
      createdAt: new Date().toISOString()
    };
    
    testimonials.push(testimonialData);
    
    console.log('⭐ New testimonial:', testimonialData.name, testimonialData.rating + ' stars');
    
    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully! It will be reviewed and published soon.',
      data: {
        id: testimonialData.id,
        name: testimonialData.name,
        rating: testimonialData.rating,
        status: 'pending_approval'
      }
    });
  } catch (error) {
    console.error('❌ Testimonial error:', error);
    res.status(400).json({
      success: false,
      message: 'Failed to submit testimonial',
      error: error.message
    });
  }
});

// Serve main pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/services', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'services.html'));
});

app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Status endpoint
app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running successfully!',
    data: {
      events: events.length,
      contacts: contacts.length,
      testimonials: testimonials.length,
      mode: 'demo'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Page not found' 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 NextEra Event Planner Caterers Server Running!`);
  console.log(`🌐 Website: http://localhost:${PORT}`);
  console.log(`📊 API Status: http://localhost:${PORT}/api/status`);
  console.log(`📝 Demo Mode - Data stored in memory`);
  console.log(`✅ All forms are working and saving data!`);
  console.log(`🛑 Press Ctrl+C to stop the server`);
  console.log(`\n🎉 Your website is ready to use!`);
});
