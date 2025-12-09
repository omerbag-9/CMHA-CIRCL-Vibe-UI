// Responder Case Detail Logic

let currentCaseId = null;
let currentCase = null;

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

    // Get case ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    currentCaseId = urlParams.get('id');

    if (!currentCaseId) {
        utils.showNotification('No case ID provided', 'error');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
        return;
    }

    loadCaseDetails();
});

function loadCaseDetails() {
    console.log('Loading case details for:', currentCaseId);
    const caseData = dataManager.getCaseById(currentCaseId);
    
    if (!caseData) {
        console.error('Case not found:', currentCaseId);
        utils.showNotification('Case not found', 'error');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
        return;
    }

    console.log('Case loaded:', caseData);
    currentCase = caseData;
    const currentUser = auth.getCurrentUser();

    // Verify case is assigned to this responder
    if (caseData.assignedTo !== currentUser.id) {
        console.error('Case not assigned to current user');
        utils.showNotification('This case is not assigned to you', 'error');
        setTimeout(() => window.location.href = 'dashboard.html', 1500);
        return;
    }

    // Update case ID display
    document.getElementById('case-id-display').textContent = caseData.caseId;

    // Render case details
    renderCaseDetails(caseData);
    
    // Render action buttons based on status
    console.log('Rendering action buttons for status:', caseData.status);
    renderActionButtons(caseData);
}

