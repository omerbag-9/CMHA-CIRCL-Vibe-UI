// Data Initialization Script - Ensures dummy data loads on server
// This script should be loaded after data.js and before dummy-data.js

(function() {
    'use strict';
    
    // Wait for all dependencies
    function ensureInitialized() {
        // Check if all required objects exist
        if (typeof dataManager === 'undefined') {
            setTimeout(ensureInitialized, 50);
            return;
        }
        
        if (typeof utils === 'undefined') {
            setTimeout(ensureInitialized, 50);
            return;
        }
        
        // Initialize dataManager first
        if (typeof dataManager.init === 'function') {
            try {
                dataManager.init();
            } catch (e) {
                console.error('Error initializing dataManager:', e);
            }
        }
        
        // Then initialize dummy data
        if (typeof dummyData !== 'undefined' && typeof dummyData.init === 'function') {
            try {
                // Small delay to ensure localStorage is ready
                setTimeout(() => {
                    dummyData.init();
                }, 100);
            } catch (e) {
                console.error('Error initializing dummyData:', e);
            }
        }
    }
    
    // Start initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureInitialized);
    } else {
        ensureInitialized();
    }
    
    // Backup initialization
    window.addEventListener('load', function() {
        setTimeout(ensureInitialized, 200);
    });
})();

