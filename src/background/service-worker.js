import { ACTIONS } from '../utils/constants.js';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === ACTIONS.CHECK_INPUT) {
        const inputData = message.payload;
        
        // Placeholder for the 3-Tiered Logic
        // 1. Check Regex (Tier 1)
        // 2. Check Context (Tier 2)
        // 3. Check Algorithms (Tier 3)

        // IF VALIDATED:
        // logDetection(message.payload);
        // chrome.tabs.sendMessage(sender.tab.id, { action: ACTIONS.PII_DETECTED, type: 'NIC' });
    }
});

async function logDetection() {
    const data = await chrome.storage.local.get(['total_blocked']);
    const current = data.total_blocked || 0;
    await chrome.storage.local.set({ total_blocked: current + 1 });
}