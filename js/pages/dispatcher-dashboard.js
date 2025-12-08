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

    // Load active cases with search filter
    const searchTerm = document.getElementById('search-dashboard-cases')?.value.toLowerCase() || '';
    
    let activeCases = dataManager.getCases()
        .filter(c => c.status === 'active' || c.status === 'new' || c.status === 'pending');
    
    // Apply search filter
    if (searchTerm) {
        activeCases = activeCases.filter(c => 
            (c.callerName && c.callerName.toLowerCase().includes(searchTerm)) ||
            (c.caseId && c.caseId.toLowerCase().includes(searchTerm)) ||
            (c.callerLocation && c.callerLocation.toLowerCase().includes(searchTerm))
        );
    }
    
    activeCases = activeCases
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10); // Show latest 10

    cases.renderCasesList(activeCases, 'active-cases-list');
}

function setupFilters() {
    const searchInput = document.getElementById('search-dashboard-cases');
    
    if (searchInput) {
        searchInput.addEventListener('input', utils.debounce(loadDashboard, 300));
    }
}

