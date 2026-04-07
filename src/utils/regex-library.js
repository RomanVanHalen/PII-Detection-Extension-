/**
 * TIER 1: REGEX LIBRARY
 * Purpose: Initial pattern matching for high-velocity data streams.
 * Standards: ISO/IEC 27001 compliant data handling patterns.
 */

export const PII_PATTERNS = {
    // Sri Lankan National Identity Card (NIC)
    // Old: 9 digits followed by V or X (e.g., 991234567V)
    // New: 12 digits (e.g., 199912345678)
    SRI_LANKA_NIC: {
        OLD: /[0-9]{9}[vVxX]/g,
        NEW: /[0-9]{12}/g,
        COMBINED: /([0-9]{9}[vVxX]|[0-9]{12})/g
    },

    // Payment Card Industry (PCI) - Basic Formats
    // Matches Visa, Mastercard, Amex, etc. (13-19 digits)
    CREDIT_CARD: {
        VISA: /^4[0-9]{12}(?:[0-9]{3})?$/g,
        MASTERCARD: /^(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}$/g,
        GENERIC: /\b(?:\d[ -]*?){13,19}\b/g // Catches numbers with spaces or hyphens
    },

    // Email Addresses (RFC 5322 Standard)
    EMAIL: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,

    // Sri Lankan Mobile Numbers (+94 or 07X)
    SL_PHONE: /^(?:\+94|0)7[0-9]{8}$/g
};

/**
 * Utility to strip formatting (spaces/hyphens) before Tier 3 validation
 */
export const sanitizeInput = (input) => {
    return input.replace(/[-\s]/g, '');
};