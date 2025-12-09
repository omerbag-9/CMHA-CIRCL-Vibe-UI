// Chat Page Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }

    // Check if caseId is provided in URL
    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get('caseId');
    
    // Initialize chat
    chat.init();
    
    if (caseId) {
        // Wait for chat to fully initialize, then find and open the conversation
        setTimeout(() => {
            openConversationByCaseId(caseId);
        }, 500);
    }
});

function openConversationByCaseId(caseId) {
    const currentUser = auth.getCurrentUser();
    if (!currentUser) return;
    
    // Get case data
    const caseData = dataManager.getCaseById(caseId);
    if (!caseData) {
        utils.showNotification('Case not found', 'error');
        return;
    }
    
    // Get all messages for this case
    const caseMessages = dataManager.getMessagesByCase(caseId);
    
    let publicUserId = null;
    
    // Strategy 1: Look for public user ID in existing messages for this case
    for (const msg of caseMessages) {
        if (msg.isPublic || msg.caseId === caseId) {
            // Check if fromId is a public user (and not the current user)
            if (msg.fromId.startsWith('public_') && msg.fromId !== currentUser.id) {
                publicUserId = msg.fromId;
                break;
            }
            // Check if toId is a public user (and not the current user)
            if (msg.toId.startsWith('public_') && msg.toId !== currentUser.id) {
                publicUserId = msg.toId;
                break;
            }
        }
    }
    
    // Strategy 2: Check all conversations to find one linked to this case
    if (!publicUserId) {
        const allMessages = dataManager.getMessages();
        const userIds = new Set();
        
        // Get all unique conversation partners
        allMessages.forEach(msg => {
            if (msg.caseId === caseId) {
                if (msg.fromId === currentUser.id) {
                    userIds.add(msg.toId);
                } else if (msg.toId === currentUser.id) {
                    userIds.add(msg.fromId);
                }
            }
        });
        
        // Find the public user ID from these conversations
        for (const userId of userIds) {
            if (userId.startsWith('public_')) {
                // Verify this user has messages for this case
                const messages = dataManager.getMessagesByConversation(currentUser.id, userId);
                const hasCaseMessage = messages.some(m => m.caseId === caseId);
                if (hasCaseMessage) {
                    publicUserId = userId;
                    break;
                }
            }
        }
    }
    
    // Strategy 3: Try common patterns for public user IDs
    if (!publicUserId) {
        const possibleUserIds = [
            'public_' + caseId,
            'public_' + caseData.id,
            localStorage.getItem('public_user_id')
        ].filter(Boolean);
        
        // Check if any of these user IDs have messages with the current user
        for (const userId of possibleUserIds) {
            if (userId.startsWith('public_')) {
                const messages = dataManager.getMessagesByConversation(currentUser.id, userId);
                const hasCaseMessage = messages.some(m => m.caseId === caseId);
                if (messages.length > 0 || hasCaseMessage) {
                    publicUserId = userId;
                    break;
                }
            }
        }
    }
    
    // Strategy 4: ALWAYS create a public user ID based on caseId
    // This ensures we can always open a conversation, even if no messages exist
    if (!publicUserId) {
        publicUserId = 'public_' + caseId;
    }
    
    // Always open the conversation - we now guarantee publicUserId exists
    // Make sure conversations are loaded first
    chat.loadConversations();
    
    // Wait for conversations to be rendered, then open
    setTimeout(() => {
        // Check if conversation exists in the list, if not, add it
        const conversationExists = chat.conversations.some(c => c.userId === publicUserId);
        
        // If conversation doesn't exist yet, we need to add it to the list
        if (!conversationExists) {
            // Add the conversation to the list
            const caseInfo = ` • ${caseData.caseId}`;
            chat.conversations.unshift({
                userId: publicUserId,
                userName: (caseData.callerName || 'Person in Crisis') + caseInfo,
                lastMessage: '',
                lastMessageTime: new Date().toISOString(), // Use current time so it appears at top
                unread: 0,
                isPublic: true
            });
            // Sort conversations again
            chat.conversations.sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));
            chat.renderConversations();
        }
        
        // Store caseId for this conversation so messages can be linked
        chat.currentCaseId = caseId;
        
        // Now open the conversation
        chat.openConversation(publicUserId);
        
        // Scroll the conversation into view in the sidebar
        setTimeout(() => {
            const conversationElement = document.querySelector(`[onclick*="${publicUserId.replace(/'/g, "\\'")}"]`);
            if (conversationElement) {
                conversationElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                // Highlight it briefly
                conversationElement.classList.add('active');
            }
        }, 100);
    }, 300);
}

