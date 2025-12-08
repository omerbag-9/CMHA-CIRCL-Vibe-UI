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

    // Load and render all cases grouped by status
    loadCasesByStatus();
}

function loadCasesByStatus() {
    const allCases = dataManager.getCases();
    
    // Apply filters
    let filteredCases = filterCases(allCases);
    
    // Group cases by status
    const casesByStatus = {
        'new_case': [],
        'assigned_to_responder': [],
        'follow_up_scheduled': [],
        'closed': []
    };
    
    filteredCases.forEach(caseData => {
        const status = caseData.status || 'new_case';
        if (casesByStatus[status]) {
            casesByStatus[status].push(caseData);
        } else {
            casesByStatus['new_case'].push(caseData);
        }
    });
    
    // Sort each group by creation date (newest first)
    Object.keys(casesByStatus).forEach(status => {
        casesByStatus[status].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    });
    
    // Render each status section
    renderCasesByStatus(casesByStatus);
}

function filterCases(allCases) {
    const urgencyFilter = document.getElementById('filter-urgency')?.value || '';
    const searchTerm = document.getElementById('search-cases')?.value.toLowerCase() || '';
    
    let filtered = allCases;
    
    // Filter by urgency
    if (urgencyFilter) {
        filtered = filtered.filter(c => c.urgency === urgencyFilter);
    }
    
    // Search filter
    if (searchTerm) {
        filtered = filtered.filter(c => 
            (c.caseId && c.caseId.toLowerCase().includes(searchTerm)) ||
            (c.callerName && c.callerName.toLowerCase().includes(searchTerm)) ||
            (c.callerLocation && c.callerLocation.toLowerCase().includes(searchTerm)) ||
            (c.callerPhone && c.callerPhone.includes(searchTerm))
        );
    }
    
    return filtered;
}

function renderCasesByStatus(casesByStatus) {
    const statuses = ['new_case', 'assigned_to_responder', 'follow_up_scheduled', 'closed'];
    
    statuses.forEach(status => {
        const tbody = document.getElementById(`cases-${status}`);
        const countEl = document.getElementById(`count-${status}`);
        const casesList = casesByStatus[status] || [];
        
        // Update count
        if (countEl) {
            countEl.textContent = casesList.length;
        }
        
        if (!tbody) return;
        
        if (casesList.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                        No cases
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = casesList.map(caseData => {
            const urgencyClass = caseData.urgency === 'emergency' ? 'badge-emergency' : 
                               caseData.urgency === 'urgent' ? 'badge-urgent' : 'badge-normal';
            const urgencyText = caseData.urgency === 'emergency' ? 'Emergency' : 
                              caseData.urgency === 'urgent' ? 'Urgent' : 'Normal';
            
            return `
                <tr class="case-row" data-case-id="${caseData.id}">
                    <td>
                        <a href="case-detail.html?id=${caseData.id}" class="case-id-link">${caseData.caseId}</a>
                    </td>
                    <td>
                        <div class="case-name-cell">
                            <strong>${caseData.callerName || 'Unknown'}</strong>
                            ${caseData.isPublicCase ? '<span class="public-badge">Web</span>' : ''}
                        </div>
                    </td>
                    <td>${caseData.callerLocation || 'Not provided'}</td>
                    <td>
                        ${caseData.callerPhone ? `
                            <a href="tel:${caseData.callerPhone}" class="phone-link">${caseData.callerPhone}</a>
                        ` : 'Not provided'}
                    </td>
                    <td>
                        ${caseData.assignedToName ? `
                            <div class="assignee-cell">
                                <span class="assignee-name">${caseData.assignedToName}</span>
                            </div>
                        ` : '<span class="text-muted">Unassigned</span>'}
                    </td>
                    <td>
                        <span class="badge ${urgencyClass}">${urgencyText}</span>
                    </td>
                    <td>
                        <span class="date-cell">${utils.formatDate(caseData.createdAt)}</span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            <a href="case-detail.html?id=${caseData.id}" class="btn-view">View</a>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    });
}

function setupFilters() {
    const searchInput = document.getElementById('search-cases');
    const urgencyFilter = document.getElementById('filter-urgency');
    
    if (searchInput) {
        searchInput.addEventListener('input', utils.debounce(loadCasesByStatus, 300));
    }
    
    if (urgencyFilter) {
        urgencyFilter.addEventListener('change', loadCasesByStatus);
    }
}

