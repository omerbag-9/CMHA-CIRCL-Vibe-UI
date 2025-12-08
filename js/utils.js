// Utility Functions

const utils = {
    // Format date
    formatDate(date) {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    // Format time ago
    timeAgo(date) {
        if (!date) return '';
        const now = new Date();
        const then = new Date(date);
        const diff = now - then;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} min ago`;
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        return `${days} day${days > 1 ? 's' : ''} ago`;
    },

    // Generate unique ID
    generateId(prefix = '') {
        const timestamp = Date.now();
        const random = Math.random().toString(36).substring(2, 9);
        return prefix ? `${prefix}-${timestamp}-${random}` : `${timestamp}-${random}`;
    },

    // Get case ID format
    generateCaseId() {
        const year = new Date().getFullYear();
        const num = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
        return `CR-${year}-${num}`;
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Show notification
    showNotification(message, type = 'info') {
        // Simple notification - can be enhanced
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#F44336' : type === 'success' ? '#00C853' : '#2196F3'};
            color: ${type === 'success' ? '#000' : '#fff'};
            padding: 16px 24px;
            border-radius: 4px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 3000);
    },

    // Get badge class
    getBadgeClass(status) {
        const badges = {
            'new': 'badge-new',
            'active': 'badge-active',
            'urgent': 'badge-urgent',
            'emergency': 'badge-emergency',
            'closed': 'badge-closed',
            'pending': 'badge-urgent'
        };
        return badges[status] || 'badge-new';
    },

    // Get badge text
    getBadgeText(status) {
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
};

