/**
 * SGGame Mimicry JS - Tab Cloaking, Security Features, and Site-wide Analytics
 * This script enables tab cloaking, panic button, tab close verification,
 * and Google Analytics across the site.
 * Add this to all pages by including the script in the head section.
 */

function initGoogleAnalytics() {
    window.__sgGaLoaded = false;
}

function getDefaultSiteState() {
    const currentIcon = document.querySelector('link[rel="icon"]')?.href || "/favicon.ico";
    return {
        type: "sggames",
        title: "SG Games",
        icon: currentIcon
    };
}

function applyCloakState(type, title, icon) {
    localStorage.setItem("pageMimicType", type);
    localStorage.setItem("pageMimicTitle", title);
    if (icon) {
        localStorage.setItem("pageMimicIcon", icon);
    } else {
        localStorage.removeItem("pageMimicIcon");
    }

    document.title = title;

    const favicon = document.querySelector('link[rel="icon"]');
    if (icon) {
        if (favicon) {
            favicon.href = icon;
        } else {
            const newFavicon = document.createElement("link");
            newFavicon.rel = "icon";
            newFavicon.href = icon;
            document.head.appendChild(newFavicon);
        }
    }
}

function setTabCloakDecision(enabled) {
    localStorage.setItem("sggamesTabCloakDecision", enabled ? "enabled" : "disabled");

    if (enabled) {
        applyCloakState(
            "gdocs",
            "Untitled document - Google Docs",
            "https://upload.wikimedia.org/wikipedia/commons/1/18/Google_Docs_icon_%282026%29.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
        );
        return;
    }

    const defaultState = getDefaultSiteState();
    applyCloakState(defaultState.type, defaultState.title, defaultState.icon);
}

function showTabCloakPopup() {
    if (document.getElementById("sggamesTabCloakPopup")) return;

    const popup = document.createElement("div");
    popup.id = "sggamesTabCloakPopup";
    popup.style.position = "fixed";
    popup.style.inset = "0";
    popup.style.background = "rgba(10, 14, 23, 0.72)";
    popup.style.display = "flex";
    popup.style.alignItems = "center";
    popup.style.justifyContent = "center";
    popup.style.zIndex = "99999";
    popup.style.backdropFilter = "blur(4px)";
    popup.innerHTML = `
        <div style="max-width: 420px; width: min(90vw, 420px); background: #111827; border: 1px solid rgba(255,255,255,0.12); border-radius: 18px; padding: 1.5rem 1.5rem 1.1rem; box-shadow: 0 18px 45px rgba(0,0,0,0.35); color: white; font-family: Arial, sans-serif; text-align: center;">
            <div style="font-size: 2.1rem; font-weight: 800; letter-spacing: 0.04em; margin-bottom: 0.7rem;">SG Games</div>
            <p style="margin: 0 0 1.25rem; color: rgba(255,255,255,0.8); font-size: 0.98rem; line-height: 1.5;">Click below to activate tab cloaking. Otherwise, the site will stay on the normal SG Games tab.</p>
            <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                <button id="sggamesEnableCloak" style="background: #6653d6; color: white; border: none; border-radius: 10px; padding: 0.82rem 1.2rem; font-weight: 700; cursor: pointer;">Activate Cloak</button>
                <button id="sggamesKeepSite" style="background: transparent; color: #dfe7ff; border: 1px solid rgba(255,255,255,0.18); border-radius: 10px; padding: 0.82rem 1.2rem; font-weight: 700; cursor: pointer;">Keep SG Games</button>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    popup.querySelector("#sggamesEnableCloak").addEventListener("click", function () {
        setTabCloakDecision(true);
        popup.remove();
    });

    popup.querySelector("#sggamesKeepSite").addEventListener("click", function () {
        setTabCloakDecision(false);
        popup.remove();
    });
}

function applySavedMimicry() {
    // Check if there's a saved style and apply it
    let savedType = localStorage.getItem("pageMimicType");
    let savedTitle = localStorage.getItem("pageMimicTitle");
    let savedIcon = localStorage.getItem("pageMimicIcon");
    const cloakDecision = localStorage.getItem("sggamesTabCloakDecision");

    const hasLegacyCloakState = savedType === "gdocs" || /Google Docs|Untitled document/i.test(String(savedTitle || ""));

    if (cloakDecision === null) {
        if (hasLegacyCloakState) {
            localStorage.removeItem("pageMimicType");
            localStorage.removeItem("pageMimicTitle");
            localStorage.removeItem("pageMimicIcon");
            savedType = null;
            savedTitle = null;
            savedIcon = null;
        }

        const defaultState = getDefaultSiteState();
        if (cloakDecision === "enabled") {
            applyCloakState(
                "gdocs",
                "Untitled document - Google Docs",
                "https://upload.wikimedia.org/wikipedia/commons/1/18/Google_Docs_icon_%282026%29.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original"
            );
        } else {
            applyCloakState(defaultState.type, defaultState.title, defaultState.icon);
        }
        savedType = localStorage.getItem("pageMimicType");
        savedTitle = localStorage.getItem("pageMimicTitle");
        savedIcon = localStorage.getItem("pageMimicIcon");
    }

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
            const newFavicon = document.createElement("link");
            newFavicon.rel = "icon";
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
    document.removeEventListener("keydown", handlePanicKey);

    // Only add listener if panic button is enabled
    const panicEnabled = localStorage.getItem("panicEnabled") !== "false"; // Default to true
    if (panicEnabled) {
        document.addEventListener("keydown", handlePanicKey);
    }
}

function getPanicRedirectUrl() {
    const savedRedirectUrl = (localStorage.getItem("panicRedirectUrl") || "").trim();
    if (!savedRedirectUrl) {
        return "https://www.google.com";
    }

    if (/^https?:\/\//i.test(savedRedirectUrl)) {
        return savedRedirectUrl;
    }

    return `https://${savedRedirectUrl}`;
}

