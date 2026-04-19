/**
 * TIER 3: VALIDATION ENGINE
 */

export const validateNIC = (nic) => {
    if (!nic) return false;
    const cleanNic = nic.trim(); // Ensure no accidental trailing spaces
    
    if (cleanNic.length === 10) {
        const digits = cleanNic.substring(0, 9);
        const lastChar = cleanNic.charAt(9).toLowerCase();
        if (!/^[0-9]{9}$/.test(digits) || (lastChar !== 'v' && lastChar !== 'x')) return false;
        
        const days = parseInt(digits.substring(2, 5));
        return (days > 0 && days < 367) || (days > 500 && days < 867);
    }

    if (cleanNic.length === 12) {
        if (!/^[0-9]{12}$/.test(cleanNic)) return false;
        const year = parseInt(cleanNic.substring(0, 4));
        const days = parseInt(cleanNic.substring(4, 7));
        
        const currentYear = new Date().getFullYear();
        const validYear = year >= 1900 && year <= currentYear;
        const validDays = (days > 0 && days < 367) || (days > 500 && days < 867);
        return validYear && validDays;
    }
    return false;
};

/**
 * Luhn Algorithm (PCI Standard)
 * FIXED: Now handles spaces and hyphens automatically
 */
export const validateLuhn = (cardNumber) => {
    // CRITICAL FIX: Strip non-digit characters before calculating
    const digitsOnly = cardNumber.replace(/\D/g, '');
    if (digitsOnly.length < 13 || digitsOnly.length > 19) return false;

    let sum = 0;
    let shouldDouble = false;
    
    for (let i = digitsOnly.length - 1; i >= 0; i--) {
        let digit = parseInt(digitsOnly.charAt(i));

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    return (sum % 10) === 0;
};