(function () {
    'use strict';

    console.log('[Entry] Script loaded');

    // ============================================================================
    // Utility Functions
    // ============================================================================

    /**
     * Load a local file using GM_xmlhttpRequest and execute it
     * @param {string} filePath - Full path to the file (e.g., file:///C:/path/to/file.js)
     * @returns {Promise<void>} Promise that resolves when script is loaded and executed
     */
    function loadLocalScript(filePath) {
        return new Promise((resolve, reject) => {
            const fileName = filePath.split('/').pop();

            GM_xmlhttpRequest({
                method: 'GET',
                url: filePath,
                onload: function (response) {
                    if (response.status === 200 || response.status === 0) { // 0 for local files
                        try {
                            eval(response.responseText);
                            console.log(`[Entry] ✓ Loaded: ${fileName}`);
                            resolve();
                        } catch (error) {
                            console.error(`[Entry] ✗ Error executing ${fileName}:`, error);
                            reject(error);
                        }
                    } else {
                        const error = new Error(`HTTP ${response.status}: ${fileName}`);
                        console.error(`[Entry] ✗ ${error.message}`);
                        reject(error);
                    }
                },
                onerror: function (error) {
                    console.error(`[Entry] ✗ Failed to load ${fileName}:`, error);
                    reject(new Error(`Failed to load ${fileName}`));
                }
            });
        });
    }

    // ============================================================================
    // Determine Script Base URL
    // ============================================================================

    let scriptBase;

    // Check window.scriptBase first (set by template)
    if (window.scriptBase) {
        scriptBase = window.scriptBase;
        console.log('[Entry] Using scriptBase from template:', scriptBase);
    }
    // Fallback: try document.currentScript (won't work with eval)
    else if (document.currentScript && document.currentScript.src) {
        scriptBase = document.currentScript.src.replace(/\/[^\/]*$/, '');
        console.log('[Entry] Calculated scriptBase from currentScript:', scriptBase);
    }
    // No way to determine base URL
    else {
        console.error('[Entry] ✗ Cannot determine script base URL!');
        console.error('[Entry] Make sure template sets window.scriptBase before loading entry.js');
        return; // Exit early - cannot proceed without scriptBase
    }

    // ============================================================================
    // Main Script Loading Logic
    // ============================================================================

    console.log('[Entry] Loading core scripts...');

    // Load core scripts first (always needed)
    Promise.all([
        loadLocalScript(`${scriptBase}/src/request_wrapper.js`),
        loadLocalScript(`${scriptBase}/src/button_wrapper.js`)
    ])
        .then(() => {
            console.log('[Entry] ✓ Core scripts loaded successfully');

            // Load page-specific scripts based on URL
            const url = window.location.href;
            console.log('[Entry] Checking URL for page-specific scripts...');

            if (url.includes('/example/')) {
                console.log('[Entry] Detected Example page');
                return Promise.all([
                    loadLocalScript(`${scriptBase}/src/example.js`),
                    loadLocalScript(`${scriptBase}/src/openlink.js`)
                ]);
            }
            else if (url.includes('/github/') || url.includes('/webserv/')) {
                console.log('[Entry] Detected Github page');
                return loadLocalScript(`${scriptBase}/src/openlink.js`);
            }
            else {
                console.log('[Entry] No page-specific scripts needed for this URL');
                return Promise.resolve();
            }
        })
        .then(() => {
            console.log('[Entry] ✓ All scripts loaded - Initialization complete');
        })
        .catch(error => {
            console.error('[Entry] ✗ Script loading failed:', error);
        });

})();
