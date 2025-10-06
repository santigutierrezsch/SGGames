/**
 * SGGame Mimicry JS - Tab Cloaking and Security Features
 * This script enables tab cloaking, panic button, and tab close verification across the site.
 * Add this to all pages by including the script in the head section.
 */

function applySavedMimicry() {
    // Check if there's a saved style and apply it
    const savedTitle = localStorage.getItem('pageMimicTitle');
    const savedIcon = localStorage.getItem('pageMimicIcon');
    
    // Apply saved title if available
    if (savedTitle) {
        document.title = savedTitle;
    }
    
    // Apply saved favicon if available
    if (savedIcon) {
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = savedIcon;
        } else {
            // Create favicon if it doesn't exist
            const newFavicon = document.createElement('link');
            newFavicon.rel = 'icon';
            newFavicon.href = savedIcon;
            document.head.appendChild(newFavicon);
        }
    }
    
    // Initialize security features
    initSecurityFeatures();
}

function initSecurityFeatures() {
    // Initialize panic key
    initPanicKey();
    
    // Initialize tab close prevention
    initTabClosePrevention();
}

function initPanicKey() {
    // Remove any existing event listener to prevent duplicates
    document.removeEventListener('keydown', handlePanicKey);
    
    // Only add listener if panic button is enabled
    const panicEnabled = localStorage.getItem('panicEnabled') !== 'false'; // Default to true
    if (panicEnabled) {
        document.addEventListener('keydown', handlePanicKey);
    }
}

function handlePanicKey(event) {
    const panicKey = localStorage.getItem('panicKey') || '[';
    if (event.key === panicKey) {
        // Set a flag that this is a panic activation so verification can be bypassed
        sessionStorage.setItem('panicActivation', 'true');
        
        // Redirect to Google immediately
        window.location.href = 'https://www.google.com';
    }
}

function initTabClosePrevention() {
    const verificationEnabled = localStorage.getItem('verificationEnabled') === 'true';
    
    // Remove any existing event listener
    window.onbeforeunload = null;
    
    if (verificationEnabled) {
        window.onbeforeunload = function(e) {
            // Check if this is a panic button activation
            const isPanicActivation = sessionStorage.getItem('panicActivation') === 'true';
            if (isPanicActivation) {
                // Clear the flag and allow the navigation
                sessionStorage.removeItem('panicActivation');
                return undefined;
            }
            
            // Otherwise show the confirmation dialog
            return "Are you sure you want to leave this page?";
        };
    }
}