function handlePanicKey(event) {
    const panicKey = localStorage.getItem("panicKey") || "[";
    if (event.key === panicKey) {
        // Set a flag that this is a panic activation so verification can be bypassed
        sessionStorage.setItem("panicActivation", "true");

        // Redirect to the configured panic URL immediately
        window.location.href = getPanicRedirectUrl();
    }
}

function initTabClosePrevention() {
    const verificationEnabled = localStorage.getItem("verificationEnabled") === "true";

    // Remove any existing event listener
    window.onbeforeunload = null;

    if (verificationEnabled) {
        window.onbeforeunload = function () {
            // Check if this is a panic button activation
            const isPanicActivation = sessionStorage.getItem("panicActivation") === "true";
            if (isPanicActivation) {
                // Clear the flag and allow the navigation
                sessionStorage.removeItem("panicActivation");
                return undefined;
            }

            // Otherwise show the confirmation dialog
            return "Are you sure you want to leave this page?";
        };
    }
}

function loadSavedSettings() {
    // Tab cloaking settings
    const savedType = localStorage.getItem("pageMimicType") || "gdocs";

    if (savedType) {
        // Highlight the correct option in the modal
        const options = document.querySelectorAll(".rename-option");
        options.forEach((opt) => {
            if (opt.dataset.type === savedType) {
                opt.classList.add("active");
            } else {
                opt.classList.remove("active");
            }
        });
    }

    // Security settings
    const verificationToggle = document.getElementById("verificationToggle");
    const panicButtonToggle = document.getElementById("panicButtonToggle");
    const panicKeyInput = document.getElementById("panicKeyInput");
    const panicRedirectInput = document.getElementById("panicRedirectInput");

    if (verificationToggle) {
        const verificationEnabled = localStorage.getItem("verificationEnabled") === "true";
        verificationToggle.checked = verificationEnabled;
    }

    if (panicButtonToggle) {
        const panicEnabled = localStorage.getItem("panicEnabled") !== "false"; // Default to true
        panicButtonToggle.checked = panicEnabled;
    }

    if (panicKeyInput) {
        const panicKey = localStorage.getItem("panicKey") || "[";
        panicKeyInput.value = panicKey;
    }

    if (panicRedirectInput) {
        panicRedirectInput.value = localStorage.getItem("panicRedirectUrl") || "https://www.google.com";
    }

    // Email customization settings
    const usernameInput = document.getElementById("username");
    const domainInput = document.getElementById("domain");

    if (usernameInput && domainInput) {
        usernameInput.value = localStorage.getItem("emailUsername") || "";
        domainInput.value = localStorage.getItem("emailDomain") || "gmail.com";
    }
}

