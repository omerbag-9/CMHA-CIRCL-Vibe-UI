// New Case Page Logic

// Topic navigation state
let completedTopics = new Set();
let currentTopic = 'case-type';

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    if (!auth.isAuthenticated()) {
        window.location.href = '/index.html';
        return;
    }

    setupForm();
    setupTopicNavigation();
    loadFromRequest();
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

    // Flow selection event listeners
    const flowRadios = document.querySelectorAll('input[name="flowType"]');
    console.log('Found flow radios:', flowRadios.length);
    flowRadios.forEach(radio => {
        radio.addEventListener('change', () => {
            console.log('Flow radio changed to:', radio.value);
            handleFlowSelection();
        });
    });

    // Initialize flow display - ensure DOM is ready
    console.log('Initializing flow display...');
    setTimeout(() => {
        console.log('Running initial handleFlowSelection');
        handleFlowSelection();
    }, 50);

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

    // Emergency action buttons
    const sendResponderBtn = document.getElementById('send-responder-btn');
    const call911Btn = document.getElementById('call-911-btn');
    
    if (sendResponderBtn) {
        sendResponderBtn.addEventListener('click', () => {
            handleEmergencyAction('send_responder');
        });
    }
    
    if (call911Btn) {
        call911Btn.addEventListener('click', () => {
            handleEmergencyAction('call_911');
        });
    }
}

function setupTopicNavigation() {
    console.log('Setting up topic navigation');
    
    // Initialize first topic as active
    setTimeout(() => {
        showTopic('case-type');
    }, 100);
    
    // Add input change listeners to mark topics as completed
    const form = document.getElementById('new-case-form');
    if (form) {
        form.addEventListener('change', () => {
            checkTopicCompletion(currentTopic);
        });
        
        form.addEventListener('input', () => {
            checkTopicCompletion(currentTopic);
        });
    }
    
    console.log('Topic navigation setup complete');
}

function showTopic(topicId) {
    console.log('=== showTopic called with:', topicId);
    currentTopic = topicId;
    
    // Hide all topic sections
    const allSections = document.querySelectorAll('.topic-section');
    console.log('Found topic sections:', allSections.length);
    allSections.forEach(section => {
        section.classList.remove('active');
        section.style.display = 'none';
    });
    
    // Show selected topic section
    const selectedSection = document.querySelector(`[data-topic-section="${topicId}"]`);
    console.log('Selected section:', selectedSection);
    if (selectedSection) {
        selectedSection.classList.add('active');
        selectedSection.style.display = 'block';
    } else {
        console.error('Topic section not found:', topicId);
    }
    
    // Update tab states
    const allTabs = document.querySelectorAll('.topic-tab');
    console.log('Found topic tabs:', allTabs.length);
    allTabs.forEach(tab => {
        tab.classList.remove('active');
        if (tab.dataset.topic === topicId) {
            tab.classList.add('active');
        }
    });
    
    // Scroll topic bar to show active tab
    const activeTab = document.querySelector(`.topic-tab[data-topic="${topicId}"]`);
    if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
}

function checkTopicCompletion(topicId) {
    const section = document.querySelector(`[data-topic-section="${topicId}"]`);
    if (!section) return;
    
    // Get all required fields in this topic
    const requiredFields = section.querySelectorAll('[required]');
    let allFilled = true;
    
    requiredFields.forEach(field => {
        if (field.type === 'radio') {
            const radioGroup = section.querySelectorAll(`[name="${field.name}"]`);
            const isChecked = Array.from(radioGroup).some(radio => radio.checked);
            if (!isChecked) allFilled = false;
        } else if (field.type === 'checkbox') {
            // For checkbox groups, at least one should be checked
            const checkboxGroup = section.querySelectorAll(`[name="${field.name}"]`);
            const isChecked = Array.from(checkboxGroup).some(cb => cb.checked);
            if (!isChecked) allFilled = false;
        } else {
            if (!field.value || field.value.trim() === '') allFilled = false;
        }
    });
    
    // Mark topic as completed
    const tab = document.querySelector(`.topic-tab[data-topic="${topicId}"]`);
    if (tab) {
        if (allFilled) {
            tab.classList.add('completed');
            completedTopics.add(topicId);
        } else {
            tab.classList.remove('completed');
            completedTopics.delete(topicId);
        }
    }
    
    // Update progress
    updateProgress();
}

