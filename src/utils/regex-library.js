/**
 * TIER 1: REGEX LIBRARY
 * Purpose: Initial pattern matching for high-velocity data streams.
 * Standards: ISO/IEC 27001 compliant data handling patterns.
 */

export const PII_PATTERNS = {
    // Sri Lankan National Identity Card (NIC)
    // Uses word boundaries \b to ensure we don't catch NICs embedded in longer numbers
    SRI_LANKA_NIC: {
        OLD: /\b[0-9]{9}[vVxX]\b/g,
        NEW: /\b[0-9]{12}\b/g,
        COMBINED: /\b([0-9]{9}[vVxX]|[0-9]{12})\b/g
    },

    // Payment Card Industry (PCI)
    // MODIFIED: Removed ^ and $ anchors. Added word boundaries \b.
    // This allows the sensor to find the card even if the user types "My card is 4111..."
    CREDIT_CARD: {
        VISA: /\b4[0-9]{12}(?:[0-9]{3})?\b/g,
        MASTERCARD: /\b(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}\b/g,
        GENERIC: /\b(?:\d[ -]*?){13,19}\b/g 
    },

    // Email Addresses (RFC 5322 Standard)
    // Removed the 'g' flag if you are using .test() in a loop to avoid lastIndex issues
    EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,

    // Sri Lankan Mobile Numbers (+94 or 07X)
    // MODIFIED: Removed anchors to support detection within full sentences
    SL_PHONE: /\b(?:\+94|0)7[0-9]{8}\b/g
};

/**
 * Utility to strip formatting (spaces/hyphens) before Tier 3 validation
 */
export const sanitizeInput = (input) => {
    return input.replace(/[-\s]/g, '');
};