// Database Connection Test Script
const mongoose = require('mongoose');

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ideal-memory-caterers';

console.log('🔄 Testing MongoDB connection...');
console.log(`📍 Connection URI: ${MONGODB_URI}`);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    console.log('✅ MongoDB connected successfully!');
    
    // Test database operations
    await testDatabaseOperations();
    
    // Close connection
    mongoose.connection.close();
    console.log('🔌 Database connection closed.');
    process.exit(0);
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
});

async function testDatabaseOperations() {
    try {
        console.log('\n🧪 Testing database operations...');
        
        // Import models
        const Event = require('./models/Event');
        const Contact = require('./models/Contact');
        const Testimonial = require('./models/Testimonial');
        
        // Test Event model
        console.log('\n📅 Testing Event model...');
        const testEvent = new Event({
            name: 'Test User',
            mobile: '1234567890',
            email: 'test@example.com',
            eventType: 'Wedding',
            eventDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            venue: 'Test Venue',
            guestCount: 100,
            budget: 50000,
            additionalInfo: 'This is a test event'
        });
        
        await testEvent.save();
        console.log('✅ Event created successfully:', testEvent._id);
        
        // Test Contact model
        console.log('\n📧 Testing Contact model...');
        const testContact = new Contact({
            name: 'Test Contact',
            email: 'contact@example.com',
            phone: '1234567890',
            subject: 'Test Subject',
            message: 'This is a test contact message'
        });
        
        await testContact.save();
        console.log('✅ Contact created successfully:', testContact._id);
        
        // Test Testimonial model
        console.log('\n⭐ Testing Testimonial model...');
        const testTestimonial = new Testimonial({
            name: 'Test Client',
            email: 'client@example.com',
            eventType: 'Wedding',
            rating: 5,
            testimonial: 'This is a test testimonial',
            eventDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 days ago
        });
        
        await testTestimonial.save();
        console.log('✅ Testimonial created successfully:', testTestimonial._id);
        
        // Test queries
        console.log('\n🔍 Testing database queries...');
        
        const eventCount = await Event.countDocuments();
        console.log(`📊 Total events in database: ${eventCount}`);
        
        const contactCount = await Contact.countDocuments();
        console.log(`📊 Total contacts in database: ${contactCount}`);
        
        const testimonialCount = await Testimonial.countDocuments();
        console.log(`📊 Total testimonials in database: ${testimonialCount}`);
        
        // Clean up test data
        console.log('\n🧹 Cleaning up test data...');
        await Event.deleteOne({ _id: testEvent._id });
        await Contact.deleteOne({ _id: testContact._id });
        await Testimonial.deleteOne({ _id: testTestimonial._id });
        console.log('✅ Test data cleaned up successfully');
        
        console.log('\n🎉 All database tests passed successfully!');
        
    } catch (error) {
        console.error('❌ Database operation error:', error.message);
        throw error;
    }
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Process interrupted. Closing database connection...');
    mongoose.connection.close();
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Process terminated. Closing database connection...');
    mongoose.connection.close();
    process.exit(0);
});
