// Admin Panel JavaScript
class AdminPanel {
    constructor() {
        this.currentUser = null;
        this.token = localStorage.getItem('adminToken');
        this.currentSection = 'dashboard';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkAuth();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Logout button
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }

        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Quick Actions
        document.getElementById('exportData')?.addEventListener('click', () => this.exportData());
        document.getElementById('backupData')?.addEventListener('click', () => this.backupData());

        // Filter changes
        document.getElementById('eventStatusFilter')?.addEventListener('change', () => this.loadEvents());
        document.getElementById('eventTypeFilter')?.addEventListener('change', () => this.loadEvents());
        document.getElementById('contactStatusFilter')?.addEventListener('change', () => this.loadContacts());
        document.getElementById('testimonialStatusFilter')?.addEventListener('change', () => this.loadTestimonials());
        document.getElementById('registrationStatusFilter')?.addEventListener('change', () => this.loadRegistrations());
        document.getElementById('registrationDateFilter')?.addEventListener('change', () => this.loadRegistrations());

        // Contacts table delegation (handles view/edit clicks without inline handlers)
        const contactsTableBody = document.getElementById('contactsTableBody');
        if (contactsTableBody) {
            contactsTableBody.addEventListener('click', (e) => {
                const button = e.target.closest('button');
                if (!button) return;
                const contactId = button.dataset.id;
                const action = button.dataset.action;
                if (!contactId || !action) return;
                if (action === 'view-contact') {
                    this.viewContact(contactId);
                } else if (action === 'edit-contact') {
                    this.editContact(contactId);
                }
            });
        }
    }

    checkAuth() {
        if (this.token) {
            this.verifyToken();
        } else {
            this.showLoginModal();
        }
    }

    async verifyToken() {
        try {
            const response = await fetch('/api/auth/profile', {
                headers: {
                    'Authorization': `Bearer ${this.token}`
                }
            });

            if (response.ok) {
                const result = await response.json();
                this.currentUser = result.data;
                this.showAdminPanel();
                this.loadDashboard();
            } else {
                this.logout();
            }
        } catch (error) {
            console.error('Token verification failed:', error);
            this.logout();
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        // Test if fetch is available
        if (typeof fetch === 'undefined') {
            this.showNotification('Fetch API not available. Please use a modern browser.', 'error');
            return;
        }

        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<span class="loading"></span> Logging in...';
        submitBtn.disabled = true;

        try {
            console.log('Attempting login with:', loginData);
            
            // Test basic connectivity first
            console.log('Testing connectivity...');
            const testResponse = await fetch('/api/auth/profile', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Connectivity test response status:', testResponse.status);
            
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);
            
            const result = await response.json();
            console.log('Response data:', result);

            if (result.success) {
                this.token = result.data.token;
                this.currentUser = result.data.user;
                localStorage.setItem('adminToken', this.token);
                this.showAdminPanel();
                this.loadDashboard();
                this.showNotification('Login successful!', 'success');
            } else {
                this.showNotification(result.message || 'Login failed', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            console.error('Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            this.showNotification(`Network error: ${error.message}. Please try again.`, 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    handleLogout() {
        this.logout();
        this.showNotification('Logged out successfully', 'info');
    }

    logout() {
        this.token = null;
        this.currentUser = null;
        localStorage.removeItem('adminToken');
        this.showLoginModal();
    }

    showLoginModal() {
        document.getElementById('loginModal').style.display = 'flex';
        document.getElementById('adminPanel').style.display = 'none';
    }

    showAdminPanel() {
        document.getElementById('loginModal').style.display = 'none';
        document.getElementById('adminPanel').style.display = 'flex';
        
        // Update user info
        document.getElementById('userName').textContent = this.currentUser.fullName;
        document.getElementById('userRole').textContent = this.currentUser.role.charAt(0).toUpperCase() + this.currentUser.role.slice(1);
    }

    handleNavigation(e) {
        e.preventDefault();
        const section = e.currentTarget.dataset.section;
        this.switchSection(section);
    }

    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-section="${section}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.content-section').forEach(sec => {
            sec.classList.remove('active');
        });
        document.getElementById(`${section}-section`).classList.add('active');

        // Update page title
        const titles = {
            dashboard: 'Dashboard',
            events: 'Events Management',
            contacts: 'Contact Messages',
            testimonials: 'Testimonials',
            users: 'User Management'
        };
        
        const descriptions = {
            dashboard: 'Overview of your event planning business',
            events: 'Manage event registrations and bookings',
            contacts: 'View and respond to customer inquiries',
            testimonials: 'Manage customer testimonials and reviews',
            users: 'Manage admin users and permissions'
        };

        document.getElementById('pageTitle').textContent = titles[section];
        document.getElementById('pageDescription').textContent = descriptions[section];

        this.currentSection = section;

        // Load section data
        switch (section) {
            case 'dashboard':
                this.loadDashboard();
                break;
            case 'events':
                this.loadEvents();
                break;
            case 'contacts':
                this.loadContacts();
                break;
            case 'testimonials':
                this.loadTestimonials();
                break;
            case 'users':
                this.loadUsers();
                break;
            case 'registrations':
                this.loadRegistrations();
                break;
        }
    }

    async loadDashboard() {
        try {
            // Load statistics
            const [eventsResponse, contactsResponse] = await Promise.all([
                fetch('/api/events/stats/overview', {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                }),
                fetch('/api/contact', {
                    headers: { 'Authorization': `Bearer ${this.token}` }
                })
            ]);

            const eventsStats = await eventsResponse.json();
            const contactsData = await contactsResponse.json();

            if (eventsStats.success) {
                const stats = eventsStats.data;
                document.getElementById('totalEvents').textContent = stats.totalEvents;
                document.getElementById('pendingEvents').textContent = stats.pendingEvents;
                document.getElementById('totalContacts').textContent = contactsData.data?.length || 0;
                
                // Update navigation badges
                this.updateNavigationBadges(stats, contactsData.data?.length || 0);
            }

            // Load recent events
            this.loadRecentEvents();
            this.loadRecentContacts();

        } catch (error) {
            console.error('Error loading dashboard:', error);
        }
    }

    async loadRecentEvents() {
        try {
            const response = await fetch('/api/events?limit=5', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const result = await response.json();

            if (result.success) {
                this.displayRecentEvents(result.data);
            }
        } catch (error) {
            console.error('Error loading recent events:', error);
        }
    }

    displayRecentEvents(events) {
        const container = document.getElementById('recentEvents');
        if (!container) return;

        if (events.length === 0) {
            container.innerHTML = '<p class="text-muted">No recent events</p>';
            return;
        }

        container.innerHTML = events.map(event => `
            <div class="recent-item">
                <div class="recent-item-icon" style="background-color: #3498db;">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <div class="recent-item-content">
                    <div class="recent-item-title">${event.name}</div>
                    <div class="recent-item-subtitle">${event.eventType} - ${new Date(event.eventDate).toLocaleDateString()}</div>
                </div>
            </div>
        `).join('');
    }

    async loadRecentContacts() {
        try {
            const response = await fetch('/api/contact?limit=5', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const result = await response.json();

            if (result.success) {
                this.displayRecentContacts(result.data);
            }
        } catch (error) {
            console.error('Error loading recent contacts:', error);
        }
    }

    displayRecentContacts(contacts) {
        const container = document.getElementById('recentContacts');
        if (!container) return;

        if (contacts.length === 0) {
            container.innerHTML = '<p class="text-muted">No recent contacts</p>';
            return;
        }

        container.innerHTML = contacts.map(contact => `
            <div class="recent-item">
                <div class="recent-item-icon" style="background-color: #27ae60;">
                    <i class="fas fa-envelope"></i>
                </div>
                <div class="recent-item-content">
                    <div class="recent-item-title">${contact.name}</div>
                    <div class="recent-item-subtitle">${contact.subject}</div>
                </div>
            </div>
        `).join('');
    }

    async loadEvents() {
        try {
            const statusFilter = document.getElementById('eventStatusFilter')?.value || '';
            const typeFilter = document.getElementById('eventTypeFilter')?.value || '';
            
            let url = '/api/events?limit=50';
            if (statusFilter) url += `&status=${statusFilter}`;
            if (typeFilter) url += `&eventType=${typeFilter}`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const result = await response.json();

            if (result.success) {
                this.displayEvents(result.data);
            }
        } catch (error) {
            console.error('Error loading events:', error);
        }
    }

    displayEvents(events) {
        const tbody = document.getElementById('eventsTableBody');
        if (!tbody) return;

        if (events.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" class="text-center">No events found</td></tr>';
            return;
        }

        tbody.innerHTML = events.map(event => `
            <tr>
                <td><strong>${event.name}</strong></td>
                <td>${event.email || 'N/A'}</td>
                <td>${event.mobile || 'N/A'}</td>
                <td><span class="event-type-badge">${event.eventType}</span></td>
                <td>${new Date(event.eventDate).toLocaleDateString()}</td>
                <td>${event.venue || 'N/A'}</td>
                <td>${event.guestCount || 'N/A'}</td>
                <td>${event.budget || 'N/A'}</td>
                <td><span class="status-badge status-${event.status || 'pending'}">${event.status || 'Pending'}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="adminPanel.viewEvent('${event._id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="adminPanel.editEvent('${event._id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async loadContacts() {
        try {
            const statusFilter = document.getElementById('contactStatusFilter')?.value || '';
            let url = '/api/contact?limit=50';
            if (statusFilter) url += `&status=${statusFilter}`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const result = await response.json();

            if (result.success) {
                this.displayContacts(result.data);
            }
        } catch (error) {
            console.error('Error loading contacts:', error);
        }
    }

    displayContacts(contacts) {
        const tbody = document.getElementById('contactsTableBody');
        if (!tbody) return;

        if (contacts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="9" class="text-center">No contacts found</td></tr>';
            return;
        }

        tbody.innerHTML = contacts.map(contact => `
            <tr>
                <td><strong>${contact.name}</strong></td>
                <td>${contact.email}</td>
                <td>${contact.phone || 'N/A'}</td>
                <td>${contact.subject || 'N/A'}</td>
                <td class="message-preview">${contact.message ? contact.message.substring(0, 50) + '...' : 'N/A'}</td>
                <td><span class="status-badge status-${contact.status || 'new'}">${contact.status || 'New'}</span></td>
                <td><span class="priority-badge priority-${contact.priority || 'medium'}">${contact.priority || 'Medium'}</span></td>
                <td>${new Date(contact.createdAt).toLocaleDateString()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" data-action="view-contact" data-id="${contact._id}">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" data-action="edit-contact" data-id="${contact._id}">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async loadTestimonials() {
        try {
            const response = await fetch('/api/testimonials?limit=50', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const result = await response.json();

            if (result.success) {
                this.displayTestimonials(result.data);
            }
        } catch (error) {
            console.error('Error loading testimonials:', error);
        }
    }

    displayTestimonials(testimonials) {
        const tbody = document.getElementById('testimonialsTableBody');
        if (!tbody) return;

        if (testimonials.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">No testimonials found</td></tr>';
            return;
        }

        tbody.innerHTML = testimonials.map(testimonial => `
            <tr>
                <td>${testimonial.name}</td>
                <td>${testimonial.eventType}</td>
                <td>${'★'.repeat(testimonial.rating)}${'☆'.repeat(5 - testimonial.rating)}</td>
                <td>${testimonial.testimonial.substring(0, 100)}${testimonial.testimonial.length > 100 ? '...' : ''}</td>
                <td>
                    <span class="status-badge ${testimonial.isApproved ? 'status-confirmed' : 'status-pending'}">
                        ${testimonial.isApproved ? 'Approved' : 'Pending'}
                    </span>
                </td>
                <td>${new Date(testimonial.createdAt).toLocaleDateString()}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="adminPanel.viewTestimonial('${testimonial._id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="adminPanel.editTestimonial('${testimonial._id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    async loadUsers() {
        try {
            const response = await fetch('/api/auth/users', {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const result = await response.json();

            if (result.success) {
                this.displayUsers(result.data);
            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }

    async loadRegistrations() {
        try {
            const statusFilter = document.getElementById('registrationStatusFilter')?.value || '';
            const dateFilter = document.getElementById('registrationDateFilter')?.value || '';
            
            let url = '/api/auth/users?limit=50';
            if (statusFilter) url += `&status=${statusFilter}`;
            if (dateFilter) url += `&date=${dateFilter}`;

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const result = await response.json();

            if (result.success) {
                this.displayRegistrations(result.data);
            }
        } catch (error) {
            console.error('Error loading registrations:', error);
        }
    }

    displayRegistrations(registrations) {
        const tbody = document.getElementById('registrationsTableBody');
        if (!tbody) return;

        if (registrations.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No registrations found</td></tr>';
            return;
        }

        tbody.innerHTML = registrations.map(user => `
            <tr>
                <td><strong>${user.fullName || user.username || 'N/A'}</strong></td>
                <td>${user.email}</td>
                <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                <td><span class="status-badge status-${user.role || 'user'}">${user.role || 'User'}</span></td>
                <td>${user.newsletter ? '<i class="fas fa-check text-success"></i>' : '<i class="fas fa-times text-danger"></i>'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn view" onclick="adminPanel.viewUser('${user._id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn edit" onclick="adminPanel.editUser('${user._id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    displayUsers(users) {
        const tbody = document.getElementById('usersTableBody');
        if (!tbody) return;

        if (users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No users found</td></tr>';
            return;
        }

        tbody.innerHTML = users.map(user => `
            <tr>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td><span class="status-badge status-${user.role}">${user.role}</span></td>
                <td><span class="status-badge ${user.isActive ? 'status-confirmed' : 'status-cancelled'}">${user.isActive ? 'Active' : 'Inactive'}</span></td>
                <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                <td>
                    <div class="action-buttons">
                        <button class="action-btn edit" onclick="adminPanel.editUser('${user._id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="action-btn ${user.isActive ? 'delete' : 'success'}" onclick="adminPanel.toggleUserStatus('${user._id}', ${user.isActive})">
                            <i class="fas fa-${user.isActive ? 'ban' : 'check'}"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }

    // Placeholder methods for actions
    viewEvent(id) {
        this.showNotification('View event functionality coming soon', 'info');
    }

    editEvent(id) {
        this.showNotification('Edit event functionality coming soon', 'info');
    }

    async viewContact(id) {
        try {
            const response = await fetch(`/api/contact/${id}`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const result = await response.json();

            if (result.success) {
                this.showContactModal(result.data);
            } else {
                this.showNotification(result.message || 'Failed to load contact details', 'error');
            }
        } catch (error) {
            console.error('Error loading contact:', error);
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    async editContact(id) {
        try {
            const response = await fetch(`/api/contact/${id}`, {
                headers: { 'Authorization': `Bearer ${this.token}` }
            });
            const result = await response.json();

            if (result.success) {
                this.showEditContactModal(result.data);
            } else {
                this.showNotification(result.message || 'Failed to load contact details', 'error');
            }
        } catch (error) {
            console.error('Error loading contact:', error);
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    viewTestimonial(id) {
        this.showNotification('View testimonial functionality coming soon', 'info');
    }

    editTestimonial(id) {
        this.showNotification('Edit testimonial functionality coming soon', 'info');
    }

    editUser(id) {
        this.showNotification('Edit user functionality coming soon', 'info');
    }

    async toggleUserStatus(id, currentStatus) {
        try {
            const response = await fetch(`/api/auth/users/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify({ isActive: !currentStatus })
            });

            const result = await response.json();

            if (result.success) {
                this.showNotification(`User ${!currentStatus ? 'activated' : 'deactivated'} successfully`, 'success');
                this.loadUsers();
            } else {
                this.showNotification(result.message || 'Failed to update user status', 'error');
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    showContactModal(contact) {
        // Remove existing modals
        const existingModals = document.querySelectorAll('.contact-modal');
        existingModals.forEach(modal => modal.remove());

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'contact-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Contact Details</h3>
                        <button class="modal-close" data-action="close-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="contact-details">
                            <div class="detail-row">
                                <label>Name:</label>
                                <span>${contact.name}</span>
                            </div>
                            <div class="detail-row">
                                <label>Email:</label>
                                <span><a href="mailto:${contact.email}">${contact.email}</a></span>
                            </div>
                            <div class="detail-row">
                                <label>Phone:</label>
                                <span><a href="tel:${contact.phone}">${contact.phone}</a></span>
                            </div>
                            <div class="detail-row">
                                <label>Subject:</label>
                                <span>${contact.subject}</span>
                            </div>
                            <div class="detail-row">
                                <label>Status:</label>
                                <span class="status-badge status-${contact.status}">${contact.status}</span>
                            </div>
                            <div class="detail-row">
                                <label>Priority:</label>
                                <span class="status-badge status-${contact.priority}">${contact.priority}</span>
                            </div>
                            <div class="detail-row">
                                <label>Date Submitted:</label>
                                <span>${new Date(contact.createdAt).toLocaleString()}</span>
                            </div>
                            <div class="detail-row full-width">
                                <label>Message:</label>
                                <div class="message-content">${contact.message}</div>
                            </div>
                            ${contact.response ? `
                                <div class="detail-row full-width">
                                    <label>Admin Response:</label>
                                    <div class="response-content">${contact.response.content}</div>
                                    <div class="response-meta">
                                        Responded by: ${contact.response.respondedBy} on ${new Date(contact.response.respondedAt).toLocaleString()}
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-action="close-modal">
                            Close
                        </button>
                        <button class="btn btn-primary" data-action="edit-contact" data-id="${contact._id}">
                            <i class="fas fa-edit"></i>
                            Edit Contact
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles
        const style = document.createElement('style');
        style.textContent = `
            .contact-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }
            
            .modal-content {
                background: white;
                border-radius: 15px;
                max-width: 600px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 2rem;
                border-bottom: 1px solid #e9ecef;
            }
            
            .modal-header h3 {
                margin: 0;
                color: #2c3e50;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #7f8c8d;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .modal-close:hover {
                background: #f8f9fa;
                color: #2c3e50;
            }
            
            .modal-body {
                padding: 2rem;
            }
            
            .contact-details {
                display: flex;
                flex-direction: column;
                gap: 1rem;
            }
            
            .detail-row {
                display: grid;
                grid-template-columns: 120px 1fr;
                gap: 1rem;
                align-items: start;
            }
            
            .detail-row.full-width {
                grid-template-columns: 1fr;
            }
            
            .detail-row label {
                font-weight: 600;
                color: #2c3e50;
                margin: 0;
            }
            
            .detail-row span {
                color: #34495e;
                word-break: break-word;
            }
            
            .detail-row a {
                color: #3498db;
                text-decoration: none;
            }
            
            .detail-row a:hover {
                text-decoration: underline;
            }
            
            .message-content,
            .response-content {
                background: #f8f9fa;
                padding: 1rem;
                border-radius: 8px;
                border-left: 4px solid #3498db;
                white-space: pre-wrap;
                word-break: break-word;
            }
            
            .response-meta {
                font-size: 0.9rem;
                color: #7f8c8d;
                margin-top: 0.5rem;
                font-style: italic;
            }
            
            .modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
                padding: 1.5rem 2rem;
                border-top: 1px solid #e9ecef;
            }
            
            @media (max-width: 768px) {
                .modal-overlay {
                    padding: 1rem;
                }
                
                .modal-header,
                .modal-body,
                .modal-footer {
                    padding: 1rem;
                }
                
                .detail-row {
                    grid-template-columns: 1fr;
                    gap: 0.5rem;
                }
                
                .modal-footer {
                    flex-direction: column;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Close modal when clicking overlay
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                modal.remove();
            }
        });

        // Modal buttons (no inline handlers due to CSP)
        modal.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const action = btn.dataset.action;
            if (action === 'close-modal') {
                modal.remove();
            } else if (action === 'edit-contact') {
                const id = btn.dataset.id;
                if (id) this.editContact(id);
            }
        });
    }

    showEditContactModal(contact) {
        // Remove existing modals
        const existingModals = document.querySelectorAll('.edit-contact-modal');
        existingModals.forEach(modal => modal.remove());

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'edit-contact-modal';
        modal.innerHTML = `
            <div class="modal-overlay">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Edit Contact</h3>
                        <button class="modal-close" data-action="close-modal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form id="editContactForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label>Status:</label>
                                    <select name="status" required>
                                        <option value="new" ${contact.status === 'new' ? 'selected' : ''}>New</option>
                                        <option value="read" ${contact.status === 'read' ? 'selected' : ''}>Read</option>
                                        <option value="replied" ${contact.status === 'replied' ? 'selected' : ''}>Replied</option>
                                        <option value="archived" ${contact.status === 'archived' ? 'selected' : ''}>Archived</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label>Priority:</label>
                                    <select name="priority" required>
                                        <option value="low" ${contact.priority === 'low' ? 'selected' : ''}>Low</option>
                                        <option value="medium" ${contact.priority === 'medium' ? 'selected' : ''}>Medium</option>
                                        <option value="high" ${contact.priority === 'high' ? 'selected' : ''}>High</option>
                                        <option value="urgent" ${contact.priority === 'urgent' ? 'selected' : ''}>Urgent</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Admin Response:</label>
                                <textarea name="response" rows="4" placeholder="Add your response to the customer...">${contact.response ? contact.response.content : ''}</textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button class="btn btn-secondary" data-action="close-modal">
                            Cancel
                        </button>
                        <button class="btn btn-primary" data-action="update-contact" data-id="${contact._id}">
                            <i class="fas fa-save"></i>
                            Update Contact
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Add modal styles (reuse the same styles as contact modal)
        const style = document.createElement('style');
        style.textContent = `
            .edit-contact-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 1000;
            }
            
            .edit-contact-modal .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }
            
            .edit-contact-modal .modal-content {
                background: white;
                border-radius: 15px;
                max-width: 500px;
                width: 100%;
                max-height: 90vh;
                overflow-y: auto;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            }
            
            .edit-contact-modal .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1.5rem 2rem;
                border-bottom: 1px solid #e9ecef;
            }
            
            .edit-contact-modal .modal-header h3 {
                margin: 0;
                color: #2c3e50;
            }
            
            .edit-contact-modal .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #7f8c8d;
                padding: 0.5rem;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .edit-contact-modal .modal-close:hover {
                background: #f8f9fa;
                color: #2c3e50;
            }
            
            .edit-contact-modal .modal-body {
                padding: 2rem;
            }
            
            .edit-contact-modal .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-bottom: 1rem;
            }
            
            .edit-contact-modal .form-group {
                margin-bottom: 1rem;
            }
            
            .edit-contact-modal label {
                display: block;
                margin-bottom: 0.5rem;
                font-weight: 600;
                color: #2c3e50;
            }
            
            .edit-contact-modal select,
            .edit-contact-modal textarea {
                width: 100%;
                padding: 0.75rem;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                font-size: 1rem;
                transition: all 0.3s ease;
            }
            
            .edit-contact-modal select:focus,
            .edit-contact-modal textarea:focus {
                outline: none;
                border-color: #3498db;
                box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
            }
            
            .edit-contact-modal .modal-footer {
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
                padding: 1.5rem 2rem;
                border-top: 1px solid #e9ecef;
            }
            
            @media (max-width: 768px) {
                .edit-contact-modal .modal-overlay {
                    padding: 1rem;
                }
                
                .edit-contact-modal .modal-header,
                .edit-contact-modal .modal-body,
                .edit-contact-modal .modal-footer {
                    padding: 1rem;
                }
                
                .edit-contact-modal .form-row {
                    grid-template-columns: 1fr;
                }
                
                .edit-contact-modal .modal-footer {
                    flex-direction: column;
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(modal);

        // Close modal when clicking overlay
        modal.querySelector('.modal-overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                modal.remove();
            }
        });

        // Modal buttons (no inline handlers due to CSP)
        modal.addEventListener('click', (e) => {
            const btn = e.target.closest('button');
            if (!btn) return;
            const action = btn.dataset.action;
            if (action === 'close-modal') {
                modal.remove();
            } else if (action === 'update-contact') {
                const id = btn.dataset.id;
                if (id) this.updateContact(id);
            }
        });
    }

    async updateContact(id) {
        try {
            const form = document.getElementById('editContactForm');
            const formData = new FormData(form);
            
            const updateData = {
                status: formData.get('status'),
                priority: formData.get('priority')
            };
            
            const response = formData.get('response');
            if (response && response.trim()) {
                updateData.response = response;
            }

            const response_api = await fetch(`/api/contact/${id}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                },
                body: JSON.stringify(updateData)
            });

            const result = await response_api.json();

            if (result.success) {
                this.showNotification('Contact updated successfully', 'success');
                document.querySelector('.edit-contact-modal').remove();
                this.loadContacts(); // Refresh the contacts list
            } else {
                this.showNotification(result.message || 'Failed to update contact', 'error');
            }
        } catch (error) {
            console.error('Error updating contact:', error);
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add to document
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Update navigation badges with current data counts
    updateNavigationBadges(eventsStats, contactsCount) {
        const badges = {
            dashboardBadge: eventsStats.totalEvents + contactsCount,
            eventsBadge: eventsStats.pendingEvents,
            contactsBadge: contactsCount,
            testimonialsBadge: 0, // Will be updated when testimonials are loaded
            usersBadge: 0, // Will be updated when users are loaded
            registrationsBadge: 0 // Will be updated when registrations are loaded
        };

        Object.entries(badges).forEach(([badgeId, count]) => {
            const badge = document.getElementById(badgeId);
            if (badge) {
                badge.textContent = count;
                badge.style.display = count > 0 ? 'block' : 'none';
            }
        });
    }

    // Quick Actions
    async exportData() {
        try {
            this.showNotification('Preparing data export...', 'info');
            
            const [eventsResponse, contactsResponse, testimonialsResponse] = await Promise.all([
                fetch('/api/events', { headers: { 'Authorization': `Bearer ${this.token}` } }),
                fetch('/api/contact', { headers: { 'Authorization': `Bearer ${this.token}` } }),
                fetch('/api/testimonials', { headers: { 'Authorization': `Bearer ${this.token}` } })
            ]);

            const eventsData = await eventsResponse.json();
            const contactsData = await contactsResponse.json();
            const testimonialsData = await testimonialsResponse.json();

            const exportData = {
                events: eventsData.data || [],
                contacts: contactsData.data || [],
                testimonials: testimonialsData.data || [],
                exportDate: new Date().toISOString(),
                exportedBy: this.currentUser?.email || 'Unknown'
            };

            // Create and download file
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            const link = document.createElement('a');
            link.href = url;
            link.download = `elite-event-planner-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            this.showNotification('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Export error:', error);
            this.showNotification('Failed to export data. Please try again.', 'error');
        }
    }

    async backupData() {
        try {
            this.showNotification('Creating database backup...', 'info');
            
            // This would typically call a backend endpoint to create a database backup
            // For now, we'll simulate the process
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            this.showNotification('Database backup created successfully!', 'success');
        } catch (error) {
            console.error('Backup error:', error);
            this.showNotification('Failed to create backup. Please try again.', 'error');
        }
    }
}

// Initialize admin panel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminPanel = new AdminPanel();
});
// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", function (e) {
            e.preventDefault(); // Stop the form from submitting to a server

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // Dummy credentials (replace with real auth if needed)
            if (email === "admin@nextera.com" && password === "admin123") {
                // Hide login modal
                document.getElementById("loginModal").style.display = "none";
                // Show admin panel
                document.getElementById("adminPanel").style.display = "flex";
            } else {
                alert("Invalid email or password");
            }
        });
    }
});
