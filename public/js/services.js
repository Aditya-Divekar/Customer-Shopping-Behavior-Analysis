// Services Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeServicesPage();
});

function initializeServicesPage() {
    setupServiceAnimations();
    setupGalleryLightbox();
    setupFormValidation();
    setupScrollToRegistration();
    setupServiceFiltering();
}

// Service Card Animations
function setupServiceAnimations() {
    const serviceCards = document.querySelectorAll('.service-detail-card');
    
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
    
    serviceCards.forEach(card => {
        observer.observe(card);
    });
}

// Gallery Lightbox
function setupGalleryLightbox() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    
    galleryItems.forEach(img => {
        img.addEventListener('click', function() {
            openLightbox(this.src, this.alt);
        });
        
        // Add cursor pointer
        img.style.cursor = 'pointer';
    });
}

function openLightbox(src, alt) {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <button class="lightbox-close" aria-label="Close lightbox">
                <i class="fas fa-times"></i>
            </button>
            <img src="${src}" alt="${alt}" class="lightbox-image">
            <div class="lightbox-caption">${alt}</div>
        </div>
    `;
    
    // Add styles
    lightbox.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const lightboxContent = lightbox.querySelector('.lightbox-content');
    lightboxContent.style.cssText = `
        position: relative;
        max-width: 90%;
        max-height: 90%;
        display: flex;
        flex-direction: column;
        align-items: center;
    `;
    
    const lightboxClose = lightbox.querySelector('.lightbox-close');
    lightboxClose.style.cssText = `
        position: absolute;
        top: -50px;
        right: 0;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
        padding: 10px;
        border-radius: 50%;
        transition: background-color 0.2s ease;
    `;
    
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    lightboxImage.style.cssText = `
        max-width: 100%;
        max-height: 80vh;
        object-fit: contain;
        border-radius: 10px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
    `;
    
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    lightboxCaption.style.cssText = `
        color: white;
        text-align: center;
        margin-top: 1rem;
        font-size: 1.1rem;
        max-width: 500px;
    `;
    
    // Add to document
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';
    
    // Animate in
    setTimeout(() => {
        lightbox.style.opacity = '1';
    }, 10);
    
    // Close functionality
    const closeLightbox = () => {
        lightbox.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(lightbox);
            document.body.style.overflow = '';
        }, 300);
    };
    
    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    
    // Keyboard support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
}

// Form Validation
function setupFormValidation() {
    const form = document.getElementById('event-registration-form');
    if (!form) return;
    
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        // Real-time validation
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            clearFieldError(this);
        });
    });
    
    // Form submission validation
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            handleFormSubmission(form);
        } else {
            showNotification('Please correct the errors in the form before submitting.', 'error');
            // Scroll to first error
            const firstError = form.querySelector('.field-error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
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
                
            case 'mobile':
                if (!/^[\+]?[1-9][\d]{9,14}$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid mobile number.';
                }
                break;
                
            case 'email':
                if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address.';
                }
                break;
                
            case 'eventDate':
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    isValid = false;
                    errorMessage = 'Event date must be in the future.';
                }
                break;
                
            case 'guestCount':
                const guestCount = parseInt(value);
                if (guestCount < 1 || guestCount > 10000) {
                    isValid = false;
                    errorMessage = 'Guest count must be between 1 and 10,000.';
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
        mobile: 'Mobile Number',
        email: 'Email Address',
        eventType: 'Event Type',
        eventDate: 'Event Date',
        venue: 'Event Venue',
        guestCount: 'Guest Count',
        budget: 'Budget Range',
        additionalInfo: 'Additional Information'
    };
    return labels[fieldName] || fieldName;
}

function showFieldError(field, message) {
    field.classList.add('field-error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        color: var(--accent-color);
        font-size: 0.875rem;
        margin-top: 0.25rem;
        display: flex;
        align-items: center;
        gap: 0.25rem;
    `;
    
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

async function handleFormSubmission(form) {
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        mobile: formData.get('mobile'),
        email: formData.get('email'),
        eventType: formData.get('eventType'),
        eventDate: formData.get('eventDate'),
        venue: formData.get('venue'),
        guestCount: formData.get('guestCount') ? parseInt(formData.get('guestCount')) : undefined,
        budget: formData.get('budget'),
        additionalInfo: formData.get('additionalInfo')
    };
    
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Submitting...';
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    
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
            showNotification('Event registration successful! We will contact you within 24 hours with a customized quote.', 'success');
            form.reset();
            
            // Scroll to top of form
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        submitBtn.classList.remove('loading');
    }
}

// Scroll to Registration Section
function setupScrollToRegistration() {
    const registrationLinks = document.querySelectorAll('a[href="#event-registration"]');
    
    registrationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.getElementById('event-registration');
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

// Service Filtering (if needed in future)
function setupServiceFiltering() {
    // This can be expanded if we add filtering functionality
    const serviceCards = document.querySelectorAll('.service-detail-card');
    
    // Add data attributes for filtering
    serviceCards.forEach((card, index) => {
        const serviceType = card.getAttribute('data-service');
        card.setAttribute('data-index', index);
        
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Price Calculator (Future Enhancement)
function setupPriceCalculator() {
    // This can be implemented if we want to add a price calculator
    const eventTypeSelect = document.getElementById('eventType');
    const guestCountInput = document.getElementById('guestCount');
    const priceDisplay = document.getElementById('price-display');
    
    if (eventTypeSelect && guestCountInput && priceDisplay) {
        const calculatePrice = () => {
            const eventType = eventTypeSelect.value;
            const guestCount = parseInt(guestCountInput.value) || 0;
            
            const basePrices = {
                'Wedding': 250000,
                'Birthday Party': 15000,
                'Conference': 75000,
                'Corporate Event': 75000,
                'Catering': 500
            };
            
            if (eventType && guestCount > 0) {
                let price = basePrices[eventType] || 50000;
                
                if (eventType === 'Catering') {
                    price = price * guestCount;
                } else if (guestCount > 100) {
                    price = price * (1 + (guestCount - 100) * 0.01);
                }
                
                priceDisplay.textContent = `Estimated Price: ₹${price.toLocaleString()}`;
                priceDisplay.style.display = 'block';
            } else {
                priceDisplay.style.display = 'none';
            }
        };
        
        eventTypeSelect.addEventListener('change', calculatePrice);
        guestCountInput.addEventListener('input', calculatePrice);
    }
}

// Image Lazy Loading Enhancement
function setupEnhancedLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Add loading animation
                    img.style.opacity = '0';
                    img.style.transition = 'opacity 0.3s ease';
                    
                    img.onload = () => {
                        img.style.opacity = '1';
                    };
                    
                    // Load image
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize enhanced features
document.addEventListener('DOMContentLoaded', function() {
    setupPriceCalculator();
    setupEnhancedLazyLoading();
});

// Utility function for notifications (if not already defined in main script)
if (typeof showNotification === 'undefined') {
    function showNotification(message, type = 'info') {
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
