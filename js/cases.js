// Case Management Functions

const cases = {
    // Render case card
    renderCaseCard(caseData) {
        const badgeClass = utils.getBadgeClass(caseData.status);
        const badgeText = utils.getBadgeText(caseData.status);
        const urgencyBadge = caseData.urgency ? `<span class="case-badge badge-${caseData.urgency}">${caseData.urgency}</span>` : '';
        
        return `
            <div class="case-card" onclick="cases.viewCase('${caseData.id}')">
                <div class="case-card-header">
                    <div>
                        <div class="case-id">${caseData.caseId}</div>
                        <div class="case-info">
                            <div class="case-info-item">${caseData.callerName || 'Unknown'}</div>
                            <div class="case-info-item">${utils.timeAgo(caseData.createdAt)}</div>
                        </div>
                    </div>
                    <div>
                        ${urgencyBadge}
                        <span class="case-badge ${badgeClass}">${badgeText}</span>
                    </div>
                </div>
                <div class="case-info">
                    <div class="case-info-item">📍 ${caseData.callerLocation || 'Location not provided'}</div>
                    ${caseData.assignedTo ? `<div class="case-info-item">👤 Assigned to: ${caseData.assignedToName || 'Responder'}</div>` : ''}
                </div>
                <div class="case-actions">
                    <button class="btn btn-primary" onclick="event.stopPropagation(); cases.viewCase('${caseData.id}')">View</button>
                    ${!caseData.assignedTo ? `<button class="btn btn-secondary" onclick="event.stopPropagation(); cases.openAssignModal('${caseData.id}')">Assign</button>` : ''}
                    ${caseData.urgency === 'emergency' ? `<button class="btn btn-secondary" onclick="event.stopPropagation(); cases.escalateCase('${caseData.id}')">Escalate</button>` : ''}
                </div>
            </div>
        `;
    },

    // Render cases list
    renderCasesList(casesList, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (casesList.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <p>No cases found</p>
                </div>
            `;
            return;
        }

        container.innerHTML = casesList.map(caseData => 
            this.renderCaseCard(caseData)
        ).join('');
    },

    // View case details
    viewCase(caseId) {
        window.location.href = `case-detail.html?id=${caseId}`;
    },

    // Open assign modal
    openAssignModal(caseId) {
        app.selectedCaseId = caseId;
        const responders = dataManager.getAvailableResponders();
        const container = document.getElementById('available-responders');
        
        if (!container) return;

        if (responders.length === 0) {
            container.innerHTML = '<p>No available responders</p>';
        } else {
            container.innerHTML = responders.map(responder => `
                <div class="responder-item" onclick="cases.selectResponder('${responder.id}')">
                    <div class="responder-name">${responder.name}</div>
                    <div class="responder-info">📍 Available • ${responder.location ? 'Nearby' : 'Location unknown'}</div>
                </div>
            `).join('');
        }

        app.openModal('assign-modal');
    },

    // Select responder
    selectResponder(responderId) {
        document.querySelectorAll('.responder-item').forEach(item => {
            item.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
        app.selectedResponder = responderId;
    },

    // Assign case to responder
    assignCase() {
        if (!app.selectedCaseId || !app.selectedResponder) {
            utils.showNotification('Please select a responder', 'error');
            return;
        }

        const caseData = dataManager.getCaseById(app.selectedCaseId);
        const responder = dataManager.getUserById(app.selectedResponder);

        if (!caseData || !responder) {
            utils.showNotification('Error assigning case', 'error');
            return;
        }

        dataManager.updateCase(app.selectedCaseId, {
            assignedTo: app.selectedResponder,
            assignedToName: responder.name,
            status: 'active',
            assignedAt: new Date().toISOString()
        });

        utils.showNotification('Case assigned successfully', 'success');
        app.closeModal();
        
        // Reload page or update UI
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    },

    // Escalate case
    escalateCase(caseId) {
        if (confirm('Are you sure you want to escalate this case to emergency services?')) {
            dataManager.updateCase(caseId, {
                status: 'emergency_escalated',
                escalatedAt: new Date().toISOString()
            });
            utils.showNotification('Case escalated to emergency services', 'success');
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    },

    // Get case statistics
    getStatistics() {
        const allCases = dataManager.getCases();
        return {
            active: allCases.filter(c => c.status === 'active').length,
            pending: allCases.filter(c => c.status === 'pending' || c.status === 'new').length,
            closed: allCases.filter(c => c.status === 'closed').length,
            total: allCases.length
        };
    },

    // Update statistics display
    updateStatistics() {
        const stats = this.getStatistics();
        const activeEl = document.getElementById('stat-active');
        const pendingEl = document.getElementById('stat-pending');
        const closedEl = document.getElementById('stat-closed');

        if (activeEl) activeEl.textContent = stats.active;
        if (pendingEl) pendingEl.textContent = stats.pending;
        if (closedEl) closedEl.textContent = stats.closed;
    },

    // Filter cases
    filterCases() {
        const statusFilter = document.getElementById('filter-status')?.value || '';
        const urgencyFilter = document.getElementById('filter-urgency')?.value || '';
        const searchTerm = document.getElementById('search-cases')?.value.toLowerCase() || '';

        let allCases = dataManager.getCases();

        // Filter by status
        if (statusFilter) {
            allCases = allCases.filter(c => c.status === statusFilter);
        }

        // Filter by urgency
        if (urgencyFilter) {
            allCases = allCases.filter(c => c.urgency === urgencyFilter);
        }

        // Search filter
        if (searchTerm) {
            allCases = allCases.filter(c => 
                c.caseId.toLowerCase().includes(searchTerm) ||
                (c.callerName && c.callerName.toLowerCase().includes(searchTerm)) ||
                (c.callerLocation && c.callerLocation.toLowerCase().includes(searchTerm))
            );
        }

        return allCases;
    }
};

// Setup assign button
document.addEventListener('DOMContentLoaded', () => {
    const assignBtn = document.getElementById('confirm-assign-btn');
    if (assignBtn) {
        assignBtn.addEventListener('click', () => {
            cases.assignCase();
        });
    }
});

