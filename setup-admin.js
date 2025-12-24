const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/elite-event-planner';

console.log('🔄 Setting up admin user...');
console.log(`📍 Database: ${MONGODB_URI}`);

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(async () => {
    console.log('✅ MongoDB connected successfully!');
    
    try {
        // Check if admin user already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        
        if (existingAdmin) {
            console.log('ℹ️  Admin user already exists:', existingAdmin.email);
            console.log('✅ Setup complete!');
            mongoose.connection.close();
            process.exit(0);
        }
        
        // Create admin user
        const adminUser = new User({
            username: 'admin',
            email: 'admin@eliteplanner.com',
            password: 'admin123', // Change this in production!
            firstName: 'Admin',
            lastName: 'User',
            role: 'admin',
            permissions: [
                'read_events', 'write_events', 'delete_events',
                'read_contacts', 'write_contacts',
                'read_testimonials', 'write_testimonials',
                'manage_users'
            ]
        });
        
        await adminUser.save();
        
        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@eliteplanner.com');
        console.log('🔑 Password: admin123');
        console.log('⚠️  Please change the password after first login!');
        
        // Close connection
        mongoose.connection.close();
        console.log('🔌 Database connection closed.');
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        mongoose.connection.close();
        process.exit(1);
    }
})
.catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
});

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
