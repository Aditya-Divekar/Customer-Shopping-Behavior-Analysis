// Profile Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeProfile();
    setupUserMenuEvents();
});

// Setup user menu event delegation
function setupUserMenuEvents() {
    // Use event delegation to handle clicks on all interactive elements
    document.addEventListener('click', function(event) {
        const target = event.target.closest('[data-action]');
        if (target) {
            event.preventDefault();
            const action = target.getAttribute('data-action');
            
            switch (action) {
                case 'logout':
                    logout();
                    break;
                case 'edit-profile':
                    editProfile();
                    break;
                case 'show-tab':
                    const tabName = target.getAttribute('data-tab');
                    showTab(tabName);
                    break;
                case 'refresh-bookings':
                    refreshBookings();
                    break;
                case 'update-settings':
                    updateSettings();
                    break;
                case 'reset-settings':
                    resetSettings();
                    break;
                case 'change-password':
                    changePassword();
                    break;
                case 'delete-account':
                    deleteAccount();
                    break;
                case 'close-edit-modal':
                    closeEditModal();
                    break;
                case 'save-profile':
                    saveProfile();
                    break;
                case 'close-password-modal':
                    closePasswordModal();
                    break;
                case 'save-password':
                    savePassword();
                    break;
            }
        }
    });
}

function initializeProfile() {
    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    const userToken = localStorage.getItem('userToken');
    
    if (!userData || !userToken) {
        // Redirect to login if not authenticated
        window.location.href = 'login.html';
        return;
    }
    
    try {
        const user = JSON.parse(userData);
        loadUserProfile(user);
        loadUserBookings();
        loadUserStats();
    } catch (error) {
        console.error('Error parsing user data:', error);
        window.location.href = 'login.html';
    }
}

function loadUserProfile(user) {
    // Update profile header
    document.getElementById('profileName').textContent = user.fullName || user.email;
    document.getElementById('profileEmail').textContent = user.email;
    document.getElementById('userName').textContent = user.fullName || user.email;
    
    // Set member since date
    const memberSince = new Date(user.createdAt || Date.now()).toLocaleDateString();
    document.getElementById('memberSince').textContent = memberSince;
    document.getElementById('accountCreated').textContent = memberSince;
    
    // Update settings form
    document.getElementById('fullName').value = user.fullName || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('newsletter').checked = user.newsletter || false;
    
    // Update newsletter status
    document.getElementById('newsletterStatus').textContent = user.newsletter ? 'Yes' : 'No';
}

async function loadUserBookings() {
    const bookingsList = document.getElementById('bookingsList');
    
    try {
        const userToken = localStorage.getItem('userToken');
        const response = await fetch('/api/events', {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });
        
        const result = await response.json();
        
        if (result.success && result.data) {
            displayBookings(result.data);
        } else {
            showNoBookings();
        }
    } catch (error) {
        console.error('Error loading bookings:', error);
        showNoBookings();
    }
}

