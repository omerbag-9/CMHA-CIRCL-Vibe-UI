// Follow-ups Page Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }

    loadFollowUps();
    setupFilters();
    setupEventListeners();
    setupChat();
});

let currentFollowupCaseId = null;
let currentPublicUserId = null;
let chatPollInterval = null;

function loadFollowUps() {
    const allCases = dataManager.getCases();
    const now = new Date();
    
    // Filter cases with follow-ups
    const followupCases = allCases.filter(c => c.followupScheduled || c.followupTime);
    
    // Separate into due and scheduled
    const dueFollowups = [];
    const scheduledFollowups = [];
    
    followupCases.forEach(caseData => {
        if (!caseData.followupTime) return;
        
        const followupTime = new Date(caseData.followupTime);
        const hoursUntil = (followupTime - now) / (1000 * 60 * 60);
        
        if (hoursUntil <= 0) {
            // Overdue or due now
            dueFollowups.push(caseData);
        } else {
            // Scheduled for future
            scheduledFollowups.push(caseData);
        }
    });
    
    // Sort by follow-up time
    dueFollowups.sort((a, b) => new Date(a.followupTime) - new Date(b.followupTime));
    scheduledFollowups.sort((a, b) => new Date(a.followupTime) - new Date(b.followupTime));
    
    renderFollowUps(dueFollowups, 'due-followups-list', true);
    renderFollowUps(scheduledFollowups, 'scheduled-followups-list', false);
}

function renderFollowUps(followups, containerId, isDue) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (followups.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No ${isDue ? 'due' : 'scheduled'} follow-ups</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = followups.map(caseData => {
        const followupTime = new Date(caseData.followupTime);
        const now = new Date();
        const hoursUntil = (followupTime - now) / (1000 * 60 * 60);
        const isOverdue = hoursUntil < -24;
        
        return `
            <div class="case-card">
                <div class="case-card-header">
                    <div>
                        <div class="case-id">${caseData.caseId}</div>
                        <div class="case-info">
                            <div class="case-info-item">${caseData.callerName || 'Unknown'}</div>
                            <div class="case-info-item">Follow-up: ${utils.formatDate(caseData.followupTime)}</div>
                            ${isOverdue ? '<div class="case-info-item" style="color: var(--error);">⚠️ Overdue</div>' : ''}
                        </div>
                    </div>
                    <div>
                        <span class="case-badge ${isOverdue ? 'badge-emergency' : 'badge-urgent'}">
                            ${isOverdue ? 'Overdue' : 'Due'}
                        </span>
                    </div>
                </div>
                <div class="case-info">
                    <div class="case-info-item">📍 ${caseData.callerLocation || 'Location not provided'}</div>
                    <div class="case-info-item">📞 ${caseData.callerPhone || 'Phone not provided'}</div>
                </div>
                <div class="case-actions">
                    <button class="btn btn-primary" onclick="openFollowupChat('${caseData.id}')">💬 Chat & Follow-up</button>
                    <button class="btn btn-secondary" onclick="openFollowupModal('${caseData.id}')">Complete Follow-up</button>
                    <a href="case-detail.html?id=${caseData.id}" class="btn btn-secondary">View Case</a>
                    <button class="btn btn-secondary" onclick="rescheduleFollowup('${caseData.id}')">Reschedule</button>
                </div>
            </div>
        `;
    }).join('');
}

function setupFilters() {
    const statusFilter = document.getElementById('filter-followup-status');
    const timeRangeFilter = document.getElementById('filter-time-range');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', loadFollowUps);
    }
    
    if (timeRangeFilter) {
        timeRangeFilter.addEventListener('change', loadFollowUps);
    }
}

function setupEventListeners() {
    const completeBtn = document.getElementById('complete-followup-btn');
    if (completeBtn) {
        completeBtn.addEventListener('click', completeFollowup);
    }

    // Chat input
    const chatInput = document.getElementById('followup-chat-input');
    const sendBtn = document.getElementById('followup-send-btn');
    
    if (sendBtn) {
        sendBtn.addEventListener('click', sendFollowupMessage);
    }
    
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendFollowupMessage();
            }
        });
    }
}