function savePageStyle() {
    const selectedOption = document.querySelector(".rename-option.active");
    if (selectedOption) {
        const pageType = selectedOption.dataset.type;
        let pageTitle = selectedOption.dataset.title;
        const pageIcon = selectedOption.dataset.icon;

        // If this is a Gmail type and we have a custom email, use it
        if (pageType === "gmail") {
            const username = localStorage.getItem("emailUsername");
            const domain = localStorage.getItem("emailDomain");

            if (username && domain) {
                pageTitle = `Inbox - ${username}@${domain} - Gmail`;
            }
        }

        // Save preferences to localStorage
        localStorage.setItem("pageMimicType", pageType);
        localStorage.setItem("pageMimicTitle", pageTitle);
        localStorage.setItem("pageMimicIcon", pageIcon);

        // Apply changes immediately
        document.title = pageTitle;
        const favicon = document.querySelector('link[rel="icon"]');
        if (favicon) {
            favicon.href = pageIcon;
        } else {
            // Create favicon if it doesn't exist
            const newFavicon = document.createElement("link");
            newFavicon.rel = "icon";
            newFavicon.href = pageIcon;
            document.head.appendChild(newFavicon);
        }
    }
}

function applyCustomEmail() {
    const usernameInput = document.getElementById("username");
    const domainInput = document.getElementById("domain");

    if (usernameInput && domainInput) {
        const username = usernameInput.value.trim();
        const domain = domainInput.value.trim() || "gmail.com";

        // Save to localStorage
        localStorage.setItem("emailUsername", username);
        localStorage.setItem("emailDomain", domain);

        // If Gmail is currently selected, update the title immediately
        const selectedOption = document.querySelector(".rename-option.active");
        if (selectedOption && selectedOption.dataset.type === "gmail") {
            const newTitle = `Inbox - ${username}@${domain} - Gmail`;
            document.title = newTitle;
            localStorage.setItem("pageMimicTitle", newTitle);
        }

        // Show brief feedback
        const applyButton = document.querySelector(".apply-email");
        if (applyButton) {
            const originalText = applyButton.textContent;
            applyButton.textContent = "Saved!";
            applyButton.style.backgroundColor = "#4CAF50";

            // Reset after a short delay
            setTimeout(() => {
                applyButton.textContent = originalText;
                applyButton.style.backgroundColor = "";
            }, 1500);
        }
    }
}

function saveSecuritySettings() {
    const verificationToggle = document.getElementById("verificationToggle");
    const panicButtonToggle = document.getElementById("panicButtonToggle");
    const panicKeyInput = document.getElementById("panicKeyInput");
    const panicRedirectInput = document.getElementById("panicRedirectInput");

    if (verificationToggle) {
        localStorage.setItem("verificationEnabled", verificationToggle.checked);
    }

    if (panicButtonToggle) {
        localStorage.setItem("panicEnabled", panicButtonToggle.checked);
    }

    if (panicKeyInput && panicKeyInput.value) {
        localStorage.setItem("panicKey", panicKeyInput.value);
    }

    if (panicRedirectInput) {
        const panicRedirectUrl = (panicRedirectInput.value || "").trim();
        if (panicRedirectUrl) {
            const normalizedRedirectUrl = /^https?:\/\//i.test(panicRedirectUrl)
                ? panicRedirectUrl
                : `https://${panicRedirectUrl}`;
            localStorage.setItem("panicRedirectUrl", normalizedRedirectUrl);
            panicRedirectInput.value = normalizedRedirectUrl;
        } else {
            localStorage.removeItem("panicRedirectUrl");
            panicRedirectInput.value = "https://www.google.com";
        }
    }

    // Reinitialize security features with new settings
    initSecurityFeatures();
}

function saveAllSettings() {
    savePageStyle();
    saveSecuritySettings();
}

function showSavedFeedback() {
    let feedbackEl = document.getElementById("savedFeedback");

    if (!feedbackEl) {
        feedbackEl = document.createElement("div");
        feedbackEl.id = "savedFeedback";
        feedbackEl.className = "sg-saved-feedback";
        feedbackEl.textContent = "Settings saved!";
        document.body.appendChild(feedbackEl);
    }

    feedbackEl.classList.add("visible");
    window.clearTimeout(window.__sgSavedFeedbackTimer);
    window.__sgSavedFeedbackTimer = window.setTimeout(() => {
        feedbackEl.classList.remove("visible");
    }, 1500);
}

document.addEventListener("DOMContentLoaded", function () {
    // Start analytics site-wide
    initGoogleAnalytics();

    // Apply any saved mimicry settings immediately
    applySavedMimicry();

    const cloakDecision = localStorage.getItem("sggamesTabCloakDecision");
    if (cloakDecision === null) {
        showTabCloakPopup();
    }

    // Set up the settings button and modal if they exist on this page
    setupSettingsModal();

    // Set up the standalone /settings/ page if present
    setupStandaloneSettingsPage();
});

