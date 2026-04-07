import { ACTIONS, PII_TYPES } from '../utils/constants.js';
import { PII_PATTERNS, sanitizeInput } from '../utils/regex-library.js';
import { validateNIC, validateLuhn } from '../utils/validators.js';

/**
 * TIERED DETECTION PIPELINE
 * Logic: Tier 1 (Regex) -> Tier 3 (Checksum Validation)
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === ACTIONS.CHECK_INPUT) {
        const rawInput = message.payload;
        const cleanInput = sanitizeInput(rawInput);

        let confirmedType = null;

        // --- PIPELINE STEP 1: SRI LANKAN NIC ---
        if (PII_PATTERNS.SRI_LANKA_NIC.COMBINED.test(cleanInput)) {
            PII_PATTERNS.SRI_LANKA_NIC.COMBINED.lastIndex = 0; // Reset regex state
            
            // TIER 3 VALIDATION: Checksum & Date Logic
            if (validateNIC(cleanInput)) {
                confirmedType = PII_TYPES.NIC;
            }
        } 
        
        // --- PIPELINE STEP 2: PAYMENT CARDS (If NIC didn't match) ---
        else if (PII_PATTERNS.CREDIT_CARD.GENERIC.test(cleanInput)) {
            PII_PATTERNS.CREDIT_CARD.GENERIC.lastIndex = 0; // Reset regex state

            // TIER 3 VALIDATION: Luhn Algorithm
            if (validateLuhn(cleanInput)) {
                confirmedType = PII_TYPES.CREDIT_CARD;
            }
        }

        // --- FINAL INTERVENTION ---
        if (confirmedType) {
            handlePositiveDetection(sender.tab.id, confirmedType);
        }
    }
    
    return true; 
});

/**
 * Orchestrates the response when PII is cryptographically/mathematically confirmed.
 */
async function handlePositiveDetection(tabId, type) {
    // 1. Update the Analytics (Trust Engine)
    await logDetection();

    // 2. Trigger the UI Intervention (The Warning Banner)
    chrome.tabs.sendMessage(tabId, { 
        action: ACTIONS.PII_DETECTED, 
        type: type 
    });
}

/**
 * Persists detection stats to Local Storage for the Popup Dashboard.
 */
async function logDetection() {
    try {
        const data = await chrome.storage.local.get(['total_blocked']);
        const current = data.total_blocked || 0;
        await chrome.storage.local.set({ total_blocked: current + 1 });
    } catch (error) {
        console.error("Storage Error:", error);
    }
}