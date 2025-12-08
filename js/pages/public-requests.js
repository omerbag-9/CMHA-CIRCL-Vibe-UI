// Public Requests Page Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }

    // Load public requests
    loadPublicRequests();

    // Setup filters and search
    setupFilters();
});

function loadPublicRequests() {
    const allCases = dataManager.getCases();
    
    // Filter only public requests that haven't been converted to cases yet
    // We'll show all public requests, but only those with status 'new_case' are actionable
    let publicRequests = allCases.filter(c => c.isPublicCase === true && c.status === 'new_case');
    
    // Apply filters
    const urgencyFilter = document.getElementById('filter-urgency')?.value || '';
    const searchTerm = document.getElementById('search-requests')?.value.toLowerCase() || '';
    
    if (urgencyFilter) {
        publicRequests = publicRequests.filter(r => r.urgency === urgencyFilter);
    }
    
    if (searchTerm) {
        publicRequests = publicRequests.filter(r => 
            (r.callerName && r.callerName.toLowerCase().includes(searchTerm)) ||
            (r.callerLocation && r.callerLocation.toLowerCase().includes(searchTerm)) ||
            (r.callerPhone && r.callerPhone.includes(searchTerm)) ||
            (r.initialNotes && r.initialNotes.toLowerCase().includes(searchTerm))
        );
    }
    
    // Sort by creation date (newest first)
    publicRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Update count
    const countEl = document.getElementById('requests-count');
    if (countEl) {
        countEl.textContent = `${publicRequests.length} request${publicRequests.length !== 1 ? 's' : ''}`;
    }
    
    // Render requests
    renderRequests(publicRequests);
}

function renderRequests(requests) {
    const listEl = document.getElementById('requests-list');
    if (!listEl) return;
    
    if (requests.length === 0) {
        listEl.innerHTML = `
            <div class="empty-state">
                <p>No new public requests found</p>
                <p style="font-size: 14px; color: var(--text-secondary); margin-top: 8px;">All requests have been processed</p>
            </div>
        `;
        return;
    }
    
    listEl.innerHTML = requests.map(request => {
        const urgencyBadge = request.urgency === 'emergency' ? 'badge-urgent' : 
                            request.urgency === 'urgent' ? 'badge-urgent' : 'badge-new';
        const urgencyText = request.urgency === 'emergency' ? 'Emergency' : 
                           request.urgency === 'urgent' ? 'Urgent' : 'Normal';
        
        // Encode data for URL
        const name = encodeURIComponent(request.callerName || '');
        const phone = encodeURIComponent(request.callerPhone || '');
        const location = encodeURIComponent(request.callerLocation || '');
        const message = encodeURIComponent(request.initialNotes || '');
        const requestId = request.id;
        
        // Determine if form was filled for self or someone else
        const isForSelf = request.isForSelf !== false; // Default to true if not specified
        const personInCrisisName = request.personInCrisisName;
        const relationshipInfo = isForSelf 
            ? '<span class="relationship-badge self">For Self</span>'
            : `<span class="relationship-badge other">For: ${personInCrisisName || 'Someone Else'}</span>`;
        
        return `
            <div class="request-card">
                <div class="request-header">
                    <div class="request-info">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 6px;">
                            <h3 class="request-name">${request.callerName || 'Unknown'}</h3>
                            ${relationshipInfo}
                        </div>
                        <span class="request-time">Submitted ${utils.formatDate(request.createdAt)}</span>
                    </div>
                    <div class="request-badges">
                        <span class="badge ${urgencyBadge}">${urgencyText}</span>
                        <span class="badge badge-new">Web Form</span>
                    </div>
                </div>
                <div class="request-body">
                    <div class="request-detail-row">
                        <div class="request-detail-item">
                            <span class="detail-icon">📞</span>
                            <div class="detail-content">
                                <span class="detail-label">Phone</span>
                                <a href="tel:${request.callerPhone}" class="detail-value">${request.callerPhone || 'N/A'}</a>
                            </div>
                        </div>
                        <div class="request-detail-item">
                            <span class="detail-icon">📍</span>
                            <div class="detail-content">
                                <span class="detail-label">Location</span>
                                <span class="detail-value">${request.callerLocation || 'N/A'}</span>
                            </div>
                        </div>
                    </div>
                    <div class="request-message">
                        <span class="message-label">How can we help?</span>
                        <p class="message-text">${request.initialNotes || 'No message provided'}</p>
                    </div>
                </div>
                <div class="request-footer">
                    <button class="btn btn-primary" onclick="createCaseFromRequest('${requestId}')">
                        Create New Case
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function createCaseFromRequest(requestId) {
    // Get the request to check if it's for self or someone else
    const request = dataManager.getCaseById(requestId);
    if (!request) {
        utils.showNotification('Request not found', 'error');
        return;
    }
    
    const isForSelf = request.isForSelf !== false; // Default to true if not specified
    const personInCrisisName = request.personInCrisisName || null;
    
    // Navigate to new case page with pre-filled data
    const params = new URLSearchParams({
        fromRequest: requestId,
        name: encodeURIComponent(request.callerName || ''),
        phone: encodeURIComponent(request.callerPhone || ''),
        location: encodeURIComponent(request.callerLocation || ''),
        message: encodeURIComponent(request.initialNotes || ''),
        isForSelf: isForSelf ? 'true' : 'false',
        personInCrisisName: personInCrisisName ? encodeURIComponent(personInCrisisName) : ''
    });
    
    window.location.href = `new-case.html?${params.toString()}`;
}

function setupFilters() {
    const searchInput = document.getElementById('search-requests');
    const urgencyFilter = document.getElementById('filter-urgency');
    
    if (searchInput) {
        searchInput.addEventListener('input', utils.debounce(loadPublicRequests, 300));
    }
    
    if (urgencyFilter) {
        urgencyFilter.addEventListener('change', loadPublicRequests);
    }
}