function updateProgress() {
    const totalTopics = document.querySelectorAll('.topic-tab').length;
    const completed = completedTopics.size;
    const percentage = (completed / totalTopics) * 100;
    
    console.log(`Progress: ${completed}/${totalTopics} topics completed`);
}

// Make showTopic globally available
window.showTopic = showTopic;

function handleFlowSelection() {
    console.log('=== handleFlowSelection called ===');
    const selectedFlow = document.querySelector('input[name="flowType"]:checked')?.value || 'for_self';
    console.log('Flow selected:', selectedFlow);
    
    // Hide all flow-specific sections
    const flowSections = document.querySelectorAll('.flow-specific');
    flowSections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Get form elements
    const callerLocation = document.getElementById('caller-location');
    const callerLocationLabel = callerLocation?.previousElementSibling;
    const callerLocationGroup = document.getElementById('caller-location-group');
    const assessmentQuestions = document.getElementById('assessment-questions');
    const notesSection = document.getElementById('notes-section');
    const contactMethodSection = document.getElementById('contact-method-section');
    const crisisTypeSection = document.getElementById('crisis-type-section');
    const caregiverFields = document.getElementById('caregiver-fields');
    const emergencyFields = document.getElementById('emergency-fields');
    const knownPersonFields = document.getElementById('known-person-fields');
    const crisisTypeSelect = document.getElementById('crisis-type');
    
    console.log('Elements found:', {
        callerLocationGroup: !!callerLocationGroup,
        contactMethodSection: !!contactMethodSection,
        crisisTypeSection: !!crisisTypeSection,
        assessmentQuestions: !!assessmentQuestions,
        notesSection: !!notesSection
    });
    
    // Reset all sections visibility first
    if (callerLocationGroup) {
        callerLocationGroup.style.display = '';
        callerLocationGroup.style.visibility = '';
        callerLocationGroup.removeAttribute('hidden');
    }
    if (contactMethodSection) {
        contactMethodSection.style.display = '';
        contactMethodSection.style.visibility = '';
        contactMethodSection.removeAttribute('hidden');
    }
    if (crisisTypeSection) {
        crisisTypeSection.style.display = '';
        crisisTypeSection.style.visibility = '';
        crisisTypeSection.removeAttribute('hidden');
    }
    if (assessmentQuestions) {
        assessmentQuestions.style.display = '';
        assessmentQuestions.style.visibility = '';
        assessmentQuestions.removeAttribute('hidden');
    }
    if (notesSection) {
        notesSection.style.display = '';
        notesSection.style.visibility = '';
        notesSection.removeAttribute('hidden');
    }
    
    // Reset crisis type to required
    if (crisisTypeSelect) {
        crisisTypeSelect.required = true;
    }
    
    // Update required fields and labels based on flow
    if (selectedFlow === 'for_self') {
        // For self: caller location is person in crisis location
        if (callerLocationLabel) {
            callerLocationLabel.textContent = 'Location *';
        }
        if (callerLocation) {
            callerLocation.required = true;
        }
        if (assessmentQuestions) {
            assessmentQuestions.style.display = 'block';
        }
        // Show notes section
        if (notesSection) {
            notesSection.style.display = 'block';
        }
    } else if (selectedFlow === 'caregiver') {
        // Caregiver: show caregiver fields and assessment questions
        if (callerLocationLabel) {
            callerLocationLabel.textContent = 'Your Location (Caregiver) *';
        }
        if (caregiverFields) {
            caregiverFields.style.display = 'block';
            // Make caregiver fields required
            const personLocation = document.getElementById('person-in-crisis-location');
            const relationship = document.getElementById('caregiver-relationship');
            if (personLocation) personLocation.required = true;
            if (relationship) relationship.required = true;
        }
        if (assessmentQuestions) {
            assessmentQuestions.style.display = 'block';
        }
        // Show notes section
        if (notesSection) {
            notesSection.style.display = 'block';
        }
    } else if (selectedFlow === 'emergency') {
        // Emergency: only caller name, phone, and location of person in crisis - nothing else
        const callerName = document.getElementById('caller-name');
        const callerPhone = document.getElementById('caller-phone');
        
        // Make caller name and phone required
        if (callerName) callerName.required = true;
        if (callerPhone) callerPhone.required = true;
        
        // Hide caller location
        if (callerLocationGroup) {
            callerLocationGroup.style.display = 'none';
        }
        if (callerLocation) {
            callerLocation.required = false;
        }
        
        // Hide contact method section
        if (contactMethodSection) {
            contactMethodSection.style.display = 'none';
        }
        
        // Hide crisis type section and make it not required
        if (crisisTypeSection) {
            crisisTypeSection.style.display = 'none';
            crisisTypeSection.style.visibility = 'hidden';
            crisisTypeSection.setAttribute('hidden', 'true');
            console.log('Hiding crisis type section for emergency');
        }
        if (crisisTypeSelect) {
            crisisTypeSelect.required = false;
        }
        
        // Hide assessment questions
        if (assessmentQuestions) {
            assessmentQuestions.style.display = 'none';
            assessmentQuestions.style.visibility = 'hidden';
            assessmentQuestions.setAttribute('hidden', 'true');
            console.log('Hiding assessment questions for emergency');
        }
        
        // Hide notes section
        if (notesSection) {
            notesSection.style.display = 'none';
        }
        
        // Show emergency fields
        if (emergencyFields) {
            emergencyFields.style.display = 'block';
        }
    } else if (selectedFlow === 'known_person') {
        // Known person: caller info (name, phone), person in crisis info (name, phone, location), and notes
        
        // Hide caller location
        if (callerLocationGroup) {
            callerLocationGroup.style.display = 'none';
        }
        if (callerLocation) {
            callerLocation.required = false;
        }
        
        // Hide contact method section
        if (contactMethodSection) {
            contactMethodSection.style.display = 'none';
        }
        
        // Hide crisis type section and make it not required
        if (crisisTypeSection) {
            crisisTypeSection.style.display = 'none';
            crisisTypeSection.style.visibility = 'hidden';
            crisisTypeSection.setAttribute('hidden', 'true');
            console.log('Hiding crisis type section for known person');
        }
        if (crisisTypeSelect) {
            crisisTypeSelect.required = false;
        }
        
        // Hide assessment questions
        if (assessmentQuestions) {
            assessmentQuestions.style.display = 'none';
            assessmentQuestions.style.visibility = 'hidden';
            assessmentQuestions.setAttribute('hidden', 'true');
            console.log('Hiding assessment questions for known person');
        }
        
        // Show person in crisis fields
        if (knownPersonFields) {
            knownPersonFields.style.display = 'block';
            // Make person in crisis fields required
            const personName = document.getElementById('person-in-crisis-name');
            const personPhone = document.getElementById('person-in-crisis-phone');
            const personLocation = document.getElementById('person-in-crisis-location-known');
            if (personName) personName.required = true;
            if (personPhone) personPhone.required = true;
            if (personLocation) personLocation.required = true;
        }
        
        // Show notes section
        if (notesSection) {
            notesSection.style.display = 'block';
        }
    }
}

