// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.getElementById('contact-form');
const testimonialsSlider = document.getElementById('testimonials-slider');
const prevBtn = document.getElementById('prev-testimonial');
const nextBtn = document.getElementById('next-testimonial');

// Global Variables
let currentTestimonial = 0;
let testimonials = [];
let isScrolling = false;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Check if user just registered
    checkForNewRegistration();
    
    setupNavigation();
    setupScrollEffects();
    setupContactForm();
    setupTestimonials();
    setupAnimations();
    loadTestimonials();
    setupCounters();
}

// Navigation Functions
function setupNavigation() {
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking on links
    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
    
    // Active link highlighting
    window.addEventListener('scroll', highlightActiveLink);
}

function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
}

function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) navLink.classList.add('active');
        }
    });
}

// Scroll Effects
function setupScrollEffects() {
    // Navbar background on scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact Form
function setupContactForm() {
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
    }
}

async function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Message sent successfully! We will get back to you soon.', 'success');
            contactForm.reset();
        } else {
            showNotification(result.message || 'Failed to send message. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Network error. Please check your connection and try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Testimonials
function setupTestimonials() {
    if (prevBtn && nextBtn) {
        prevBtn.addEventListener('click', () => changeTestimonial(-1));
        nextBtn.addEventListener('click', () => changeTestimonial(1));
    }
}

async function loadTestimonials() {
    try {
        const response = await fetch('/api/testimonials/featured');
        const result = await response.json();
        
        if (result.success) {
            testimonials = result.data;
            updateTestimonialDisplay();
        }
    } catch (error) {
        console.error('Error loading testimonials:', error);
        // Use default testimonials if API fails
        testimonials = getDefaultTestimonials();
        updateTestimonialDisplay();
    }
}

function getDefaultTestimonials() {
    return [
        {
            name: "Sarah Johnson",
            eventType: "Wedding",
            rating: 5,
            testimonial: "NextEra Event Planner Caterers made our wedding absolutely perfect! Every detail was handled with care and professionalism. The food was exceptional, and the decoration was beyond our expectations.",
            images: [{ path: "images/testimonial-1.jpg" }]
        },
        {
            name: "Michael Chen",
            eventType: "Corporate Event",
            rating: 5,
            testimonial: "Our corporate conference was a huge success thanks to NextEra Event Planner. The catering was top-notch, and the event coordination was seamless. Highly recommended!",
            images: [{ path: "images/testimonial-2.jpg" }]
        },
        {
            name: "Emily Rodriguez",
            eventType: "Birthday Party",
            rating: 5,
            testimonial: "My daughter's birthday party was magical! The team created an amazing princess theme and the kids had the time of their lives. Thank you for making it special!",
            images: [{ path: "images/testimonial-3.jpg" }]
        }
    ];
}

function changeTestimonial(direction) {
    if (testimonials.length === 0) return;
    
    currentTestimonial += direction;
    
    if (currentTestimonial >= testimonials.length) {
        currentTestimonial = 0;
    } else if (currentTestimonial < 0) {
        currentTestimonial = testimonials.length - 1;
    }
    
    updateTestimonialDisplay();
}

function updateTestimonialDisplay() {
    if (!testimonialsSlider || testimonials.length === 0) return;
    
    const testimonial = testimonials[currentTestimonial];
    
    const testimonialCard = testimonialsSlider.querySelector('.testimonial-card');
    if (testimonialCard) {
        testimonialCard.innerHTML = `
            <div class="testimonial-content">
                <div class="stars">
                    ${generateStars(testimonial.rating)}
                </div>
                <p class="testimonial-text">"${testimonial.testimonial}"</p>
                <div class="testimonial-author">
                    <img src="${testimonial.images?.[0]?.path || 'images/default-avatar.jpg'}" alt="${testimonial.name}" loading="lazy">
                    <div class="author-info">
                        <h4>${testimonial.name}</h4>
                        <span>${testimonial.eventType} Client</span>
                    </div>
                </div>
            </div>
        `;
    }
}

function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return stars;
}

// Animations
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.service-card, .about-content, .testimonial-card, .contact-content').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Counter Animation
function setupCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Utility Functions
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 5px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        margin-left: auto;
        padding: 0.25rem;
        border-radius: 3px;
        transition: background-color 0.2s ease;
    `;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Close button functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    return colors[type] || '#3498db';
}

// Service Card Interactions
document.addEventListener('DOMContentLoaded', function() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Parallax Effect for Hero Section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Add CSS animations dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2) !important;
    }
    
    body.menu-open {
        overflow: hidden;
    }
`;
document.head.appendChild(style);

// Event Registration Form (if exists)
function setupEventRegistration() {
    const eventForm = document.getElementById('event-registration-form');
    if (eventForm) {
        eventForm.addEventListener('submit', handleEventRegistration);
    }
}

// Event Booking Form (main page)
function setupEventBooking() {
    const bookingForm = document.getElementById('event-booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleEventBooking);
    }
}

async function handleEventRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        mobile: formData.get('mobile'),
        email: formData.get('email'),
        eventType: formData.get('eventType'),
        eventDate: formData.get('eventDate'),
        venue: formData.get('venue'),
        guestCount: formData.get('guestCount'),
        budget: formData.get('budget'),
        additionalInfo: formData.get('additionalInfo')
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Event registration successful! We will contact you soon.', 'success');
            e.target.reset();
        } else {
            showNotification(result.message || 'Registration failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Network error. Please check your connection and try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

async function handleEventBooking(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        mobile: formData.get('mobile'),
        email: formData.get('email'),
        eventType: formData.get('eventType'),
        eventDate: formData.get('eventDate'),
        venue: formData.get('venue'),
        guestCount: formData.get('guestCount'),
        budget: formData.get('budget'),
        additionalInfo: formData.get('additionalInfo')
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification('Event booking successful! We will contact you within 24 hours with a customized quote.', 'success');
            e.target.reset();
            
            // Scroll to top of form
            e.target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            showNotification(result.message || 'Booking failed. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showNotification('Network error. Please check your connection and try again.', 'error');
    } finally {
        // Reset button state
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

// Initialize event registration and booking forms
document.addEventListener('DOMContentLoaded', () => {
    setupEventRegistration();
    setupEventBooking();
});

// Lazy loading for images
function setupLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Check for new registration and show welcome message
function checkForNewRegistration() {
    // Check if user came from registration page
    const urlParams = new URLSearchParams(window.location.search);
    const fromRegistration = urlParams.get('registered');
    const fromLogin = urlParams.get('loggedin');
    const userName = urlParams.get('user');
    
    if (fromRegistration === 'true') {
        // Show welcome message
        showWelcomeMessage();
        
        // Clean up URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    } else if (fromLogin === 'true' && userName) {
        // Show login success message
        showLoginSuccessMessage(decodeURIComponent(userName));
        
        // Clean up URL
        const newUrl = window.location.pathname;
        window.history.replaceState({}, document.title, newUrl);
    }
    
    // Check if user is logged in and update navigation
    updateNavigationForLoggedInUser();
}

// Show welcome message for new users
function showWelcomeMessage() {
    // Create welcome notification
    const welcomeNotification = document.createElement('div');
    welcomeNotification.className = 'welcome-notification';
    welcomeNotification.innerHTML = `
        <div class="welcome-content">
            <div class="welcome-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <div class="welcome-text">
                <h3>Welcome to NextEra Event Planners!</h3>
                <p>Your account has been created successfully. You can now book events and start planning your special occasions.</p>
            </div>
            <button class="welcome-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    welcomeNotification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #28a745, #20c997);
        color: white;
        padding: 1.5rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(40, 167, 69, 0.3);
        z-index: 1001;
        max-width: 400px;
        animation: slideInRight 0.5s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        .welcome-content {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
        }
        .welcome-icon {
            font-size: 2rem;
            color: white;
        }
        .welcome-text h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1.2rem;
        }
        .welcome-text p {
            margin: 0;
            font-size: 0.9rem;
            opacity: 0.9;
        }
        .welcome-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        .welcome-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(welcomeNotification);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
        if (welcomeNotification.parentNode) {
            welcomeNotification.style.animation = 'slideInRight 0.5s ease reverse';
            setTimeout(() => {
                if (welcomeNotification.parentNode) {
                    welcomeNotification.parentNode.removeChild(welcomeNotification);
                }
            }, 500);
        }
    }, 10000);
}

// Show login success message
function showLoginSuccessMessage(userName) {
    const loginNotification = document.createElement('div');
    loginNotification.className = 'login-notification';
    loginNotification.innerHTML = `
        <div class="login-content">
            <div class="login-icon">
                <i class="fas fa-user-check"></i>
            </div>
            <div class="login-text">
                <h3>Welcome back, ${userName}!</h3>
                <p>You are now logged in. You can book events and manage your account.</p>
            </div>
            <button class="login-close" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    loginNotification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #17a2b8, #138496);
        color: white;
        padding: 1.5rem;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(23, 162, 184, 0.3);
        z-index: 1001;
        max-width: 400px;
        animation: slideInRight 0.5s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        .login-content {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
        }
        .login-icon {
            font-size: 2rem;
            color: white;
        }
        .login-text h3 {
            margin: 0 0 0.5rem 0;
            font-size: 1.2rem;
        }
        .login-text p {
            margin: 0;
            font-size: 0.9rem;
            opacity: 0.9;
        }
        .login-close {
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 50%;
            transition: background 0.3s ease;
        }
        .login-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(loginNotification);
    
    // Auto remove after 8 seconds
    setTimeout(() => {
        if (loginNotification.parentNode) {
            loginNotification.style.animation = 'slideInRight 0.5s ease reverse';
            setTimeout(() => {
                if (loginNotification.parentNode) {
                    loginNotification.parentNode.removeChild(loginNotification);
                }
            }, 500);
        }
    }, 8000);
}

// Update navigation for logged-in user
function updateNavigationForLoggedInUser() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        try {
            const user = JSON.parse(userData);
            
            // Find the login and register links
            const loginLink = document.querySelector('a[href="login.html"]');
            const registerLink = document.querySelector('a[href="register.html"]');
            
            if (loginLink && registerLink) {
                // Replace login and register with user menu
                const userMenu = document.createElement('li');
                userMenu.className = 'nav-item';
                userMenu.innerHTML = `
                    <div class="user-menu">
                        <div class="user-info">
                            <i class="fas fa-user-circle"></i>
                            <span>${user.fullName || user.email}</span>
                        </div>
                        <div class="user-dropdown">
                            <a href="#" class="dropdown-item" data-action="profile">
                                <i class="fas fa-user"></i> Profile
                            </a>
                            <a href="#" class="dropdown-item" data-action="logout">
                                <i class="fas fa-sign-out-alt"></i> Logout
                            </a>
                        </div>
                    </div>
                `;
                
                // Replace the login and register links
                loginLink.parentElement.replaceWith(userMenu);
                registerLink.parentElement.remove();
                
                // Add user menu styles
                addUserMenuStyles();
                
                // Add event delegation for dropdown items
                setupUserMenuEvents();
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    }
}

// Add user menu styles
function addUserMenuStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .user-menu {
            position: relative;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.6rem 1rem;
            border-radius: 8px;
            background: linear-gradient(135deg, #17a2b8, #138496);
            color: white;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .user-menu:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(23, 162, 184, 0.4);
        }
        
        .user-info {
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .user-info i {
            font-size: 1.2rem;
        }
        
        .user-dropdown {
            position: absolute;
            top: 100%;
            right: 0;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            min-width: 150px;
            opacity: 0;
            visibility: hidden;
            transform: translateY(-10px);
            transition: all 0.3s ease;
            z-index: 1000;
        }
        
        .user-menu:hover .user-dropdown {
            opacity: 1;
            visibility: visible;
            transform: translateY(0);
        }
        
        .dropdown-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            color: #333;
            text-decoration: none;
            transition: background 0.3s ease;
        }
        
        .dropdown-item:hover {
            background: #f8f9fa;
        }
        
        .dropdown-item i {
            width: 16px;
            text-align: center;
        }
    `;
    document.head.appendChild(style);
}

// Setup user menu event delegation
function setupUserMenuEvents() {
    // Use event delegation to handle clicks on dropdown items
    document.addEventListener('click', function(event) {
        if (event.target.closest('.dropdown-item')) {
            event.preventDefault();
            const action = event.target.closest('.dropdown-item').getAttribute('data-action');
            
            if (action === 'profile') {
                viewProfile();
            } else if (action === 'logout') {
                logout();
            }
        }
    });
}

// User functions
function viewProfile() {
    // Redirect to profile page
    window.location.href = 'profile.html';
}

function logout() {
    // Show confirmation dialog
    if (confirm('Are you sure you want to logout?')) {
        // Clear user data
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        
        // Show logout message
        const logoutNotification = document.createElement('div');
        logoutNotification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #6c757d, #495057);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(108, 117, 125, 0.3);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
        `;
        logoutNotification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-sign-out-alt"></i>
                <span>Logged out successfully</span>
            </div>
        `;
        
        document.body.appendChild(logoutNotification);
        
        // Reload page to reset navigation
        setTimeout(() => {
            window.location.reload();
        }, 1500);
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', setupLazyLoading);