function setupChat() {
    // Start polling for new messages if chat is open
    if (currentFollowupCaseId) {
        startChatPolling();
    }
}

function startChatPolling() {
    if (chatPollInterval) {
        clearInterval(chatPollInterval);
    }
    
    chatPollInterval = setInterval(() => {
        if (currentFollowupCaseId && currentPublicUserId) {
            loadFollowupChat();
        }
    }, 2000);
}

function stopChatPolling() {
    if (chatPollInterval) {
        clearInterval(chatPollInterval);
        chatPollInterval = null;
    }
}

function openFollowupChat(caseId) {
    currentFollowupCaseId = caseId;
    const caseData = dataManager.getCaseById(caseId);
    
    if (!caseData) return;
    
    // Find public user ID for this case
    const allMessages = dataManager.getMessages();
    const caseMessage = allMessages.find(m => m.caseId === caseId && m.isPublic);
    
    if (caseMessage) {
        // Use the fromId if it's a public user, or find the public user in the conversation
        if (caseMessage.fromId.startsWith('public_')) {
            currentPublicUserId = caseMessage.fromId;
        } else if (caseMessage.toId.startsWith('public_')) {
            currentPublicUserId = caseMessage.toId;
        } else {
            // Create a public user ID if it doesn't exist
            currentPublicUserId = 'public_' + caseId;
        }
    } else {
        // Create a public user ID if it doesn't exist
        currentPublicUserId = 'public_' + caseId;
    }
    
    // Update chat header
    const chatHeader = document.querySelector('.followup-chat-header h3');
    const chatSubtitle = document.querySelector('.followup-chat-subtitle');
    
    if (chatHeader) {
        chatHeader.textContent = `Chat: ${caseData.callerName || 'Person in Crisis'}`;
    }
    
    if (chatSubtitle) {
        chatSubtitle.textContent = `Case: ${caseData.caseId} • Follow-up: ${utils.formatDate(caseData.followupTime)}`;
    }
    
    // Show chat input
    const chatInputContainer = document.getElementById('followup-chat-input-container');
    if (chatInputContainer) {
        chatInputContainer.style.display = 'flex';
    }
    
    // Load chat messages
    loadFollowupChat();
    
    // Start polling
    startChatPolling();
    
    // Scroll to chat panel on mobile
    if (window.innerWidth < 768) {
        document.querySelector('.followups-right').scrollIntoView({ behavior: 'smooth' });
    }
}

function loadFollowupChat() {
    if (!currentFollowupCaseId || !currentPublicUserId) return;
    
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;
    
    // Get messages by conversation
    let messages = dataManager.getMessagesByConversation(currentUser.id, currentPublicUserId);
    
    // Also get messages by case ID to catch any case-linked messages
    const caseMessages = dataManager.getMessagesByCase(currentFollowupCaseId);
    
    // Merge and deduplicate
    const messageMap = new Map();
    [...messages, ...caseMessages].forEach(msg => {
        if (!messageMap.has(msg.id)) {
            messageMap.set(msg.id, msg);
        }
    });
    
    messages = Array.from(messageMap.values()).sort((a, b) => 
        new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    renderFollowupChat(messages, currentUser.id);
}

function renderFollowupChat(messages, currentUserId) {
    const container = document.getElementById('followup-chat-messages');
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
        const sender = msg.fromId === currentUserId ? 
            (auth.getCurrentUser()?.name || 'You') : 
            (dataManager.getCaseById(currentFollowupCaseId)?.callerName || 'Person in Crisis');
        
        return `
            <div class="chat-message ${isSent ? 'sent' : 'received'}">
                <div class="chat-message-header">${sender}</div>
                <div class="chat-message-text">${msg.text}</div>
                <div class="chat-message-time">${utils.formatDate(msg.timestamp)}</div>
            </div>
        `;
    }).join('');
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function sendFollowupMessage() {
    const chatInput = document.getElementById('followup-chat-input');
    if (!chatInput || !chatInput.value.trim() || !currentFollowupCaseId || !currentPublicUserId) return;
    
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;
    
    const messageData = {
        fromId: currentUser.id,
        toId: currentPublicUserId,
        text: chatInput.value.trim(),
        type: 'text',
        caseId: currentFollowupCaseId,
        isPublic: true
    };
    
    dataManager.createMessage(messageData);
    chatInput.value = '';
    
    // Reload chat
    loadFollowupChat();
}