function displayBookings(bookings) {
    const bookingsList = document.getElementById('bookingsList');
    
    if (bookings.length === 0) {
        showNoBookings();
        return;
    }
    
    bookingsList.innerHTML = bookings.map(booking => `
        <div class="booking-card">
            <div class="booking-header">
                <h3 class="booking-title">${booking.eventType} Event</h3>
                <span class="booking-status ${getBookingStatus(booking)}">${getBookingStatus(booking)}</span>
            </div>
            <div class="booking-details">
                <div class="booking-detail">
                    <label>Event Date</label>
                    <span>${new Date(booking.eventDate).toLocaleDateString()}</span>
                </div>
                <div class="booking-detail">
                    <label>Venue</label>
                    <span>${booking.venue || 'Not specified'}</span>
                </div>
                <div class="booking-detail">
                    <label>Guest Count</label>
                    <span>${booking.guestCount || 'Not specified'}</span>
                </div>
                <div class="booking-detail">
                    <label>Budget</label>
                    <span>${booking.budget || 'Not specified'}</span>
                </div>
            </div>
            ${booking.additionalInfo ? `
                <div class="booking-notes">
                    <label>Additional Information:</label>
                    <p>${booking.additionalInfo}</p>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function showNoBookings() {
    const bookingsList = document.getElementById('bookingsList');
    bookingsList.innerHTML = `
        <div class="no-bookings">
            <div style="text-align: center; padding: 3rem; color: #6c757d;">
                <i class="fas fa-calendar-plus" style="font-size: 3rem; margin-bottom: 1rem; opacity: 0.5;"></i>
                <h3>No Bookings Yet</h3>
                <p>You haven't made any event bookings yet.</p>
                <a href="index.html#booking" class="btn btn-primary" style="margin-top: 1rem;">
                    <i class="fas fa-plus"></i> Book Your First Event
                </a>
            </div>
        </div>
    `;
}

function getBookingStatus(booking) {
    // Simple status logic - you can enhance this based on your business logic
    const eventDate = new Date(booking.eventDate);
    const now = new Date();
    
    if (eventDate < now) {
        return 'completed';
    } else if (eventDate.getTime() - now.getTime() < 7 * 24 * 60 * 60 * 1000) {
        return 'confirmed';
    } else {
        return 'pending';
    }
}

async function loadUserStats() {
    try {
        const userToken = localStorage.getItem('userToken');
        
        // Load bookings count
        const bookingsResponse = await fetch('/api/events', {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });
        const bookingsResult = await bookingsResponse.json();
        const bookingsCount = bookingsResult.success ? bookingsResult.data.length : 0;
        
        // Load messages count
        const messagesResponse = await fetch('/api/contact', {
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });
        const messagesResult = await messagesResponse.json();
        const messagesCount = messagesResult.success ? messagesResult.data.length : 0;
        
        // Calculate total spent (simplified)
        const totalSpent = bookingsCount * 500; // Assuming average $500 per booking
        
        // Update stats
        document.getElementById('totalBookings').textContent = bookingsCount;
        document.getElementById('totalSpent').textContent = `$${totalSpent.toLocaleString()}`;
        document.getElementById('messagesSent').textContent = messagesCount;
        
    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// Tab functionality
function showTab(tabName) {
    // Hide all tab contents
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab content
    document.getElementById(tabName).classList.add('active');
    
    // Add active class to clicked tab button
    event.target.classList.add('active');
    
    // Load data for specific tabs
    if (tabName === 'bookings') {
        loadUserBookings();
    }
}

// Profile editing functions
function editProfile() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    // Populate edit form
    document.getElementById('editFullName').value = userData.fullName || '';
    document.getElementById('editEmail').value = userData.email || '';
    document.getElementById('editPhone').value = userData.phone || '';
    
    // Show modal
    document.getElementById('editProfileModal').classList.add('active');
}

function closeEditModal() {
    document.getElementById('editProfileModal').classList.remove('active');
}

async function saveProfile() {
    const form = document.getElementById('editProfileForm');
    const formData = new FormData(form);
    
    const updateData = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone')
    };
    
    try {
        const userToken = localStorage.getItem('userToken');
        const response = await fetch('/api/auth/profile', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify(updateData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Update local storage
            const userData = JSON.parse(localStorage.getItem('userData'));
            userData.fullName = updateData.fullName;
            userData.email = updateData.email;
            userData.phone = updateData.phone;
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Update profile display
            loadUserProfile(userData);
            
            // Close modal
            closeEditModal();
            
            // Show success message
            showNotification('Profile updated successfully!', 'success');
        } else {
            showNotification(result.message || 'Failed to update profile', 'error');
        }
    } catch (error) {
        console.error('Error updating profile:', error);
        showNotification('Network error. Please try again.', 'error');
    }
}

// Settings functions
async function updateSettings() {
    const settingsData = {
        phone: document.getElementById('phone').value,
        newsletter: document.getElementById('newsletter').checked
    };
    
    try {
        const userToken = localStorage.getItem('userToken');
        const response = await fetch('/api/auth/settings', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify(settingsData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Update local storage
            const userData = JSON.parse(localStorage.getItem('userData'));
            userData.phone = settingsData.phone;
            userData.newsletter = settingsData.newsletter;
            localStorage.setItem('userData', JSON.stringify(userData));
            
            // Update display
            loadUserProfile(userData);
            
            showNotification('Settings updated successfully!', 'success');
        } else {
            showNotification(result.message || 'Failed to update settings', 'error');
        }
    } catch (error) {
        console.error('Error updating settings:', error);
        showNotification('Network error. Please try again.', 'error');
    }
}

function resetSettings() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    document.getElementById('phone').value = userData.phone || '';
    document.getElementById('newsletter').checked = userData.newsletter || false;
}

// Password change functions
function changePassword() {
    document.getElementById('changePasswordModal').classList.add('active');
}

function closePasswordModal() {
    document.getElementById('changePasswordModal').classList.remove('active');
    document.getElementById('changePasswordForm').reset();
}

async function savePassword() {
    const form = document.getElementById('changePasswordForm');
    const formData = new FormData(form);
    
    const passwordData = {
        currentPassword: formData.get('currentPassword'),
        newPassword: formData.get('newPassword'),
        confirmPassword: formData.get('confirmPassword')
    };
    
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
        showNotification('New passwords do not match', 'error');
        return;
    }
    
    // Validate password length
    if (passwordData.newPassword.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    
    try {
        const userToken = localStorage.getItem('userToken');
        const response = await fetch('/api/auth/change-password', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify(passwordData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            closePasswordModal();
            showNotification('Password changed successfully!', 'success');
        } else {
            showNotification(result.message || 'Failed to change password', 'error');
        }
    } catch (error) {
        console.error('Error changing password:', error);
        showNotification('Network error. Please try again.', 'error');
    }
}

// Account deletion
function deleteAccount() {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        if (confirm('This will permanently delete your account and all associated data. Are you absolutely sure?')) {
            performAccountDeletion();
        }
    }
}

async function performAccountDeletion() {
    try {
        const userToken = localStorage.getItem('userToken');
        const response = await fetch('/api/auth/delete-account', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${userToken}`
            }
        });
        
        const result = await response.json();
        
        if (result.success) {
            // Clear local storage
            localStorage.removeItem('userToken');
            localStorage.removeItem('userData');
            
            // Show success message
            showNotification('Account deleted successfully', 'success');
            
            // Redirect to homepage
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            showNotification(result.message || 'Failed to delete account', 'error');
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        showNotification('Network error. Please try again.', 'error');
    }
}

// Refresh bookings
function refreshBookings() {
    const refreshBtn = event.target;
    const originalText = refreshBtn.innerHTML;
    
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Refreshing...';
    refreshBtn.disabled = true;
    
    loadUserBookings();
    
    setTimeout(() => {
        refreshBtn.innerHTML = originalText;
        refreshBtn.disabled = false;
    }, 1000);
}

// Logout function (from main script)
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        
        showNotification('Logged out successfully', 'success');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    }
}

// Notification function
function showNotification(message, type = 'info') {
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
    
    document.body.appendChild(notification);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
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
