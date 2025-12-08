// Main Application Logic

const app = {
    currentUser: null,
    selectedResponder: null,

    // Initialize app
    init() {
        this.currentUser = auth.getCurrentUser();
        this.setupEventListeners();
        this.updateUserDisplay();
        this.checkAuth();
    },

    // Check authentication
    checkAuth() {
        const currentPath = window.location.pathname;
        const publicPaths = ['/index.html', '/pages/public/request-help.html'];
        
        if (publicPaths.some(path => currentPath.includes(path))) {
            return;
        }

        if (!auth.isAuthenticated()) {
            window.location.href = '/index.html';
            return;
        }

        // Check if user is on correct page for their role
        const user = auth.getCurrentUser();
        const rolePages = {
            'dispatcher': '/pages/dispatcher/',
            'responder': '/pages/responder/',
            'agency_manager': '/pages/manager/',
            'cmha_admin': '/pages/admin/'
        };

        const expectedPath = rolePages[user.role];
        if (expectedPath && !currentPath.includes(expectedPath)) {
            auth.redirectByRole();
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleLogin();
            });
        }

        // Logout button
        const logoutBtns = document.querySelectorAll('#logout-btn');
        logoutBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                auth.logout();
            });
        });

        // Menu toggle
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                document.querySelector('.sidebar').classList.toggle('open');
            });
        }

        // Navigation items - allow normal href navigation
        // Only prevent default if it's a data-page attribute (SPA mode)
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const page = item.getAttribute('data-page');
                // Only prevent default if it's SPA mode (has data-page but no href)
                if (page && !item.getAttribute('href')) {
                    e.preventDefault();
                    this.showPage(page);
                }
                // Otherwise, let the href work normally
            });
        });
    },

    // Handle login
    handleLogin() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('login-error');

        const result = auth.login(email, password);
        if (result.success) {
            errorDiv.classList.remove('show');
            auth.redirectByRole();
        } else {
            errorDiv.textContent = result.error;
            errorDiv.classList.add('show');
        }
    },

    // Update user display
    updateUserDisplay() {
        const user = auth.getCurrentUser();
        if (user) {
            const userNameElements = document.querySelectorAll('#user-name');
            userNameElements.forEach(el => {
                if (el) el.textContent = user.name;
            });
        }
    },

    // Show page (for SPA-like navigation)
    showPage(pageId) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.classList.add('active');
        }
    },

    // Close modal
    closeModal() {
        const modal = document.getElementById('modal-overlay');
        if (modal) {
            modal.style.display = 'none';
        }
        this.selectedResponder = null;
    },

    // Open modal
    openModal(modalId) {
        const modal = document.getElementById('modal-overlay');
        if (modal) {
            modal.style.display = 'flex';
            const targetModal = document.getElementById(modalId);
            if (targetModal) {
                document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
                targetModal.style.display = 'flex';
            }
        }
    }
};

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => app.init());
} else {
    app.init();
}

