// Contact Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeContactPage();
});

function initializeContactPage() {
    setupContactForm();
    setupFAQAccordion();
    setupContactAnimations();
    setupBusinessHours();
    setupFormValidation();
}

// Contact Form Handling
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactSubmit);
        
        // Real-time validation
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(this);
            });
        });
    }
}

async function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message'),
        eventDate: formData.get('eventDate'),
        guestCount: formData.get('guestCount'),
        budget: formData.get('budget'),
        newsletter: formData.get('newsletter') === 'on'
    };
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
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
            showNotification('Message sent successfully! We will get back to you within 24 hours.', 'success');
            e.target.reset();
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
        submitBtn.classList.remove('loading');
    }
}

// Form Validation
function setupFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name;
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous error
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = `${getFieldLabel(fieldName)} is required.`;
    }
    
    // Specific validations
    if (value && isValid) {
        switch (fieldName) {
            case 'name':
                if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters long.';
                }
                break;
                
            case 'email':
                if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
                break;
                
            case 'phone':
                if (!/^[\+]?[1-9][\d]{9,14}$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid phone number.';
                }
                break;
                
            case 'eventDate':
                if (value) {
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    
                    if (selectedDate < today) {
                        isValid = false;
                        errorMessage = 'Event date must be in the future.';
                    }
                }
                break;
                
            case 'guestCount':
                if (value) {
                    const guestCount = parseInt(value);
                    if (guestCount < 1 || guestCount > 10000) {
                        isValid = false;
                        errorMessage = 'Guest count must be between 1 and 10,000.';
                    }
                }
                break;
                
            case 'message':
                if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters long.';
                }
                break;
        }
    }
    
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function getFieldLabel(fieldName) {
    const labels = {
        name: 'Full Name',
        email: 'Email Address',
        phone: 'Phone Number',
        subject: 'Subject',
        message: 'Message',
        eventDate: 'Event Date',
        guestCount: 'Guest Count',
        budget: 'Budget Range'
    };
    return labels[fieldName] || fieldName;
}

function showFieldError(field, message) {
    field.classList.add('field-error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error-message';
    errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('field-error');
    const errorMessage = field.parentNode.querySelector('.field-error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// FAQ Accordion
function setupFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });
}

// Contact Animations
function setupContactAnimations() {
    const contactMethods = document.querySelectorAll('.contact-method');
    const formContainer = document.querySelector('.contact-form-container');
    const faqItems = document.querySelectorAll('.faq-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    [...contactMethods, formContainer, ...faqItems].forEach(element => {
        if (element) {
            observer.observe(element);
        }
    });
}

// Business Hours Status
function setupBusinessHours() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.querySelector('.status-indicator span:last-child');
    
    if (statusDot && statusText) {
        function updateBusinessStatus() {
            const now = new Date();
            const day = now.getDay(); // 0 = Sunday, 1 = Monday, etc.
            const hour = now.getHours();
            
            let isOpen = false;
            let status = '';
            
            // Monday to Friday: 9 AM - 6 PM
            if (day >= 1 && day <= 5 && hour >= 9 && hour < 18) {
                isOpen = true;
                status = 'Currently Open';
            }
            // Saturday: 10 AM - 4 PM
            else if (day === 6 && hour >= 10 && hour < 16) {
                isOpen = true;
                status = 'Currently Open';
            }
            else {
                isOpen = false;
                if (day === 0) {
                    status = 'Closed (Sunday)';
                } else if (hour < 9) {
                    status = 'Opens at 9:00 AM';
                } else if (hour >= 18) {
                    status = 'Closed for Today';
                } else {
                    status = 'Currently Closed';
                }
            }
            
            statusDot.style.background = isOpen ? '#27ae60' : '#e74c3c';
            statusText.textContent = status;
        }
    
        // Update status immediately and then every minute
        updateBusinessStatus();
        setInterval(updateBusinessStatus, 60000);
    }
}

// Contact Method Interactions
function setupContactMethodInteractions() {
    const contactMethods = document.querySelectorAll('.contact-method');
    
    contactMethods.forEach(method => {
        method.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        method.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Social Media Links
function setupSocialMediaLinks() {
    const socialLinks = document.querySelectorAll('.social-media .social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.querySelector('span').textContent;
            showNotification(`Opening ${platform} profile...`, 'info');
            
            // You can implement actual social media links here
            // For example:
            // window.open('https://facebook.com/idealmemory', '_blank');
        });
    });
}

// Map Placeholder Click Handler
function setupMapInteraction() {
    const mapPlaceholder = document.querySelector('.map-placeholder');
    
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function() {
            showNotification('Interactive map feature coming soon!', 'info');
            
            // You can implement actual map integration here
            // For example, with Google Maps API:
            // initializeGoogleMap();
        });
    }
}

// Phone Number Formatting
function setupPhoneFormatting() {
    const phoneInput = document.getElementById('phone');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            let value = this.value.replace(/\D/g, '');
            
            if (value.length >= 10) {
                value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
            }
            
            this.value = value;
        });
    }
}

// Auto-resize Textarea
function setupTextareaAutoResize() {
    const textarea = document.querySelector('textarea[name="message"]');
    
    if (textarea) {
        textarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        });
    }
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    setupContactMethodInteractions();
    setupSocialMediaLinks();
    setupMapInteraction();
    setupPhoneFormatting();
    setupTextareaAutoResize();
});

// Utility function for notifications (if not already defined)
if (typeof showNotification === 'undefined') {
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
}
