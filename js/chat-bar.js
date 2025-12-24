// Bottom Chat Bar - Zoho Mail Style

const chatBar = {
    isExpanded: false,
    conversations: [],

    init() {
        if (!auth.isAuthenticated()) return;
        
        this.setupEventListeners();
        this.loadConversations();
        this.startAutoRefresh();
    },

    setupEventListeners() {
        const toggleBtn = document.getElementById('chat-bar-toggle-btn');
        const toggle = document.getElementById('chat-bar-toggle');
        const newBtn = document.getElementById('chat-bar-new');
        const container = document.getElementById('chat-bar-container');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggle();
            });
        }

        if (toggle) {
            toggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.collapse();
            });
        }

        if (newBtn) {
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Just expand to show conversations
                if (!this.isExpanded) {
                    this.expand();
                }
            });
        }

        // Overlay removed - no blur effect

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isExpanded) {
                this.collapse();
            }
        });
    },

    toggle() {
        this.isExpanded = !this.isExpanded;
        if (this.isExpanded) {
            this.expand();
        } else {
            this.collapse();
        }
    },

    expand() {
        this.isExpanded = true;
        const container = document.getElementById('chat-bar-container');
        if (container) {
            container.classList.add('expanded');
        }
        document.body.classList.add('chat-bar-expanded');
    },

    collapse() {
        this.isExpanded = false;
        const container = document.getElementById('chat-bar-container');
        if (container) {
            container.classList.remove('expanded', 'chat-open');
            this.currentChatUserId = null;
        }
        document.body.classList.remove('chat-bar-expanded');
    },

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

        this.render();
    },

    getInitials(name) {
        if (!name) return 'U';
        const parts = name.trim().split(' • ')[0].split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    },

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

    render() {
        const container = document.getElementById('chat-bar-conversations');
        const badge = document.getElementById('chat-bar-badge');
        const title = document.getElementById('chat-bar-title');

        if (!container) return;

        // Update badge
        const totalUnread = this.conversations.reduce((sum, conv) => sum + conv.unread, 0);
        if (badge) {
            if (totalUnread > 0) {
                badge.textContent = totalUnread > 99 ? '99+' : totalUnread;
                badge.style.display = 'inline-block';
            } else {
                badge.style.display = 'none';
            }
        }

        // Update title
        if (title) {
            if (this.conversations.length === 0) {
                title.textContent = 'No messages';
            } else {
                title.textContent = `${this.conversations.length} conversation${this.conversations.length !== 1 ? 's' : ''}`;
            }
        }

        // Render conversations (show top 5)
        const topConversations = this.conversations.slice(0, 5);
        
        if (topConversations.length === 0) {
            container.innerHTML = `
                <div class="chat-bar-empty">
                    <p>No conversations yet</p>
                </div>
            `;
            return;
        }

        container.innerHTML = topConversations.map(conv => {
            const initials = this.getInitials(conv.userName);
            const time = this.formatTime(conv.lastMessageTime);
            return `
                <div class="chat-bar-conversation" onclick="chatBar.openConversation('${conv.userId}')">
                    <div class="chat-bar-conversation-avatar">${initials}</div>
                    <div class="chat-bar-conversation-info">
                        <div class="chat-bar-conversation-name">${conv.userName}</div>
                        <div class="chat-bar-conversation-preview">${conv.lastMessage || 'No messages'}</div>
                    </div>
                    <div class="chat-bar-conversation-meta">
                        ${time ? `<div class="chat-bar-conversation-time">${time}</div>` : ''}
                        ${conv.unread > 0 ? `<div class="chat-bar-conversation-unread">${conv.unread}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    },

    currentChatUserId: null,

    openConversation(userId) {
        // Open chat inline in the bar
        const currentUser = auth.getCurrentUser();
        if (!currentUser) return;

        this.currentChatUserId = userId;
        const container = document.getElementById('chat-bar-container');
        if (container) {
            if (!this.isExpanded) {
                this.expand();
            }
            container.classList.add('chat-open');
        }

        const messages = dataManager.getMessagesByConversation(currentUser.id, userId);
        this.renderChat(messages, currentUser.id, userId);
    },

    renderChat(messages, currentUserId, otherUserId) {
        const chatView = document.getElementById('chat-bar-chat-view');
        if (!chatView) return;

        let userName = 'Unknown';
        let caseInfo = '';
        
        // Get user name
        if (otherUserId.startsWith('public_')) {
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
            const user = dataManager.getUserById(otherUserId);
            if (user) {
                userName = user.name;
            }
        }

        // Render chat header
        const headerHTML = `
            <div class="chat-bar-chat-header">
                <div class="chat-bar-chat-header-info">
                    <button class="chat-bar-chat-back-btn" onclick="chatBar.closeChat()" title="Back">←</button>
                    <div class="chat-bar-chat-header-avatar">${this.getInitials(userName)}</div>
                    <div class="chat-bar-chat-header-name">${userName}${caseInfo}</div>
                </div>
                <div class="chat-bar-chat-header-actions"></div>
            </div>
        `;

        // Render messages
        let messagesHTML = '';
        if (messages.length === 0) {
            messagesHTML = `
                <div class="chat-bar-empty">
                    <p>No messages yet. Start the conversation!</p>
                </div>
            `;
        } else {
            let lastDate = null;
            messagesHTML = messages.map(msg => {
                const isSent = msg.fromId === currentUserId;
                const msgDate = new Date(msg.timestamp);
                const dateStr = msgDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
                const showDateSeparator = dateStr !== lastDate;
                lastDate = dateStr;
                const timeStr = msgDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
                
                return `
                    ${showDateSeparator ? `
                        <div style="text-align: center; margin: 16px 0; font-size: 11px; color: #9ca3af;">
                            ${dateStr}
                        </div>
                    ` : ''}
                    <div class="chat-bar-chat-message ${isSent ? 'sent' : 'received'}">
                        <div class="chat-bar-chat-message-bubble">${msg.text}</div>
                        <div class="chat-bar-chat-message-time">${timeStr}</div>
                    </div>
                `;
            }).join('');
        }

        // Render input
        const inputHTML = `
            <div class="chat-bar-chat-input-container">
                <input type="text" id="chat-bar-chat-input" placeholder="Type a message..." />
                <button class="chat-bar-chat-send-btn" id="chat-bar-chat-send-btn">Send</button>
            </div>
        `;

        chatView.innerHTML = headerHTML + `
            <div class="chat-bar-chat-messages" id="chat-bar-chat-messages">
                ${messagesHTML}
            </div>
        ` + inputHTML;

        // Scroll to bottom
        const messagesContainer = document.getElementById('chat-bar-chat-messages');
        if (messagesContainer) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }

        // Setup input event listeners
        const input = document.getElementById('chat-bar-chat-input');
        const sendBtn = document.getElementById('chat-bar-chat-send-btn');

        if (input && sendBtn) {
            const sendMessage = () => {
                if (!input.value.trim() || !this.currentChatUserId) return;
                
                const currentUser = auth.getCurrentUser();
                if (!currentUser) return;

                const messageData = {
                    fromId: currentUser.id,
                    toId: this.currentChatUserId,
                    text: input.value.trim(),
                    type: 'text'
                };

                // Add caseId if available
                const messages = dataManager.getMessagesByConversation(currentUser.id, this.currentChatUserId);
                const caseMessage = messages.find(m => m.caseId);
                if (caseMessage && caseMessage.caseId) {
                    messageData.caseId = caseMessage.caseId;
                    messageData.isPublic = this.currentChatUserId.startsWith('public_');
                }

                dataManager.createMessage(messageData);
                input.value = '';

                // Reload chat
                this.openConversation(this.currentChatUserId);
            };

            sendBtn.addEventListener('click', sendMessage);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    sendMessage();
                }
            });
        }
    },

    closeChat() {
        this.currentChatUserId = null;
        const container = document.getElementById('chat-bar-container');
        if (container) {
            container.classList.remove('chat-open');
        }
    },

    startAutoRefresh() {
        // Refresh conversations every 30 seconds
        setInterval(() => {
            this.loadConversations();
        }, 30000);
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    chatBar.init();
});

