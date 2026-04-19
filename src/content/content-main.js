import { ACTIONS } from '../utils/constants.js';
import { PIIUIController } from './ui-controller.js';

const ui = new PIIUIController();
let inputTimeout = null;
let lastDetectedElement = null;

document.addEventListener('input', (event) => {
    const target = event.target;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const val = target.value;
        lastDetectedElement = target;

        if (inputTimeout) clearTimeout(inputTimeout);
        
        inputTimeout = setTimeout(() => {
            if (val.length < 9) return; 

            // ULTIMATE LIVE SITE DEFENSIVE CHECK
            try {
                // We check if the runtime object is 'truthy' without accessing its properties first
                const isContextValid = !!(typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.id);
                
                if (isContextValid) {
                    chrome.runtime.sendMessage({
                        action: ACTIONS.CHECK_INPUT,
                        payload: val,
                        context: {
                            id: target.id,
                            placeholder: target.placeholder,
                            name: target.name
                        }
                    });
                } else {
                    console.warn("PII Shield: Monitoring paused. Please refresh the page.");
                }
            } catch (error) {
                // This catch now officially handles the "context invalidated" crash on live sites
                console.log("PII Shield: Extension reloaded. Refresh required.");
            }
            
            inputTimeout = null;
        }, 300);
    }
});

/**
 * INTERVENTION LISTENER
 */
try {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === ACTIONS.PII_DETECTED) {
            const targetElement = lastDetectedElement || (request.context?.id ? document.getElementById(request.context.id) : null);
            if (targetElement) {
                ui.inject(request.type, targetElement);
            }
        }
        
        if (request.action === 'PAGE_UNLOAD') {
            ui.dispose();
        }
    });
} catch (e) {
    // Catch invalidation of the listener itself on reload
}