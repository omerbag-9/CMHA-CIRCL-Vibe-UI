// Chat Management Functions

const chat = {
    currentConversation: null,
    currentCaseId: null,
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
            let userName = 'Unknown';
            let caseInfo = '';
            
            // Check if it's a public user (person in crisis)
            if (userId.startsWith('public_')) {
                // Get case info for public users
                const messages = dataManager.getMessagesByConversation(currentUser.id, userId);
                const caseMessage = messages.find(m => m.caseId);
                if (caseMessage) {
                    const caseData = dataManager.getCaseById(caseMessage.caseId);
                    if (caseData) {
                        userName = caseData.callerName || 'Person in Crisis';
                        caseInfo = ` • ${caseData.caseId}`;
                    } else {
                        userName = 'Person in Crisis';
                    }
                } else {
                    userName = 'Person in Crisis';
                }
            } else {
                const user = dataManager.getUserById(userId);
                if (user) {
                    userName = user.name;
                }
            }
            
            const messages = dataManager.getMessagesByConversation(currentUser.id, userId);
            const lastMessage = messages[messages.length - 1];
            
            return {
                userId,
                userName: userName + caseInfo,
                lastMessage: lastMessage ? lastMessage.text : '',
                lastMessageTime: lastMessage ? lastMessage.timestamp : '',
                unread: messages.filter(m => !m.read && m.toId === currentUser.id).length,
                isPublic: userId.startsWith('public_')
            };
        }).sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

        this.renderConversations();
    },

    // Get initials for avatar
    getInitials(name) {
        if (!name) return 'U';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    },

    // Format time for display
    formatTime(timestamp) {
        if (!timestamp) return '';
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}d`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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

        container.innerHTML = this.conversations.map(conv => {
            const initials = this.getInitials(conv.userName.split(' • ')[0]);
            const time = this.formatTime(conv.lastMessageTime);
            return `
                <div class="chat-contact ${conv.userId === this.currentConversation ? 'active' : ''}" 
                     onclick="chat.openConversation('${conv.userId}')">
                    <div class="chat-contact-avatar">${initials}</div>
                    <div class="chat-contact-info">
                        <div class="chat-contact-header">
                            <div class="chat-contact-name">${conv.userName}</div>
                            ${time ? `<div class="chat-contact-time">${time}</div>` : ''}
                        </div>
                        <div class="chat-contact-preview">${conv.lastMessage || 'No messages'}</div>
                    </div>
                    ${conv.unread > 0 ? `<span class="chat-contact-badge">${conv.unread}</span>` : ''}
                </div>
            `;
        }).join('');
    },

    // Open conversation
    openConversation(userId) {
        this.currentConversation = userId;
        const currentUser = auth.getCurrentUser();
        const messages = dataManager.getMessagesByConversation(currentUser.id, userId);
        
        let userName = 'Unknown';
        let caseInfo = '';
        let foundCaseId = null;
        
        // Check if it's a public user (person in crisis)
        if (userId.startsWith('public_')) {
            const caseMessage = messages.find(m => m.caseId);
            if (caseMessage) {
                foundCaseId = caseMessage.caseId;
                const caseData = dataManager.getCaseById(caseMessage.caseId);
                if (caseData) {
                    userName = caseData.callerName || 'Person in Crisis';
                    caseInfo = ` • ${caseData.caseId}`;
                } else {
                    userName = 'Person in Crisis';
                }
            } else {
                // Try to extract caseId from userId if it follows the pattern public_caseId
                const match = userId.match(/^public_(.+)$/);
                if (match && match[1]) {
                    const possibleCaseId = match[1];
                    const caseData = dataManager.getCaseById(possibleCaseId);
                    if (caseData) {
                        foundCaseId = possibleCaseId;
                        userName = caseData.callerName || 'Person in Crisis';
                        caseInfo = ` • ${caseData.caseId}`;
                    } else {
                        userName = 'Person in Crisis';
                    }
                } else {
                    userName = 'Person in Crisis';
                }
            }
            
            // Update currentCaseId if we found one
            if (foundCaseId) {
                this.currentCaseId = foundCaseId;
            }
        } else {
            const user = dataManager.getUserById(userId);
            if (user) {
                userName = user.name;
            }
        }

        // Update header with Zoho Mail style
        const headerName = document.getElementById('chat-header-name');
        const headerSubtitle = document.getElementById('chat-header-subtitle');
        const headerAvatar = document.getElementById('chat-header-avatar');
        
        if (headerName) {
            headerName.textContent = userName;
        }
        if (headerSubtitle) {
            headerSubtitle.textContent = caseInfo ? caseInfo.replace(' • ', '') : 'Online';
        }
        if (headerAvatar) {
            headerAvatar.textContent = this.getInitials(userName);
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

        let lastDate = null;
        container.innerHTML = messages.map(msg => {
            const isSent = msg.fromId === currentUserId;
            const sender = dataManager.getUserById(msg.fromId);
            const msgDate = new Date(msg.timestamp);
            const dateStr = msgDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
            const showDateSeparator = dateStr !== lastDate;
            lastDate = dateStr;
            
            const timeStr = msgDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
            
            return `
                ${showDateSeparator ? `
                    <div class="chat-date-separator">
                        <span>${dateStr}</span>
                    </div>
                ` : ''}
                <div class="chat-message ${isSent ? 'sent' : 'received'}">
                    ${!isSent ? `<div class="chat-message-sender">${sender ? sender.name : 'Unknown'}</div>` : ''}
                    <div class="chat-message-bubble">${msg.text}</div>
                    <div class="chat-message-time">${timeStr}</div>
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

        // Add caseId if available (from URL parameter or stored)
        if (this.currentCaseId) {
            messageData.caseId = this.currentCaseId;
            messageData.isPublic = this.currentConversation.startsWith('public_');
        }

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

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="padding: 24px; text-align: center;">
                    <p style="color: var(--text-secondary); font-size: 14px;">No conversations found</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(conv => `
            <div class="chat-contact ${conv.userId === this.currentConversation ? 'active' : ''}" 
                 onclick="chat.openConversation('${conv.userId}')">
                <div class="chat-contact-name">
                    ${conv.userName}
                    ${conv.unread > 0 ? `<span class="badge badge-urgent" style="margin-left: 8px; font-size: 10px; padding: 2px 6px;">${conv.unread}</span>` : ''}
                </div>
                <div class="chat-contact-preview">${conv.lastMessage || 'No messages'}</div>
            </div>
        `).join('');
    }
};

