// Force Responder Regeneration Script
// Run this once to regenerate all responders

(function() {
    'use strict';
    
    console.log('🔄 Force regenerating responders...');
    
    // Get existing users
    let users = JSON.parse(localStorage.getItem('crcl_users') || '[]');
    
    // Remove all responders
    users = users.filter(u => u.role !== 'responder');
    
    // Add Sarah
    users.push({
        id: '2',
        email: 'responder@crcl.ca',
        password: 'responder123',
        name: 'Sarah Responder',
        role: 'responder',
        agencyId: 'agency1',
        status: 'busy',
        city: 'Vancouver',
        province: 'BC',
        phone: '604-555-0100',
        certifications: ['Mental Health First Aid', 'Crisis Intervention', 'Suicide Prevention'],
        activeCases: 1
    });
    
    // Add all other responders
    const responders = [
        {
            id: '5',
            email: 'michael.brown@crcl.ca',
            password: 'responder123',
            name: 'Michael Brown',
            role: 'responder',
            agencyId: 'agency1',
            status: 'busy',
            city: 'Vancouver',
            province: 'BC',
            phone: '604-555-0101',
            certifications: ['Mental Health First Aid', 'Crisis Intervention'],
            activeCases: 2
        },
        {
            id: '6',
            email: 'jessica.lee@crcl.ca',
            password: 'responder123',
            name: 'Jessica Lee',
            role: 'responder',
            agencyId: 'agency1',
            status: 'busy',
            city: 'Vancouver',
            province: 'BC',
            phone: '604-555-0102',
            certifications: ['Mental Health First Aid', 'De-escalation Training'],
            activeCases: 2
        },
        {
            id: '7',
            email: 'david.chen@crcl.ca',
            password: 'responder123',
            name: 'David Chen',
            role: 'responder',
            agencyId: 'agency1',
            status: 'busy',
            city: 'Burnaby',
            province: 'BC',
            phone: '604-555-0103',
            certifications: ['Mental Health First Aid', 'Trauma-Informed Care'],
            activeCases: 1
        },
        {
            id: '8',
            email: 'emily.white@crcl.ca',
            password: 'responder123',
            name: 'Emily White',
            role: 'responder',
            agencyId: 'agency1',
            status: 'busy',
            city: 'Surrey',
            province: 'BC',
            phone: '604-555-0104',
            certifications: ['Mental Health First Aid', 'Crisis Intervention', 'Suicide Prevention'],
            activeCases: 2
        },
        {
            id: '9',
            email: 'robert.kim@crcl.ca',
            password: 'responder123',
            name: 'Robert Kim',
            role: 'responder',
            agencyId: 'agency1',
            status: 'busy',
            city: 'Richmond',
            province: 'BC',
            phone: '604-555-0105',
            certifications: ['Mental Health First Aid', 'De-escalation Training'],
            activeCases: 1
        },
        {
            id: '10',
            email: 'amanda.garcia@crcl.ca',
            password: 'responder123',
            name: 'Amanda Garcia',
            role: 'responder',
            agencyId: 'agency1',
            status: 'offline',
            city: 'Coquitlam',
            province: 'BC',
            phone: '604-555-0106',
            certifications: ['Mental Health First Aid', 'Crisis Intervention'],
            activeCases: 0
        },
        {
            id: '11',
            email: 'thomas.wilson@crcl.ca',
            password: 'responder123',
            name: 'Thomas Wilson',
            role: 'responder',
            agencyId: 'agency1',
            status: 'available',
            city: 'Vancouver',
            province: 'BC',
            phone: '604-555-0107',
            certifications: ['Mental Health First Aid', 'Trauma-Informed Care', 'Cultural Competency'],
            activeCases: 0
        },
        {
            id: '12',
            email: 'sophia.martinez@crcl.ca',
            password: 'responder123',
            name: 'Sophia Martinez',
            role: 'responder',
            agencyId: 'agency1',
            status: 'busy',
            city: 'New Westminster',
            province: 'BC',
            phone: '604-555-0108',
            certifications: ['Mental Health First Aid', 'De-escalation Training'],
            activeCases: 1
        },
        {
            id: '13',
            email: 'daniel.park@crcl.ca',
            password: 'responder123',
            name: 'Daniel Park',
            role: 'responder',
            agencyId: 'agency1',
            status: 'busy',
            city: 'Burnaby',
            province: 'BC',
            phone: '604-555-0109',
            certifications: ['Mental Health First Aid', 'Crisis Intervention', 'Trauma-Informed Care'],
            activeCases: 2
        },
        {
            id: '14',
            email: 'lisa.thompson@crcl.ca',
            password: 'responder123',
            name: 'Lisa Thompson',
            role: 'responder',
            agencyId: 'agency1',
            status: 'available',
            city: 'Surrey',
            province: 'BC',
            phone: '604-555-0110',
            certifications: ['Mental Health First Aid', 'De-escalation Training'],
            activeCases: 0
        }
    ];
    
    users = users.concat(responders);
    
    // Save
    localStorage.setItem('crcl_users', JSON.stringify(users));
    
    console.log(`✅ Successfully regenerated ${responders.length + 1} responders`);
    console.log('📊 Breakdown:');
    console.log('  - Busy: 7');
    console.log('  - Available: 3');
    console.log('  - Offline: 1');
    
    // Reload page
    setTimeout(() => {
        location.reload();
    }, 500);
})();

