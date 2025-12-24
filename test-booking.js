const fetch = require('node-fetch');

async function testBooking() {
    try {
        console.log('🧪 Testing event booking flow...');
        
        // Test booking data
        const bookingData = {
            name: "John Doe",
            mobile: "9876543210",
            email: "john.doe@example.com",
            eventType: "Wedding",
            eventDate: "2024-12-25",
            venue: "Grand Hotel, Mumbai",
            guestCount: "150",
            budget: "500000-1000000",
            additionalInfo: "Need full wedding planning services including decoration, catering, and photography."
        };
        
        console.log('📝 Sending booking data:', bookingData);
        
        // Send booking request
        const response = await fetch('http://localhost:3000/api/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookingData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Booking successful!');
            console.log('📊 Response:', result);
            
            // Now test if the event appears in admin panel
            console.log('\n🔍 Testing admin panel access...');
            
            // First login to get admin token
            const loginResponse = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: 'admin@eliteplanner.com',
                    password: 'admin123'
                })
            });
            
            const loginResult = await loginResponse.json();
            
            if (loginResult.success) {
                console.log('✅ Admin login successful!');
                const token = loginResult.data.token;
                
                // Now fetch events from admin panel
                const eventsResponse = await fetch('http://localhost:3000/api/events?limit=10', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                const eventsResult = await eventsResponse.json();
                
                if (eventsResult.success) {
                    console.log('✅ Events loaded successfully!');
                    console.log(`📊 Total events: ${eventsResult.data.length}`);
                    
                    // Check if our test booking is in the list
                    const testBooking = eventsResult.data.find(event => 
                        event.name === 'John Doe' && event.email === 'john.doe@example.com'
                    );
                    
                    if (testBooking) {
                        console.log('🎉 SUCCESS: Test booking found in admin panel!');
                        console.log('📋 Booking details:', {
                            name: testBooking.name,
                            email: testBooking.email,
                            eventType: testBooking.eventType,
                            eventDate: testBooking.eventDate,
                            venue: testBooking.venue,
                            status: testBooking.status
                        });
                    } else {
                        console.log('❌ Test booking not found in admin panel');
                    }
                } else {
                    console.log('❌ Failed to load events:', eventsResult.message);
                }
            } else {
                console.log('❌ Admin login failed:', loginResult.message);
            }
            
        } else {
            console.log('❌ Booking failed:', result.message);
        }
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

testBooking();
