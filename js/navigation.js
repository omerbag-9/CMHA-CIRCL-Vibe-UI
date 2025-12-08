// Navigation Helper - Handles navigation and active states

const navigation = {
    // Set active nav item based on current page
    setActiveNav() {
        // Get current page from URL
        const path = window.location.pathname;
        const currentPage = path.split('/').pop() || 'dashboard.html';
        
        // Remove all active classes first
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Find and activate the matching nav item
        document.querySelectorAll('.nav-item').forEach(item => {
            const href = item.getAttribute('href');
            if (href) {
                const hrefPage = href.split('/').pop();
                // Match the page name
                if (hrefPage === currentPage) {
                    item.classList.add('active');
                }
                // Also handle index/dashboard cases
                if ((currentPage === '' || currentPage === 'index.html') && hrefPage === 'dashboard.html') {
                    item.classList.add('active');
                }
            }
        });
    },

    // Initialize navigation
    init() {
        // Set active state based on current URL
        this.setActiveNav();
        
        // Update active state after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.setActiveNav();
        }, 100);
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => navigation.init());
} else {
    navigation.init();
}

// Also run on page load
window.addEventListener('load', () => {
    navigation.setActiveNav();
});

