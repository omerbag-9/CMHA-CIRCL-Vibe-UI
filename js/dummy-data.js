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
        const statuses = ['new', 'active', 'active', 'pending', 'active', 'closed', 'closed', 'active'];
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

            // Add assignment for some active cases
            if (status === 'active' && Math.random() > 0.3) {
                caseData.assignedTo = '2'; // Responder
                caseData.assignedToName = 'Sarah Responder';
                const assignedTime = new Date(createdAt.getTime() + Math.random() * 60 * 60 * 1000);
                caseData.assignedAt = assignedTime.toISOString();
                caseData.timeline.push({
                    action: 'Assigned to Sarah Responder',
                    timestamp: assignedTime.toISOString(),
                    user: 'John Dispatcher'
                });
            }

            // Add follow-up for some cases
            if (status === 'closed' && Math.random() > 0.5) {
                const followupTime = new Date(createdAt.getTime() + (24 + Math.random() * 24) * 60 * 60 * 1000);
                caseData.followupScheduled = true;
                caseData.followupTime = followupTime.toISOString();
                caseData.timeline.push({
                    action: 'Follow-up scheduled',
                    timestamp: followupTime.toISOString(),
                    user: 'System'
                });
            }

            // Add closure for closed cases
            if (status === 'closed') {
                const closedTime = new Date(createdAt.getTime() + (2 + Math.random() * 5) * 60 * 60 * 1000);
                caseData.closedAt = closedTime.toISOString();
                caseData.timeline.push({
                    action: 'Case Closed',
                    timestamp: closedTime.toISOString(),
                    user: status === 'active' ? 'Sarah Responder' : 'John Dispatcher'
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

    // Initialize all dummy data
    init() {
        // Only add dummy data if there are no cases
        const existingCases = dataManager.getCases();
        if (existingCases.length === 0) {
            const cases = this.generateCases();
            localStorage.setItem('crcl_cases', JSON.stringify(cases));
            console.log(`✅ Generated ${cases.length} dummy cases`);
        }

        // Only add dummy messages if there are no messages
        const existingMessages = dataManager.getMessages();
        if (existingMessages.length === 0) {
            const messages = this.generateMessages();
            localStorage.setItem('crcl_messages', JSON.stringify(messages));
            console.log(`✅ Generated ${messages.length} dummy messages`);
        }
    }
};

// Initialize dummy data when script loads
if (typeof window !== 'undefined') {
    // Wait for dataManager to be available
    const initDummyData = () => {
        if (typeof dataManager !== 'undefined' && typeof utils !== 'undefined') {
            dummyData.init();
        } else {
            setTimeout(initDummyData, 50);
        }
    };
    
    // Initialize after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDummyData);
    } else {
        setTimeout(initDummyData, 100);
    }
}