function setupSettingsModal() {
    // Get elements
    const settingsButton = document.querySelector(".settings-button");
    const settingsModal = document.getElementById("settingsModal");
    const closeModalBtn = document.querySelector(".close-modal");
    const closeSettingsBtn = document.querySelector(".close-settings");
    const applyEmailBtn = document.querySelector(".apply-email");

    if (!settingsButton || !settingsModal) return; // Not all pages may have the settings modal

    // Open settings modal
    settingsButton.addEventListener("click", function () {
        settingsModal.style.display = "flex";
        loadSavedSettings();
    });

    // Close settings modal via X button
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", function () {
            settingsModal.style.display = "none";
        });
    }

    // Close settings modal via "Close" button
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener("click", function () {
            saveAllSettings();
            settingsModal.style.display = "none";
        });
    }

    // Close settings modal when clicking outside
    window.addEventListener("click", function (event) {
        if (event.target === settingsModal) {
            settingsModal.style.display = "none";
        }
    });

    // Setup rename options
    const renameOptions = document.querySelectorAll(".rename-option");
    renameOptions.forEach((option) => {
        option.addEventListener("click", function () {
            // Remove active class from all options
            renameOptions.forEach((opt) => opt.classList.remove("active"));

            // Add active class to clicked option
            this.classList.add("active");

            // Show/hide email customization if Gmail is selected
            const emailCustomization = document.getElementById("emailCustomization");
            if (emailCustomization) {
                if (this.dataset.type === "gmail") {
                    emailCustomization.style.display = "block";
                } else {
                    emailCustomization.style.display = "none";
                }
            }

            // Auto-save when option is selected
            savePageStyle();
        });
    });

    // Check if Gmail is selected on load and show email customization if needed
    const activeOption = document.querySelector(".rename-option.active");
    if (activeOption && activeOption.dataset.type === "gmail") {
        const emailCustomization = document.getElementById("emailCustomization");
        if (emailCustomization) {
            emailCustomization.style.display = "block";
        }
    }

    // Setup toggles to auto-save on change
    const toggleInputs = document.querySelectorAll(".settings-toggle input");
    toggleInputs.forEach((input) => {
        input.addEventListener("change", function () {
            saveSecuritySettings();
        });
    });

    // Setup panic key input to save on change
    const panicKeyInput = document.getElementById("panicKeyInput");
    if (panicKeyInput) {
        panicKeyInput.addEventListener("change", function () {
            saveSecuritySettings();
        });
    }

    const panicRedirectInput = document.getElementById("panicRedirectInput");
    if (panicRedirectInput) {
        panicRedirectInput.addEventListener("change", function () {
            saveSecuritySettings();
        });
    }

    // Setup email customization
    if (applyEmailBtn) {
        applyEmailBtn.addEventListener("click", function () {
            applyCustomEmail();
        });

        // Also set up the email inputs with saved values
        const usernameInput = document.getElementById("username");
        const domainInput = document.getElementById("domain");

        if (usernameInput && domainInput) {
            usernameInput.value = localStorage.getItem("emailUsername") || "";
            domainInput.value = localStorage.getItem("emailDomain") || "gmail.com";
        }
    }
}

function setupStandaloneSettingsPage() {
    const settingsPage = document.querySelector("[data-sg-settings-page]");
    if (!settingsPage) return;

    loadSavedSettings();

    const savedType = localStorage.getItem("pageMimicType") || "gdocs";
    const emailCustomization = document.getElementById("emailCustomization");
    if (emailCustomization) {
        emailCustomization.style.display = savedType === "gmail" ? "block" : "none";
    }

    const renameOptions = document.querySelectorAll(".rename-option");
    renameOptions.forEach((option) => {
        option.addEventListener("click", function () {
            renameOptions.forEach((opt) => opt.classList.remove("active"));
            this.classList.add("active");

            if (emailCustomization) {
                emailCustomization.style.display = this.dataset.type === "gmail" ? "block" : "none";
            }

            savePageStyle();
            showSavedFeedback();
        });
    });

    document.querySelector(".apply-email")?.addEventListener("click", function () {
        applyCustomEmail();
        showSavedFeedback();
    });

    ["username", "domain"].forEach((id) => {
        document.getElementById(id)?.addEventListener("keydown", function (event) {
            if (event.key !== "Enter") return;
            event.preventDefault();
            applyCustomEmail();
            showSavedFeedback();
        });
    });

    document.querySelectorAll(".toggle-switch input, .settings-toggle input").forEach((input) => {
        input.addEventListener("change", function () {
            saveSecuritySettings();
            showSavedFeedback();
        });
    });

    ["panicKeyInput", "panicRedirectInput"].forEach((id) => {
        document.getElementById(id)?.addEventListener("change", function () {
            saveSecuritySettings();
            showSavedFeedback();
        });
    });
}
