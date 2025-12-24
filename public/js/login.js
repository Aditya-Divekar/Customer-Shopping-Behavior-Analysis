// Login Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    const successMessage = document.getElementById('successMessage');
    const loginBtn = document.getElementById('loginBtn');
    const loginBtnText = document.getElementById('loginBtnText');
    const loginBtnLoading = document.getElementById('loginBtnLoading');
    const togglePassword = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('loginPassword');

    // Password toggle functionality
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }

    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    async function handleLogin(event) {
        event.preventDefault();
        
        // Hide any previous messages
        hideMessages();
        
        // Get form data
        const formData = new FormData(loginForm);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        // Validate form
        if (!validateForm(loginData)) {
            return;
        }

        // Show loading state
        setLoadingState(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();

            if (result.success) {
                // Store user data and token
                localStorage.setItem('userToken', result.token);
                localStorage.setItem('userData', JSON.stringify(result.data.user));
                
                // Show success message
                showSuccessMessage();
                
                // Redirect to homepage with user info
                setTimeout(() => {
                    const userName = result.data.user.fullName || result.data.user.email;
                    window.location.href = `index.html?loggedin=true&user=${encodeURIComponent(userName)}`;
                }, 2000);
            } else {
                showError(result.message || 'Login failed. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            showError('Network error. Please check your connection and try again.');
        } finally {
            setLoadingState(false);
        }
    }

    function validateForm(data) {
        if (!data.email || !data.password) {
            showError('Please fill in all required fields.');
            return false;
        }

        if (!isValidEmail(data.email)) {
            showError('Please enter a valid email address.');
            return false;
        }

        if (data.password.length < 6) {
            showError('Password must be at least 6 characters long.');
            return false;
        }

        return true;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showError(message) {
        errorText.textContent = message;
        errorMessage.classList.remove('hidden');
        
        // Add shake animation
        loginForm.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            loginForm.style.animation = '';
        }, 500);
    }

    function showSuccessMessage() {
        loginForm.classList.add('hidden');
        successMessage.classList.remove('hidden');
    }

    function hideMessages() {
        errorMessage.classList.add('hidden');
        successMessage.classList.add('hidden');
    }

    function setLoadingState(loading) {
        if (loading) {
            loginBtn.disabled = true;
            loginBtnText.classList.add('hidden');
            loginBtnLoading.classList.remove('hidden');
        } else {
            loginBtn.disabled = false;
            loginBtnText.classList.remove('hidden');
            loginBtnLoading.classList.add('hidden');
        }
    }

    // Add shake animation CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    // Auto-focus on email field
    const emailInput = document.getElementById('loginEmail');
    if (emailInput) {
        emailInput.focus();
    }

    // Add input validation styling
    const inputs = document.querySelectorAll('input[required]');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.value.trim() === '') {
                this.classList.add('error');
            } else {
                this.classList.remove('error');
                this.classList.add('success');
            }
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('error') && this.value.trim() !== '') {
                this.classList.remove('error');
                this.classList.add('success');
            }
        });
    });

    // Check if user is already logged in
    checkExistingLogin();
});

function checkExistingLogin() {
    const userToken = localStorage.getItem('userToken');
    const userData = localStorage.getItem('userData');
    
    if (userToken && userData) {
        try {
            const user = JSON.parse(userData);
            // User is already logged in, redirect to homepage
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1000);
        } catch (error) {
            // Invalid user data, clear it
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
        }
    }
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', function() {
    // Add floating particles effect
    createFloatingParticles();
    
    // Add form field animations
    addFormAnimations();
});

function createFloatingParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'floating-particles';
    particlesContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
        overflow: hidden;
    `;
    
    document.body.appendChild(particlesContainer);
    
    // Create particles
    for (let i = 0; i < 20; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.3);
        border-radius: 50%;
        animation: float-particle ${Math.random() * 10 + 10}s linear infinite;
        left: ${Math.random() * 100}%;
        top: 100%;
    `;
    
    container.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
        // Create new particle
        createParticle(container);
    }, (Math.random() * 10 + 10) * 1000);
}

// Add particle animation CSS
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes float-particle {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

function addFormAnimations() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.1}s`;
        group.classList.add('fade-in-up');
    });
    
    // Add animation CSS
    const animationStyle = document.createElement('style');
    animationStyle.textContent = `
        .fade-in-up {
            animation: fadeInUp 0.6s ease forwards;
            opacity: 0;
            transform: translateY(20px);
        }
        
        @keyframes fadeInUp {
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(animationStyle);
}
