// Chat Management Functions

const chat = {
    currentConversation: null,
    conversations: [],

    // Initialize chat
    init() {
        this.loadConversations();
        this.setupEventListeners();
    },

    // Setup event listeners
    setupEventListeners() {
        const sendBtn = document.getElementById('send-message-btn');
        const chatInput = document.getElementById('chat-input');
        const searchInput = document.getElementById('chat-search-input');

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

        if (searchInput) {
            searchInput.addEventListener('input', utils.debounce((e) => {
                this.searchConversations(e.target.value);
            }, 300));
        }
    },

    // Load conversations
    loadConversations() {
        const currentUser = auth.getCurrentUser();
        if (!currentUser) return;

        const allMessages = dataManager.getMessages();
        const userIds = new Set();
        
        // Get all unique conversation partners
        allMessages.forEach(msg => {
            if (msg.fromId === currentUser.id) {
                userIds.add(msg.toId);
            } else if (msg.toId === currentUser.id) {
                userIds.add(msg.fromId);
            }
        });

        // Get user details for each conversation
        this.conversations = Array.from(userIds).map(userId => {
            const user = dataManager.getUserById(userId);
            const messages = dataManager.getMessagesByConversation(currentUser.id, userId);
            const lastMessage = messages[messages.length - 1];
            
            return {
                userId,
                userName: user ? user.name : 'Unknown',
                lastMessage: lastMessage ? lastMessage.text : '',
                lastMessageTime: lastMessage ? lastMessage.timestamp : '',
                unread: messages.filter(m => !m.read && m.toId === currentUser.id).length
            };
        }).sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

        this.renderConversations();
    },

    // Render conversations list
    renderConversations() {
        const container = document.getElementById('chat-contacts');
        if (!container) return;

        if (this.conversations.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No conversations</p>
                </div>
            `;
            return;
        }

        container.innerHTML = this.conversations.map(conv => `
            <div class="chat-contact ${conv.userId === this.currentConversation ? 'active' : ''}" 
                 onclick="chat.openConversation('${conv.userId}')">
                <div class="chat-contact-name">${conv.userName}</div>
                <div class="chat-contact-preview">${conv.lastMessage || 'No messages'}</div>
                ${conv.unread > 0 ? `<span class="badge badge-new">${conv.unread}</span>` : ''}
            </div>
        `).join('');
    },

    // Open conversation
    openConversation(userId) {
        this.currentConversation = userId;
        const currentUser = auth.getCurrentUser();
        const messages = dataManager.getMessagesByConversation(currentUser.id, userId);
        const user = dataManager.getUserById(userId);

        // Update header
        const header = document.getElementById('chat-header');
        if (header) {
            header.innerHTML = `<span>${user ? user.name : 'Unknown'}</span>`;
        }

        // Enable input
        const chatInput = document.getElementById('chat-input');
        const sendBtn = document.getElementById('send-message-btn');
        if (chatInput) chatInput.disabled = false;
        if (sendBtn) sendBtn.disabled = false;

        // Render messages
        this.renderMessages(messages, currentUser.id);

        // Mark messages as read
        messages.forEach(msg => {
            if (msg.toId === currentUser.id && !msg.read) {
                // Update read status (would need updateMessage function in dataManager)
            }
        });

        // Update conversations list
        this.renderConversations();
    },

    // Render messages
    renderMessages(messages, currentUserId) {
        const container = document.getElementById('chat-messages');
        if (!container) return;

        if (messages.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <p>No messages yet. Start the conversation!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = messages.map(msg => {
            const isSent = msg.fromId === currentUserId;
            const sender = dataManager.getUserById(msg.fromId);
            
            return `
                <div class="chat-message ${isSent ? 'sent' : 'received'}">
                    <div class="chat-message-header">${sender ? sender.name : 'Unknown'}</div>
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
        const chatInput = document.getElementById('chat-input');
        if (!chatInput || !chatInput.value.trim() || !this.currentConversation) return;

        const currentUser = auth.getCurrentUser();
        if (!currentUser) return;

        const messageData = {
            fromId: currentUser.id,
            toId: this.currentConversation,
            text: chatInput.value.trim(),
            type: 'text'
        };

        dataManager.createMessage(messageData);
        chatInput.value = '';

        // Reload conversation
        this.openConversation(this.currentConversation);
    },

    // Search conversations
    searchConversations(searchTerm) {
        const filtered = this.conversations.filter(conv =>
            conv.userName.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const container = document.getElementById('chat-contacts');
        if (!container) return;

        container.innerHTML = filtered.map(conv => `
            <div class="chat-contact ${conv.userId === this.currentConversation ? 'active' : ''}" 
                 onclick="chat.openConversation('${conv.userId}')">
                <div class="chat-contact-name">${conv.userName}</div>
                <div class="chat-contact-preview">${conv.lastMessage || 'No messages'}</div>
            </div>
        `).join('');
    }
};