function handleEmergencyAction(action) {
    const form = document.getElementById('new-case-form');
    const formData = new FormData(form);
    
    const location = formData.get('personInCrisisLocationEmergency');
    
    if (!location) {
        utils.showNotification('Please fill in the location of person in crisis', 'error');
        return;
    }
    
    if (action === 'send_responder') {
        // Create case immediately and assign responder
        const caseData = {
            flowType: 'emergency',
            callerName: formData.get('callerName') || 'Unknown',
            callerPhone: formData.get('callerPhone') || '',
            callerLocation: formData.get('callerLocation') || '',
            personInCrisisLocation: location,
            emergencyType: 'suicide-risk',
            isEmergency: true,
            contactMethod: formData.get('contactMethod'),
            crisisType: 'emergency',
            urgency: 'emergency',
            status: 'assigned_to_responder',
            createdBy: auth.getCurrentUser()?.id || '1',
            initialNotes: formData.get('initialNotes') || `Emergency action: Send Responder. Location: ${location}. Suicide risk.`
        };
        
        const newCase = dataManager.createCase(caseData);
        utils.showNotification(`Emergency case created. Responder dispatched to ${location}`, 'success');
        
        setTimeout(() => {
            window.location.href = `case-detail.html?id=${newCase.id}`;
        }, 1500);
    } else if (action === 'call_911') {
        // Create case and note 911 was called
        const caseData = {
            flowType: 'emergency',
            callerName: formData.get('callerName') || 'Unknown',
            callerPhone: formData.get('callerPhone') || '',
            callerLocation: formData.get('callerLocation') || '',
            personInCrisisLocation: location,
            emergencyType: 'suicide-risk',
            isEmergency: true,
            contactMethod: formData.get('contactMethod'),
            crisisType: 'emergency',
            urgency: 'emergency',
            status: 'assigned_to_responder',
            createdBy: auth.getCurrentUser()?.id || '1',
            initialNotes: formData.get('initialNotes') || `911 called. Location: ${location}. Suicide risk.`
        };
        
        const newCase = dataManager.createCase(caseData);
        utils.showNotification('911 has been notified. Case created.', 'success');
        
        setTimeout(() => {
            window.location.href = `case-detail.html?id=${newCase.id}`;
        }, 1500);
    }
}

