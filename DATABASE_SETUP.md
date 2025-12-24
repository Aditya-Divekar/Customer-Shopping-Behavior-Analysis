# Database Setup Guide - NextEra Event Planners

## Overview
This guide explains how to set up and use the MongoDB database integration for the NextEra Event Planners website.

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

## Database Models

### 1. User Model (`models/User.js`)
- **Purpose**: Admin user authentication and management
- **Fields**:
  - `username`: Unique username
  - `email`: Unique email address
  - `password`: Hashed password
  - `firstName`, `lastName`: User's full name
  - `role`: admin, manager, or staff
  - `isActive`: Account status
  - `permissions`: Array of specific permissions
  - `lastLogin`: Last login timestamp

### 2. Event Model (`models/Event.js`)
- **Purpose**: Event registrations and bookings
- **Fields**:
  - `name`: Client name
  - `mobile`: Contact number
  - `email`: Client email
  - `eventType`: Type of event (Wedding, Birthday, etc.)
  - `eventDate`: Event date
  - `venue`: Event location
  - `guestCount`: Number of guests
  - `budget`: Event budget
  - `status`: pending, confirmed, in-progress, completed, cancelled
  - `notes`: Array of admin notes
  - `images`: Array of event images

### 3. Contact Model (`models/Contact.js`)
- **Purpose**: Contact form submissions
- **Fields**:
  - `name`: Contact person name
  - `email`: Contact email
  - `phone`: Contact phone
  - `subject`: Inquiry subject
  - `message`: Inquiry message
  - `status`: new, read, replied, archived
  - `priority`: low, medium, high, urgent
  - `response`: Admin response details

### 4. Testimonial Model (`models/Testimonial.js`)
- **Purpose**: Customer testimonials and reviews
- **Fields**:
  - `name`: Customer name
  - `email`: Customer email
  - `eventType`: Type of event
  - `rating`: 1-5 star rating
  - `testimonial`: Review text
  - `eventDate`: Date of the event
  - `images`: Array of testimonial images
  - `isApproved`: Approval status
  - `isFeatured`: Featured testimonial flag

## API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - User login
- `GET /profile` - Get current user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `GET /users` - Get all users (admin only)
- `PUT /users/:id/status` - Update user status (admin only)

### Events (`/api/events`)
- `GET /` - Get all events (with pagination and filters)
- `GET /:id` - Get single event
- `POST /` - Create new event registration
- `PUT /:id/status` - Update event status
- `GET /stats/overview` - Get event statistics

### Contacts (`/api/contact`)
- `GET /` - Get all contacts (with pagination and filters)
- `GET /:id` - Get single contact
- `POST /` - Create new contact submission
- `PUT /:id` - Update contact status

### Testimonials (`/api/testimonials`)
- `GET /` - Get all testimonials
- `GET /featured` - Get featured testimonials
- `GET /:id` - Get single testimonial
- `POST /` - Create new testimonial
- `PUT /:id` - Update testimonial

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/elite-event-planner

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production-2024
JWT_EXPIRES_IN=24h

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760

# Security Configuration
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

### 3. Database Setup
```bash
# Test database connection
npm run test-db

# Create admin user
npm run setup-admin
```

### 4. Start the Server
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Admin Panel

### Access
- URL: `http://localhost:3000/admin`
- Default credentials:
  - Email: `admin@eliteplanner.com`
  - Password: `admin123`

### Features
- **Dashboard**: Overview of events, contacts, and statistics
- **Events Management**: View, filter, and manage event registrations
- **Contact Management**: View and respond to customer inquiries
- **Testimonials**: Manage customer reviews and approvals
- **User Management**: Manage admin users and permissions

## Database Operations

### Testing Database Connection
```bash
npm run test-db
```

This script will:
- Connect to MongoDB
- Test all model operations
- Create sample data
- Verify queries work correctly
- Clean up test data

### Creating Admin User
```bash
npm run setup-admin
```

This script will:
- Create the first admin user
- Set up default permissions
- Provide login credentials

## Security Features

### Authentication
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Session management

### Security Middleware
- Helmet for security headers
- CORS configuration
- Rate limiting
- Input validation
- SQL injection protection

### Data Validation
- Mongoose schema validation
- Input sanitization
- File upload restrictions
- Email format validation

## File Structure
```
├── models/
│   ├── User.js          # User/Admin model
│   ├── Event.js         # Event registration model
│   ├── Contact.js       # Contact form model
│   └── Testimonial.js   # Testimonial model
├── routes/
│   ├── auth.js          # Authentication routes
│   ├── events.js        # Event management routes
│   ├── contact.js       # Contact management routes
│   └── testimonials.js  # Testimonial routes
├── middleware/
│   └── auth.js          # Authentication middleware
├── public/
│   ├── admin.html       # Admin panel interface
│   ├── css/admin.css    # Admin panel styles
│   └── js/admin.js      # Admin panel functionality
├── server.js            # Main server file
├── test-db.js           # Database testing script
├── setup-admin.js       # Admin user setup script
└── .env                 # Environment configuration
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Ensure MongoDB is running
   - Check connection string in `.env`
   - Verify network connectivity

2. **Authentication Errors**
   - Check JWT secret in `.env`
   - Verify user credentials
   - Ensure user account is active

3. **Permission Denied**
   - Check user role and permissions
   - Verify admin access for protected routes
   - Review middleware configuration

### Logs and Debugging
- Server logs are displayed in the console
- Database operations are logged
- Error messages provide detailed information
- Use `NODE_ENV=development` for verbose logging

## Production Deployment

### Environment Variables
Update `.env` for production:
- Use strong JWT secret
- Configure production MongoDB URI
- Set up email service credentials
- Configure proper CORS origins
- Set `NODE_ENV=production`

### Security Checklist
- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Configure HTTPS
- [ ] Set up proper CORS
- [ ] Enable rate limiting
- [ ] Configure file upload limits
- [ ] Set up database backups

## Support

For issues or questions:
1. Check the console logs
2. Verify database connection
3. Test API endpoints
4. Review error messages
5. Check environment configuration

## API Documentation

### Request/Response Format
All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Description of the result",
  "data": {}, // Response data
  "error": "Error details (if any)"
}
```

### Authentication Headers
For protected routes, include:
```
Authorization: Bearer <jwt_token>
```

### Pagination
For list endpoints, use query parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `sortBy`: Sort field (default: createdAt)
- `status`: Filter by status
- `eventType`: Filter by event type
