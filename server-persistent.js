const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const DataStorage = require('./data-storage');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize data storage
const dataStorage = new DataStorage();

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

// Routes
// Events API
app.get('/api/events', (req, res) => {
  const events = dataStorage.getEvents();
  res.json({
    success: true,
    data: events,
    message: 'Events retrieved successfully (Persistent storage)'
  });
});

app.post('/api/events', (req, res) => {
  try {
    const event = dataStorage.addEvent(req.body);
    
    console.log('📝 New event registered:', event.name, event.eventType);
    
    res.status(201).json({
      success: true,
      message: 'Event registered successfully! We will contact you soon.',
      data: {
        id: event.id,
        name: event.name,
        eventType: event.eventType,
        status: event.status
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

app.get('/api/events/stats/overview', (req, res) => {
  const stats = dataStorage.getEventStats();
  res.json({
    success: true,
    data: stats
  });
});

// Contact API
app.get('/api/contact', (req, res) => {
  const contacts = dataStorage.getContacts();
  res.json({
    success: true,
    data: contacts,
    message: 'Contact messages retrieved successfully (Persistent storage)'
  });
});

app.post('/api/contact', (req, res) => {
  try {
    const contact = dataStorage.addContact(req.body);
    
    console.log('📧 New contact message:', contact.name, contact.subject);
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully! We will get back to you within 24 hours.',
      data: {
        id: contact.id,
        name: contact.name,
        subject: contact.subject,
        status: contact.status
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
app.get('/api/testimonials', (req, res) => {
  const testimonials = dataStorage.getTestimonials().filter(t => t.isApproved);
  res.json({
    success: true,
    data: testimonials,
    message: 'Testimonials retrieved successfully (Persistent storage)'
  });
});

app.get('/api/testimonials/featured', (req, res) => {
  const featuredTestimonials = dataStorage.getFeaturedTestimonials();
  res.json({
    success: true,
    data: featuredTestimonials
  });
});

app.post('/api/testimonials', (req, res) => {
  try {
    const testimonial = dataStorage.addTestimonial(req.body);
    
    console.log('⭐ New testimonial:', testimonial.name, testimonial.rating + ' stars');
    
    res.status(201).json({
      success: true,
      message: 'Testimonial submitted successfully! It will be reviewed and published soon.',
      data: {
        id: testimonial.id,
        name: testimonial.name,
        rating: testimonial.rating,
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

// Admin API
app.get('/api/admin/export', (req, res) => {
  const allData = dataStorage.exportAllData();
  res.json({
    success: true,
    data: allData
  });
});

app.post('/api/admin/import', (req, res) => {
  try {
    dataStorage.importData(req.body);
    res.json({
      success: true,
      message: 'Data imported successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to import data',
      error: error.message
    });
  }
});

app.delete('/api/admin/clear', (req, res) => {
  try {
    dataStorage.clearAllData();
    res.json({
      success: true,
      message: 'All data cleared successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to clear data',
      error: error.message
    });
  }
});

// Status endpoint
app.get('/api/status', (req, res) => {
  const events = dataStorage.getEvents();
  const contacts = dataStorage.getContacts();
  const testimonials = dataStorage.getTestimonials();
  
  res.json({
    success: true,
    message: 'Server is running successfully with persistent storage!',
    data: {
      events: events.length,
      contacts: contacts.length,
      testimonials: testimonials.length,
      mode: 'persistent',
      storageLocation: './data/'
    }
  });
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

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
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

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server gracefully...');
  dataStorage.saveData();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Server terminated, saving data...');
  dataStorage.saveData();
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`🚀 NextEra Event Planner Caterers Server (Persistent Storage)`);
  console.log(`🌐 Website: http://localhost:${PORT}`);
  console.log(`📊 Admin Panel: http://localhost:${PORT}/admin`);
  console.log(`📊 API Status: http://localhost:${PORT}/api/status`);
  console.log(`💾 Data Storage: ./data/ (Persistent)`);
  console.log(`✅ All forms save data permanently!`);
  console.log(`🛑 Press Ctrl+C to stop the server`);
  console.log(`\n🎉 Your website is ready with persistent data storage!`);
});
