// open the link in the target host of the selected text with a small icon
(function () {
    console.log("openlink.js loaded");

    const TARGET_HOST = 'https://example.com';

    // Update the elment tag pre.font-size to 15px
    const preElements = document.querySelectorAll('pre');
    preElements.forEach(pre => {
        pre.style.fontSize = '15px';
    }
    );

    let selectionIcon = null;
    let currentSelectedText = '';

    function createSelectionIcon() {
        const icon = document.createElement('div');
        icon.innerHTML = '🔗'; // Link emoji as icon
        icon.style.cssText = `
            position: absolute;
            background: #333;
            color: white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            transition: all 0.2s ease;
        `;

        icon.addEventListener('mouseenter', function () {
            icon.style.transform = 'scale(1.1)';
        });

        icon.addEventListener('mouseleave', function () {
            icon.style.transform = 'scale(1)';
        });

        return icon;
    }

    function removeSelectionIcon() {
        if (selectionIcon) {
            selectionIcon.remove();
            selectionIcon = null;
            currentSelectedText = '';
        }
    }

    function selectWordTillSpaces(event) {
        const target = event.target;

        // Only work on text nodes or elements that contain text
        if (target.nodeType !== Node.TEXT_NODE && !target.textContent) {
            return;
        }

        // Get the text content and click position
        let textNode = target;
        let textContent = target.textContent || target.innerText || '';
        let clickOffset = 0;

        // If clicked on an element, find the text node and offset
        if (target.nodeType !== Node.TEXT_NODE) {
            const range = document.caretRangeFromPoint(event.clientX, event.clientY);
            if (range) {
                textNode = range.startContainer;
                textContent = textNode.textContent || '';
                clickOffset = range.startOffset;
            } else {
                return;
            }
        } else {
            // For text nodes, we need to calculate the offset
            const range = document.caretRangeFromPoint(event.clientX, event.clientY);
            if (range) {
                clickOffset = range.startOffset;
            }
        }

        if (!textContent) return;

        // Find word boundaries (spaces, tabs, newlines, or quotations)
        let startIndex = clickOffset;
        let endIndex = clickOffset;

        // Move backward to find start of word (or start of text)
        while (startIndex > 0 &&
            textContent[startIndex - 1] !== ' ' &&
            textContent[startIndex - 1] !== '\t' &&
            textContent[startIndex - 1] !== '\n' &&
            textContent[startIndex - 1] !== '"' &&
            textContent[startIndex - 1] !== "'") {
            startIndex--;
        }

        // Move forward to find end of word (or end of text)
        while (endIndex < textContent.length &&
            textContent[endIndex] !== ' ' &&
            textContent[endIndex] !== '\t' &&
            textContent[endIndex] !== '\n' &&
            textContent[endIndex] !== '"' &&
            textContent[endIndex] !== "'") {
            endIndex++;
        }

        // Create selection if we found a word
        if (startIndex < endIndex) {
            const selection = window.getSelection();
            const range = document.createRange();

            try {
                range.setStart(textNode, startIndex);
                range.setEnd(textNode, endIndex);
                selection.removeAllRanges();
                selection.addRange(range);

                const selectedWord = textContent.substring(startIndex, endIndex);
                console.log('Double-click selected word:', `"${selectedWord}"`);

                // Trigger selection handling after a small delay
                setTimeout(handleSelection, 10);
            } catch (e) {
                console.log('Selection failed:', e);
            }
        }
    }

    function positionIcon(selection) {
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();

            // Detect selection direction by comparing focus and anchor nodes
            let isSelectionReversed = false;
            if (selection.anchorNode && selection.focusNode) {
                const position = selection.anchorNode.compareDocumentPosition(selection.focusNode);
                if (position & Node.DOCUMENT_POSITION_PRECEDING) {
                    // Focus is before anchor - selection is reversed (right to left)
                    isSelectionReversed = true;
                } else if (selection.anchorNode === selection.focusNode) {
                    // Same node, compare offsets
                    isSelectionReversed = selection.anchorOffset > selection.focusOffset;
                }
            }

            let x, y;

            if (isSelectionReversed) {
                // Selection was made right to left, position icon at left side
                x = rect.left + window.scrollX - 30; // 30px to the left
                y = rect.top + window.scrollY - 5;
                console.log('Selection direction: Right to Left');
            } else {
                // Selection was made left to right, position icon at right side
                x = rect.right + window.scrollX + 5; // 5px to the right
                y = rect.top + window.scrollY - 5;
                console.log('Selection direction: Left to Right');
            }

            selectionIcon.style.left = x + 'px';
            selectionIcon.style.top = y + 'px';
        }
    }

    function handleSelection() {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();

        // Remove existing icon
        removeSelectionIcon();

        if (selectedText) {
            // Check constraints before showing icon

            // 1. Check if selection contains newlines (multiple lines)
            if (selectedText.includes('\n') || selectedText.includes('\r')) {
                console.log('Multi-line selection detected, not showing icon');
                return;
            }

            // 2. Check if there are spaces in the text
            if (selectedText.includes(' ')) {
                console.log('Text contains spaces, not showing icon');
                return;
            }

            // 3. Check if text contains forward slash (/)
            if (!selectedText.includes('/')) {
                console.log('Text does not contain "/", not showing icon');
                return;
            }

            // 4. shouldn't start with ./
            if (selectedText.startsWith('./')) {
                console.log('Text start with "./", not showing icon');
                return;
            }

            // 5. If only start with / or http
            if (!selectedText.startsWith('/') && !selectedText.startsWith('http')) {
                // Allow if text contains a slash even if it doesn't start with /
                if (!selectedText.includes('/')) {
                    console.log('Text does not start with "/" or "http" and does not contain "/", not showing icon');
                    return;
                }
            }

            // Store the selected text (already trimmed)
            currentSelectedText = selectedText;
            console.log('Text selected:', `"${currentSelectedText}"`); // Debug log with quotes to see spaces

            // Create and position new icon
            selectionIcon = createSelectionIcon();
            document.body.appendChild(selectionIcon);
            positionIcon(selection);

            // Add click handler to icon using mousedown for better reliability
            selectionIcon.addEventListener('mousedown', function (event) {
                event.preventDefault();
                event.stopPropagation();
                // Trim again to be absolutely sure
                const trimmedText = currentSelectedText.trim();
                console.log('Icon clicked, opening:', `"${trimmedText}"`); // Debug log with quotes

                let targetUrl;
                // Check if the text is already a complete URL
                if (trimmedText.startsWith('http://') || trimmedText.startsWith('https://')) {
                    targetUrl = trimmedText;
                    console.log('Using direct URL:', targetUrl);
                } else if (trimmedText.startsWith('/')) {
                    // Absolute path - use as is with TARGET_HOST
                    targetUrl = `${TARGET_HOST}${trimmedText}`;
                    console.log('Using absolute path with target host:', targetUrl);
                } else {
                    // Relative path - merge with current directory
                    const currentPath = window.location.pathname;
                    const currentDir = currentPath.endsWith('/') ? currentPath : currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
                    const fullPath = currentDir + trimmedText;
                    targetUrl = `${TARGET_HOST}${fullPath}`;
                    console.log('Using relative path merged with current dir (target host):', targetUrl);
                }

                window.open(targetUrl, '_blank');
                removeSelectionIcon();
            });

            // Also add click handler as backup
            selectionIcon.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
                console.log('Icon click event triggered'); // Debug log
            });

            // Mark the icon to identify it in other event handlers
            selectionIcon.setAttribute('data-selection-icon', 'true');
        }
    }

    function openLinkToHost() {
        // Handle double-click to select word till spaces
        document.addEventListener('dblclick', selectWordTillSpaces);

        // Handle text selection
        document.addEventListener('mouseup', function (event) {
            // Small delay to ensure selection is complete
            setTimeout(handleSelection, 10);
        });

        // Handle keyboard selection (Shift+arrows, Ctrl+A, etc.)
        document.addEventListener('keyup', function (event) {
            if (event.shiftKey || event.key === 'ArrowLeft' || event.key === 'ArrowRight' ||
                event.key === 'ArrowUp' || event.key === 'ArrowDown' ||
                (event.ctrlKey && event.key === 'a')) {
                setTimeout(handleSelection, 10);
            }
        });

        // Remove icon when clicking elsewhere (use mousedown to avoid conflicts)
        document.addEventListener('mousedown', function (event) {
            // Don't remove if clicking on the icon itself
            if (selectionIcon && event.target !== selectionIcon && !selectionIcon.contains(event.target)) {
                // Add a small delay to let the icon's mousedown handler execute first
                setTimeout(function () {
                    if (selectionIcon) { // Check if still exists
                        removeSelectionIcon();
                    }
                }, 1);
            }
        });

        // Remove icon when selection changes
        document.addEventListener('selectionchange', function () {
            const selection = window.getSelection();
            if (selection.toString().trim() === '') {
                removeSelectionIcon();
            }
        });

        // Keep middle-click functionality as backup
        document.addEventListener('mouseup', function (event) {
            if (event.button === 1) { // Middle mouse button
                const selectedText = window.getSelection().toString().trim();
                if (selectedText) {
                    let targetUrl;
                    // Check if the text is already a complete URL
                    if (selectedText.startsWith('http://') || selectedText.startsWith('https://')) {
                        targetUrl = selectedText;
                    } else if (selectedText.startsWith('/')) {
                        // Absolute path - use as is with TARGET_HOST
                        targetUrl = `${TARGET_HOST}${selectedText}`;
                    } else {
                        // Relative path - merge with current directory
                        const currentPath = window.location.pathname;
                        const currentDir = currentPath.endsWith('/') ? currentPath : currentPath.substring(0, currentPath.lastIndexOf('/') + 1);
                        const fullPath = currentDir + selectedText;
                        targetUrl = `${TARGET_HOST}${fullPath}`;
                    }
                    window.open(targetUrl, '_blank');
                }
            }
        });
    }

    openLinkToHost();
})();