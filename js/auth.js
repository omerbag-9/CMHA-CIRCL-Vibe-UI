// Authentication Management

const auth = {
    // Check if user is logged in
    isAuthenticated() {
        return dataManager.getCurrentUser() !== null;
    },

    // Login
    login(email, password) {
        const user = dataManager.getUserByEmail(email);
        if (!user) {
            return { success: false, error: 'Invalid credentials' };
        }

        // Simple password check (in production, use proper hashing)
        if (user.password !== password) {
            return { success: false, error: 'Invalid credentials' };
        }

        const { password: _, ...userWithoutPassword } = user;
        dataManager.setCurrentUser(userWithoutPassword);
        return { success: true, user: userWithoutPassword };
    },

    // Logout
    logout() {
        dataManager.clearCurrentUser();
        window.location.href = '/index.html';
    },

    // Get current user
    getCurrentUser() {
        return dataManager.getCurrentUser();
    },

    // Check role
    hasRole(role) {
        const user = this.getCurrentUser();
        if (!user) return false;
        return user.role === role;
    },

    // Check if user has any of the roles
    hasAnyRole(roles) {
        const user = this.getCurrentUser();
        if (!user) return false;
        return roles.includes(user.role);
    },

    // Redirect based on role
    redirectByRole() {
        const user = this.getCurrentUser();
        if (!user) {
            window.location.href = '/index.html';
            return;
        }

        const roleRoutes = {
            'dispatcher': '/pages/dispatcher/dashboard.html',
            'responder': '/pages/responder/dashboard.html',
            'agency_manager': '/pages/manager/dashboard.html',
            'cmha_admin': '/pages/admin/dashboard.html'
        };

        const route = roleRoutes[user.role];
        if (route) {
            window.location.href = route;
        }
    }
};

