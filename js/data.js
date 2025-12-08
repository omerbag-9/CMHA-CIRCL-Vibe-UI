// Data Management - LocalStorage

const dataManager = {
    // Initialize default data
    init() {
        if (!localStorage.getItem('crcl_users')) {
            const defaultUsers = [
                {
                    id: '1',
                    email: 'dispatcher@crcl.ca',
                    password: 'dispatcher123',
                    name: 'John Dispatcher',
                    role: 'dispatcher',
                    agencyId: 'agency1'
                },
                {
                    id: '2',
                    email: 'responder@crcl.ca',
                    password: 'responder123',
                    name: 'Sarah Responder',
                    role: 'responder',
                    agencyId: 'agency1',
                    status: 'available',
                    location: { lat: 49.2827, lng: -123.1207 }
                },
                {
                    id: '3',
                    email: 'manager@crcl.ca',
                    password: 'manager123',
                    name: 'Mike Manager',
                    role: 'agency_manager',
                    agencyId: 'agency1'
                },
                {
                    id: '4',
                    email: 'admin@crcl.ca',
                    password: 'admin123',
                    name: 'Admin User',
                    role: 'cmha_admin'
                }
            ];
            localStorage.setItem('crcl_users', JSON.stringify(defaultUsers));
        }

        if (!localStorage.getItem('crcl_cases')) {
            localStorage.setItem('crcl_cases', JSON.stringify([]));
        }

        if (!localStorage.getItem('crcl_messages')) {
            localStorage.setItem('crcl_messages', JSON.stringify([]));
        }

        if (!localStorage.getItem('crcl_current_user')) {
            localStorage.setItem('crcl_current_user', JSON.stringify(null));
        }
    },

    // Users
    getUsers() {
        return JSON.parse(localStorage.getItem('crcl_users') || '[]');
    },

    getUserById(id) {
        const users = this.getUsers();
        return users.find(u => u.id === id);
    },

    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(u => u.email === email);
    },

    updateUser(id, updates) {
        const users = this.getUsers();
        const index = users.findIndex(u => u.id === id);
        if (index !== -1) {
            users[index] = { ...users[index], ...updates };
            localStorage.setItem('crcl_users', JSON.stringify(users));
            return users[index];
        }
        return null;
    },

    // Cases
    getCases() {
        return JSON.parse(localStorage.getItem('crcl_cases') || '[]');
    },

    getCaseById(id) {
        const cases = this.getCases();
        return cases.find(c => c.id === id);
    },

    createCase(caseData) {
        const cases = this.getCases();
        const newCase = {
            id: utils.generateId('case'),
            caseId: utils.generateCaseId(),
            ...caseData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            status: 'new',
            timeline: [{
                action: 'Case Created',
                timestamp: new Date().toISOString(),
                user: caseData.createdBy || 'System'
            }]
        };
        cases.push(newCase);
        localStorage.setItem('crcl_cases', JSON.stringify(cases));
        return newCase;
    },

    updateCase(id, updates) {
        const cases = this.getCases();
        const index = cases.findIndex(c => c.id === id);
        if (index !== -1) {
            cases[index] = {
                ...cases[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            if (updates.status) {
                cases[index].timeline.push({
                    action: `Status changed to ${updates.status}`,
                    timestamp: new Date().toISOString(),
                    user: updates.updatedBy || 'System'
                });
            }
            localStorage.setItem('crcl_cases', JSON.stringify(cases));
            return cases[index];
        }
        return null;
    },

    deleteCase(id) {
        const cases = this.getCases();
        const filtered = cases.filter(c => c.id !== id);
        localStorage.setItem('crcl_cases', JSON.stringify(filtered));
        return true;
    },

    // Messages
    getMessages() {
        return JSON.parse(localStorage.getItem('crcl_messages') || '[]');
    },

    getMessagesByConversation(userId1, userId2) {
        const messages = this.getMessages();
        return messages.filter(m => 
            (m.fromId === userId1 && m.toId === userId2) ||
            (m.fromId === userId2 && m.toId === userId1)
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    },

    createMessage(messageData) {
        const messages = this.getMessages();
        const newMessage = {
            id: utils.generateId('msg'),
            ...messageData,
            timestamp: new Date().toISOString(),
            read: false
        };
        messages.push(newMessage);
        localStorage.setItem('crcl_messages', JSON.stringify(messages));
        return newMessage;
    },

    // Current User
    getCurrentUser() {
        return JSON.parse(localStorage.getItem('crcl_current_user') || 'null');
    },

    setCurrentUser(user) {
        localStorage.setItem('crcl_current_user', JSON.stringify(user));
    },

    clearCurrentUser() {
        localStorage.removeItem('crcl_current_user');
    },

    // Responders
    getResponders() {
        const users = this.getUsers();
        return users.filter(u => u.role === 'responder');
    },

    getAvailableResponders() {
        return this.getResponders().filter(r => r.status === 'available');
    }
};

// Initialize data on load
if (typeof window !== 'undefined') {
    dataManager.init();
}

