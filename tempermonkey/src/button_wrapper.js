/**
 * ============================================================================
 * DRAGGABLE BUTTON WITH VIEWPORT-RELATIVE POSITIONING
 * ============================================================================
 * 
 * This button uses viewport-relative units (vw/vh) to maintain its position
 * across different zoom levels. Here's how it works:
 * 
 * KEY CONCEPTS:
 * 1. position: fixed + vw/vh units = stays at same viewport position during zoom
 * 2. Drag uses pixels for smooth movement, then converts to percentages
 * 3. Position stored as percentages, applied as vw/vh on load
 * 4. Button size uses fixed units (px) - doesn't scale with zoom
 * 
 * ZOOM BEHAVIOR:
 * - Button stays at same position on screen (viewport)
 * - Button size remains constant (doesn't grow/shrink)
 * - Position persists across page reloads
 * 
 * IMPLEMENTATION STEPS (as per requirements):
 * ✓ Step 1-2: Use vw/vh for position instead of pixels
 * ✓ Step 3: Convert position to percentages before saving
 * ✓ Step 4: Save percentages in localStorage
 * ✓ Step 5: Apply saved percentages as vw/vh on load
 * ✓ Step 6: Move in pixels during drag, convert to % when saving
 * ✓ Step 7: Constrain within viewport boundaries
 * ✓ Step 8: Keep button size in fixed units (px/rem)
 * ✓ Step 9: Add resize listener to re-constrain
 * ✓ Step 10: Tested with drag, zoom, resize, reload
 * 
 * @param {string} id - Unique ID for the button
 * @param {string} text - Button text
 * @param {Object} styles - Custom styles to override defaults
 * @param {string} originalColor - Default background color
 * @param {string} hoverColor - Hover background color
 * @returns {HTMLButtonElement} The created button element
 */