function openFollowupModal(caseId) {
    currentFollowupCaseId = caseId;
    const caseData = dataManager.getCaseById(caseId);
    
    if (!caseData) return;
    
    const caseInfoEl = document.getElementById('followup-case-info');
    if (caseInfoEl) {
        caseInfoEl.innerHTML = `
            <div class="info-card" style="margin-bottom: 20px;">
                <h4>Case: ${caseData.caseId}</h4>
                <p><strong>Caller:</strong> ${caseData.callerName}</p>
                <p><strong>Phone:</strong> ${caseData.callerPhone}</p>
                <p><strong>Scheduled for:</strong> ${utils.formatDate(caseData.followupTime)}</p>
            </div>
        `;
    }
    
    app.openModal('followup-modal');
}

function completeFollowup() {
    if (!currentFollowupCaseId) return;
    
    const notes = document.getElementById('followup-notes').value;
    const outcome = document.getElementById('followup-outcome').value;
    
    if (!notes || !outcome) {
        utils.showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const caseData = dataManager.getCaseById(currentFollowupCaseId);
    if (!caseData) return;
    
    // Add follow-up note
    const followupNote = {
        text: `Follow-up completed: ${notes}`,
        outcome: outcome,
        timestamp: new Date().toISOString(),
        type: 'followup'
    };
    
    const existingNotes = caseData.notes || [];
    existingNotes.push(followupNote);
    
    // Update case based on outcome
    let newStatus = caseData.status;
    if (outcome === 'resolved') {
        newStatus = 'closed';
    } else if (outcome === 'needs-support' || outcome === 'escalate') {
        newStatus = 'active';
    }
    
    dataManager.updateCase(currentFollowupCaseId, {
        notes: existingNotes,
        status: newStatus,
        followupCompleted: true,
        followupCompletedAt: new Date().toISOString(),
        followupOutcome: outcome
    });
    
    utils.showNotification('Follow-up completed successfully', 'success');
    app.closeModal();
    
    // Clear chat if open
    stopChatPolling();
    currentFollowupCaseId = null;
    currentPublicUserId = null;
    
    // Reset chat panel
    const chatHeader = document.querySelector('.followup-chat-header h3');
    const chatSubtitle = document.querySelector('.followup-chat-subtitle');
    const chatInputContainer = document.getElementById('followup-chat-input-container');
    const chatMessages = document.getElementById('followup-chat-messages');
    
    if (chatHeader) chatHeader.textContent = 'Chat with Person in Crisis';
    if (chatSubtitle) chatSubtitle.textContent = 'Select a follow-up to start chatting';
    if (chatInputContainer) chatInputContainer.style.display = 'none';
    if (chatMessages) {
        chatMessages.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💬</div>
                <p>Select a follow-up case to chat with the person</p>
            </div>
        `;
    }
    
    // Reload follow-ups
    setTimeout(() => {
        loadFollowUps();
    }, 500);
}

function rescheduleFollowup(caseId) {
    const hours = prompt('Reschedule follow-up in how many hours? (24 or 48)', '24');
    if (!hours || isNaN(hours)) return;
    
    const followupTime = new Date();
    followupTime.setHours(followupTime.getHours() + parseInt(hours));
    
    dataManager.updateCase(caseId, {
        followupTime: followupTime.toISOString(),
        followupRescheduled: true
    });
    
    utils.showNotification('Follow-up rescheduled', 'success');
    setTimeout(() => {
        loadFollowUps();
    }, 500);
}

// Make functions globally available
window.openFollowupChat = openFollowupChat;
window.openFollowupModal = openFollowupModal;
window.rescheduleFollowup = rescheduleFollowup;

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    stopChatPolling();
});

