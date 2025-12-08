// Follow-ups Page Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }

    loadFollowUps();
    setupFilters();
    setupEventListeners();
});

let currentFollowupCaseId = null;

function loadFollowUps() {
    const allCases = dataManager.getCases();
    const now = new Date();
    
    // Filter cases with follow-ups
    const followupCases = allCases.filter(c => c.followupScheduled || c.followupTime);
    
    // Separate into due and scheduled
    const dueFollowups = [];
    const scheduledFollowups = [];
    
    followupCases.forEach(caseData => {
        if (!caseData.followupTime) return;
        
        const followupTime = new Date(caseData.followupTime);
        const hoursUntil = (followupTime - now) / (1000 * 60 * 60);
        
        if (hoursUntil <= 0) {
            // Overdue or due now
            dueFollowups.push(caseData);
        } else {
            // Scheduled for future
            scheduledFollowups.push(caseData);
        }
    });
    
    // Sort by follow-up time
    dueFollowups.sort((a, b) => new Date(a.followupTime) - new Date(b.followupTime));
    scheduledFollowups.sort((a, b) => new Date(a.followupTime) - new Date(b.followupTime));
    
    renderFollowUps(dueFollowups, 'due-followups-list', true);
    renderFollowUps(scheduledFollowups, 'scheduled-followups-list', false);
}

function renderFollowUps(followups, containerId, isDue) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (followups.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No ${isDue ? 'due' : 'scheduled'} follow-ups</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = followups.map(caseData => {
        const followupTime = new Date(caseData.followupTime);
        const now = new Date();
        const hoursUntil = (followupTime - now) / (1000 * 60 * 60);
        const isOverdue = hoursUntil < -24;
        
        return `
            <div class="case-card">
                <div class="case-card-header">
                    <div>
                        <div class="case-id">${caseData.caseId}</div>
                        <div class="case-info">
                            <div class="case-info-item">${caseData.callerName || 'Unknown'}</div>
                            <div class="case-info-item">Follow-up: ${utils.formatDate(caseData.followupTime)}</div>
                            ${isOverdue ? '<div class="case-info-item" style="color: var(--error);">⚠️ Overdue</div>' : ''}
                        </div>
                    </div>
                    <div>
                        <span class="case-badge ${isOverdue ? 'badge-emergency' : 'badge-urgent'}">
                            ${isOverdue ? 'Overdue' : 'Due'}
                        </span>
                    </div>
                </div>
                <div class="case-info">
                    <div class="case-info-item">📍 ${caseData.callerLocation || 'Location not provided'}</div>
                    <div class="case-info-item">📞 ${caseData.callerPhone || 'Phone not provided'}</div>
                </div>
                <div class="case-actions">
                    <button class="btn btn-primary" onclick="openFollowupModal('${caseData.id}')">Complete Follow-up</button>
                    <a href="case-detail.html?id=${caseData.id}" class="btn btn-secondary">View Case</a>
                    <button class="btn btn-secondary" onclick="rescheduleFollowup('${caseData.id}')">Reschedule</button>
                </div>
            </div>
        `;
    }).join('');
}

function setupFilters() {
    const statusFilter = document.getElementById('filter-followup-status');
    const timeRangeFilter = document.getElementById('filter-time-range');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', loadFollowUps);
    }
    
    if (timeRangeFilter) {
        timeRangeFilter.addEventListener('change', loadFollowUps);
    }
}

function setupEventListeners() {
    const completeBtn = document.getElementById('complete-followup-btn');
    if (completeBtn) {
        completeBtn.addEventListener('click', completeFollowup);
    }
}

function openFollowupModal(caseId) {
    currentFollowupCaseId = caseId;
    const caseData = dataManager.getCaseById(caseId);
    
    if (!caseData) return;
    
    const caseInfoEl = document.getElementById('followup-case-info');
    if (caseInfoEl) {
        caseInfoEl.innerHTML = `
            <div class="info-card" style="margin-bottom: 20px;">
                <h4>Case: ${caseData.caseId}</h4>
                <p><strong>Caller:</strong> ${caseData.callerName}</p>
                <p><strong>Phone:</strong> ${caseData.callerPhone}</p>
                <p><strong>Scheduled for:</strong> ${utils.formatDate(caseData.followupTime)}</p>
            </div>
        `;
    }
    
    app.openModal('followup-modal');
}

function completeFollowup() {
    if (!currentFollowupCaseId) return;
    
    const notes = document.getElementById('followup-notes').value;
    const outcome = document.getElementById('followup-outcome').value;
    
    if (!notes || !outcome) {
        utils.showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    const caseData = dataManager.getCaseById(currentFollowupCaseId);
    if (!caseData) return;
    
    // Add follow-up note
    const followupNote = {
        text: `Follow-up completed: ${notes}`,
        outcome: outcome,
        timestamp: new Date().toISOString(),
        type: 'followup'
    };
    
    const existingNotes = caseData.notes || [];
    existingNotes.push(followupNote);
    
    // Update case based on outcome
    let newStatus = caseData.status;
    if (outcome === 'resolved') {
        newStatus = 'closed';
    } else if (outcome === 'needs-support' || outcome === 'escalate') {
        newStatus = 'active';
    }
    
    dataManager.updateCase(currentFollowupCaseId, {
        notes: existingNotes,
        status: newStatus,
        followupCompleted: true,
        followupCompletedAt: new Date().toISOString(),
        followupOutcome: outcome
    });
    
    utils.showNotification('Follow-up completed successfully', 'success');
    app.closeModal();
    
    // Reload follow-ups
    setTimeout(() => {
        loadFollowUps();
    }, 500);
}

function rescheduleFollowup(caseId) {
    const hours = prompt('Reschedule follow-up in how many hours? (24 or 48)', '24');
    if (!hours || isNaN(hours)) return;
    
    const followupTime = new Date();
    followupTime.setHours(followupTime.getHours() + parseInt(hours));
    
    dataManager.updateCase(caseId, {
        followupTime: followupTime.toISOString(),
        followupRescheduled: true
    });
    
    utils.showNotification('Follow-up rescheduled', 'success');
    setTimeout(() => {
        loadFollowUps();
    }, 500);
}

// Make functions globally available
window.openFollowupModal = openFollowupModal;
window.rescheduleFollowup = rescheduleFollowup;

