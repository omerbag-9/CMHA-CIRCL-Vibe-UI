// Generate Dummy Responder Data

const dummyResponders = {
    generateResponders() {
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
                status: 'busy',
                city: 'Coquitlam',
                province: 'BC',
                phone: '604-555-0106',
                certifications: ['Mental Health First Aid', 'Crisis Intervention'],
                activeCases: 2
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

        return responders;
    },

    init() {
        try {
            // Get existing users
            let users = JSON.parse(localStorage.getItem('crcl_users') || '[]');
            
            // Check if we need to regenerate responders
            const existingResponders = users.filter(u => u.role === 'responder');
            const hasAllResponders = existingResponders.length >= 11 && 
                                     existingResponders.some(r => r.id === '13') && 
                                     existingResponders.some(r => r.id === '14');
            
            // Always regenerate on first load or if we don't have all responders
            if (!hasAllResponders) {
                console.log('🔄 Regenerating responders...');
                
                // Generate new responders
                const newResponders = this.generateResponders();
                
                // Remove all old responders
                users = users.filter(u => u.role !== 'responder');
                
                // Update Sarah's info and add her
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
                
                // Add new responders
                users = users.concat(newResponders);
                
                // Save updated users
                localStorage.setItem('crcl_users', JSON.stringify(users));
                console.log(`✅ Generated ${newResponders.length + 1} responders`);
            } else {
                console.log(`ℹ️ ${existingResponders.length} responders already exist`);
            }
            
            // Update active cases count for responders
            this.updateResponderCaseCount();
        } catch (error) {
            console.error('Error initializing responders:', error);
        }
    },
    
    // Force regeneration (for manual reset)
    forceRegenerate() {
        let users = JSON.parse(localStorage.getItem('crcl_users') || '[]');
        users = users.filter(u => u.role !== 'responder');
        
        const newResponders = this.generateResponders();
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
        users = users.concat(newResponders);
        localStorage.setItem('crcl_users', JSON.stringify(users));
        console.log(`✅ Force regenerated ${newResponders.length + 1} responders`);
        this.updateResponderCaseCount();
    },

    updateResponderCaseCount() {
        const users = JSON.parse(localStorage.getItem('crcl_users') || '[]');
        const cases = JSON.parse(localStorage.getItem('crcl_cases') || '[]');
        
        // Count active cases for each responder
        const responderCaseCounts = {};
        cases.forEach(c => {
            if (c.assignedTo && c.status === 'assigned_to_responder') {
                responderCaseCounts[c.assignedTo] = (responderCaseCounts[c.assignedTo] || 0) + 1;
            }
        });
        
        // Update users
        users.forEach(user => {
            if (user.role === 'responder') {
                user.activeCases = responderCaseCounts[user.id] || 0;
                // Auto-update status based on workload
                if (user.activeCases === 0 && user.status === 'busy') {
                    user.status = 'available';
                } else if (user.activeCases >= 2 && user.status === 'available') {
                    user.status = 'busy';
                }
            }
        });
        
        localStorage.setItem('crcl_users', JSON.stringify(users));
    }
};

// Initialize responders when script loads
(function() {
    'use strict';
    
    function initResponders() {
        if (typeof dataManager === 'undefined') {
            setTimeout(initResponders, 100);
            return;
        }
        
        try {
            dummyResponders.init();
        } catch (error) {
            console.error('Error initializing responders:', error);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initResponders);
    } else {
        initResponders();
    }
})();

