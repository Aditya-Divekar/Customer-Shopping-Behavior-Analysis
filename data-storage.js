const fs = require('fs');
const path = require('path');

class DataStorage {
    constructor() {
        this.dataDir = path.join(__dirname, 'data');
        this.ensureDataDir();
        this.loadData();
    }

    ensureDataDir() {
        if (!fs.existsSync(this.dataDir)) {
            fs.mkdirSync(this.dataDir, { recursive: true });
        }
    }

    loadData() {
        this.events = this.loadFromFile('events.json') || [];
        this.contacts = this.loadFromFile('contacts.json') || [];
        this.testimonials = this.loadFromFile('testimonials.json') || [];
        
        console.log(`📊 Loaded data: ${this.events.length} events, ${this.contacts.length} contacts, ${this.testimonials.length} testimonials`);
    }

    saveData() {
        this.saveToFile('events.json', this.events);
        this.saveToFile('contacts.json', this.contacts);
        this.saveToFile('testimonials.json', this.testimonials);
        console.log('💾 Data saved to files');
    }

    loadFromFile(filename) {
        try {
            const filePath = path.join(this.dataDir, filename);
            if (fs.existsSync(filePath)) {
                const data = fs.readFileSync(filePath, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.error(`Error loading ${filename}:`, error.message);
        }
        return null;
    }

    saveToFile(filename, data) {
        try {
            const filePath = path.join(this.dataDir, filename);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`Error saving ${filename}:`, error.message);
        }
    }

    // Events
    addEvent(eventData) {
        const event = {
            ...eventData,
            id: Date.now().toString(),
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        this.events.push(event);
        this.saveData();
        return event;
    }

    getEvents() {
        return this.events;
    }

    getEventStats() {
        return {
            totalEvents: this.events.length,
            pendingEvents: this.events.filter(e => e.status === 'pending').length,
            confirmedEvents: this.events.filter(e => e.status === 'confirmed').length,
            completedEvents: this.events.filter(e => e.status === 'completed').length,
            eventTypesStats: this.events.reduce((acc, event) => {
                acc[event.eventType] = (acc[event.eventType] || 0) + 1;
                return acc;
            }, {})
        };
    }

    // Contacts
    addContact(contactData) {
        const contact = {
            ...contactData,
            id: Date.now().toString(),
            status: 'new',
            priority: 'medium',
            createdAt: new Date().toISOString()
        };
        this.contacts.push(contact);
        this.saveData();
        return contact;
    }

    getContacts() {
        return this.contacts;
    }

    // Testimonials
    addTestimonial(testimonialData) {
        const testimonial = {
            ...testimonialData,
            id: Date.now().toString(),
            isApproved: false,
            isFeatured: false,
            createdAt: new Date().toISOString()
        };
        this.testimonials.push(testimonial);
        this.saveData();
        return testimonial;
    }

    getTestimonials() {
        return this.testimonials;
    }

    getFeaturedTestimonials() {
        return this.testimonials.filter(t => t.isApproved && t.isFeatured);
    }

    // Export data
    exportAllData() {
        return {
            events: this.events,
            contacts: this.contacts,
            testimonials: this.testimonials,
            exportedAt: new Date().toISOString()
        };
    }

    // Import data
    importData(data) {
        if (data.events) this.events = data.events;
        if (data.contacts) this.contacts = data.contacts;
        if (data.testimonials) this.testimonials = data.testimonials;
        this.saveData();
        console.log('📥 Data imported successfully');
    }

    // Clear all data
    clearAllData() {
        this.events = [];
        this.contacts = [];
        this.testimonials = [];
        this.saveData();
        console.log('🗑️ All data cleared');
    }
}

module.exports = DataStorage;
