<<<<<<< HEAD
# NextEra Event Planner Caterers - Modern Event Planning Website

A beautiful, modern website for NextEra Event Planner Caterers featuring MongoDB integration, responsive design, and comprehensive event planning services.

## 🚀 Features

### Frontend
- **Modern, Responsive Design** - Beautiful UI that works on all devices
- **Interactive Animations** - Smooth scroll animations and hover effects
- **Dynamic Content** - Real-time testimonials and statistics
- **Contact Forms** - Advanced form validation and submission
- **Image Galleries** - Lightbox functionality for service images
- **FAQ Accordion** - Interactive frequently asked questions
- **Mobile-First Design** - Optimized for mobile devices

### Backend
- **Node.js & Express** - Robust server framework
- **MongoDB Integration** - Modern NoSQL database with Mongoose
- **RESTful API** - Complete API endpoints for all functionality
- **Security Features** - Rate limiting, CORS, helmet protection
- **File Upload Support** - Image upload capabilities
- **Email Integration** - Contact form email notifications

### Services Offered
- Wedding Planning
- Birthday Celebrations
- Corporate Events
- Premium Catering
- Event Decoration
- Photography & Videography

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Styling**: Custom CSS with CSS Grid and Flexbox
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Poppins, Dancing Script)

## 📁 Project Structure

```
ideal-memory/
├── public/                 # Frontend files
│   ├── css/               # Stylesheets
│   │   ├── style.css      # Main styles
│   │   ├── services.css   # Services page styles
│   │   ├── about.css      # About page styles
│   │   └── contact.css    # Contact page styles
│   ├── js/                # JavaScript files
│   │   ├── script.js      # Main JavaScript
│   │   ├── services.js    # Services page scripts
│   │   ├── about.js       # About page scripts
│   │   └── contact.js     # Contact page scripts
│   ├── images/            # Image assets
│   ├── index.html         # Homepage
│   ├── services.html      # Services page
│   ├── about.html         # About page
│   └── contact.html       # Contact page
├── models/                # MongoDB models
│   ├── Event.js          # Event model
│   ├── Contact.js        # Contact model
│   └── Testimonial.js    # Testimonial model
├── routes/               # API routes
│   ├── events.js         # Event endpoints
│   ├── contact.js        # Contact endpoints
│   └── testimonials.js   # Testimonial endpoints
├── server.js             # Main server file
├── package.json          # Dependencies
└── README.md            # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ideal-memory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/ideal-memory-caterers
   JWT_SECRET=your-super-secret-jwt-key-here
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system:
   ```bash
   # For local MongoDB
   mongod
   
   # Or use MongoDB Atlas cloud service
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

6. **Access the website**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## 📊 Database Models

### Event Model
- Event registration and management
- Guest count and budget tracking
- Status management (pending, confirmed, completed)
- Image uploads and notes

### Contact Model
- Contact form submissions
- Message priority and status
- Response tracking

### Testimonial Model
- Client testimonials
- Rating system
- Approval workflow
- Featured testimonials

## 🔌 API Endpoints

### Events
- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get single event
- `PUT /api/events/:id/status` - Update event status
- `GET /api/events/stats/overview` - Get event statistics

### Contact
- `GET /api/contact` - Get all contact messages
- `POST /api/contact` - Submit contact form
- `PUT /api/contact/:id/status` - Update contact status
- `GET /api/contact/stats/overview` - Get contact statistics

### Testimonials
- `GET /api/testimonials` - Get approved testimonials
- `POST /api/testimonials` - Submit testimonial
- `GET /api/testimonials/featured` - Get featured testimonials
- `PUT /api/testimonials/:id/approve` - Approve testimonial
- `GET /api/testimonials/stats/overview` - Get testimonial statistics

## 🎨 Design Features

