// New Case Page Logic

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }

    setupForm();
});

function setupForm() {
    const form = document.getElementById('new-case-form');
    const crisisTypeSelect = document.getElementById('crisis-type');
    const dynamicQuestions = document.getElementById('dynamic-questions');
    const saveDraftBtn = document.getElementById('save-draft-btn');

    // Load dummy data button (for testing)
    const loadDummyBtn = document.createElement('button');
    loadDummyBtn.type = 'button';
    loadDummyBtn.className = 'btn btn-secondary';
    loadDummyBtn.textContent = '📋 Load Sample Data';
    loadDummyBtn.style.marginBottom = '16px';
    loadDummyBtn.onclick = loadDummyData;
    
    const firstSection = document.querySelector('.form-section');
    if (firstSection) {
        firstSection.insertBefore(loadDummyBtn, firstSection.firstChild);
    }

    // Form submission
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            createCase();
        });
    }

    // Save draft
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', () => {
            saveDraft();
        });
    }

    // Auto-save draft every 30 seconds
    setInterval(() => {
        if (form) {
            saveDraft(true); // Silent save
        }
    }, 30000);
}

// Load dummy data function
function loadDummyData() {
    // Only load if form is empty
    const callerName = document.getElementById('caller-name');
    if (callerName && !callerName.value) {
        // Dummy caller information
        document.getElementById('caller-name').value = 'Sarah Johnson';
        document.getElementById('caller-phone').value = '604-555-0123';
        document.getElementById('caller-location').value = '123 Main Street, Vancouver, BC V6B 1A1';
        
        // Set some default assessment answers
        document.getElementById('danger-no').checked = true;
        document.querySelector('input[name="suicidal-thoughts"][value="no"]').checked = true;
        document.querySelector('input[name="homicidal-thoughts"][value="no"]').checked = true;
        document.querySelector('input[name="weapons-involved"][value="no"]').checked = true;
        document.querySelector('input[name="current-state"][value="anxious"]').checked = true;
        document.querySelector('input[name="substance-none"]').checked = true;
        document.getElementById('medications').value = 'Sertraline 50mg daily';
        document.getElementById('diagnosis').value = 'Generalized Anxiety Disorder';
        document.querySelector('input[name="has-support"][value="yes"]').checked = true;
        document.querySelector('input[name="support-family"]').checked = true;
        document.querySelector('input[name="support-friends"]').checked = true;
        document.getElementById('emergency-contact').value = 'John Johnson (Spouse): 604-555-0124';
        document.querySelector('input[name="previous-attempts"][value="no"]').checked = true;
        document.querySelector('input[name="risk-none"]').checked = true;
        document.querySelector('input[name="repeat-caller"][value="no"]').checked = true;
        document.querySelector('input[name="hospital-history"][value="no"]').checked = true;
        document.querySelector('input[name="living-situation"][value="own-home"]').checked = true;
        document.getElementById('trigger-event').value = 'Recent job loss and financial stress. Feeling overwhelmed and unable to cope.';
        document.querySelector('input[name="need-counseling"]').checked = true;
        document.querySelector('input[name="need-resources"]').checked = true;
        document.getElementById('caller-relationship').value = 'self';
        document.getElementById('special-notes').value = 'Person is cooperative and willing to accept help. Prefers phone communication.';
        document.getElementById('initial-notes').value = 'Initial assessment completed. Person is experiencing significant stress but is not in immediate danger. Willing to work with crisis responder for support and resource connection.';
    }
}

// Remove the old loadDynamicQuestions function as we now have static categories

function createCase() {
    const form = document.getElementById('new-case-form');
    const formData = new FormData(form);
    
    const currentUser = auth.getCurrentUser();
    if (!currentUser) {
        utils.showNotification('You must be logged in', 'error');
        return;
    }

    // Check immediate danger
    const immediateDanger = formData.get('immediate-danger') === 'yes';
    
    const caseData = {
        callerName: formData.get('callerName'),
        callerPhone: formData.get('callerPhone'),
        callerLocation: formData.get('callerLocation'),
        contactMethod: formData.get('contactMethod'),
        crisisType: formData.get('crisisType'),
        urgency: formData.get('crisisType') === 'emergency' ? 'emergency' : 
                formData.get('crisisType') === 'urgent' ? 'urgent' : 'normal',
        initialNotes: formData.get('initialNotes'),
        createdBy: currentUser.id,
        status: immediateDanger ? 'emergency' : 'new'
    };

    // Collect all assessment answers
    const assessmentData = {};
    
    // Get all form inputs from assessment section
    const assessmentSection = document.getElementById('assessment-questions');
    if (assessmentSection) {
        // Get radio button values
        assessmentSection.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
            assessmentData[radio.name] = radio.value;
        });
        
        // Get checkbox values (as array)
        const checkboxGroups = {};
        assessmentSection.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            if (!checkboxGroups[checkbox.name]) {
                checkboxGroups[checkbox.name] = [];
            }
            checkboxGroups[checkbox.name].push(checkbox.value);
        });
        Object.assign(assessmentData, checkboxGroups);
        
        // Get text inputs and textareas
        assessmentSection.querySelectorAll('input[type="text"], textarea, select').forEach(input => {
            if (input.value) {
                assessmentData[input.name] = input.value;
            }
        });
    }
    
    caseData.assessmentData = assessmentData;

    const newCase = dataManager.createCase(caseData);
    
    utils.showNotification(`Case ${newCase.caseId} created successfully`, 'success');
    
    // Clear draft
    localStorage.removeItem('case_draft');
    
    // Redirect to case detail
    setTimeout(() => {
        window.location.href = `case-detail.html?id=${newCase.id}`;
    }, 1000);
}

function saveDraft(silent = false) {
    const form = document.getElementById('new-case-form');
    const formData = new FormData(form);
    
    const draft = {
        callerName: formData.get('callerName'),
        callerPhone: formData.get('callerPhone'),
        callerLocation: formData.get('callerLocation'),
        contactMethod: formData.get('contactMethod'),
        crisisType: formData.get('crisisType'),
        initialNotes: formData.get('initialNotes'),
        savedAt: new Date().toISOString()
    };

    localStorage.setItem('case_draft', JSON.stringify(draft));
    
    if (!silent) {
        utils.showNotification('Draft saved', 'success');
    }
}

// Load draft on page load
window.addEventListener('load', () => {
    const draft = localStorage.getItem('case_draft');
    if (draft) {
        try {
            const draftData = JSON.parse(draft);
            const form = document.getElementById('new-case-form');
            
            if (draftData.callerName) document.getElementById('caller-name').value = draftData.callerName;
            if (draftData.callerPhone) document.getElementById('caller-phone').value = draftData.callerPhone;
            if (draftData.callerLocation) document.getElementById('caller-location').value = draftData.callerLocation;
            if (draftData.contactMethod) {
                const radio = form.querySelector(`input[name="contactMethod"][value="${draftData.contactMethod}"]`);
                if (radio) radio.checked = true;
            }
            if (draftData.crisisType) {
                document.getElementById('crisis-type').value = draftData.crisisType;
            }
            if (draftData.initialNotes) document.getElementById('initial-notes').value = draftData.initialNotes;
        } catch (e) {
            console.error('Error loading draft:', e);
        }
    }
});

