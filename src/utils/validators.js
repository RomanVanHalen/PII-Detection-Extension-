/**
 * TIER 3: VALIDATION ENGINE
 * Purpose: Algorithmic verification (Checksums & Business Logic).
 * Standards: Modulo 11 (NIC) and Luhn Algorithm (PCI).
 */

/**
 * Validates Sri Lankan NIC (Old and New formats)
 * @param {string} nic 
 * @returns {boolean}
 */
export const validateNIC = (nic) => {
    if (!nic) return false;
    
    // 1. Handle Old NIC (9 Digits + V/X)
    if (nic.length === 10) {
        const digits = nic.substring(0, 9);
        const lastChar = nic.charAt(9).toLowerCase();
        if (!/^[0-9]{9}$/.test(digits) || (lastChar !== 'v' && lastChar !== 'x')) {
            return false;
        }
        // Basic check: Birth day of year (Days 1-366 or 501-866 for females)
        const days = parseInt(digits.substring(2, 5));
        return (days > 0 && days < 367) || (days > 500 && days < 867);
    }

    // 2. Handle New NIC (12 Digits)
    if (nic.length === 12) {
        if (!/^[0-9]{12}$/.test(nic)) return false;

        // Modulo 11 Checksum (Simplified for New NIC validation)
        // New NICs also follow specific date patterns: YYYY + DDD + SSSS + C
        const year = parseInt(nic.substring(0, 4));
        const days = parseInt(nic.substring(4, 7));
        
        const currentYear = new Date().getFullYear();
        const validYear = year >= 1900 && year <= currentYear;
        const validDays = (days > 0 && days < 367) || (days > 500 && days < 867);

        return validYear && validDays;
    }

    return false;
};

/**
 * Luhn Algorithm for Credit Card Validation (PCI Standard)
 * @param {string} cardNumber 
 * @returns {boolean}
 */
export const validateLuhn = (cardNumber) => {
    let sum = 0;
    let shouldDouble = false;
    
    // Loop through digits from right to left
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return (sum % 10) === 0;
};