// Registration Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const termsCheckbox = document.getElementById('terms');
    const newsletterCheckbox = document.getElementById('newsletter');

    // Real-time validation
    fullNameInput.addEventListener('input', validateFullName);
    emailInput.addEventListener('input', validateEmail);
    passwordInput.addEventListener('input', validatePassword);
    confirmPasswordInput.addEventListener('input', validateConfirmPassword);
    termsCheckbox.addEventListener('change', validateTerms);

    // Form submission
    form.addEventListener('submit', handleFormSubmission);

    // Password strength indicator
    passwordInput.addEventListener('input', updatePasswordStrength);

    function validateFullName() {
        const value = fullNameInput.value.trim();
        const errorElement = document.getElementById('fullNameError');
        
        if (value.length < 2) {
            showError(fullNameInput, errorElement, 'Full name must be at least 2 characters long');
            return false;
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
            showError(fullNameInput, errorElement, 'Full name can only contain letters and spaces');
            return false;
        } else {
            showSuccess(fullNameInput, errorElement);
            return true;
        }
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        const errorElement = document.getElementById('emailError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!value) {
            showError(emailInput, errorElement, 'Email address is required');
            return false;
        } else if (!emailRegex.test(value)) {
            showError(emailInput, errorElement, 'Please enter a valid email address');
            return false;
        } else {
            showSuccess(emailInput, errorElement);
            return true;
        }
    }

    function validatePassword() {
        const value = passwordInput.value;
        const errorElement = document.getElementById('passwordError');
        
        if (value.length < 8) {
            showError(passwordInput, errorElement, 'Password must be at least 8 characters long');
            return false;
        } else if (!/(?=.*[a-z])/.test(value)) {
            showError(passwordInput, errorElement, 'Password must contain at least one lowercase letter');
            return false;
        } else if (!/(?=.*[A-Z])/.test(value)) {
            showError(passwordInput, errorElement, 'Password must contain at least one uppercase letter');
            return false;
        } else if (!/(?=.*\d)/.test(value)) {
            showError(passwordInput, errorElement, 'Password must contain at least one number');
            return false;
        } else if (!/(?=.*[@$!%*?&])/.test(value)) {
            showError(passwordInput, errorElement, 'Password must contain at least one special character (@$!%*?&)');
            return false;
        } else {
            showSuccess(passwordInput, errorElement);
            return true;
        }
    }

    function validateConfirmPassword() {
        const value = confirmPasswordInput.value;
        const passwordValue = passwordInput.value;
        const errorElement = document.getElementById('confirmPasswordError');
        
        if (!value) {
            showError(confirmPasswordInput, errorElement, 'Please confirm your password');
            return false;
        } else if (value !== passwordValue) {
            showError(confirmPasswordInput, errorElement, 'Passwords do not match');
            return false;
        } else {
            showSuccess(confirmPasswordInput, errorElement);
            return true;
        }
    }

    function validateTerms() {
        const errorElement = document.getElementById('termsError');
        
        if (!termsCheckbox.checked) {
            showError(termsCheckbox, errorElement, 'You must agree to the terms and conditions');
            return false;
        } else {
            showSuccess(termsCheckbox, errorElement);
            return true;
        }
    }

    function updatePasswordStrength() {
        const password = passwordInput.value;
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        
        let score = 0;
        let feedback = '';

        // Length check
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;

        // Character variety checks
        if (/[a-z]/.test(password)) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[@$!%*?&]/.test(password)) score++;

        // Remove all strength classes
        strengthFill.classList.remove('weak', 'fair', 'good', 'strong');

        if (password.length === 0) {
            strengthText.textContent = 'Password strength';
            return;
        }

        if (score <= 2) {
            strengthFill.classList.add('weak');
            feedback = 'Weak';
        } else if (score <= 4) {
            strengthFill.classList.add('fair');
            feedback = 'Fair';
        } else if (score <= 5) {
            strengthFill.classList.add('good');
            feedback = 'Good';
        } else {
            strengthFill.classList.add('strong');
            feedback = 'Strong';
        }

        strengthText.textContent = `Password strength: ${feedback}`;
    }

    function showError(input, errorElement, message) {
        input.classList.remove('success');
        input.classList.add('error');
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }

    function showSuccess(input, errorElement) {
        input.classList.remove('error');
        input.classList.add('success');
        errorElement.textContent = '';
        errorElement.style.display = 'none';
    }

    function validateAllFields() {
        const isFullNameValid = validateFullName();
        const isEmailValid = validateEmail();
        const isPasswordValid = validatePassword();
        const isConfirmPasswordValid = validateConfirmPassword();
        const isTermsValid = validateTerms();

        return isFullNameValid && isEmailValid && isPasswordValid && isConfirmPasswordValid && isTermsValid;
    }

    async function handleFormSubmission(e) {
        e.preventDefault();

        // Validate all fields
        if (!validateAllFields()) {
            showNotification('Please fix the errors in the form', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        // Show loading state
        submitBtn.innerHTML = '<span class="loading"></span> Creating Account...';
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Prepare form data
            const formData = {
                fullName: fullNameInput.value.trim(),
                email: emailInput.value.trim(),
                password: passwordInput.value,
                newsletter: newsletterCheckbox.checked
            };

            // Simulate API call (replace with actual API endpoint)
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                // Show success notification
                showNotification('Registration successful! Redirecting to homepage...', 'success');
                
                // Clear form
                form.reset();
                clearAllValidations();
                
                // Redirect to main website after 2 seconds
                setTimeout(() => {
                    window.location.href = 'index.html?registered=true';
                }, 2000);
            } else {
                showNotification(result.message || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Registration error:', error);
            showNotification('Network error. Please check your connection and try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.innerHTML = originalText;
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    function clearAllValidations() {
        const inputs = [fullNameInput, emailInput, passwordInput, confirmPasswordInput];
        const errorElements = ['fullNameError', 'emailError', 'passwordError', 'confirmPasswordError', 'termsError'];

        inputs.forEach(input => {
            input.classList.remove('error', 'success');
        });

        errorElements.forEach(id => {
            const errorElement = document.getElementById(id);
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        });

        // Reset password strength
        const strengthFill = document.getElementById('strengthFill');
        const strengthText = document.getElementById('strengthText');
        strengthFill.classList.remove('weak', 'fair', 'good', 'strong');
        strengthText.textContent = 'Password strength';
    }

    function showSuccessModal() {
        const modal = document.getElementById('successModal');
        modal.style.display = 'block';
    }

    function showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#28a745' : '#dc3545'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
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
            .notification-content {
                display: flex;
                align-items: center;
            }
            .notification-content i {
                margin-right: 0.5rem;
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove notification after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
});

// Modal functions
function closeModal() {
    const modal = document.getElementById('successModal');
    modal.style.display = 'none';
}

function redirectToHomepage() {
    window.location.href = 'index.html?registered=true';
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('successModal');
    if (event.target === modal) {
        closeModal();
    }
});

// Mobile menu toggle (if needed)
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a link
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
});
document.getElementById('registrationForm').addEventListener('submit', function(e) {
    e.preventDefault();

    // Basic validation
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!fullName || !email || !password || !confirmPassword) {
        alert('Please fill in all required fields.');
        return;
    }
    if (password !== confirmPassword) {
        alert('Passwords do not match.');
        return;
    }

    // Show success modal
    const modal = document.getElementById('successModal');
    modal.style.display = 'block';

    // Redirect after 2 seconds
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 2000);
});

// Modal buttons
function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

function redirectToHomepage() {
    window.location.href = 'index.html';
}
