# Tampermonkey Modular Script System

## Overview

A sophisticated Tampermonkey userscript architecture that supports:
- **Dual deployment modes**: Local file development & server-based production
- **Dynamic module loading**: Load scripts on-demand without explicit `@resource` declarations
- **Modular design**: Reusable wrappers for buttons and HTTP requests
- **Smart routing**: URL-based conditional script loading
- **Persistent UI**: Draggable buttons with saved positions

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Template (User Choice)                       │
├─────────────────────────────┬───────────────────────────────────┤
│   template_file.js          │   template_server.js              │
│   (Local Development)       │   (Server Deployment)             │
└──────────────┬──────────────┴────────────────┬──────────────────┘
               │                               │
               ├── @resource: entry.js ────────┤
               │   (Only ONE file needs        │
               │    explicit @resource)        │
               │                               │
               ▼                               ▼
        ┌──────────────────────────────────────────┐
        │           entry.js (Bootstrap)           │
        │  • Detects scriptBase from template     │
        │  • Uses GM_xmlhttpRequest for loading   │
        │  • Loads scripts dynamically             │
        └──────────────┬───────────────────────────┘
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
    ┌─────────┐              ┌──────────────┐
    │  Core   │              │ Page-Specific│
    │ Scripts │              │   Scripts    │
    └────┬────┘              └──────┬───────┘
         │                          │
    ┌────┴─────────────┐     ┌─────┴──────────┐
    │ • button_wrapper │     │ • example.js   │
    │ • request_wrapper│     │ • openlink.js  │
    └──────────────────┘     └────────────────┘
```

## File Structure

```
tempermonkey/
├── template_file.js          # Template for local file loading
├── template_server.js        # Template for server deployment
├── entry.js                  # Bootstrap script (loaded via @resource)
└── src/
    ├── button_wrapper.js     # Draggable persistent button creator
    ├── request_wrapper.js    # HTTP request wrapper
    ├── example.js            # Example usage (buttons demo)
    └── openlink.js           # Page-specific feature
```

---

## Core Modules

### 1. entry.js - Bootstrap Script
**Purpose**: Entry point that dynamically loads all other modules

**Key Features**:
- Detects `scriptBase` from template (set by `window.scriptBase`)
- Uses `GM_xmlhttpRequest` to load scripts without explicit `@resource` directives
- Loads core modules first, then page-specific modules based on URL
- Works with both `file://` and `https://` URLs

**Loading Strategy**:
```javascript
// Core modules (always loaded)
- src/request_wrapper.js
- src/button_wrapper.js

// Page-specific modules (conditional)
if (url.includes('/example/'))
  → src/example.js, src/openlink.js
else if (url.includes('/github/'))
  → src/openlink.js
```

### 2. button_wrapper.js - Draggable Button Creator
**Purpose**: Factory function for creating persistent, draggable buttons

**Exports**: `window.createButton(id, text, styles, originalColor, hoverColor)`

**Features**:
- **Draggable**: Click and drag to reposition
- **Persistent**: Saves position to `localStorage`
- **Zoom-adaptive**: Adjusts position on browser zoom
- **Viewport constraint**: Stays visible with 10px padding
- **Click protection**: Prevents click event when dragged >3px
- **Customizable**: Accepts custom styles and colors

**Usage Example**:
```javascript
const btn = createButton('myBtn', 'Click Me', {
    top: '50px',
    backgroundColor: 'rgb(65 193 170)'
}, 'rgb(65 193 170)', 'rgb(45 173 150)');

btn.addEventListener('click', () => {
    console.log('Button clicked!');
});
```

**Storage Key**: `button_position_${id}` in localStorage
**Drag Threshold**: 3px movement to distinguish from click

### 3. request_wrapper.js - HTTP Request Helper
**Purpose**: Wrapper around `GM_xmlhttpRequest` for simplified HTTP requests

**Exports**: `window.makeRequest(url, method, data)`

**Features**:
- Promise-based interface
- Automatic JSON handling
- Error handling with fallback
- Supports GET/POST/PUT/DELETE

