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
        status: formData.get('emergency') ? 'emergency' : 'new'
    };

    const newCase = dataManager.createCase(requestData);
    
    // Show success message
    const errorDiv = document.getElementById('request-error');
    const successDiv = document.getElementById('request-success');
    const caseIdDisplay = document.getElementById('case-id-display');
    
    if (errorDiv) errorDiv.style.display = 'none';
    if (successDiv) successDiv.style.display = 'block';
    if (caseIdDisplay) caseIdDisplay.textContent = newCase.caseId;
    
    // Reset form
    form.reset();
    
    // Scroll to success message
    successDiv.scrollIntoView({ behavior: 'smooth' });
}

