import { ACTIONS } from '../utils/constants.js';

// Monitor all input fields
document.addEventListener('input', (event) => {
    const target = event.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const val = target.value;
        
        // Send to Service Worker for Tiered Checking
        chrome.runtime.sendMessage({
            action: ACTIONS.CHECK_INPUT,
            payload: val,
            context: {
                id: target.id,
                placeholder: target.placeholder,
                name: target.name
            }
        });
    }
});

// Listen for the "Show Banner" command from Background
chrome.runtime.onMessage.addListener((request) => {
    if (request.action === ACTIONS.PII_DETECTED) {
        // Trigger the UI Controller (we will link the Figma code here)
        console.log("PII Alert Triggered:", request.type);
    }
});