document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggle-overlay');

    // Initialize button text based on stored state
    chrome.storage.local.get(['overlayEnabled'], (result) => {
        const enabled = result.overlayEnabled !== false; // default to true if not set
        toggleButton.textContent = enabled ? 'Disable Overlays' : 'Enable Overlays';
    });

    // Add click event listener to the toggle button
    toggleButton.addEventListener('click', () => {
        chrome.storage.local.get(['overlayEnabled'], (result) => {
            //Two variables - past and present after click
            const enabled = result.overlayEnabled !== false;
            const newEnabledState = !enabled;

            // Changes overlayEnabled variable to newEnabledState
            chrome.storage.local.set({overlayEnabled: newEnabledState}, () => {
                // Change button based on enabled state
                toggleButton.textContent = newEnabledState ? 'Disable Overlays' : 'Enable Overlays';

                // Reload Twitter page to apply changes
                chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
                    chrome.tabs.reload(tabs[0].id);
                });
            });
        });
    });
});