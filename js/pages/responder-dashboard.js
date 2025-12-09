// Responder Dashboard Logic

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

    loadDashboard();
    setupEventListeners();
});

function loadDashboard() {
    const currentUser = auth.getCurrentUser();
    
    // Update responder name
    const responderNameEl = document.getElementById('responder-name');
    if (responderNameEl) {
        responderNameEl.textContent = currentUser.name;
    }

    // Load responder status
    const statusSelect = document.getElementById('responder-status');
    if (statusSelect && currentUser.status) {
        statusSelect.value = currentUser.status;
    }

    // Load all cases for this responder
    loadCases();
}

function loadCases() {
    const currentUser = auth.getCurrentUser();
    const allCases = dataManager.getCases();
    
    // Filter cases assigned to this responder
    const myCases = allCases.filter(c => c.assignedTo === currentUser.id);
    
    // Categorize cases
    const newRequests = myCases.filter(c => c.status === 'assigned_to_responder');
    const activeCases = myCases.filter(c => ['accepted_by_responder', 'on_site'].includes(c.status));
    const completedToday = myCases.filter(c => {
        if (c.status !== 'responder_closed' && c.status !== 'closed') return false;
        if (!c.closedAt) return false;
        const closedDate = new Date(c.closedAt);
        const today = new Date();
        return closedDate.toDateString() === today.toDateString();
    });

    // Sort emergency cases to top
    newRequests.sort((a, b) => {
        const aIsEmergency = a.crisisType === 'emergency' || a.isEmergency;
        const bIsEmergency = b.crisisType === 'emergency' || b.isEmergency;
        if (aIsEmergency && !bIsEmergency) return -1;
        if (!aIsEmergency && bIsEmergency) return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    // Update statistics
    document.getElementById('active-count').textContent = activeCases.length;
    document.getElementById('pending-count').textContent = newRequests.length;
    document.getElementById('completed-count').textContent = completedToday.length;
    document.getElementById('new-requests-badge').textContent = newRequests.length;
    document.getElementById('active-cases-badge').textContent = `${activeCases.length}/3`;
    document.getElementById('completed-cases-badge').textContent = completedToday.length;

    // Render lists
    renderNewRequests(newRequests);
    renderActiveCases(activeCases);
    renderCompletedCases(completedToday);
}

function renderNewRequests(requests) {
    const container = document.getElementById('new-requests-list');
    if (!container) return;

    if (requests.length === 0) {
        container.innerHTML = `
            <div class="mobile-empty-state">
                <div class="icon">📭</div>
                <div>No new requests</div>
            </div>
        `;
        return;
    }

    container.innerHTML = requests.map(caseData => {
        const isEmergency = caseData.crisisType === 'emergency' || caseData.isEmergency;
        const emergencyBadge = isEmergency ? '<span class="mobile-badge mobile-badge-emergency">EMERGENCY</span>' : '';
        const personName = caseData.callerName || caseData.personInCrisisName || 'Unknown';
        const location = caseData.callerLocation || caseData.personInCrisisLocation || 'Unknown location';
        
        return `
            <div class="mobile-card">
                <div class="mobile-card-header">
                    <div>
                        <h3 class="mobile-card-title">${personName}</h3>
                        <p class="mobile-card-subtitle">${caseData.caseId}</p>
                    </div>
                    ${emergencyBadge}
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
                    <button class="mobile-btn mobile-btn-primary" onclick="acceptCase('${caseData.id}')">Accept</button>
                    <button class="mobile-btn mobile-btn-secondary" onclick="viewCaseDetail('${caseData.id}')">View</button>
                    <button class="mobile-btn mobile-btn-secondary" onclick="declineCase('${caseData.id}')">Decline</button>
                </div>
            </div>
        `;
    }).join('');
}

function renderActiveCases(cases) {
    const container = document.getElementById('active-cases-list');
    if (!container) return;

    if (cases.length === 0) {
        container.innerHTML = `
            <div class="mobile-empty-state">
                <div class="icon">📋</div>
                <div>No active cases</div>
            </div>
        `;
        return;
    }

    container.innerHTML = cases.map(caseData => {
        const personName = caseData.callerName || caseData.personInCrisisName || 'Unknown';
        const location = caseData.callerLocation || caseData.personInCrisisLocation || 'Unknown location';
        const statusBadge = utils.getBadgeText(caseData.status);
        
        return `
            <div class="mobile-card">
                <div class="mobile-card-header">
                    <div>
                        <h3 class="mobile-card-title">${personName}</h3>
                        <p class="mobile-card-subtitle">${caseData.caseId}</p>
                    </div>
                    <span class="mobile-badge ${caseData.status === 'on_site' ? 'mobile-badge-urgent' : 'mobile-badge-routine'}">${statusBadge}</span>
                </div>
                <div class="mobile-card-body">
                    <div class="mobile-card-row">
                        <span class="icon">📍</span>
                        <span>${location}</span>
                    </div>
                    <div class="mobile-card-row">
                        <span class="icon">🕐</span>
                        <span>${utils.timeAgo(caseData.acceptedAt || caseData.createdAt)}</span>
                    </div>
                </div>
                <div class="mobile-card-actions">
                    <a href="case-detail.html?id=${caseData.id}" class="mobile-btn mobile-btn-primary">View Details</a>
                </div>
            </div>
        `;
    }).join('');
}

function renderCompletedCases(cases) {
    const container = document.getElementById('completed-cases-list');
    if (!container) return;

    if (cases.length === 0) {
        container.innerHTML = `
            <div class="mobile-empty-state">
                <div class="icon">✅</div>
                <div>No completed cases today</div>
            </div>
        `;
        return;
    }

    container.innerHTML = cases.map(caseData => {
        const personName = caseData.callerName || caseData.personInCrisisName || 'Unknown';
        const outcome = caseData.closureOutcome || 'Completed';
        
        return `
            <div class="mobile-card">
                <div class="mobile-card-header">
                    <div>
                        <h3 class="mobile-card-title">${personName}</h3>
                        <p class="mobile-card-subtitle">${caseData.caseId}</p>
                    </div>
                    <span class="mobile-badge mobile-badge-routine">${outcome}</span>
                </div>
                <div class="mobile-card-body">
                    <div class="mobile-card-row">
                        <span class="icon">🕐</span>
                        <span>Closed ${utils.timeAgo(caseData.closedAt)}</span>
                    </div>
                    ${caseData.timeOnSite ? `
                    <div class="mobile-card-row">
                        <span class="icon">⏱️</span>
                        <span>Time on site: ${caseData.timeOnSite} min</span>
                    </div>
                    ` : ''}
                </div>
                <div class="mobile-card-actions">
                    <a href="case-detail.html?id=${caseData.id}" class="mobile-btn mobile-btn-secondary mobile-btn-full">View Details</a>
                </div>
            </div>
        `;
    }).join('');
}

function setupEventListeners() {
    // Status change
    const statusSelect = document.getElementById('responder-status');
    if (statusSelect) {
        statusSelect.addEventListener('change', (e) => {
            const currentUser = auth.getCurrentUser();
            dataManager.updateUser(currentUser.id, { status: e.target.value });
            utils.showNotification(`Status updated to ${e.target.value}`, 'success');
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            auth.logout();
        });
    }
}

function acceptCase(caseId) {
    const currentUser = auth.getCurrentUser();
    const result = dataManager.acceptCase(caseId, currentUser.id);
    
    if (result.success) {
        utils.showNotification(result.message, 'success');
        setTimeout(() => {
            loadCases();
        }, 500);
    } else {
        utils.showNotification(result.message, 'error');
    }
}

function declineCase(caseId) {
    if (!confirm('Are you sure you want to decline this case?')) return;
    
    const reason = prompt('Reason for declining (optional):');
    const currentUser = auth.getCurrentUser();
    const result = dataManager.declineCase(caseId, currentUser.id, reason);
    
    if (result.success) {
        utils.showNotification(result.message, 'success');
        setTimeout(() => {
            loadCases();
        }, 500);
    } else {
        utils.showNotification(result.message, 'error');
    }
}

function viewCaseDetail(caseId) {
    window.location.href = `case-detail.html?id=${caseId}`;
}

// Make functions globally available
window.acceptCase = acceptCase;
window.declineCase = declineCase;
window.viewCaseDetail = viewCaseDetail;

