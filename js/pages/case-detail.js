// Case Detail Page Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }

    // Get case ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const caseId = urlParams.get('id');

    if (caseId) {
        loadCaseDetail(caseId);
    } else {
        document.getElementById('case-detail-content').innerHTML = `
            <div class="empty-state">
                <p>Case not found</p>
                <a href="dashboard.html" class="btn btn-primary">Back to Dashboard</a>
            </div>
        `;
    }
});

function loadCaseDetail(caseId) {
    const caseData = dataManager.getCaseById(caseId);
    
    if (!caseData) {
        document.getElementById('case-detail-content').innerHTML = `
            <div class="empty-state">
                <p>Case not found</p>
                <a href="dashboard.html" class="btn btn-primary">Back to Dashboard</a>
            </div>
        `;
        return;
    }

    // Update title
    const titleEl = document.getElementById('case-detail-title');
    if (titleEl) {
        titleEl.textContent = `${caseData.caseId} ${caseData.urgency ? `[${caseData.urgency}]` : ''}`;
    }

    // Render case details
    renderCaseDetail(caseData);
}

function renderCaseDetail(caseData) {
    const container = document.getElementById('case-detail-content');
    if (!container) return;

    const badgeClass = utils.getBadgeClass(caseData.status);
    const badgeText = utils.getBadgeText(caseData.status);

    // Build flow-specific information sections
    let flowInfoSection = '';
    let personInCrisisSection = '';
    
    if (caseData.flowType === 'caregiver') {
        flowInfoSection = `
            <div class="info-card">
                <h3>Caregiver Information</h3>
                <div class="info-item">
                    <strong>Name:</strong> ${caseData.caregiverName || caseData.callerName || 'Not provided'}
                </div>
                <div class="info-item">
                    <strong>Phone:</strong> ${caseData.caregiverPhone || caseData.callerPhone || 'Not provided'}
                </div>
                <div class="info-item">
                    <strong>Relationship:</strong> ${caseData.caregiverRelationship || 'Not specified'}
                </div>
                <div class="info-item">
                    <strong>Contact Method:</strong> ${caseData.contactMethod || 'Unknown'}
                </div>
                <div class="case-actions">
                    <button class="btn btn-secondary">📞 Call Caregiver</button>
                    <button class="btn btn-secondary">💬 SMS</button>
                </div>
            </div>
        `;
        personInCrisisSection = `
            <div class="info-card">
                <h3>Person in Crisis Location</h3>
                <div class="info-item">
                    <strong>Location:</strong> ${caseData.personInCrisisLocation || 'Not provided'}
                </div>
            </div>
        `;
    } else if (caseData.flowType === 'emergency') {
        flowInfoSection = `
            <div class="info-card">
                <h3>Emergency Information</h3>
                <div class="info-item">
                    <strong>Emergency Type:</strong> ${caseData.emergencyType || 'Not specified'}
                </div>
                <div class="info-item">
                    <strong>Caller Name:</strong> ${caseData.callerName || 'Unknown'}
                </div>
                <div class="info-item">
                    <strong>Caller Phone:</strong> ${caseData.callerPhone || 'Not provided'}
                </div>
                <div class="info-item">
                    <strong>Contact Method:</strong> ${caseData.contactMethod || 'Unknown'}
                </div>
            </div>
        `;
        personInCrisisSection = `
            <div class="info-card">
                <h3>Person in Crisis Location</h3>
                <div class="info-item">
                    <strong>Location:</strong> ${caseData.personInCrisisLocation || 'Not provided'}
                </div>
                <div class="case-actions">
                    <button class="btn btn-danger">🚨 Send Responder</button>
                    <button class="btn btn-danger">📞 Call 911</button>
                </div>
            </div>
        `;
    } else if (caseData.flowType === 'known_person') {
        flowInfoSection = `
            <div class="info-card">
                <h3>Caller Information</h3>
                <div class="info-item">
                    <strong>Name:</strong> ${caseData.callerName || 'Not provided'}
                </div>
                <div class="info-item">
                    <strong>Phone:</strong> ${caseData.callerPhone || 'Not provided'}
                </div>
                <div class="info-item">
                    <strong>Location:</strong> ${caseData.callerLocation || 'Not provided'}
                </div>
                <div class="info-item">
                    <strong>Contact Method:</strong> ${caseData.contactMethod || 'Unknown'}
                </div>
                <div class="case-actions">
                    <button class="btn btn-secondary">📞 Call Caller</button>
                    <button class="btn btn-secondary">💬 SMS</button>
                </div>
            </div>
        `;
        personInCrisisSection = `
            <div class="info-card">
                <h3>Person in Crisis Information</h3>
                <div class="info-item">
                    <strong>Name:</strong> ${caseData.personInCrisisName || 'Not provided'}
                </div>
                <div class="info-item">
                    <strong>Phone:</strong> ${caseData.personInCrisisPhone || 'Not provided'}
                </div>
                <div class="info-item">
                    <strong>Location:</strong> ${caseData.personInCrisisLocation || 'Not provided'}
                </div>
                <div class="case-actions">
                    <button class="btn btn-primary">📞 Call Person in Crisis</button>
                    <button class="btn btn-secondary">💬 SMS</button>
                </div>
            </div>
        `;
    } else {
        // For self flow - standard display
        flowInfoSection = `
            <div class="info-card">
                <h3>Caller Information</h3>
                <div class="info-item">
                    <strong>Name:</strong> ${caseData.callerName || 'Not provided'}
                </div>
                <div class="info-item">
                    <strong>Phone:</strong> ${caseData.callerPhone || 'Not provided'}
                </div>
                <div class="info-item">
                    <strong>Location:</strong> ${caseData.callerLocation || 'Not provided'}
                </div>
                <div class="info-item">
                    <strong>Contact Method:</strong> ${caseData.contactMethod || 'Unknown'}
                </div>
                <div class="case-actions">
                    <button class="btn btn-secondary">📞 Call</button>
                    <button class="btn btn-secondary">💬 SMS</button>
                </div>
            </div>
        `;
    }

    container.innerHTML = `
        <div class="case-detail-grid">
            <div class="case-info-section">
                ${flowInfoSection}
                ${personInCrisisSection}

                <div class="info-card">
                    <h3>Case Status</h3>
                    <div class="info-item">
                        <span class="case-badge ${badgeClass}">${badgeText}</span>
                    </div>
                    <div class="info-item">
                        <strong>Urgency:</strong> ${caseData.urgency || 'Normal'}
                    </div>
                    <div class="info-item">
                        <strong>Crisis Type:</strong> ${caseData.crisisType || 'Not specified'}
                    </div>
                    ${caseData.assignedTo ? `
                        <div class="info-item">
                            <strong>Assigned To:</strong> ${caseData.assignedToName || 'Responder'}
                        </div>
                    ` : ''}
                </div>
            </div>

            <div class="case-timeline-section">
                <div class="info-card">
                    <h3>Timeline</h3>
                    <div class="timeline">
                        ${caseData.timeline ? caseData.timeline.map(item => `
                            <div class="timeline-item">
                                <div class="timeline-dot"></div>
                                <div class="timeline-content">
                                    <div class="timeline-time">${utils.formatDate(item.timestamp)}</div>
                                    <div class="timeline-text">${item.action}</div>
                                </div>
                            </div>
                        `).join('') : ''}
                    </div>
                </div>

                <div class="info-card">
                    <h3>Case Notes</h3>
                    <div id="case-notes">
                        ${caseData.initialNotes ? `<p>${caseData.initialNotes}</p>` : '<p>No notes yet</p>'}
                    </div>
                    <div class="form-group mt-3">
                        <textarea id="new-note" rows="3" placeholder="Add a note..."></textarea>
                        <button class="btn btn-primary mt-2" onclick="addCaseNote('${caseData.id}')">Add Note</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="case-actions-bar">
            ${!caseData.assignedTo ? `
                <button class="btn btn-primary" onclick="cases.openAssignModal('${caseData.id}')">Assign Responder</button>
            ` : ''}
            <button class="btn btn-secondary" onclick="scheduleFollowup('${caseData.id}')">Schedule Follow-up</button>
            ${caseData.urgency === 'emergency' ? `
                <button class="btn btn-secondary" onclick="cases.escalateCase('${caseData.id}')">Escalate Emergency</button>
            ` : ''}
            <button class="btn btn-secondary" onclick="updateCaseStatus('${caseData.id}')">Update Status</button>
            <button class="btn btn-secondary" onclick="closeCase('${caseData.id}')">Close Case</button>
        </div>
    `;
}

