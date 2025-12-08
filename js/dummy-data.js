// Dummy Data Generator - Makes the system feel like it's in production

const dummyData = {
    // Generate dummy cases
    generateCases() {
        const cases = [];
        const names = [
            'John Smith', 'Sarah Johnson', 'Michael Chen', 'Emily Davis', 'David Wilson',
            'Lisa Anderson', 'Robert Brown', 'Jennifer Martinez', 'James Taylor', 'Maria Garcia',
            'William Lee', 'Patricia White', 'Richard Harris', 'Linda Clark', 'Joseph Lewis'
        ];
        const locations = [
            '123 Main St, Vancouver, BC', '456 Oak Ave, Burnaby, BC', '789 Pine Rd, Surrey, BC',
            '321 Elm St, Richmond, BC', '654 Maple Dr, Coquitlam, BC', '987 Cedar Ln, North Vancouver, BC',
            '147 Spruce Way, New Westminster, BC', '258 Birch St, Port Moody, BC', '369 Willow Ave, Langley, BC'
        ];
        const statuses = ['new_case', 'assigned_to_responder', 'follow_up_scheduled', 'closed'];
        const urgencies = ['normal', 'normal', 'urgent', 'normal', 'urgent', 'normal', 'normal', 'normal'];
        const crisisTypes = ['routine', 'routine', 'urgent', 'routine', 'urgent', 'routine', 'routine', 'sensitive'];
        const contactMethods = ['phone', 'sms', 'phone', 'web', 'phone', 'phone', 'sms', 'phone'];
        
        const now = new Date();
        
        for (let i = 0; i < 25; i++) {
            const hoursAgo = Math.floor(Math.random() * 168); // Last 7 days
            const createdAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const urgency = urgencies[Math.floor(Math.random() * urgencies.length)];
            const crisisType = crisisTypes[Math.floor(Math.random() * crisisTypes.length)];
            
            const caseData = {
                id: `case-${i + 1}`,
                caseId: `CR-2024-${String(100000 + i).padStart(6, '0')}`,
                callerName: names[Math.floor(Math.random() * names.length)],
                callerPhone: `604-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
                callerLocation: locations[Math.floor(Math.random() * locations.length)],
                contactMethod: contactMethods[Math.floor(Math.random() * contactMethods.length)],
                crisisType: crisisType,
                urgency: urgency,
                status: status,
                initialNotes: this.generateNotes(crisisType),
                createdBy: '1', // Dispatcher
                createdAt: createdAt.toISOString(),
                updatedAt: createdAt.toISOString(),
                timeline: [{
                    action: 'Case Created',
                    timestamp: createdAt.toISOString(),
                    user: 'System'
                }]
            };

            // Add assignment for cases that are assigned to responder
            if (status === 'assigned_to_responder' && Math.random() > 0.2) {
                const responderIds = ['2', '5', '6', '7', '8', '9', '10'];
                const responderNames = ['Sarah Responder', 'Michael Brown', 'Jessica Lee', 'David Chen', 'Emily White', 'Robert Kim', 'Amanda Garcia'];
                const responderIndex = Math.floor(Math.random() * responderIds.length);
                
                caseData.assignedTo = responderIds[responderIndex];
                caseData.assignedToName = responderNames[responderIndex];
                const assignedTime = new Date(createdAt.getTime() + Math.random() * 30 * 60 * 1000);
                caseData.assignedAt = assignedTime.toISOString();
                caseData.timeline.push({
                    action: `Assigned to ${responderNames[responderIndex]}`,
                    timestamp: assignedTime.toISOString(),
                    user: 'John Dispatcher'
                });
            }

            // Add follow-up for cases with follow_up_scheduled status
            if (status === 'follow_up_scheduled') {
                const followupTime = new Date(createdAt.getTime() + (24 + Math.random() * 24) * 60 * 60 * 1000);
                caseData.followupScheduled = true;
                caseData.followupTime = followupTime.toISOString();
                caseData.timeline.push({
                    action: 'Follow-up scheduled',
                    timestamp: followupTime.toISOString(),
                    user: 'John Dispatcher'
                });
                
                // Also assign to responder if not already assigned
                if (!caseData.assignedTo && Math.random() > 0.3) {
                    const responderIds = ['2', '5', '6', '7', '8', '9', '10'];
                    const responderNames = ['Sarah Responder', 'Michael Brown', 'Jessica Lee', 'David Chen', 'Emily White', 'Robert Kim', 'Amanda Garcia'];
                    const responderIndex = Math.floor(Math.random() * responderIds.length);
                    
                    caseData.assignedTo = responderIds[responderIndex];
                    caseData.assignedToName = responderNames[responderIndex];
                    const assignedTime = new Date(createdAt.getTime() + Math.random() * 30 * 60 * 1000);
                    caseData.assignedAt = assignedTime.toISOString();
                    caseData.timeline.push({
                        action: `Assigned to ${responderNames[responderIndex]}`,
                        timestamp: assignedTime.toISOString(),
                        user: 'John Dispatcher'
                    });
                }
            }

            // Add closure for closed cases
            if (status === 'closed') {
                const closedTime = new Date(createdAt.getTime() + (2 + Math.random() * 5) * 60 * 60 * 1000);
                caseData.closedAt = closedTime.toISOString();
                caseData.timeline.push({
                    action: 'Case Closed',
                    timestamp: closedTime.toISOString(),
                    user: 'John Dispatcher'
                });
            }

            cases.push(caseData);
        }

        // Sort by creation date (newest first)
        cases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        return cases;
    },

    // Generate notes based on crisis type
    generateNotes(crisisType) {
        const notes = {
            routine: [
                'Caller requesting information about available resources.',
                'Person seeking support for ongoing mental health concerns.',
                'Follow-up needed for previous case.',
                'Request for community resources and referrals.'
            ],
            urgent: [
                'Person experiencing increased stress and anxiety. Needs immediate support.',
                'Escalating situation requiring prompt response.',
                'Caller expressing concerns about safety but no immediate danger.',
                'Family member concerned about loved one\'s wellbeing.'
            ],
            emergency: [
                'IMMEDIATE ATTENTION REQUIRED: Person in crisis, potential self-harm risk.',
                'Emergency situation - caller needs immediate intervention.',
                'URGENT: Safety concerns identified, emergency services may be needed.',
                'Critical situation requiring immediate response team.'
            ],
            sensitive: [
                'Sensitive case - requires extra confidentiality.',
                'Person requesting private consultation.',
                'Confidential matter requiring special handling.',
                'Sensitive information - handle with care.'
            ]
        };
        const noteList = notes[crisisType] || notes.routine;
        return noteList[Math.floor(Math.random() * noteList.length)];
    },

    // Generate dummy messages
    generateMessages() {
        const messages = [];
        const messageTemplates = [
            'On my way to the case location. ETA 15 minutes.',
            'Arrived on site. Beginning assessment now.',
            'Situation is stable. Providing support and resources.',
            'Case resolved successfully. Person is safe.',
            'Need additional support. Can you send backup?',
            'Follow-up completed. Person is doing well.',
            'New case assigned. Reviewing details now.',
            'Status update: Person is receiving appropriate care.',
            'Resources provided. Case can be closed.',
            'Emergency escalation may be needed. Standby.'
        ];

        const now = new Date();
        
        // Generate messages between dispatcher and responder
        for (let i = 0; i < 15; i++) {
            const hoursAgo = Math.floor(Math.random() * 48);
            const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
            
            // Alternate between dispatcher and responder
            const fromId = i % 2 === 0 ? '1' : '2'; // Dispatcher or Responder
            const toId = fromId === '1' ? '2' : '1';
            
            messages.push({
                id: `msg-${i + 1}`,
                fromId: fromId,
                toId: toId,
                text: messageTemplates[Math.floor(Math.random() * messageTemplates.length)],
                timestamp: timestamp.toISOString(),
                read: hoursAgo > 2, // Older messages are read
                type: 'text'
            });
        }

        // Sort by timestamp
        messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        return messages;
    },

    // Assign cases to busy responders
    assignCasesToBusyResponders() {
        // Get all users to find busy responders
        const users = dataManager.getUsers();
        const busyResponders = users.filter(u => u.role === 'responder' && u.status === 'busy');
        
        if (busyResponders.length === 0) {
            console.log('No busy responders found to assign cases to');
            return [];
        }
        
        const cases = [];
        const names = [
            'John Smith', 'Sarah Johnson', 'Michael Chen', 'Emily Davis', 'David Wilson',
            'Lisa Anderson', 'Robert Brown', 'Jennifer Martinez', 'James Taylor', 'Maria Garcia',
            'William Lee', 'Patricia White', 'Richard Harris', 'Linda Clark', 'Joseph Lewis',
            'Nancy Moore', 'Charles Taylor', 'Barbara Jackson', 'Daniel Martin', 'Susan Lee'
        ];
        const locations = [
            '123 Main St, Vancouver, BC', '456 Oak Ave, Burnaby, BC', '789 Pine Rd, Surrey, BC',
            '321 Elm St, Richmond, BC', '654 Maple Dr, Coquitlam, BC', '987 Cedar Ln, North Vancouver, BC',
            '147 Spruce Way, New Westminster, BC', '258 Birch St, Port Moody, BC', '369 Willow Ave, Langley, BC',
            '741 Oak Street, Vancouver, BC', '852 Maple Avenue, Burnaby, BC', '963 Pine Road, Surrey, BC'
        ];
        const activeStatuses = ['assigned_to_responder'];
        const urgencies = ['normal', 'urgent', 'normal', 'urgent', 'normal'];
        const crisisTypes = ['routine', 'urgent', 'routine', 'sensitive', 'routine'];
        const contactMethods = ['phone', 'sms', 'phone', 'web', 'phone'];
        
        const now = new Date();
        let caseIndex = 0;
        
        // Assign 1-2 cases to each busy responder
        busyResponders.forEach(responder => {
            const numCases = Math.floor(Math.random() * 2) + 1; // 1 or 2 cases
            
            for (let i = 0; i < numCases; i++) {
                const hoursAgo = Math.floor(Math.random() * 72); // Last 3 days
                const createdAt = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
                const status = activeStatuses[Math.floor(Math.random() * activeStatuses.length)];
                const urgency = urgencies[Math.floor(Math.random() * urgencies.length)];
                const crisisType = crisisTypes[Math.floor(Math.random() * crisisTypes.length)];
                
                // Match location to responder's city when possible
                let location = locations[Math.floor(Math.random() * locations.length)];
                if (responder.city && Math.random() > 0.3) {
                    // 70% chance to match responder's city
                    const cityLocations = locations.filter(loc => loc.includes(responder.city));
                    if (cityLocations.length > 0) {
                        location = cityLocations[Math.floor(Math.random() * cityLocations.length)];
                    }
                }
                
                const caseData = {
                    id: `case-busy-${responder.id}-${i + 1}`,
                    caseId: `CR-2024-${String(200000 + caseIndex).padStart(6, '0')}`,
                    callerName: names[Math.floor(Math.random() * names.length)],
                    callerPhone: `604-${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`,
                    callerLocation: location,
                    contactMethod: contactMethods[Math.floor(Math.random() * contactMethods.length)],
                    crisisType: crisisType,
                    urgency: urgency,
                    status: status,
                    initialNotes: this.generateNotes(crisisType),
                    createdBy: '1', // Dispatcher
                    assignedTo: responder.id,
                    assignedToName: responder.name,
                    createdAt: createdAt.toISOString(),
                    updatedAt: createdAt.toISOString(),
                    assignedAt: new Date(createdAt.getTime() + Math.random() * 30 * 60 * 1000).toISOString(),
                    timeline: [{
                        action: 'Case Created',
                        timestamp: createdAt.toISOString(),
                        user: 'System'
                    }, {
                        action: `Assigned to ${responder.name}`,
                        timestamp: new Date(createdAt.getTime() + Math.random() * 30 * 60 * 1000).toISOString(),
                        user: 'John Dispatcher'
                    }]
                };
                
                // Add follow-up for cases with follow_up_scheduled status
                if (status === 'follow_up_scheduled') {
                    const followupTime = new Date(createdAt.getTime() + (24 + Math.random() * 24) * 60 * 60 * 1000);
                    caseData.followupScheduled = true;
                    caseData.followupTime = followupTime.toISOString();
                    caseData.timeline.push({
                        action: 'Follow-up scheduled',
                        timestamp: followupTime.toISOString(),
                        user: 'John Dispatcher'
                    });
                }
                
                cases.push(caseData);
                caseIndex++;
            }
        });
        
        return cases;
    },

    // Clean up old statuses from existing cases
    cleanOldStatuses() {
        try {
            const allCases = dataManager.getCases();
            const validStatuses = ['new_case', 'assigned_to_responder', 'follow_up_scheduled', 'closed'];
            let updated = false;
            
            allCases.forEach(caseData => {
                if (!validStatuses.includes(caseData.status)) {
                    // Map old statuses to new ones
                    let newStatus = caseData.status;
                    
                    if (['new', 'pending', 'pending_review'].includes(caseData.status)) {
                        newStatus = 'new_case';
                    } else if (['assigned', 'responder_en_route', 'responder_on_site', 'in_progress', 'active'].includes(caseData.status)) {
                        newStatus = 'assigned_to_responder';
                    } else if (['moved_to_followup', 'followup_scheduled'].includes(caseData.status)) {
                        newStatus = 'follow_up_scheduled';
                    } else if (['resolved', 'closed'].includes(caseData.status)) {
                        newStatus = 'closed';
                    } else {
                        // Default to new_case for unknown statuses
                        newStatus = 'new_case';
                    }
                    
                    dataManager.updateCase(caseData.id, { status: newStatus });
                    updated = true;
                }
            });
            
            if (updated) {
                console.log('Cleaned up old case statuses');
            }
        } catch (e) {
            console.warn('Error cleaning old statuses:', e);
        }
    },

    // Initialize all dummy data
    init() {
        try {
            // Check if localStorage is available
            if (typeof localStorage === 'undefined') {
                console.warn('localStorage not available');
                return;
            }
            
            // Check existing cases
            let existingCases = [];
            try {
                existingCases = dataManager.getCases();
            } catch (e) {
                console.warn('Error getting cases:', e);
                existingCases = [];
            }
            
            // Check if any cases have old statuses
            const validStatuses = ['new_case', 'assigned_to_responder', 'follow_up_scheduled', 'closed'];
            const hasOldStatuses = existingCases.some(c => !validStatuses.includes(c.status));
            
            // Regenerate all cases if there are none or if any have old statuses
            if (existingCases.length === 0 || hasOldStatuses) {
                if (hasOldStatuses) {
                    console.log('🔄 Found cases with old statuses, regenerating all cases...');
                }
                
                // First generate regular cases
                const regularCases = this.generateCases();
                
                // Then generate cases specifically for busy responders
                const busyResponderCases = this.assignCasesToBusyResponders();
                
                // Combine all cases
                const allCases = [...regularCases, ...busyResponderCases];
                
                // Sort by creation date (newest first)
                allCases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                localStorage.setItem('crcl_cases', JSON.stringify(allCases));
                console.log(`✅ Generated ${regularCases.length} regular cases and ${busyResponderCases.length} cases for busy responders`);
            } else {
                console.log(`ℹ️ ${existingCases.length} cases already exist with valid statuses, skipping dummy data generation`);
            }

            // Only add dummy messages if there are no messages
            let existingMessages = [];
            try {
                existingMessages = dataManager.getMessages();
            } catch (e) {
                console.warn('Error getting messages:', e);
                existingMessages = [];
            }
            
            if (existingMessages.length === 0) {
                const messages = this.generateMessages();
                localStorage.setItem('crcl_messages', JSON.stringify(messages));
                console.log(`✅ Generated ${messages.length} dummy messages`);
            } else {
                console.log(`ℹ️ ${existingMessages.length} messages already exist, skipping dummy data generation`);
            }
        } catch (error) {
            console.error('Error in dummyData.init():', error);
        }
    },
    
    // Force initialization (for testing/debugging)
    forceInit() {
        // Clear existing data and regenerate
        localStorage.removeItem('crcl_cases');
        localStorage.removeItem('crcl_messages');
        this.init();
    }
};

// Initialize dummy data when script loads
(function() {
    'use strict';
    
    function initDummyData() {
        // Check if dataManager and utils are available
        if (typeof dataManager === 'undefined' || typeof utils === 'undefined') {
            // Retry after a short delay
            setTimeout(initDummyData, 100);
            return;
        }
        
        // Ensure dataManager is initialized first
        if (typeof dataManager.init === 'function') {
            dataManager.init();
        }
        
        // Now initialize dummy data
        try {
            dummyData.init();
        } catch (error) {
            console.error('Error initializing dummy data:', error);
            // Retry once more
            setTimeout(initDummyData, 200);
        }
    }
    
    // Multiple initialization strategies to ensure it works
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDummyData);
    } else {
        // DOM already loaded, try immediately
        initDummyData();
    }
    
    // Also try after window load as backup
    window.addEventListener('load', function() {
        setTimeout(initDummyData, 100);
    });
    
    // Final fallback - try after a longer delay
    setTimeout(initDummyData, 500);
})();

