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

    // Crisis type change handler
    if (crisisTypeSelect) {
        crisisTypeSelect.addEventListener('change', (e) => {
            loadDynamicQuestions(e.target.value);
        });
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

function loadDynamicQuestions(crisisType) {
    const container = document.getElementById('dynamic-questions');
    if (!container) return;

    const questions = {
        emergency: [
            { id: 'immediate-danger', text: 'Is there immediate danger?', type: 'radio', options: ['Yes', 'No'] },
            { id: 'weapons', text: 'Are there any weapons involved?', type: 'radio', options: ['Yes', 'No', 'Unknown'] }
        ],
        urgent: [
            { id: 'repeat-caller', text: 'Has this person called before?', type: 'radio', options: ['Yes', 'No', 'Unknown'] },
            { id: 'support-system', text: 'Do they have a support system?', type: 'radio', options: ['Yes', 'No', 'Unknown'] }
        ],
        routine: [
            { id: 'nature', text: 'What is the nature of the crisis?', type: 'textarea' }
        ],
        sensitive: [
            { id: 'confidential', text: 'This is a sensitive case requiring extra confidentiality', type: 'checkbox' }
        ]
    };

    const questionSet = questions[crisisType] || [];
    
    if (questionSet.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = questionSet.map(q => {
        if (q.type === 'radio') {
            return `
                <div class="form-group">
                    <label>${q.text}</label>
                    <div class="radio-group">
                        ${q.options.map(opt => `
                            <label class="radio-label">
                                <input type="radio" name="${q.id}" value="${opt.toLowerCase()}">
                                <span>${opt}</span>
                            </label>
                        `).join('')}
                    </div>
                </div>
            `;
        } else if (q.type === 'textarea') {
            return `
                <div class="form-group">
                    <label>${q.text}</label>
                    <textarea name="${q.id}" rows="3"></textarea>
                </div>
            `;
        } else if (q.type === 'checkbox') {
            return `
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="${q.id}">
                        <span>${q.text}</span>
                    </label>
                </div>
            `;
        }
    }).join('');
}

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

    // Add dynamic question answers
    const dynamicAnswers = {};
    form.querySelectorAll('#dynamic-questions input, #dynamic-questions textarea').forEach(input => {
        if (input.type === 'checkbox') {
            dynamicAnswers[input.name] = input.checked;
        } else if (input.value) {
            dynamicAnswers[input.name] = input.value;
        }
    });
    caseData.dynamicAnswers = dynamicAnswers;

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
                loadDynamicQuestions(draftData.crisisType);
            }
            if (draftData.initialNotes) document.getElementById('initial-notes').value = draftData.initialNotes;
        } catch (e) {
            console.error('Error loading draft:', e);
        }
    }
});

