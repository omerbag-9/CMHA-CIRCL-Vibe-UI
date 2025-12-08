// Responders Page Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }

    loadResponders();
    setupFilters();
});

function loadResponders() {
    const searchTerm = document.getElementById('search-responders')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('filter-responder-status')?.value || '';
    const cityFilter = document.getElementById('filter-city')?.value || '';

    // Get all users and cases
    const allUsers = dataManager.getUsers();
    const allCases = dataManager.getCases();
    
    // Filter responders
    let responders = allUsers.filter(u => u.role === 'responder');
    
    console.log('Total responders found:', responders.length);

    // Apply search filter
    if (searchTerm) {
        responders = responders.filter(r =>
            r.name.toLowerCase().includes(searchTerm) ||
            (r.city && r.city.toLowerCase().includes(searchTerm)) ||
            (r.phone && r.phone.includes(searchTerm))
        );
    }

    // Apply status filter
    if (statusFilter) {
        responders = responders.filter(r => r.status === statusFilter);
    }

    // Apply city filter
    if (cityFilter) {
        responders = responders.filter(r => r.city === cityFilter);
    }

    // Update active cases count for each responder
    responders.forEach(responder => {
        const activeCases = allCases.filter(c => 
            c.assignedTo === responder.id && 
            c.status === 'assigned_to_responder'
        );
        responder.activeCases = activeCases.length;
    });

    // Separate by status
    const available = responders.filter(r => r.status === 'available');
    const busy = responders.filter(r => r.status === 'busy');
    const offline = responders.filter(r => r.status === 'offline');
    
    console.log('Available:', available.length, 'Busy:', busy.length, 'Offline:', offline.length);

    // Update counts
    document.getElementById('available-count').textContent = `${available.length} Available`;
    document.getElementById('busy-count').textContent = `${busy.length} Busy`;
    document.getElementById('offline-count').textContent = `${offline.length} Offline`;

    // Render responders with cases data
    renderResponders(available, 'available-responders', allCases);
    renderResponders(busy, 'busy-responders', allCases);
    renderResponders(offline, 'offline-responders', allCases);
}

