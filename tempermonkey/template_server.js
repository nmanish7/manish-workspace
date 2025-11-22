// ==UserScript==
// @name         Template User Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  A template for loading external JS with server
// @author       Your Name
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      *
// ==/UserScript==

/**
 * Simple template that:
 * 1. Loads entry.js from server
 * 2. entry.js then loads all other scripts internally using GM_xmlhttpRequest
 * 3. No need to add API for every script!
 */
(function () {
    let API = "https://example.com/entry.js";
    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
    document.head.appendChild(
        Object.assign(document.createElement("script"), {
            src: API,
            onload: () => console.log("OK: entry API loaded successfully"),
            onerror: () => console.error("Error: failed to load entry API"),
        })
    );
})();