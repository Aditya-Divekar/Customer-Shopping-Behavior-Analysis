# Elite Event Planner Website - Complete Project Structure

## 📁 Project Root: `Elite_event_planner_website/`

### 📂 Backend Files

#### `routes/` - API Route Handlers
- `auth.js` - Authentication routes (login, register, profile, user management)
- `contact.js` - Contact form and message handling routes
- `events.js` - Event registration and management routes
- `testimonials.js` - Testimonial submission and management routes

#### `models/` - Database Models (Mongoose Schemas)
- `User.js` - User model with authentication and permissions
- `Contact.js` - Contact message model
- `Event.js` - Event registration model
- `Testimonial.js` - Testimonial model

#### `middleware/` - Express Middleware
- `auth.js` - Authentication middleware (JWT verification, role-based access)

#### `data/` - Sample Data Files
- `sample-contacts.json` - Sample contact messages
- `sample-events.json` - Sample event registrations
- `sample-testimonials.json` - Sample testimonials

### 📂 Frontend Files

#### `public/` - Public Web Files

##### HTML Pages
- `index.html` - Homepage
- `about.html` - About Us page
- `services.html` - Services page
- `contact.html` - Contact page
- `login.html` - User login page
- `register.html` - User registration page
- `profile.html` - User profile page
- `admin.html` - Admin dashboard page
- `test-api.html` - API testing page

##### `public/css/` - Stylesheets
- `style.css` - Main stylesheet (global styles, navigation, hero, services, testimonials, footer)
- `about.css` - About page specific styles
- `admin.css` - Admin dashboard styles
- `contact.css` - Contact page styles
- `login.css` - Login page styles
- `profile.css` - Profile page styles
- `register.css` - Registration page styles
- `services.css` - Services page styles

##### `public/js/` - JavaScript Files
- `script.js` - Main homepage JavaScript (navigation, forms, testimonials, animations)
- `about.js` - About page JavaScript
- `admin.js` - Admin panel JavaScript
- `contact.js` - Contact page JavaScript
- `login.js` - Login page JavaScript
- `profile.js` - Profile page JavaScript
- `register.js` - Registration page JavaScript
- `services.js` - Services page JavaScript

##### `public/` - Image Assets
- `b1.jpg`, `b2.jpg`, `b3.jpg` - Background images
- `background-image.jpg` - Main background image
- `birthday.jpg` - Birthday event image
- `bk1.jpeg`, `bk2.jpeg` - Booking images
- `bp1.jpg`, `bp2.jpg`, `bp3.jpg` - Business/party images
- `c1.jpg`, `c2.jpg`, `c3.jpg` - Catering images
- `f1.jpg`, `f2.jpeg` - Food images
- `our time.jpg` - Team image
- `ph1.jpg`, `ph2.jpg`, `ph3.jpg` - Photography images
- `wed3.jpg` - Wedding image
- `wedding1.jpg`, `wedding2.jpg` - Wedding images

### 📂 Configuration Files

#### `.vscode/` - VS Code Settings
- `settings.json` - VS Code workspace settings

### 📂 Dependencies

#### `node_modules/` - NPM Dependencies
- All installed npm packages (excluded from GitHub upload)

---

## 📋 File Summary

### Total Files by Type:
- **JavaScript Files**: 13 files (routes: 4, models: 4, middleware: 1, public/js: 8)
- **HTML Files**: 9 files
- **CSS Files**: 8 files
- **JSON Files**: 4 files (data: 3, .vscode: 1)
- **Image Files**: 15+ image files

### Formatted Files:
✅ All JavaScript files formatted with Prettier
✅ All HTML files consistently formatted
✅ All CSS files consistently formatted
✅ All JSON files properly formatted

---

## 🚀 Ready for GitHub Upload

All files have been formatted and are ready for repository upload. The project structure follows best practices with:
- Clear separation of backend (routes, models, middleware) and frontend (public)
- Organized file structure
- Consistent code formatting
- Sample data for testing

---

## 📝 Notes:
- `node_modules/` should be excluded from GitHub (add to `.gitignore`)
- Environment variables (`.env`) should not be committed
- Image files are included in the `public/` directory
- All code files are formatted and ready for production

