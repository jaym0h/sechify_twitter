(() => {
    const numImages = 78;
    const imageAlts = ['Image', 'Embedded video'];  // Image alt tags to look for

    // See whether overlays are enabled
    chrome.storage.local.get(['overlayEnabled'], (result) => {
        // Param @result - an object that contains data retreived from chrome.storage.local.get
        // overlayEnabled - an attribute of result

        const enabled = result.overlayEnabled !== false;    // default = true if not set
        const opacity = enabled ? '1': '0';

        // Apply new thumbnails
        function changeThumbnail(thumbnail, overlayURL) {
            // Create overlay image
            const overlay = document.createElement('img');
            overlay.src = overlayURL;
            overlay.style.position = 'absolute';
            overlay.style.top = overlay.style.left = '0';
            overlay.style.width = overlay.style.width = '100%';
            overlay.style.zIndex = '0';
            overlay.style.opacity = opacity;
            
            thumbnail.parentElement.appendChild(overlay);
        }

        // Get random image index
        function getRandomImageIndex() {
            return Math.floor(Math.random() * (numImages) + 1);
        }

        // Get URL of the overlay image
        function getOverlayURL(index) {
            return chrome.runtime.getURL(`assets/images/${index}.PNG`);
        }

        // Function call whenever a page load is observed
        const callback = function(mutationsList) {
            if(enabled) {
                // Loop through lists of nodes that were added on update (this helps us check for child nodes)
                for(const { addedNodes } of mutationsList) {
                    // Check each individual node added
                    for(const node of addedNodes) {
                        if(!node.tagName) continue; // Skip if node is not a page element

                        // Look for images and add a random Sechi onto them
                        if(node.tagName === 'IMG' && imageAlts.includes(node.alt)) {
                            const index = getRandomImageIndex();

                            // Get URL of random image
                            let overlayURL = getOverlayURL(index);
                            changeThumbnail(node, overlayURL);
                        }
                    }
                }
            }
        };

        // Observe the entire body of the document for changes
        const observer = new MutationObserver(callback);
        observer.observe(document.body, {
            // Types of mutations to observe (changes to the site)
            childList: true,
            subtree: true,
        });

        callback();
    });
})();