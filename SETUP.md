# Setup Guide - NextEra Event Planner Caterers Website

## Prerequisites Installation

Before running the website, you need to install the following:

### 1. Node.js and npm

**Download and Install Node.js:**
1. Go to [https://nodejs.org/](https://nodejs.org/)
2. Download the LTS version (recommended)
3. Run the installer and follow the setup wizard
4. Restart your command prompt/terminal

**Verify Installation:**
```bash
node --version
npm --version
```

### 2. MongoDB

**Option A: Local MongoDB Installation**
1. Go to [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Download MongoDB Community Server
3. Install following the setup wizard
4. Start MongoDB service

**Option B: MongoDB Atlas (Cloud - Recommended)**
1. Go to [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string

### 3. Project Setup

**Install Dependencies:**
```bash
# Navigate to project directory
cd D:\Projects\ideal-memory

# Install all required packages
npm install
```

**Environment Configuration:**
1. Create a `.env` file in the root directory
2. Add the following content:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/ideal-memory-caterers
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ideal-memory-caterers

# JWT Secret (generate a secure secret for production)
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production

# Email Configuration (for contact form and notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# File Upload Configuration
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Test Database Connection
```bash
node test-db.js
```

## Accessing the Website

Once the server is running, open your browser and navigate to:
- **Homepage**: http://localhost:3000
- **Services**: http://localhost:3000/services.html
- **About**: http://localhost:3000/about.html
- **Contact**: http://localhost:3000/contact.html

## API Endpoints

The following API endpoints are available:

### Events
- `POST /api/events` - Submit event registration
- `GET /api/events` - Get all events (admin)
- `GET /api/events/stats/overview` - Get event statistics

### Contact
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get all contact messages (admin)
- `GET /api/contact/stats/overview` - Get contact statistics

### Testimonials
- `GET /api/testimonials` - Get approved testimonials
- `POST /api/testimonials` - Submit testimonial
- `GET /api/testimonials/featured` - Get featured testimonials

## Troubleshooting

### Common Issues

**1. Node.js not found**
- Make sure Node.js is installed and added to PATH
- Restart your terminal after installation

**2. MongoDB connection failed**
- Check if MongoDB is running (for local installation)
- Verify connection string in .env file
- Check firewall settings

**3. Port already in use**
- Change PORT in .env file to another port (e.g., 3001)
- Or kill the process using port 3000

**4. Dependencies installation failed**
- Clear npm cache: `npm cache clean --force`
- Delete node_modules folder and package-lock.json
- Run `npm install` again

### Getting Help

If you encounter any issues:
1. Check the console output for error messages
2. Verify all prerequisites are installed
3. Check the README.md for additional information
4. Contact support: support@idealmemory.com

## Features Overview

### ✅ Completed Features
- ✅ Modern, responsive website design
- ✅ MongoDB database integration
- ✅ RESTful API endpoints
- ✅ Event registration system
- ✅ Contact form with validation
- ✅ Testimonials system
- ✅ Mobile-responsive design
- ✅ Interactive animations
- ✅ Image galleries with lightbox
- ✅ FAQ accordion
- ✅ Business hours indicator
- ✅ Social media integration
- ✅ Security features (rate limiting, CORS, helmet)
- ✅ Error handling and validation

### 🎨 Design Features
- Beautiful gradient backgrounds
- Smooth animations and transitions
- Interactive hover effects
- Professional color scheme
- Modern typography
- Responsive grid layouts
- Mobile-first approach

### 🔧 Technical Features
- Node.js backend with Express
- MongoDB with Mongoose ODM
- RESTful API design
- Form validation and sanitization
- File upload support
- Email integration ready
- Security middleware
- Performance optimizations

## Next Steps

After successful setup:
1. Test all functionality
2. Add your actual content and images
3. Configure email settings
4. Set up production environment
5. Deploy to hosting platform

Enjoy your new modern event planning website! 🎉
