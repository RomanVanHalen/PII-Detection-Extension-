import { ACTIONS, PII_TYPES } from '../utils/constants.js';
import { PII_PATTERNS, sanitizeInput } from '../utils/regex-library.js';
import { validateNIC, validateLuhn } from '../utils/validators.js';

/**
 * TIERED DETECTION PIPELINE
 * Parallel processing with dual-stream sanitization.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === ACTIONS.CHECK_INPUT) {
        const rawInput = message.payload;
        
        // LANE 1: Numeric Sanitization (For NIC and PCI)
        // Strips spaces and hyphens so checksums don't break
        const numericOnly = sanitizeInput(rawInput); 

        // LANE 2: Literal Sanitization (For Email and Phone)
        // Only trims outer whitespace to preserve internal symbols like '@' and '.'
        const literalInput = rawInput.trim();

        let confirmedType = null;

        // --- 1. SRI LANKAN NIC ---
        if (PII_PATTERNS.SRI_LANKA_NIC.COMBINED.test(numericOnly)) {
            PII_PATTERNS.SRI_LANKA_NIC.COMBINED.lastIndex = 0; 
            if (validateNIC(numericOnly)) {
                confirmedType = PII_TYPES.NIC;
            }
        } 
        
        // --- 2. PAYMENT CARDS (PCI) ---
        if (!confirmedType && PII_PATTERNS.CREDIT_CARD.GENERIC.test(numericOnly)) {
            PII_PATTERNS.CREDIT_CARD.GENERIC.lastIndex = 0;
            if (validateLuhn(numericOnly)) {
                confirmedType = PII_TYPES.CREDIT_CARD;
            }
        }

        // --- 3. EMAIL ADDRESSES ---
        // CRITICAL: We use 'literalInput' here to keep the email structure intact
        if (!confirmedType && PII_PATTERNS.EMAIL.test(literalInput)) {
            PII_PATTERNS.EMAIL.lastIndex = 0;
            confirmedType = PII_TYPES.EMAIL;
        }

        // --- 4. SRI LANKAN PHONE NUMBERS ---
        if (!confirmedType && PII_PATTERNS.SL_PHONE.test(literalInput)) {
            PII_PATTERNS.SL_PHONE.lastIndex = 0;
            confirmedType = PII_TYPES.PHONE;
        }

        if (confirmedType) {
            handlePositiveDetection(sender.tab.id, confirmedType);
        }
    }
    return true; 
});

async function handlePositiveDetection(tabId, type) {
    await logDetection();
    chrome.tabs.sendMessage(tabId, { 
        action: ACTIONS.PII_DETECTED, 
        type: type 
    });
}

async function logDetection() {
    try {
        const data = await chrome.storage.local.get(['total_blocked']);
        const current = data.total_blocked || 0;
        await chrome.storage.local.set({ total_blocked: current + 1 });
    } catch (error) {
        console.error("PII Shield Storage Error:", error);
    }
}