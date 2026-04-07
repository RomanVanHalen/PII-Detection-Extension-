import { ACTIONS } from '../utils/constants.js';
import { PIIUIController } from './ui-controller.js';

// Initialize the UI Controller
const ui = new PIIUIController();

/**
 * TIER 0: THE SENSOR
 * Monitors DOM inputs and forwards data to the Service Worker.
 */
let inputTimeout;

document.addEventListener('input', (event) => {
    const target = event.target;
    
    // Only monitor text-based inputs and textareas
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const val = target.value;

        // PERFORMANCE: Debounce the input by 300ms 
        // This ensures we only validate when the user pauses typing
        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(() => {
            if (val.length < 9) return; // Don't check strings shorter than an old NIC

            chrome.runtime.sendMessage({
                action: ACTIONS.CHECK_INPUT,
                payload: val,
                context: {
                    id: target.id,
                    placeholder: target.placeholder,
                    name: target.name
                }
            });
        }, 300);
    }
});

/**
 * INTERVENTION LISTENER
 * Receives confirmed detection signals from the Service Worker.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === ACTIONS.PII_DETECTED) {
        // Trigger the Sandboxed Shadow DOM Banner
        ui.inject(request.type);
    }
    
    // Cleanup if the page is navigated/reloaded
    if (request.action === 'PAGE_UNLOAD') {
        ui.dispose();
    }
});