function renderCaseDetails(caseData) {
    const container = document.getElementById('case-content');
    if (!container) return;

    const personName = caseData.callerName || caseData.personInCrisisName || 'Unknown';
    const location = caseData.callerLocation || caseData.personInCrisisLocation || 'Unknown location';
    const phone = caseData.callerPhone || caseData.personInCrisisPhone || 'Not provided';
    const isEmergency = caseData.crisisType === 'emergency' || caseData.isEmergency;
    const statusBadge = utils.getBadgeText(caseData.status);

    // Build assessment section if available
    let assessmentHTML = '';
    if (caseData.assessmentData && Object.keys(caseData.assessmentData).length > 0) {
        // Format assessment data in a more readable way
        const formatLabel = (key) => {
            return key.replace(/-/g, ' ')
                      .replace(/\b\w/g, l => l.toUpperCase())
                      .replace(/^Immediate Danger$/, '⚠️ Immediate Danger')
                      .replace(/^Suicidal Thoughts$/, '🆘 Suicidal Thoughts')
                      .replace(/^Homicidal Thoughts$/, '⚠️ Homicidal Thoughts')
                      .replace(/^Weapons Involved$/, '🔫 Weapons Involved')
                      .replace(/^Current State$/, '🧠 Mental State')
                      .replace(/^Has Support$/, '🤝 Support Systems');
        };
        
        const formatValue = (value) => {
            if (Array.isArray(value)) {
                return value.length > 0 ? value.join(', ') : 'None';
            }
            if (value === 'yes') return '✓ Yes';
            if (value === 'no') return '✗ No';
            if (value === 'unknown') return '❓ Unknown';
            return value;
        };
        
        // Group critical info first
        const criticalKeys = ['immediate-danger', 'suicidal-thoughts', 'homicidal-thoughts', 'weapons-involved'];
        const criticalData = Object.entries(caseData.assessmentData).filter(([key]) => criticalKeys.includes(key));
        const otherData = Object.entries(caseData.assessmentData).filter(([key]) => !criticalKeys.includes(key));
        
        assessmentHTML = `
            <div class="mobile-card">
                <h3 style="margin: 0 0 12px; font-size: 16px; color: #F44336;">⚠️ Safety Assessment</h3>
                <div style="background: #fff3f3; padding: 12px; border-radius: 8px; margin-bottom: 12px; border-left: 4px solid #F44336;">
                    ${criticalData.map(([key, value]) => `
                        <div style="display: flex; justify-content: space-between; padding: 6px 0;">
                            <span style="font-size: 14px; font-weight: 600; color: #1a1a1a;">${formatLabel(key)}</span>
                            <span style="font-size: 14px; font-weight: 700; color: ${value === 'yes' ? '#F44336' : '#00C853'};">${formatValue(value)}</span>
                        </div>
                    `).join('')}
                </div>
                ${otherData.length > 0 ? `
                <h4 style="margin: 12px 0 8px; font-size: 14px; color: #1a1a1a; font-weight: 600;">Additional Information</h4>
                <div class="mobile-card-body">
                    ${otherData.map(([key, value]) => `
                        <div class="mobile-info-row">
                            <span class="mobile-info-label">${formatLabel(key)}</span>
                            <span class="mobile-info-value">${formatValue(value)}</span>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </div>
        `;
    }

    container.innerHTML = `
        <!-- Status Badge -->
        <div style="margin-bottom: 16px;">
            <span class="mobile-badge ${isEmergency ? 'mobile-badge-emergency' : 'mobile-badge-routine'}">${statusBadge}</span>
            ${isEmergency ? '<span class="mobile-badge mobile-badge-emergency" style="margin-left: 8px;">EMERGENCY</span>' : ''}
        </div>

        <!-- Person Information -->
        <div class="mobile-card">
            <h3 style="margin: 0 0 12px; font-size: 16px; color: #1a1a1a; font-weight: 700;">Person in Crisis</h3>
            <div class="mobile-card-body">
                <div class="mobile-info-row">
                    <span class="mobile-info-label">Name</span>
                    <span class="mobile-info-value">${personName}</span>
                </div>
                <div class="mobile-info-row">
                    <span class="mobile-info-label">Phone</span>
                    <span class="mobile-info-value"><a href="tel:${phone}" style="color: var(--primary-color); text-decoration: none; font-weight: 600;">${phone}</a></span>
                </div>
                <div class="mobile-info-row">
                    <span class="mobile-info-label">Location</span>
                    <span class="mobile-info-value">${location}</span>
                </div>
                <div class="mobile-info-row">
                    <span class="mobile-info-label">Crisis Type</span>
                    <span class="mobile-info-value">${caseData.crisisType || 'Not specified'}</span>
                </div>
            </div>
            <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}" target="_blank" class="mobile-btn mobile-btn-primary mobile-btn-full" style="margin-top: 12px; text-decoration: none;">
                📍 Navigate to Location
            </a>
        </div>

        ${assessmentHTML}

        <!-- Dispatcher Notes -->
        ${caseData.initialNotes ? `
        <div class="mobile-card">
            <h3 style="margin: 0 0 12px; font-size: 16px; color: #1a1a1a; font-weight: 700;">Dispatcher Notes</h3>
            <p style="font-size: 14px; color: #4a4a4a; margin: 0; line-height: 1.6;">${caseData.initialNotes}</p>
        </div>
        ` : ''}

        <!-- Timeline -->
        <div class="mobile-card">
            <h3 style="margin: 0 0 12px; font-size: 16px; color: #1a1a1a; font-weight: 700;">Timeline</h3>
            <div class="mobile-timeline">
                ${renderTimeline(caseData)}
            </div>
        </div>

        <!-- Case Notes -->
        ${caseData.notes && caseData.notes.length > 0 ? `
        <div class="mobile-card">
            <h3 style="margin: 0 0 12px; font-size: 16px; color: #1a1a1a; font-weight: 700;">Notes</h3>
            ${caseData.notes.map(note => `
                <div style="padding: 12px; background: #f5f5f5; border-radius: 8px; margin-bottom: 8px;">
                    <div style="font-size: 12px; color: #999; margin-bottom: 4px;">${utils.formatDate(note.timestamp)}</div>
                    <div style="font-size: 14px; color: #1a1a1a;">${note.text}</div>
                    ${note.outcome ? `<div style="font-size: 12px; color: var(--primary-color); margin-top: 4px; font-weight: 600;">Outcome: ${note.outcome}</div>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}
    `;
}

function renderTimeline(caseData) {
    if (!caseData.timeline || caseData.timeline.length === 0) {
        return '<div style="color: #999; font-size: 14px;">No timeline events</div>';
    }

    return caseData.timeline.map(event => `
        <div class="mobile-timeline-item">
            <div class="mobile-timeline-time">${utils.formatDate(event.timestamp)}</div>
            <div class="mobile-timeline-text" style="color: #1a1a1a;">${event.action}</div>
        </div>
    `).join('');
}

function renderActionButtons(caseData) {
    const container = document.getElementById('action-buttons');
    if (!container) {
        console.log('Action buttons container not found');
        return;
    }

    let buttonsHTML = '';

    console.log('Rendering action buttons for status:', caseData.status);

    if (caseData.status === 'assigned_to_responder') {
        // Show Accept button
        buttonsHTML = `
            <div class="mobile-card" style="background: linear-gradient(135deg, #e8f5e9, #f1f8e9); border: 2px solid #00C853;">
                <h3 style="margin: 0 0 12px; font-size: 16px; color: #1a1a1a;">Action Required</h3>
                <p style="margin: 0 0 16px; font-size: 14px; color: #1a1a1a;">This case has been assigned to you. Accept to add it to your active cases.</p>
                <button class="mobile-btn mobile-btn-success mobile-btn-full" onclick="acceptCurrentCase()">
                    ✓ Accept Case
                </button>
                <button class="mobile-btn mobile-btn-secondary mobile-btn-full" onclick="declineCurrentCase()" style="margin-top: 8px;">
                    Decline Case
                </button>
            </div>
        `;
    } else if (caseData.status === 'accepted_by_responder') {
        // Show Arrived on Site button
        buttonsHTML = `
            <div class="mobile-card" style="background: linear-gradient(135deg, #e3f2fd, #f3e5f5); border: 2px solid #2196F3;">
                <h3 style="margin: 0 0 12px; font-size: 16px; color: #1a1a1a;">Next Step</h3>
                <p style="margin: 0 0 16px; font-size: 14px; color: #1a1a1a;">When you arrive at the location, click the button below.</p>
                <button class="mobile-btn mobile-btn-primary mobile-btn-full" onclick="arriveOnSite()">
                    📍 Arrived on Site
                </button>
            </div>
        `;
    } else if (caseData.status === 'on_site') {
        // Show Close Case button
        buttonsHTML = `
            <div class="mobile-card" style="background: linear-gradient(135deg, #fff3e0, #ffe0b2); border: 2px solid #FF9800;">
                <h3 style="margin: 0 0 12px; font-size: 16px; color: #1a1a1a;">Finish Case</h3>
                <p style="margin: 0 0 16px; font-size: 14px; color: #1a1a1a;">When you're done helping the person in crisis, close the case and schedule follow-up.</p>
                <button class="mobile-btn mobile-btn-success mobile-btn-full" onclick="openCloseModal()">
                    ✓ Close Case
                </button>
            </div>
        `;
    } else if (caseData.status === 'responder_closed') {
        // Show case closed message
        buttonsHTML = `
            <div class="mobile-card" style="background: #f5f5f5; border: 2px solid #e0e0e0;">
                <h3 style="margin: 0 0 8px; font-size: 16px; color: #1a1a1a;">✓ Case Closed</h3>
                <p style="margin: 0; font-size: 14px; color: #666;">This case has been closed. A 48-hour follow-up has been scheduled.</p>
            </div>
        `;
    }

    if (buttonsHTML) {
        container.innerHTML = buttonsHTML;
        container.style.display = 'block';
    } else {
        container.innerHTML = '';
        container.style.display = 'none';
    }
}

function declineCurrentCase() {
    if (!confirm('Are you sure you want to decline this case?')) return;
    
    const reason = prompt('Reason for declining (optional):');
    const currentUser = auth.getCurrentUser();
    const result = dataManager.declineCase(currentCaseId, currentUser.id, reason);
    
    if (result.success) {
        utils.showNotification(result.message, 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        utils.showNotification(result.message, 'error');
    }
}

function acceptCurrentCase() {
    const currentUser = auth.getCurrentUser();
    const result = dataManager.acceptCase(currentCaseId, currentUser.id);
    
    if (result.success) {
        utils.showNotification(result.message, 'success');
        setTimeout(() => {
            loadCaseDetails();
        }, 500);
    } else {
        utils.showNotification(result.message, 'error');
    }
}

function arriveOnSite() {
    const currentUser = auth.getCurrentUser();
    const result = dataManager.arriveOnSite(currentCaseId, currentUser.id);
    
    if (result.success) {
        utils.showNotification(result.message, 'success');
        setTimeout(() => {
            loadCaseDetails();
        }, 500);
    } else {
        utils.showNotification(result.message, 'error');
    }
}

function openCloseModal() {
    const modal = document.getElementById('close-case-modal');
    if (!modal) return;

    // Calculate time on site
    if (currentCase && currentCase.arrivedOnSiteAt) {
        const arrivedTime = new Date(currentCase.arrivedOnSiteAt);
        const now = new Date();
        const minutes = Math.round((now - arrivedTime) / 60000);
        document.getElementById('time-on-site').value = `${minutes} minutes`;
    } else {
        document.getElementById('time-on-site').value = 'Not tracked';
    }

    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('close-case-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function submitCloseCaseForm() {
    const outcome = document.getElementById('closure-outcome').value;
    const notes = document.getElementById('closure-notes').value;

    if (!outcome) {
        utils.showNotification('Please select an outcome', 'error');
        return;
    }

    if (!notes || notes.trim().length < 10) {
        utils.showNotification('Please provide detailed notes (at least 10 characters)', 'error');
        return;
    }

    const currentUser = auth.getCurrentUser();
    const result = dataManager.closeCaseByResponder(currentCaseId, outcome, notes, currentUser.id);

    if (result.success) {
        closeModal();
        utils.showNotification(result.message, 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 2000);
    } else {
        utils.showNotification(result.message, 'error');
    }
}

// Make functions globally available
window.acceptCurrentCase = acceptCurrentCase;
window.declineCurrentCase = declineCurrentCase;
window.arriveOnSite = arriveOnSite;
window.openCloseModal = openCloseModal;
window.closeModal = closeModal;
window.submitCloseCaseForm = submitCloseCaseForm;