// Questions are now static in HTML - no dynamic generation needed

// Load data from public request URL parameters
function loadFromRequest() {
    const urlParams = new URLSearchParams(window.location.search);
    const fromRequest = urlParams.get('fromRequest');
    
    if (!fromRequest) return;
    
    // Get the request data
    const name = urlParams.get('name');
    const phone = urlParams.get('phone');
    const location = urlParams.get('location');
    const message = urlParams.get('message');
    const isForSelf = urlParams.get('isForSelf') === 'true';
    const personInCrisisName = urlParams.get('personInCrisisName');
    
    // Determine flow type
    let flowType = 'for_self';
    if (!isForSelf) {
        // Default to known_person if person name is provided, otherwise could be caregiver
        flowType = personInCrisisName ? 'known_person' : 'caregiver';
    }
    
    // Set flow type radio button
    const flowRadio = document.getElementById(`flow-${flowType}`);
    if (flowRadio) {
        flowRadio.checked = true;
        handleFlowSelection();
    }
    
    // Pre-fill the form
    const callerNameInput = document.getElementById('caller-name');
    const callerPhoneInput = document.getElementById('caller-phone');
    const callerLocationInput = document.getElementById('caller-location');
    const initialNotesInput = document.getElementById('initial-notes');
    const contactMethodWeb = document.querySelector('input[name="contactMethod"][value="web"]');
    
    if (name && callerNameInput) {
        callerNameInput.value = decodeURIComponent(name);
    }
    
    if (phone && callerPhoneInput) {
        callerPhoneInput.value = decodeURIComponent(phone);
    }
    
    if (location && callerLocationInput) {
        callerLocationInput.value = decodeURIComponent(location);
    }
    
    if (message && initialNotesInput) {
        initialNotesInput.value = decodeURIComponent(message);
    }
    
    // Pre-fill person in crisis fields if known person flow
    if (flowType === 'known_person' && personInCrisisName) {
        const personNameInput = document.getElementById('person-in-crisis-name');
        const personLocationInput = document.getElementById('person-in-crisis-location-known');
        if (personNameInput) {
            personNameInput.value = decodeURIComponent(personInCrisisName);
        }
        if (personLocationInput && location) {
            personLocationInput.value = decodeURIComponent(location);
        }
    }
    
    // Set contact method to web
    if (contactMethodWeb) {
        contactMethodWeb.checked = true;
    }
    
    // Show notification
    if (name || phone || location || message) {
        const relationshipText = isForSelf ? 'for themselves' : `for ${personInCrisisName || 'someone else'}`;
        utils.showNotification(`Form pre-filled from web request ${relationshipText}`, 'success');
    }
    
    // Store request ID to mark it as processed when case is created
    if (fromRequest) {
        localStorage.setItem('pending_request_id', fromRequest);
    }
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

    // Get flow type
    const flowType = formData.get('flowType') || 'for_self';
    
    // Check immediate danger
    const immediateDanger = formData.get('immediate-danger') === 'yes';
    
    const caseData = {
        flowType: flowType,
        callerName: formData.get('callerName'),
        callerPhone: formData.get('callerPhone'),
        callerLocation: formData.get('callerLocation'),
        contactMethod: formData.get('contactMethod'),
        crisisType: formData.get('crisisType'),
        urgency: formData.get('crisisType') === 'emergency' ? 'emergency' : 
                formData.get('crisisType') === 'urgent' ? 'urgent' : 'normal',
        initialNotes: formData.get('initialNotes'),
        createdBy: currentUser.id,
        status: immediateDanger ? 'assigned_to_responder' : 'new_case'
    };

    // Add flow-specific fields
    if (flowType === 'caregiver') {
        caseData.caregiverName = formData.get('callerName');
        caseData.caregiverPhone = formData.get('callerPhone');
        caseData.personInCrisisLocation = formData.get('personInCrisisLocation');
        caseData.caregiverRelationship = formData.get('caregiverRelationship');
    } else if (flowType === 'emergency') {
        caseData.personInCrisisLocation = formData.get('personInCrisisLocationEmergency');
        caseData.emergencyType = formData.get('emergencyType');
        caseData.isEmergency = true;
    } else if (flowType === 'known_person') {
        caseData.personInCrisisName = formData.get('personInCrisisName');
        caseData.personInCrisisPhone = formData.get('personInCrisisPhone');
        caseData.personInCrisisLocation = formData.get('personInCrisisLocationKnown');
    }

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
            if (input.value && input.name) {
                assessmentData[input.name] = input.value;
            }
        });
    }
    
    // Collect situation data
    const situationData = {};
    const situationSection = document.querySelector('[data-topic-section="situation"]');
    if (situationSection) {
        // Collect radio buttons
        situationSection.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
            if (radio.value && radio.name) {
                situationData[radio.name] = radio.value;
            }
        });
        // Collect text inputs and textareas
        situationSection.querySelectorAll('input[type="text"], textarea, select').forEach(input => {
            if (input.value && input.name) {
                situationData[input.name] = input.value;
            }
        });
        // Collect checkboxes
        const checkboxGroups = {};
        situationSection.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            if (!checkboxGroups[checkbox.name]) {
                checkboxGroups[checkbox.name] = [];
            }
            checkboxGroups[checkbox.name].push(checkbox.value);
        });
        Object.assign(situationData, checkboxGroups);
    }
    
    // Collect additional information data
    const additionalData = {};
    const additionalSection = document.querySelector('[data-topic-section="additional"]');
    if (additionalSection) {
        // Collect radio buttons
        additionalSection.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
            if (radio.value && radio.name) {
                additionalData[radio.name] = radio.value;
            }
        });
        // Collect text inputs and textareas
        additionalSection.querySelectorAll('input[type="text"], textarea, select').forEach(input => {
            if (input.value && input.name) {
                additionalData[input.name] = input.value;
            }
        });
        // Collect checkboxes
        const checkboxGroups = {};
        additionalSection.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
            if (!checkboxGroups[checkbox.name]) {
                checkboxGroups[checkbox.name] = [];
            }
            checkboxGroups[checkbox.name].push(checkbox.value);
        });
        Object.assign(additionalData, checkboxGroups);
    }
    
    // Collect notes data
    const notesData = {};
    const notesSection = document.querySelector('[data-topic-section="notes"]');
    if (notesSection) {
        // Collect radio buttons
        notesSection.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
            if (radio.value && radio.name) {
                notesData[radio.name] = radio.value;
            }
        });
        // Collect text inputs and textareas
        notesSection.querySelectorAll('textarea, input[type="text"]').forEach(input => {
            if (input.value && input.name) {
                notesData[input.name] = input.value;
            }
        });
    }
    
    caseData.assessmentData = assessmentData;
    caseData.situationData = situationData;
    caseData.additionalData = additionalData;
    caseData.notesData = notesData;

    const newCase = dataManager.createCase(caseData);
    
    // If this case was created from a public request, mark the request as processed
    const pendingRequestId = localStorage.getItem('pending_request_id');
    if (pendingRequestId) {
        const request = dataManager.getCaseById(pendingRequestId);
        if (request && request.isPublicCase) {
            // Update the request to link it to the new case
            dataManager.updateCase(pendingRequestId, {
                status: 'assigned_to_responder',
                linkedCaseId: newCase.id,
                timeline: [
                    ...(request.timeline || []),
                    {
                        action: `Case created from web request - ${newCase.caseId}`,
                        timestamp: new Date().toISOString(),
                        user: currentUser.name
                    }
                ]
            });
            localStorage.removeItem('pending_request_id');
        }
    }
    
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