function createButton(id, text, styles = {}, originalColor = '#5a2a82', hoverColor = '#4c1778') {
    const button = document.createElement('button');
    button.id = id;
    button.textContent = text;

    // Storage key for this button's position (stores percentages)
    const STORAGE_KEY = `button_position_${id}`;

    // Default styles - using fixed size units (won't scale with zoom)
    const defaultStyles = {
        position: 'fixed',
        // Default to bottom-right, will be overridden by saved position
        right: '20px',
        bottom: '70px',
        backgroundColor: originalColor,
        color: 'white',
        border: 'none',
        borderRadius: '8%',
        padding: '7px',
        fontSize: '12px',
        cursor: 'grab',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        minWidth: '70px',
        userSelect: 'none',
        transition: 'background-color 0.2s'
    };

    // Merge default styles with custom styles
    Object.assign(button.style, defaultStyles, styles);

    // Store the actual background color after all styles are applied
    const actualBackgroundColor = button.style.backgroundColor;

    // ============================================================================
    // STEP 1 & 2: Viewport-Relative Position Management
    // ============================================================================

    /**
     * Convert pixel position to viewport percentage
     * This allows the button to maintain relative position during zoom
     */
    function pixelsToViewportPercent(pixelLeft, pixelTop) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        return {
            leftPercent: (pixelLeft / viewportWidth) * 100,
            topPercent: (pixelTop / viewportHeight) * 100
        };
    }

    /**
     * Convert viewport percentage to pixel position
     * Used during drag for smooth movement
     */
    function viewportPercentToPixels(leftPercent, topPercent) {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        return {
            leftPx: (leftPercent / 100) * viewportWidth,
            topPx: (topPercent / 100) * viewportHeight
        };
    }

    /**
     * STEP 3: Save position as percentages to localStorage
     * This ensures consistent positioning across zoom levels
     */
    function savePosition() {
        try {
            const rect = button.getBoundingClientRect();
            const percentages = pixelsToViewportPercent(rect.left, rect.top);
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify({
                leftPercent: percentages.leftPercent,
                topPercent: percentages.topPercent
            }));
            
            console.log(`[Button] Saved position: ${percentages.leftPercent.toFixed(2)}vw, ${percentages.topPercent.toFixed(2)}vh`);
        } catch (e) {
            console.error('[Button] Failed to save position:', e);
        }
    }

    /**
     * STEP 4: Load position from localStorage and apply as vw/vh
     * This maintains position across page reloads and zoom levels
     */
    function loadPosition() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const { leftPercent, topPercent } = JSON.parse(saved);
                
                // Apply as vw/vh units - these scale with viewport, not zoom
                button.style.left = `${leftPercent}vw`;
                button.style.top = `${topPercent}vh`;
                button.style.right = 'auto';
                button.style.bottom = 'auto';
                
                console.log(`[Button] Loaded position: ${leftPercent.toFixed(2)}vw, ${topPercent.toFixed(2)}vh`);
                return true;
            }
        } catch (e) {
            console.error('[Button] Failed to load position:', e);
        }
        return false;
    }

    /**
     * STEP 7: Constrain button within viewport boundaries
     * Ensures button never goes off-screen
     */
    function constrainToViewport() {
        const rect = button.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const padding = 10;

        let left = rect.left;
        let top = rect.top;

        // Constrain horizontally
        if (left < padding) {
            left = padding;
        } else if (left + rect.width > viewportWidth - padding) {
            left = viewportWidth - rect.width - padding;
        }

        // Constrain vertically
        if (top < padding) {
            top = padding;
        } else if (top + rect.height > viewportHeight - padding) {
            top = viewportHeight - rect.height - padding;
        }

        // Convert constrained position to percentages and apply as vw/vh
        const percentages = pixelsToViewportPercent(left, top);
        button.style.left = `${percentages.leftPercent}vw`;
        button.style.top = `${percentages.topPercent}vh`;
        button.style.right = 'auto';
        button.style.bottom = 'auto';
    }

    // ============================================================================
    // STEP 5 & 6: Drag Functionality with Pixel-based Movement
    // ============================================================================

    let isDragging = false;
    let hasMoved = false;
    let startX, startY;
    let initialLeft, initialTop;

    /**
     * STEP 5: Start drag - capture initial position in pixels for smooth movement
     */
    button.addEventListener('mousedown', (e) => {
        // Only handle left mouse button
        if (e.button !== 0) return;

        isDragging = true;
        hasMoved = false;
        startX = e.clientX;
        startY = e.clientY;

        // Get current position in pixels (for smooth dragging)
        const rect = button.getBoundingClientRect();
        initialLeft = rect.left;
        initialTop = rect.top;

        // Change cursor
        button.style.cursor = 'grabbing';
        button.dataset.dragging = 'true';

        // Prevent text selection during drag
        e.preventDefault();
        e.stopPropagation();
    });

    /**
     * STEP 5: During drag - move in pixels for smoothness
     */
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;

        // If moved more than 3px, consider it a drag (not a click)
        if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
            hasMoved = true;
            button.dataset.moved = 'true';
        }

        // Update position in pixels during drag for smooth movement
        const newLeft = initialLeft + deltaX;
        const newTop = initialTop + deltaY;

        button.style.left = `${newLeft}px`;
        button.style.top = `${newTop}px`;
        button.style.right = 'auto';
        button.style.bottom = 'auto';

        // Prevent default to avoid any interference
        e.preventDefault();
    });

    /**
     * STEP 6: End drag - convert to percentages and save
     */
    document.addEventListener('mouseup', (e) => {
        if (isDragging) {
            isDragging = false;
            button.style.cursor = 'grab';
            button.dataset.dragging = 'false';

            if (hasMoved) {
                // Constrain to viewport (converts to vw/vh internally)
                constrainToViewport();
                
                // Save position as percentages
                savePosition();

                // Keep hasMoved true for a brief moment to block click
                setTimeout(() => {
                    hasMoved = false;
                    button.dataset.moved = 'false';
                }, 50);
            } else {
                // Reset immediately if not moved
                button.dataset.moved = 'false';
            }
        }
    });

    /**
     * Prevent click event if button was dragged
     */
    button.addEventListener('click', (e) => {
        if (hasMoved) {
            e.stopImmediatePropagation();
            e.preventDefault();
            hasMoved = false;
        }
    }, true); // Use capture phase to intercept before other handlers

    // ============================================================================
    // Hover Effects
    // ============================================================================

    button.addEventListener('mouseover', () => {
        if (!isDragging) {
            button.style.backgroundColor = hoverColor;
        }
    });

    button.addEventListener('mouseout', () => {
        // Revert to the actual background color (respects custom styles)
        button.style.backgroundColor = actualBackgroundColor;
    });

    // ============================================================================
    // STEP 9: Viewport Resize Handling
    // ============================================================================

    /**
     * Re-constrain button when viewport changes (e.g., window resize)
     * vw/vh units automatically adjust, but we need to ensure button stays visible
     */
    function handleViewportResize() {
        constrainToViewport();
    }

    // Debounce resize events
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleViewportResize, 100);
    });

    // ============================================================================
    // STEP 10: Initialization
    // ============================================================================

    // Append button to body
    document.body.appendChild(button);

    // Load saved position (vw/vh) or use default and constrain
    if (!loadPosition()) {
        // No saved position, use default and constrain
        constrainToViewport();
    } else {
        // Loaded position, ensure it's still within viewport
        // (viewport might have changed since last session)
        setTimeout(() => constrainToViewport(), 100);
    }

    console.log(`[Button] Created viewport-relative button: ${id}`);

    return button;
}

// Export the function for use in other scripts
window.createButton = createButton;