function addCaseNote(caseId) {
    const noteInput = document.getElementById('new-note');
    if (!noteInput || !noteInput.value.trim()) return;

    const caseData = dataManager.getCaseById(caseId);
    if (!caseData) return;

    const currentUser = auth.getCurrentUser();
    const notes = caseData.notes || [];
    notes.push({
        text: noteInput.value.trim(),
        author: currentUser.name,
        timestamp: new Date().toISOString()
    });

    dataManager.updateCase(caseId, { notes });
    noteInput.value = '';
    loadCaseDetail(caseId);
    utils.showNotification('Note added', 'success');
}

function scheduleFollowup(caseId) {
    const hours = prompt('Schedule follow-up in how many hours? (24 or 48)', '24');
    if (!hours || isNaN(hours)) return;

    const followupTime = new Date();
    followupTime.setHours(followupTime.getHours() + parseInt(hours));

    dataManager.updateCase(caseId, {
        followupScheduled: true,
        followupTime: followupTime.toISOString(),
        status: 'follow_up_scheduled'
    });

    utils.showNotification(`Follow-up scheduled for ${utils.formatDate(followupTime)}`, 'success');
    setTimeout(() => window.location.reload(), 1000);
}

function updateCaseStatus(caseId) {
    const statusOptions = [
        'new_case',
        'assigned_to_responder',
        'follow_up_scheduled',
        'closed'
    ];
    const statusText = prompt('Enter new status:\n- new_case\n- assigned_to_responder\n- follow_up_scheduled\n- closed', 'assigned_to_responder');
    if (!statusText) return;
    
    const status = statusOptions.find(s => s === statusText) || statusText;
    dataManager.updateCase(caseId, { status });
    utils.showNotification('Status updated', 'success');
    setTimeout(() => window.location.reload(), 1000);
}

function closeCase(caseId) {
    if (!confirm('Are you sure you want to close this case?')) return;

    dataManager.updateCase(caseId, { status: 'closed', closedAt: new Date().toISOString() });
    utils.showNotification('Case closed', 'success');
    setTimeout(() => {
        window.location.href = 'dashboard.html';
    }, 1000);
}