**Usage Example**:
```javascript
// Single request
makeRequest('https://api.example.com/data')
    .then(response => console.log(response.responseText));

// Multiple requests
Promise.all([
    makeRequest('https://example.com'),
    makeRequest('https://google.com')
]).then(responses => {
    responses.forEach(r => console.log(r.responseText));
});
```

### 4. Page-Specific Modules

#### example.js
Demonstrates button creation with two interactive examples:
- **Example Button**: Shows alert on click with purple color
- **Example 2 Button**: Fetches multiple URLs and logs page titles

**Dependencies**: Requires `button_wrapper.js` and `request_wrapper.js`

#### openlink.js
Adds link-opening functionality on specific pages:
- Text selection icon for opening links
- Double-click word selection
- Automatic link detection and opening
- Font size adjustment for `<pre>` elements

**Target Pages**: Example and Github pages

---

## Prerequisites

### 1. Install Tampermonkey
- **Chrome**: [Chrome Web Store](https://chrome.google.com/webstore)
- **Firefox**: [Firefox Add-ons](https://addons.mozilla.org)
- **Edge**: [Edge Add-ons](https://microsoftedge.microsoft.com/addons)

### 2. For Local File Development (template_file.js)

#### Enable File URL Access (Chrome/Edge)
1. Navigate to `chrome://extensions/` (or `edge://extensions/`)
2. Find **Tampermonkey** extension
3. Click **Details**
4. Enable **"Allow access to file URLs"**

#### Configure Tampermonkey Settings
1. Open Tampermonkey Dashboard
2. Go to **Settings** tab
3. Under **Security**:
   - Set "Allow scripts to access local files" to **"All local files"**

### 3. For Server Deployment (template_server.js)

#### Configure Server Access
1. Ensure your scripts are hosted on a web server
2. Update `@connect` directive with your domain
3. No special browser permissions needed

---

## Setup Guide

### Option A: Local File Development (Recommended for Development)

#### Step 1: Organize Your Files

Place files in a local directory:
```
C:/Users/YourName/userscripts/     (Windows)
/home/username/userscripts/         (Linux/Mac)
├── entry.js
└── src/
    ├── button_wrapper.js
    ├── request_wrapper.js
    ├── example.js
    └── openlink.js
```

#### Step 2: Create Tampermonkey Script

1. Open **Tampermonkey Dashboard**
2. Click **"+"** to create new script
3. **Copy** the content from `template_file.js`
4. **Customize these critical lines**:

```javascript
// Line 13: Set your local directory (NO trailing slash)
window.scriptBase = "file:///C:/Users/YourName/userscripts";

// Line 18: Point to your entry.js with version parameter
// @resource     entryScript file:///C:/Users/YourName/userscripts/entry.js?v=1.2

// Line 7: Optionally restrict to specific sites
// @match        *://*/*
// OR
// @match        https://github.com/*
```

**Important Notes**:
- Use **three slashes** in file URI: `file:///`
- **No trailing slash** on `scriptBase`
- Windows paths: `file:///C:/Users/...`
- Linux/Mac paths: `file:///home/...`
- Version parameter `?v=1.2` helps with cache busting

5. Save the script (`Ctrl+S`)

#### Step 3: Test

1. Visit a matching URL (e.g., any website if using `*://*/*`)
2. Open **Console** (F12)
3. Look for these messages:
   ```
   [Template] ✓ Entry script loaded
   [Entry] Script loaded
   [Entry] Using scriptBase from template: file:///C:/...
   [Entry] Loading core scripts...
   [Entry] ✓ Loaded: request_wrapper.js
   [Entry] ✓ Loaded: button_wrapper.js
   [Entry] ✓ All scripts loaded - Initialization complete
   [Button] Created draggable button: exampleBtn
   ```

#### Step 4: Development Workflow

1. **Edit** any script in `src/` directory
2. **Refresh** the webpage → Changes take effect immediately ✅
3. **If editing entry.js**:
   - Increment version: `?v=1.2` → `?v=1.3` in the `@resource` line
   - Save template in Tampermonkey to re-cache

**Why this workflow is fast**:
- Only `entry.js` is cached via `@resource`
- All other scripts load fresh via `GM_xmlhttpRequest`
- No need to reinstall or update the userscript

---

### Option B: Server Deployment (Production)

#### Step 1: Host Your Scripts

Upload scripts to a web server:
```
https://your-domain.com/scripts/
├── entry.js
└── src/
    ├── button_wrapper.js
    ├── request_wrapper.js
    ├── example.js
    └── openlink.js
```

**Ensure proper CORS headers** if loading from different domain:
```
Access-Control-Allow-Origin: *
Content-Type: application/javascript
```

#### Step 2: Create Tampermonkey Script

1. Open **Tampermonkey Dashboard**
2. Click **"+"** to create new script
3. **Copy** the content from `template_server.js`
4. **Customize these lines**:

```javascript
// Line 8: Set your server URL
let API = "https://your-domain.com/scripts/entry.js";

// Line 6: Allow your domain
// @connect      your-domain.com

// Line 5: Optionally restrict to specific sites
// @match        https://github.com/*
```

5. Save the script

#### Step 3: Configure entry.js for Server

The server-based entry.js can use `document.currentScript` to detect the base URL, but it's more reliable to set it explicitly in the template:

**In template_server.js**, add after line 8:
```javascript
let API = "https://your-domain.com/scripts/entry.js";
window.scriptBase = "https://your-domain.com/scripts";
unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
```

#### Step 4: Test

1. Visit a matching URL
2. Open **Console** (F12)
3. Look for: `OK: entry API loaded successfully`
4. Check for module loading messages

**Deployment Workflow**:
1. Edit scripts on your local machine
2. Upload to server via FTP/SSH/Git
3. Refresh webpage → New version loads

---

## How It Works

### Template → Entry → Modules Flow

```
┌─────────────────────────────────────────────────────┐
│ 1. Template loads and runs                          │
│    • Sets window.scriptBase                         │
│    • Makes GM_xmlhttpRequest available globally     │
│    • Loads entry.js via GM_getResourceText/script   │
│    • Evaluates entry.js code                        │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│ 2. Entry.js executes                                │
│    • Checks window.scriptBase (set by template)     │
│    • Defines loadLocalScript() function             │
│    • Loads core modules via GM_xmlhttpRequest       │
│    • Checks URL for page-specific modules           │
│    • Loads page-specific modules conditionally      │
└───────────────────┬─────────────────────────────────┘
                    │
┌───────────────────▼─────────────────────────────────┐
│ 3. Modules execute in order                         │
│    • button_wrapper.js → exports createButton()     │
│    • request_wrapper.js → exports makeRequest()     │
│    • example.js → uses createButton()               │
│    • openlink.js → page-specific features           │
└─────────────────────────────────────────────────────┘
```

### Key Technical Details

#### 1. Why Only entry.js Needs @resource
- `@resource` caches files when script is installed/updated
- `entry.js` uses `GM_xmlhttpRequest` to dynamically load other files
- This avoids cluttering template with dozens of `@resource` lines
- Development is faster: edit `src/*.js` → refresh page ✅

#### 2. Why window.scriptBase is Set by Template
- When code runs via `eval()`, `document.currentScript` returns `null`
- Template sets `window.scriptBase` **before** calling `eval()`
- Entry.js checks `window.scriptBase` first, then falls back to `document.currentScript`

**Code in entry.js**:
```javascript
if (window.scriptBase) {
    scriptBase = window.scriptBase;  // ✅ Works
} else if (document.currentScript) {
    scriptBase = document.currentScript.src.replace(/\/[^\/]*$/, '');  // ❌ null
}
```

#### 3. How GM_xmlhttpRequest Works with file://
- Browsers block `<script src="file://...">` for security
- `GM_xmlhttpRequest` has special permissions to read local files
- Response status is `0` for local files (not `200`)

**Code in entry.js**:
```javascript
if (response.status === 200 || response.status === 0) {  // 0 for local files
    eval(response.responseText);
}
```

#### 4. Cache Busting with Version Parameters
```javascript
// @resource entryScript file:///path/to/entry.js?v=1.2
```
- Change `?v=1.2` to `?v=1.3` when updating entry.js
- Forces Tampermonkey to re-cache the file
- Save in dashboard to apply changes
- Also update `@version` in header for consistency

#### 5. Conditional Module Loading
Entry.js checks the current URL and loads appropriate modules:

```javascript
const url = window.location.href;

if (url.includes('/example/')) {
    // Load both example and openlink for Example
    loadLocalScript(`${scriptBase}/src/example.js`),
    loadLocalScript(`${scriptBase}/src/openlink.js`)
} else if (url.includes('/github/')) {
    // Load only openlink for Github
    loadLocalScript(`${scriptBase}/src/openlink.js`)
}
```

**Benefits**:
- Reduces memory usage
- Faster loading
- Cleaner console
- Modular architecture

---

## Complete Code Examples

### Example 1: Simple Alert Button

```javascript
// In your custom script (e.g., src/my_feature.js)
const alertBtn = createButton('alertBtn', '⚠️ Alert', {
    top: '200px',
    backgroundColor: '#e74c3c'
}, '#e74c3c', '#c0392b');

alertBtn.addEventListener('click', () => {
    alert('Hello from Tampermonkey!');
});
```

**Add to entry.js**:
```javascript
loadLocalScript(`${scriptBase}/src/my_feature.js`)
```

### Example 2: API Data Fetcher

```javascript
// Create button that fetches data
const fetchBtn = createButton('fetchBtn', '📊 Fetch', {
    top: '270px',
    backgroundColor: '#3498db'
}, '#3498db', '#2980b9');

fetchBtn.addEventListener('click', async () => {
    try {
        const response = await makeRequest('https://api.github.com/users/github');
        const data = JSON.parse(response.responseText);
        console.log('User:', data.login, 'Repos:', data.public_repos);
    } catch (error) {
        console.error('Fetch failed:', error);
    }
});
```

### Example 3: Multi-URL Checker

```javascript
// Check multiple URLs in parallel
const checkBtn = createButton('checkBtn', '🔍 Check URLs', {
    top: '340px',
    backgroundColor: '#9b59b6'
}, '#9b59b6', '#8e44ad');

checkBtn.addEventListener('click', () => {
    const urls = [
        'https://github.com',
        'https://stackoverflow.com',
        'https://developer.mozilla.org'
    ];
    
    Promise.all(urls.map(url => makeRequest(url)))
        .then(responses => {
            responses.forEach((response, idx) => {
                if (response.error) {
                    console.log(`❌ ${urls[idx]}: ${response.error}`);
                } else {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(response.responseText, 'text/html');
                    const title = doc.querySelector('title')?.textContent || 'No title';
                    console.log(`✅ ${urls[idx]}: ${title}`);
                }
            });
        });
});
```

---

## Troubleshooting

### Issue: Script not loading

**Symptoms**: No console messages, buttons don't appear

**Solutions**:
1. ✅ Check Tampermonkey extension is enabled
2. ✅ Verify URL matches `@match` pattern
3. ✅ Open Tampermonkey dashboard → check script is enabled
4. ✅ Hard refresh: `Ctrl+Shift+R` (Windows) / `Cmd+Shift+R` (Mac)

### Issue: "Not allowed to load local resource"

**Symptoms**: Console error about local resource access

**Solutions**:
1. ✅ Enable "Allow access to file URLs" in Chrome extensions
2. ✅ Set Tampermonkey security to "All local files"
3. ✅ Verify file path uses `file:///` (three slashes)
4. ✅ Check file actually exists at that path

### Issue: Changes not reflected

**Symptoms**: Edited files but no changes appear

**Solutions**:

**For src/*.js files**:
- Just refresh the page (should work immediately)
- Check console for loading errors

**For entry.js**:
1. Increment version: `?v=1.2` → `?v=1.3`
2. Save script in Tampermonkey dashboard
3. Refresh page

**For template**:
1. Edit in Tampermonkey dashboard
2. Save (`Ctrl+S`)
3. Refresh page

### Issue: "Failed to load" errors in console

**Symptoms**: `[Entry] ✗ Failed to load: script_name.js`

**Solutions**:
1. ✅ Check file exists in `src/` directory
2. ✅ Verify `scriptBase` path is correct (check console)
3. ✅ Ensure no trailing slash in `scriptBase`
4. ✅ Check file permissions (must be readable)

### Issue: Buttons not draggable

**Symptoms**: Buttons appear but can't be moved

**Solutions**:
1. ✅ Ensure `button_wrapper.js` loaded successfully
2. ✅ Check console for JavaScript errors
3. ✅ Verify no CSS conflicts with `position: fixed`
4. ✅ Check if other scripts are interfering with mouse events

### Issue: localStorage not persisting

**Symptoms**: Button positions reset on refresh

**Solutions**:
1. ✅ Check browser privacy settings (localStorage enabled)
2. ✅ Verify not in incognito/private mode
3. ✅ Check browser console for storage quota errors
4. ✅ Try different button ID (avoid conflicts)

### Issue: GM_xmlhttpRequest not working

**Symptoms**: `GM_xmlhttpRequest is not defined`

**Solutions**:
1. ✅ Verify `@grant GM_xmlhttpRequest` in template header
2. ✅ Check template passes it to `unsafeWindow`
3. ✅ Ensure running in Tampermonkey (not regular page context)

### Issue: Server deployment 404 errors

**Symptoms**: "Failed to load entry API from server"

**Solutions**:
1. ✅ Verify server URL is correct and accessible
2. ✅ Check CORS headers are properly set
3. ✅ Test URL in browser directly
4. ✅ Update `@connect` directive with domain
5. ✅ Check server logs for access errors

---

## Best Practices

### 1. Version Management
```javascript
// Always increment versions when updating entry.js
// @version      1.2
// @resource     entryScript file:///path/entry.js?v=1.2
```

### 2. Specific Match Patterns
```javascript
// Instead of matching all sites:
// @match        *://*/*

// Be specific:
// @match        https://github.com/*
// @match        https://stackoverflow.com/*
```

### 3. Error Handling
```javascript
// Wrap risky code in try-catch
btn.addEventListener('click', async () => {
    try {
        const response = await makeRequest(url);
        // Process response
    } catch (error) {
        console.error('Error:', error);
        alert('Operation failed!');
    }
});
```

### 4. Unique Button IDs
```javascript
// Use descriptive, unique IDs
createButton('githubPRBtn', 'PRs');      // ✅ Good
createButton('btn1', 'Button');          // ❌ Generic
```

### 5. Modular Development
```javascript
// Create focused modules for specific features
src/
├── github_enhancer.js    // GitHub-specific features
├── reddit_tools.js       // Reddit-specific features
└── universal_utils.js    // Shared utilities
```

### 6. Console Logging
```javascript
// Use consistent prefixes for easy filtering
console.log('[MyFeature] Initialized');
console.log('[MyFeature] Processing...');
console.error('[MyFeature] Error:', error);
```

### 7. Cleanup on Navigation
```javascript
// Remove event listeners when navigating away
window.addEventListener('beforeunload', () => {
    // Cleanup code
    btn.removeEventListener('click', handler);
});
```

---

## Security Considerations

### 1. eval() Usage
- ⚠️ Only load scripts from **trusted sources**
- ✅ Verify file paths before loading
- ✅ Use HTTPS for server deployments
- ❌ Never eval user input

### 2. File Access
- ⚠️ Be cautious with local file permissions
- ✅ Restrict `@match` to specific domains
- ✅ Review loaded scripts regularly

### 3. Network Requests
- ✅ Limit `@connect` to specific domains you control
- ❌ Avoid `@connect *` in production
- ✅ Validate responses before processing

### 4. localStorage
- ⚠️ Don't store sensitive data in localStorage
- ✅ Validate data before using
- ✅ Use prefixed keys to avoid conflicts

### 5. Production Deployment
- ✅ Use HTTPS for all server resources
- ✅ Implement proper CORS headers
- ✅ Regular security audits
- ✅ Version control for rollback capability

---

## Advanced Features

### Custom Module Loading Pattern

```javascript
// In entry.js, create a module loader
function loadModules(modules) {
    return Promise.all(
        modules.map(mod => loadLocalScript(`${scriptBase}/src/${mod}.js`))
    );
}

// Load based on complex conditions
if (document.querySelector('.specific-element')) {
    await loadModules(['feature_a', 'feature_b']);
} else {
    await loadModules(['feature_c']);
}
```

### Dynamic scriptBase Detection

```javascript
// In template, detect environment automatically
const isDevelopment = window.location.hostname === 'localhost';
window.scriptBase = isDevelopment
    ? "file:///C:/Users/dev/scripts"
    : "https://cdn.example.com/scripts";
```

### Hot Reload for Development

```javascript
// Add to template for development
if (window.location.hostname === 'localhost') {
    // Reload scripts every 5 seconds
    setInterval(() => {
        console.log('[Dev] Hot reloading...');
        location.reload();
    }, 5000);
}
```

### Conditional Logging

```javascript
// In entry.js, control verbosity
const DEBUG = true;
function log(...args) {
    if (DEBUG) console.log('[Entry]', ...args);
}

log('This only appears in debug mode');
```

---

## Migration Guide

### From Old Template to New System

**Old approach** (multiple @resource lines):
```javascript
// @resource     script1 file:///path/script1.js
// @resource     script2 file:///path/script2.js
// @resource     script3 file:///path/script3.js
```

**New approach** (single entry.js):
```javascript
// @resource     entryScript file:///path/entry.js?v=1.0
```

**Steps**:
1. Create `entry.js` with loading logic
2. Move scripts to `src/` directory
3. Update template to only load `entry.js`
4. Test and verify all modules load

---

## FAQ

**Q: Why use this system instead of inline code?**
A: Separation of concerns, reusability, easier maintenance, faster development.

**Q: Can I mix local and server resources?**
A: Yes! Template_file.js loads from local, template_server.js from server. Entry.js works with both.

**Q: How do I debug loading issues?**
A: Check console for `[Entry]` messages. Enable verbose logging. Verify file paths.

**Q: Can I use TypeScript?**
A: Yes, but compile to JavaScript first. Browsers can't run TypeScript directly.

**Q: What if I need to load external libraries?**
A: Add them as `@require` in template header, or load via `GM_xmlhttpRequest`.

**Q: How do I share my scripts with others?**
A: Deploy to a server, share the template with server URL configured.

**Q: Can I use npm packages?**
A: Bundle them with webpack/rollup first, then include in your scripts.

---

## Summary

This system provides:
- ✅ **Fast local development** - Edit files, refresh page
- ✅ **Production deployment** - Host on server for distribution
- ✅ **Modular architecture** - Reusable components
- ✅ **Smart loading** - Conditional module loading based on URL
- ✅ **Persistent UI** - Draggable buttons with saved positions
- ✅ **Easy maintenance** - Single template, many modules
- ✅ **Flexible deployment** - Local OR server, same codebase

Perfect for building sophisticated userscripts with professional development workflow!

---

## Additional Resources

- [Tampermonkey Documentation](https://www.tampermonkey.net/documentation.php)
- [Greasemonkey API Reference](https://wiki.greasespot.net/Greasemonkey_Manual:API)
- [MDN Web Docs - localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [File URI Scheme](https://en.wikipedia.org/wiki/File_URI_scheme)

---

**Version**: 2.0  
**Last Updated**: 2024  
**License**: MIT
