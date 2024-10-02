(() => {
    const numImages = 1;

    // See whether overlays are enabled
    chrome.storage.local.get(['overlayEnabled'], (result) => {
        // Param @result - an object that contains data retreived from chrome.storage.local.get
        // overlayEnabled - an attribute of result

        const enabled = result.overlayEnabled !== false;    // default = true if not set
        const opacity = enabled ? '1': '0';

        // Grab all Twitter images
        function getThumbnails() {
            const thumbnails = document.getElementsByTagName('img');

            // Loop through thumbnails, get index, get url, send over to merge to image
            thumbnails.forEach((thumbnail) => {
                const index = getRandomImageIndex();

                // Get URL of random image
                let overlayURL = getOverlayURL(index);
                changeThumbnail(thumbnail, overlayURL);
            });
        }

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
            return chrome.runtime.getURL(`assets/images/${index}.png`);
        }

        // Observe the entire body of the document for changes
        const observer = new MutationObserver(() => {
            getThumbnails();
        });
        observer.observe(document.body, {
            // Types of mutations to observe (changes to the site)
            childList: true,
            subtree: true,
        });

        // Initial call to set thumbnails on page load
        getThumbnails();
    });
})();