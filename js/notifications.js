// Notifications Module

const notifications = {
    // Generate dummy notifications
    generateDummyNotifications() {
        return [
            {
                id: 'notif-1',
                type: 'case_assigned',
                title: 'New Case Assigned',
                message: 'Case CR-2024-100001 has been assigned to you',
                timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
                read: false,
                link: 'case-detail.html?id=case-1'
            },
            {
                id: 'notif-2',
                type: 'followup_due',
                title: 'Follow-up Due',
                message: 'Follow-up for John Smith is due in 2 hours',
                timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
                read: false,
                link: 'follow-ups.html'
            },
            {
                id: 'notif-3',
                type: 'new_message',
                title: 'New Message',
                message: 'You have a new message from Sarah Responder',
                timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
                read: false,
                link: 'chat.html'
            },
            {
                id: 'notif-4',
                type: 'case_updated',
                title: 'Case Status Updated',
                message: 'Case CR-2024-100002 status changed to "Assigned to Responder"',
                timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
                read: true,
                link: 'case-detail.html?id=case-2'
            },
            {
                id: 'notif-5',
                type: 'responder_available',
                title: 'Responder Available',
                message: 'Michael Brown is now available for assignment',
                timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                read: true,
                link: 'responders.html'
            },
            {
                id: 'notif-6',
                type: 'urgent_case',
                title: 'Urgent Case Alert',
                message: 'New urgent case CR-2024-100003 requires immediate attention',
                timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
                read: false,
                link: 'case-detail.html?id=case-3'
            },
            {
                id: 'notif-7',
                type: 'followup_completed',
                title: 'Follow-up Completed',
                message: 'Follow-up for Emily Davis has been marked as completed',
                timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
                read: true,
                link: 'follow-ups.html'
            },
            {
                id: 'notif-8',
                type: 'case_closed',
                title: 'Case Closed',
                message: 'Case CR-2024-100004 has been closed',
                timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
                read: true,
                link: 'cases.html'
            }
        ];
    },

    // Get notifications from localStorage or generate dummy ones
    getNotifications() {
        try {
            const stored = localStorage.getItem('crcl_notifications');
            if (stored) {
                return JSON.parse(stored);
            }
            // Generate and store dummy notifications
            const dummyNotifs = this.generateDummyNotifications();
            localStorage.setItem('crcl_notifications', JSON.stringify(dummyNotifs));
            return dummyNotifs;
        } catch (e) {
            console.warn('Error getting notifications:', e);
            return this.generateDummyNotifications();
        }
    },

    // Save notifications to localStorage
    saveNotifications(notifs) {
        try {
            localStorage.setItem('crcl_notifications', JSON.stringify(notifs));
        } catch (e) {
            console.warn('Error saving notifications:', e);
        }
    },

    // Mark notification as read
    markAsRead(notifId) {
        const notifs = this.getNotifications();
        const notif = notifs.find(n => n.id === notifId);
        if (notif) {
            notif.read = true;
            this.saveNotifications(notifs);
        }
    },

    // Mark all as read
    markAllAsRead() {
        const notifs = this.getNotifications();
        notifs.forEach(n => n.read = true);
        this.saveNotifications(notifs);
    },

    // Get unread count
    getUnreadCount() {
        const notifs = this.getNotifications();
        return notifs.filter(n => !n.read).length;
    },

    // Format timestamp
    formatTimestamp(timestamp) {
        const now = new Date();
        const time = new Date(timestamp);
        const diffMs = now - time;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return time.toLocaleDateString();
    },

    // Initialize notification dropdown
    init() {
        const notifBtn = document.getElementById('notifications-btn');
        if (!notifBtn) return;

        // Create dropdown if it doesn't exist
        let dropdown = document.getElementById('notifications-dropdown');
        if (!dropdown) {
            dropdown = this.createDropdown();
            notifBtn.parentElement.appendChild(dropdown);
        }

        // Toggle dropdown on button click
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
            this.updateDropdown();
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !notifBtn.contains(e.target)) {
                dropdown.classList.remove('show');
            }
        });

        // Update badge count
        this.updateBadge();
    },

    // Create dropdown HTML
    createDropdown() {
        const dropdown = document.createElement('div');
        dropdown.id = 'notifications-dropdown';
        dropdown.className = 'notifications-dropdown';
        
        dropdown.innerHTML = `
            <div class="notifications-header">
                <h3>Notifications</h3>
                <button class="mark-all-read-btn" id="mark-all-read-btn">Mark all as read</button>
            </div>
            <div class="notifications-list" id="notifications-list">
                <!-- Notifications will be loaded here -->
            </div>
            <div class="notifications-footer">
                <a href="#" class="view-all-link">View all notifications</a>
            </div>
        `;

        // Mark all as read button
        const markAllBtn = dropdown.querySelector('#mark-all-read-btn');
        if (markAllBtn) {
            markAllBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.markAllAsRead();
                this.updateDropdown();
                this.updateBadge();
            });
        }

        return dropdown;
    },

    // Update dropdown content
    updateDropdown() {
        const list = document.getElementById('notifications-list');
        if (!list) return;

        const notifs = this.getNotifications();
        
        if (notifs.length === 0) {
            list.innerHTML = '<div class="notification-empty">No notifications</div>';
            return;
        }

        list.innerHTML = notifs.map(notif => `
            <div class="notification-item ${notif.read ? 'read' : 'unread'}" data-id="${notif.id}">
                <div class="notification-icon">
                    ${this.getIcon(notif.type)}
                </div>
                <div class="notification-content">
                    <div class="notification-title">${notif.title}</div>
                    <div class="notification-message">${notif.message}</div>
                    <div class="notification-time">${this.formatTimestamp(notif.timestamp)}</div>
                </div>
            </div>
        `).join('');

        // Add click handlers
        list.querySelectorAll('.notification-item').forEach(item => {
            item.addEventListener('click', () => {
                const notifId = item.getAttribute('data-id');
                const notif = notifs.find(n => n.id === notifId);
                if (notif) {
                    this.markAsRead(notifId);
                    this.updateDropdown();
                    this.updateBadge();
                    if (notif.link) {
                        window.location.href = notif.link;
                    }
                }
            });
        });
    },

    // Get icon for notification type
    getIcon(type) {
        const icons = {
            'case_assigned': '📋',
            'followup_due': '⏰',
            'new_message': '💬',
            'case_updated': '🔄',
            'responder_available': '✅',
            'urgent_case': '🚨',
            'followup_completed': '✓',
            'case_closed': '🔒'
        };
        return icons[type] || '🔔';
    },

    // Update badge count on button
    updateBadge() {
        const notifBtn = document.getElementById('notifications-btn');
        if (!notifBtn) return;

        const unreadCount = this.getUnreadCount();
        
        // Remove existing badge
        const existingBadge = notifBtn.querySelector('.notification-badge');
        if (existingBadge) {
            existingBadge.remove();
        }

        // Add badge if there are unread notifications
        if (unreadCount > 0) {
            const badge = document.createElement('span');
            badge.className = 'notification-badge';
            badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
            notifBtn.appendChild(badge);
        }
    }
};

// Initialize notifications when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => notifications.init());
} else {
    notifications.init();
}

