// ==UserScript==
// @name         Template User Script (Local Files)
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Loads entry.js which loads all other scripts dynamically
// @author       Your Name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @resource     entryScript file:///C:/Users/dmanish/Downloads/test/entry.js?v=1.0
// ==/UserScript==

/**
 * Simple template that:
 * 1. Loads entry.js from local file
 * 2. entry.js then loads all other scripts internally using GM_xmlhttpRequest
 * 3. No need to add @resource for every script!
 */
(function () {
    'use strict';

    // Set scriptBase WITHOUT trailing slash
    window.scriptBase = "file:///C:/Users/dmanish/Downloads/test";

    // Make GM_xmlhttpRequest available to entry.js
    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;

    // Load and execute entry script
    try {
        const scriptContent = GM_getResourceText("entryScript");
        if (scriptContent) {
            eval(scriptContent);
            console.log("[Template] ✓ Entry script loaded");
        } else {
            throw new Error("Entry script resource is empty");
        }
    } catch (error) {
        console.error("[Template] ✗ Failed to load entry script:", error);
    }
})();