### Color Scheme
- Primary: Gold (#d4af37)
- Secondary: Dark Blue (#2c3e50)
- Accent: Red (#e74c3c)
- Background: Light Gray (#f8f9fa)

### Typography
- Primary Font: Poppins (Google Fonts)
- Script Font: Dancing Script (Google Fonts)
- Responsive font sizes with rem units

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Development

### Adding New Features
1. Create new routes in the `routes/` directory
2. Add corresponding models in the `models/` directory
3. Update frontend JavaScript files as needed
4. Add CSS styles for new components

### Database Operations
- All database operations use Mongoose ODM
- Models include validation and indexing
- Error handling for all database operations

### Frontend Development
- Modular CSS architecture
- JavaScript ES6+ features
- Progressive enhancement approach
- Accessibility considerations

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Features

- Rate limiting to prevent abuse
- CORS configuration
- Helmet.js for security headers
- Input validation and sanitization
- Environment variable protection

## 📈 Performance Optimizations

- Image lazy loading
- CSS and JavaScript minification
- Database indexing
- Efficient API endpoints
- Responsive image loading

## 🚀 Deployment

### Production Deployment
1. Set `NODE_ENV=production` in environment variables
2. Use a production MongoDB instance (MongoDB Atlas recommended)
3. Set up proper email configuration
4. Configure reverse proxy (nginx recommended)
5. Set up SSL certificates
6. Use PM2 for process management

### Environment Setup
- Production database URL
- Secure JWT secret
- Email service configuration
- File upload limits
- CORS origins

## 📞 Support

For support and questions:
- Email: support@idealmemory.com
- Phone: +1 (555) 123-4567
- Website: https://idealmemory.com

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- MongoDB for database services
- Express.js community for framework
- All contributors and testers

---

**NextEra Event Planner Caterers** - Creating unforgettable memories through exceptional event planning and catering services.
=======
# Customer-Shopping-Behavior-Analysis

A complete end-to-end analytics project exploring how customers shop across different product categories. This project combines **Python, SQL (MySQL), and Power BI** to uncover patterns in spending, product demand, customer loyalty, and subscription behavior. The goal is to transform raw transactional data into clear insights that support better business decisions. 

---

## 🔍 **Project Overview**

This project analyzes **3,900 customer transactions** across 18 features, including demographics, purchase details, discounts, ratings, and shopping behavior.
The analysis focuses on:

* Understanding **what customers buy**
* Identifying **which segments spend the most**
* Measuring **the impact of discounts and subscriptions**
* Finding **top-rated and top-selling products**
* Building recommendations that help businesses improve retention and revenue 

---

## 📊 **Tech Stack**

* **Python** (Pandas, NumPy, Matplotlib/Seaborn)
* **SQL – MySQL**
* **PostgreSQL integration**
* **Power BI Dashboard**
* **Jupyter Notebook**

---

## 🧹 **Data Preprocessing**

Key steps completed in Python:

* Loaded and explored dataset with `df.info()` and `df.describe()`
* Imputed missing values in review ratings using category medians
* Standardized column names for readability
* Engineered new features like **age groups** and **purchase frequency**
* Dropped redundant variables after correlation checks
* Loaded cleaned data into PostgreSQL for SQL analysis 

---

## 🧠 **Analysis Performed**

### **Using SQL**

Insights extracted from structured queries:

* Revenue comparison by gender
* High-spending customers using discounts
* Top 5 products based on ratings
* Average purchase amount by shipping type
* Subscriber vs. non-subscriber spending
* Most discount-dependent products
* Customer classification: **New, Returning, Loyal**
* Top 3 products per category
* Subscription likelihood among repeat buyers
* Revenue contribution by age groups 

---

## 📈 **Power BI Dashboard**

Built an interactive dashboard visualizing:

* Average purchase amount
* Average review rating
* Sales by category
* Revenue by age group
* Subscription status distribution
* Product category drill-downs
* Filters for gender, category, shipping, and subscription status 

---

## 🎯 **Key Insights**

* Clothing leads in revenue contribution
* Loyal customers dominate total purchases
* Young adults generate the highest revenue
* Express shipping users spend slightly more
* Subscriptions positively correlate with repeat buying behavior
* Top products (e.g., Gloves, Sandals, Boots) consistently show high ratings and demand 

---

## 💡 **Business Recommendations**

* Strengthen loyalty programs for high-value customers
* Promote subscription benefits to increase recurring revenue
* Highlight best-rated / most-purchased items in marketing campaigns
* Optimize discount strategy for categories highly dependent on offers
* Focus campaigns on **high-revenue age groups**
* Improve shipping experiences as it influences spending behavior 

---

## 📂 **Project Structure**

```
├── data/
├── notebooks/
├── sql_queries/
├── powerbi_dashboard/
├── scripts/
└── README.md
```

---

## 🚀 **About the Project**

This project reflects my hands-on experience in solving real analytics problems using both technical and business lenses. I aimed to build a workflow that feels close to what analysts do in real industry environments—cleaning data, exploring patterns, validating through SQL, and presenting insights clearly through dashboards.
>>>>>>> 90c62f0b42ca0a26c43089b424fabfb560028d01