function loadSavedSettings() {
    // Tab cloaking settings
    const savedType = localStorage.getItem('pageMimicType');
    
    if (savedType) {
        // Highlight the correct option in the modal
        const options = document.querySelectorAll('.rename-option');
        options.forEach(opt => {
            if (opt.dataset.type === savedType) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    }
    
    // Security settings
    const verificationToggle = document.getElementById('verificationToggle');
    const panicButtonToggle = document.getElementById('panicButtonToggle');
    const panicKeyInput = document.getElementById('panicKeyInput');
    
    if (verificationToggle) {
        const verificationEnabled = localStorage.getItem('verificationEnabled') === 'true';
        verificationToggle.checked = verificationEnabled;
    }
    
    if (panicButtonToggle) {
        const panicEnabled = localStorage.getItem('panicEnabled') !== 'false'; // Default to true
        panicButtonToggle.checked = panicEnabled;
    }
    
    if (panicKeyInput) {
        const panicKey = localStorage.getItem('panicKey') || '[';
        panicKeyInput.value = panicKey;
    }
    
    // Email customization settings
    const usernameInput = document.getElementById('username');
    const domainInput = document.getElementById('domain');
    
    if (usernameInput && domainInput) {
        usernameInput.value = localStorage.getItem('emailUsername') || '';
        domainInput.value = localStorage.getItem('emailDomain') || 'gmail.com';
    }
}

function savePageStyle() {
    const selectedOption = document.querySelector('.rename-option.active');
    if (selectedOption) {
        const pageType = selectedOption.dataset.type;
        let pageTitle = selectedOption.dataset.title;
        const pageIcon = selectedOption.dataset.icon;
        
        // If this is a Gmail type and we have a custom email, use it
        if (pageType === 'gmail') {
            const username = localStorage.getItem('emailUsername');
            const domain = localStorage.getItem('emailDomain');
            
            if (username && domain) {
                pageTitle = `Inbox - ${username}@${domain} - Gmail`;
            }
        }
        
        // Save preferences to localStorage
        localStorage.setItem('pageMimicType', pageType);
        localStorage.setItem('pageMimicTitle', pageTitle);
        localStorage.setItem('pageMimicIcon', pageIcon);
        
        // Apply changes immediately
        document.title = pageTitle;
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = pageIcon;
        } else {
            // Create favicon if it doesn't exist
            const newFavicon = document.createElement('link');
            newFavicon.rel = 'icon';
            newFavicon.href = pageIcon;
            document.head.appendChild(newFavicon);
        }
    }
}

function applyCustomEmail() {
    const usernameInput = document.getElementById('username');
    const domainInput = document.getElementById('domain');
    
    if (usernameInput && domainInput) {
        const username = usernameInput.value.trim();
        const domain = domainInput.value.trim() || 'gmail.com';
        
        // Save to localStorage
        localStorage.setItem('emailUsername', username);
        localStorage.setItem('emailDomain', domain);
        
        // If Gmail is currently selected, update the title immediately
        const selectedOption = document.querySelector('.rename-option.active');
        if (selectedOption && selectedOption.dataset.type === 'gmail') {
            const newTitle = `Inbox - ${username}@${domain} - Gmail`;
            document.title = newTitle;
            localStorage.setItem('pageMimicTitle', newTitle);
        }
        
        // Show brief feedback
        const applyButton = document.querySelector('.apply-email');
        if (applyButton) {
            const originalText = applyButton.textContent;
            applyButton.textContent = 'Saved!';
            applyButton.style.backgroundColor = '#4CAF50'; // Green
            
            // Reset after a short delay
            setTimeout(() => {
                applyButton.textContent = originalText;
                applyButton.style.backgroundColor = '';
            }, 1500);
        }
    }
}

function saveSecuritySettings() {
    const verificationToggle = document.getElementById('verificationToggle');
    const panicButtonToggle = document.getElementById('panicButtonToggle');
    const panicKeyInput = document.getElementById('panicKeyInput');
    
    if (verificationToggle) {
        localStorage.setItem('verificationEnabled', verificationToggle.checked);
    }
    
    if (panicButtonToggle) {
        localStorage.setItem('panicEnabled', panicButtonToggle.checked);
    }
    
    if (panicKeyInput && panicKeyInput.value) {
        localStorage.setItem('panicKey', panicKeyInput.value);
    }
    
    // Reinitialize security features with new settings
    initSecurityFeatures();
}

function saveAllSettings() {
    savePageStyle();
    saveSecuritySettings();
}

document.addEventListener('DOMContentLoaded', function() {
    // Apply any saved mimicry settings immediately
    applySavedMimicry();
    
    // Set up the settings button and modal if they exist on this page
    setupSettingsModal();
});

function setupSettingsModal() {
    // Get elements
    const settingsButton = document.querySelector('.settings-button');
    const settingsModal = document.getElementById('settingsModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeSettingsBtn = document.querySelector('.close-settings');
    const applyEmailBtn = document.querySelector('.apply-email');
    
    if (!settingsButton || !settingsModal) return; // Not all pages may have the settings modal
    
    // Open settings modal
    settingsButton.addEventListener('click', function() {
        settingsModal.style.display = 'flex';
        loadSavedSettings();
    });
    
    // Close settings modal via X button
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            settingsModal.style.display = 'none';
        });
    }
    
    // Close settings modal via "Close" button
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener('click', function() {
            saveAllSettings();
            settingsModal.style.display = 'none';
        });
    }
    
    // Close settings modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });
    
    // Setup rename options
    const renameOptions = document.querySelectorAll('.rename-option');
    renameOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            renameOptions.forEach(opt => opt.classList.remove('active'));
            // Add active class to clicked option
            this.classList.add('active');
            
            // Show/hide email customization if Gmail is selected
            const emailCustomization = document.getElementById('emailCustomization');
            if (emailCustomization) {
                if (this.dataset.type === 'gmail') {
                    emailCustomization.style.display = 'block';
                } else {
                    emailCustomization.style.display = 'none';
                }
            }
            
            // Auto-save when option is selected
            savePageStyle();
        });
    });
    
    // Check if Gmail is selected on load and show email customization if needed
    const activeOption = document.querySelector('.rename-option.active');
    if (activeOption && activeOption.dataset.type === 'gmail') {
        const emailCustomization = document.getElementById('emailCustomization');
        if (emailCustomization) {
            emailCustomization.style.display = 'block';
        }
    }
    
    // Setup toggles to auto-save on change
    const toggleInputs = document.querySelectorAll('.settings-toggle input');
    toggleInputs.forEach(input => {
        input.addEventListener('change', function() {
            saveSecuritySettings();
        });
    });
    
    // Setup panic key input to save on change
    const panicKeyInput = document.getElementById('panicKeyInput');
    if (panicKeyInput) {
        panicKeyInput.addEventListener('change', function() {
            saveSecuritySettings();
        });
    }
    
    // Setup email customization
    if (applyEmailBtn) {
        applyEmailBtn.addEventListener('click', function() {
            applyCustomEmail();
        });
        
        // Also set up the email inputs with saved values
        const usernameInput = document.getElementById('username');
        const domainInput = document.getElementById('domain');
        
        if (usernameInput && domainInput) {
            usernameInput.value = localStorage.getItem('emailUsername') || '';
            domainInput.value = localStorage.getItem('emailDomain') || 'gmail.com';
        }
    }
}