function renderResponders(responders, containerId, allCases) {
    const container = document.getElementById(containerId);
    if (!container) {
        console.log('Container not found:', containerId);
        return;
    }

    if (responders.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No responders found</p>
            </div>
        `;
        return;
    }

    container.innerHTML = responders.map(responder => {
        const statusBadge = getStatusBadge(responder.status);
        const workloadText = responder.activeCases > 0 
            ? `${responder.activeCases} active case${responder.activeCases > 1 ? 's' : ''}`
            : 'No active cases';
        const workloadClass = responder.activeCases === 0 ? 'text-success' : responder.activeCases >= 2 ? 'text-error' : 'text-warning';
        
        // Get assigned cases for this responder
        const assignedCases = allCases ? allCases.filter(c => 
            c.assignedTo === responder.id && 
            c.status === 'assigned_to_responder'
        ) : [];
        
        return `
            <div class="responder-card">
                <div class="responder-card-header">
                    <div>
                        <h3 class="responder-name">${responder.name}</h3>
                        <div class="responder-location">📍 ${responder.city || 'Unknown'}, ${responder.province || 'BC'}</div>
                    </div>
                    ${statusBadge}
                </div>
                <div class="responder-info">
                    <div class="responder-info-item">
                        <span class="label">Phone:</span>
                        <span>${responder.phone || 'N/A'}</span>
                    </div>
                    <div class="responder-info-item">
                        <span class="label">Workload:</span>
                        <span class="${workloadClass}" style="font-weight: 600;">${workloadText}</span>
                    </div>
                    ${assignedCases.length > 0 ? `
                        <div class="responder-info-item">
                            <span class="label">Assigned Cases:</span>
                            <div style="margin-top: 8px;">
                                ${assignedCases.map(c => `
                                    <div style="padding: 8px; background: var(--charcoal); border-radius: 4px; margin-bottom: 6px; font-size: 13px;">
                                        <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
                                            ${c.caseId} - ${c.callerName || 'Unknown'}
                                        </div>
                                        <div style="color: var(--text-muted); font-size: 12px;">
                                            📍 ${c.callerLocation || 'Location unknown'}
                                        </div>
                                        <div style="margin-top: 4px;">
                                            <span class="badge ${utils.getBadgeClass(c.status)}" style="font-size: 11px;">
                                                ${utils.getBadgeText(c.status)}
                                            </span>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    ${responder.certifications && responder.certifications.length > 0 ? `
                        <div class="responder-info-item">
                            <span class="label">Certifications:</span>
                            <div class="certifications-list">
                                ${responder.certifications.map(cert => `<span class="cert-badge">${cert}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
                <div class="responder-actions">
                    ${responder.status === 'available' && responder.activeCases < 2 ? 
                        `<button class="btn btn-primary btn-sm" onclick="assignResponder('${responder.id}')">Assign to Case</button>` : 
                        ''
                    }
                </div>
            </div>
        `;
    }).join('');
}

function getStatusBadge(status) {
    const badges = {
        'available': '<span class="badge badge-new">Available</span>',
        'busy': '<span class="badge badge-urgent">Busy</span>',
        'offline': '<span class="badge badge-closed">Offline</span>'
    };
    return badges[status] || '<span class="badge">Unknown</span>';
}

function setupFilters() {
    const searchInput = document.getElementById('search-responders');
    const statusFilter = document.getElementById('filter-responder-status');
    const cityFilter = document.getElementById('filter-city');

    if (searchInput) {
        searchInput.addEventListener('input', utils.debounce(loadResponders, 300));
    }

    if (statusFilter) {
        statusFilter.addEventListener('change', loadResponders);
    }

    if (cityFilter) {
        cityFilter.addEventListener('change', loadResponders);
    }
}

let selectedResponderId = null;
let selectedCaseId = null;

function assignResponder(responderId) {
    selectedResponderId = responderId;
    const responder = dataManager.getUserById(responderId);
    
    if (!responder) {
        utils.showNotification('Responder not found', 'error');
        return;
    }

    // Update modal title and summary
    document.getElementById('selected-responder-name').textContent = responder.name;
    document.getElementById('responder-summary').innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>${responder.name}</strong>
                <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">
                    📍 ${responder.city}, ${responder.province} • ${responder.phone}
                </div>
            </div>
            <span class="badge badge-new">${responder.activeCases || 0} Active Cases</span>
        </div>
    `;

    // Load available cases in the responder's area
    loadAvailableCases(responder);

    // Show modal
    document.getElementById('modal-overlay').style.display = 'flex';
}

function loadAvailableCases(responder) {
    const searchTerm = document.getElementById('search-assign-cases')?.value.toLowerCase() || '';
    const allCases = dataManager.getCases();
    
    // Filter cases that:
    // 1. Are new or pending (not assigned yet)
    // 2. Are in the same city or nearby area
    let availableCases = allCases.filter(c => 
        (c.status === 'new_case' || !c.assignedTo) &&
        c.callerLocation && 
        (c.callerLocation.includes(responder.city) || 
         isNearbyLocation(c.callerLocation, responder.city))
    );

    // Apply search filter
    if (searchTerm) {
        availableCases = availableCases.filter(c =>
            c.caseId.toLowerCase().includes(searchTerm) ||
            (c.callerName && c.callerName.toLowerCase().includes(searchTerm)) ||
            (c.callerLocation && c.callerLocation.toLowerCase().includes(searchTerm))
        );
    }

    // Sort by urgency and creation date
    availableCases.sort((a, b) => {
        const urgencyOrder = { 'emergency': 0, 'urgent': 1, 'normal': 2 };
        const urgencyDiff = (urgencyOrder[a.urgency] || 2) - (urgencyOrder[b.urgency] || 2);
        if (urgencyDiff !== 0) return urgencyDiff;
        return new Date(b.createdAt) - new Date(a.createdAt);
    });

    renderAvailableCases(availableCases);
}

function isNearbyLocation(location, city) {
    // Define nearby cities for major BC cities
    const nearbyAreas = {
        'Vancouver': ['Burnaby', 'Richmond', 'North Vancouver', 'West Vancouver'],
        'Burnaby': ['Vancouver', 'New Westminster', 'Coquitlam'],
        'Surrey': ['Langley', 'White Rock', 'Delta'],
        'Richmond': ['Vancouver', 'Delta'],
        'Coquitlam': ['Burnaby', 'Port Moody', 'Port Coquitlam'],
        'New Westminster': ['Burnaby', 'Coquitlam']
    };

    const nearby = nearbyAreas[city] || [];
    return nearby.some(area => location.includes(area));
}

function renderAvailableCases(cases) {
    const container = document.getElementById('available-cases-list');
    
    if (cases.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No available cases in this area</p>
            </div>
        `;
        document.getElementById('confirm-assign-btn').disabled = true;
        return;
    }

    container.innerHTML = cases.map(caseData => {
        const urgencyClass = caseData.urgency === 'emergency' ? 'badge-emergency' : 
                           caseData.urgency === 'urgent' ? 'badge-urgent' : 'badge-new';
        
        return `
            <div class="case-card-selectable" onclick="selectCase('${caseData.id}')" data-case-id="${caseData.id}" style="cursor: pointer; margin-bottom: 12px; border: 2px solid var(--border-color); transition: all 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <div>
                        <div style="font-family: 'Courier New', monospace; font-size: 13px; font-weight: 600; color: var(--text-primary);">
                            ${caseData.caseId}
                        </div>
                        <div style="font-size: 15px; font-weight: 600; color: var(--text-primary); margin-top: 4px;">
                            ${caseData.callerName || 'Unknown'}
                        </div>
                    </div>
                    <span class="badge ${urgencyClass}">${caseData.urgency || 'Normal'}</span>
                </div>
                <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 8px;">
                    📍 ${caseData.callerLocation}
                </div>
                <div style="font-size: 13px; color: var(--text-muted);">
                    ${caseData.initialNotes ? caseData.initialNotes.substring(0, 100) + '...' : 'No notes'}
                </div>
                <div style="font-size: 12px; color: var(--text-muted); margin-top: 8px;">
                    Created ${utils.timeAgo(caseData.createdAt)}
                </div>
            </div>
        `;
    }).join('');
}

function selectCase(caseId) {
    selectedCaseId = caseId;
    
    // Remove selection from all cases
    document.querySelectorAll('.case-card-selectable').forEach(card => {
        card.style.borderColor = 'var(--border-color)';
        card.style.backgroundColor = 'var(--white)';
    });
    
    // Highlight selected case
    const selectedCard = document.querySelector(`[data-case-id="${caseId}"]`);
    if (selectedCard) {
        selectedCard.style.borderColor = 'var(--primary-green)';
        selectedCard.style.backgroundColor = 'var(--charcoal)';
    }
    
    // Enable assign button
    document.getElementById('confirm-assign-btn').disabled = false;
}

function confirmAssignment() {
    if (!selectedResponderId || !selectedCaseId) {
        utils.showNotification('Please select a case', 'error');
        return;
    }

    const responder = dataManager.getUserById(selectedResponderId);
    const caseData = dataManager.getCaseById(selectedCaseId);

    if (!responder || !caseData) {
        utils.showNotification('Error: Invalid selection', 'error');
        return;
    }

    // Update case
    dataManager.updateCase(selectedCaseId, {
        assignedTo: selectedResponderId,
        assignedToName: responder.name,
        status: 'assigned_to_responder',
        assignedAt: new Date().toISOString()
    });

    // Add timeline entry
    const updatedCase = dataManager.getCaseById(selectedCaseId);
    if (updatedCase.timeline) {
        updatedCase.timeline.push({
            action: `Assigned to ${responder.name}`,
            timestamp: new Date().toISOString(),
            user: auth.getCurrentUser()?.name || 'Dispatcher'
        });
        dataManager.updateCase(selectedCaseId, { timeline: updatedCase.timeline });
    }

    utils.showNotification(`Case ${caseData.caseId} assigned to ${responder.name}`, 'success');
    
    // Close modal and reload
    closeAssignModal();
    setTimeout(() => {
        location.reload();
    }, 1000);
}

function closeAssignModal() {
    document.getElementById('modal-overlay').style.display = 'none';
    selectedResponderId = null;
    selectedCaseId = null;
}

// Setup event listeners
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-assign-cases');
    if (searchInput) {
        searchInput.addEventListener('input', utils.debounce(() => {
            if (selectedResponderId) {
                const responder = dataManager.getUserById(selectedResponderId);
                if (responder) loadAvailableCases(responder);
            }
        }, 300));
    }

    const confirmBtn = document.getElementById('confirm-assign-btn');
    if (confirmBtn) {
        confirmBtn.addEventListener('click', confirmAssignment);
    }
});

