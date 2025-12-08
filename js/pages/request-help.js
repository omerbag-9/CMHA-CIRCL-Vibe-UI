// Request Help Page Logic

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('request-help-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            submitRequest();
        });
    }
});

function submitRequest() {
    const form = document.getElementById('request-help-form');
    const formData = new FormData(form);
    
    const requestData = {
        callerName: formData.get('name'),
        callerPhone: formData.get('phone'),
        callerLocation: formData.get('location'),
        initialNotes: formData.get('message'),
        contactMethod: 'web',
        crisisType: formData.get('emergency') ? 'emergency' : 'routine',
        urgency: formData.get('emergency') ? 'emergency' : 'normal',
        createdBy: 'public',
        status: formData.get('emergency') ? 'emergency' : 'new',
        isPublicCase: true
    };

    const newCase = dataManager.createCase(requestData);
    
    // Store case ID for chat
    localStorage.setItem('public_case_id', newCase.id);
    
    // Create initial message from person in crisis
    const publicUserId = 'public_' + Date.now();
    localStorage.setItem('public_user_id', publicUserId);
    
    const initialMessage = {
        fromId: publicUserId,
        toId: '1', // Dispatcher ID
        text: formData.get('message'),
        type: 'text',
        caseId: newCase.id,
        isPublic: true
    };
    
    dataManager.createMessage(initialMessage);
    
    // Show success and redirect to chat
    const errorDiv = document.getElementById('request-error');
    const successDiv = document.getElementById('request-success');
    const caseIdDisplay = document.getElementById('case-id-display');
    
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'block';
    if (caseIdDisplay) caseIdDisplay.textContent = newCase.caseId;
    
    // Redirect to chat after 2 seconds
    setTimeout(() => {
        window.location.href = `chat.html?caseId=${newCase.id}`;
    }, 2000);
}

