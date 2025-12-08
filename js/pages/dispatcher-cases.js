// Dispatcher Cases Page Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }

    // Load cases
    loadCases();

    // Setup filters
    setupFilters();
});

function loadCases() {
    const filteredCases = cases.filterCases();
    cases.renderCasesList(filteredCases, 'cases-list');
}

function setupFilters() {
    const statusFilter = document.getElementById('filter-status');
    const urgencyFilter = document.getElementById('filter-urgency');
    const searchInput = document.getElementById('search-cases');

    if (statusFilter) {
        statusFilter.addEventListener('change', loadCases);
    }

    if (urgencyFilter) {
        urgencyFilter.addEventListener('change', loadCases);
    }

    if (searchInput) {
        searchInput.addEventListener('input', utils.debounce(loadCases, 300));
    }
}

