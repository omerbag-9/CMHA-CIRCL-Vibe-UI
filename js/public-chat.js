// Public Chat - For People in Crisis

const publicChat = {
    caseId: null,
    publicUserId: null,
    dispatcherId: '1', // Default dispatcher ID
    intervalId: null,

    // Initialize public chat
    init() {
        // Get case ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        this.caseId = urlParams.get('caseId');
        
        if (!this.caseId) {
            // Try to get from localStorage
            this.caseId = localStorage.getItem('public_case_id');
        }

        if (!this.caseId) {
            document.getElementById('public-chat-messages').innerHTML = `
                <div class="empty-state">
                    <p>No case found. Please submit a request first.</p>
                    <a href="request-help.html" class="btn btn-primary">Request Help</a>
                </div>
            `;
            return;
        }

        // Get or create public user
        this.setupPublicUser();
        
        // Load case info
        this.loadCaseInfo();
        
        // Load messages
        this.loadMessages();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Start polling for new messages
        this.startPolling();
    },

    // Setup public user (anonymous user for chat)
    setupPublicUser() {
        // Check if we have a public user ID stored
        let publicUserId = localStorage.getItem('public_user_id');
        
        if (!publicUserId) {
            // Create a temporary public user
            publicUserId = 'public_' + Date.now();
            localStorage.setItem('public_user_id', publicUserId);
        }
        
        this.publicUserId = publicUserId;
    },

    // Load case info
    loadCaseInfo() {
        const caseData = dataManager.getCaseById(this.caseId);
        if (caseData) {
            const caseInfoEl = document.getElementById('case-id-text');
            if (caseInfoEl) {
                caseInfoEl.textContent = `Case: ${caseData.caseId}`;
            }
        }
    },

    // Setup event listeners
    setupEventListeners() {
        const sendBtn = document.getElementById('public-send-btn');
        const chatInput = document.getElementById('public-chat-input');

        if (sendBtn) {
            sendBtn.addEventListener('click', () => {
                this.sendMessage();
            });
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
    },

    // Load messages
    loadMessages() {
        const messages = dataManager.getMessagesByConversation(this.publicUserId, this.dispatcherId);
        this.renderMessages(messages);
    },

    // Render messages
    renderMessages(messages) {
        const container = document.getElementById('public-chat-messages');
        if (!container) return;

        if (messages.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>Start the conversation. A dispatcher will respond shortly.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = messages.map(msg => {
            const isSent = msg.fromId === this.publicUserId;
            
            return `
                <div class="chat-message ${isSent ? 'sent' : 'received'}">
                    <div class="chat-message-text">${msg.text}</div>
                    <div class="chat-message-time">${utils.formatDate(msg.timestamp)}</div>
                </div>
            `;
        }).join('');

        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    },

    // Send message
    sendMessage() {
        const chatInput = document.getElementById('public-chat-input');
        if (!chatInput || !chatInput.value.trim()) return;

        const messageData = {
            fromId: this.publicUserId,
            toId: this.dispatcherId,
            text: chatInput.value.trim(),
            type: 'text',
            caseId: this.caseId,
            isPublic: true
        };

        dataManager.createMessage(messageData);
        chatInput.value = '';

        // Reload messages
        this.loadMessages();
    },

    // Poll for new messages
    startPolling() {
        this.intervalId = setInterval(() => {
            this.loadMessages();
        }, 2000); // Check every 2 seconds
    },

    // Stop polling
    stopPolling() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
};

// Initialize when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => publicChat.init());
} else {
    publicChat.init();
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    publicChat.stopPolling();
});

