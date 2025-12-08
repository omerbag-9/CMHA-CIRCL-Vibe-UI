// Dispatcher Dashboard Page Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }

    // Load dashboard data
    loadDashboard();

    // Setup filters and search
    setupFilters();
});

function loadDashboard() {
    // Update statistics
    cases.updateStatistics();

    // Load active cases
    const activeCases = dataManager.getCases()
        .filter(c => c.status === 'active' || c.status === 'new' || c.status === 'pending')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10); // Show latest 10

    cases.renderCasesList(activeCases, 'active-cases-list');
}

function setupFilters() {
    // Real-time filtering can be added here if needed
}

