// Responder Cases Page Logic

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }

    const currentUser = auth.getCurrentUser();
    if (currentUser.role !== 'responder') {
        window.location.href = '/index.html';
        return;
    }

    loadCases();
});

function loadCases() {
    const currentUser = auth.getCurrentUser();
    const allCases = dataManager.getCases();
    
    // Filter cases assigned to this responder
    let myCases = allCases.filter(c => c.assignedTo === currentUser.id);
    
    // Apply filter
    if (currentFilter === 'active') {
        myCases = myCases.filter(c => ['accepted_by_responder', 'on_site'].includes(c.status));
    } else if (currentFilter === 'pending') {
        myCases = myCases.filter(c => c.status === 'assigned_to_responder');
    } else if (currentFilter === 'completed') {
        myCases = myCases.filter(c => ['responder_closed', 'closed'].includes(c.status));
    }

    // Sort by date
    myCases.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    renderCases(myCases);
}

function renderCases(cases) {
    const container = document.getElementById('cases-list');
    if (!container) return;

    if (cases.length === 0) {
        container.innerHTML = `
            <div class="mobile-empty-state">
                <div class="icon">📋</div>
                <div>No cases found</div>
            </div>
        `;
        return;
    }

    container.innerHTML = cases.map(caseData => {
        const personName = caseData.callerName || caseData.personInCrisisName || 'Unknown';
        const location = caseData.callerLocation || caseData.personInCrisisLocation || 'Unknown location';
        const statusBadge = utils.getBadgeText(caseData.status);
        const isEmergency = caseData.crisisType === 'emergency' || caseData.isEmergency;
        const badgeClass = caseData.status === 'on_site' ? 'mobile-badge-urgent' : 
                          ['responder_closed', 'closed'].includes(caseData.status) ? 'mobile-badge-routine' :
                          'mobile-badge-routine';

        return `
            <div class="mobile-card">
                <div class="mobile-card-header">
                    <div>
                        <h3 class="mobile-card-title">${personName}</h3>
                        <p class="mobile-card-subtitle">${caseData.caseId}</p>
                    </div>
                    <div style="display: flex; flex-direction: column; gap: 4px; align-items: flex-end;">
                        <span class="mobile-badge ${badgeClass}">${statusBadge}</span>
                        ${isEmergency ? '<span class="mobile-badge mobile-badge-emergency">EMERGENCY</span>' : ''}
                    </div>
                </div>
                <div class="mobile-card-body">
                    <div class="mobile-card-row">
                        <span class="icon">📍</span>
                        <span>${location}</span>
                    </div>
                    <div class="mobile-card-row">
                        <span class="icon">🕐</span>
                        <span>${utils.timeAgo(caseData.createdAt)}</span>
                    </div>
                </div>
                <div class="mobile-card-actions">
                    <a href="case-detail.html?id=${caseData.id}" class="mobile-btn mobile-btn-primary mobile-btn-full">View Details</a>
                </div>
            </div>
        `;
    }).join('');
}

function filterCases(filter) {
    currentFilter = filter;
    
    // Update button styles
    document.querySelectorAll('[data-filter]').forEach(btn => {
        if (btn.dataset.filter === filter) {
            btn.classList.remove('mobile-btn-secondary');
            btn.classList.add('mobile-btn-primary');
        } else {
            btn.classList.remove('mobile-btn-primary');
            btn.classList.add('mobile-btn-secondary');
        }
    });

    loadCases();
}

// Make functions globally available
window.filterCases = filterCases;

