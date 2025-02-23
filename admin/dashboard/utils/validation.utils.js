/**
 * Validates a project object
 * @param {Object} project - Project to validate
 * @returns {boolean} - Whether the project is valid
 */
export function validateProject(project) {
    const requiredFields = ['name', 'description', 'category', 'status'];
    return requiredFields.every(field => Boolean(project[field]));
}

/**
 * Validates an email address
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether the email is valid
 */
export function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates a URL
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export function validateUrl(url) {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

/**
 * Validates a password
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with success and errors
 */
export function validatePassword(password) {
    const rules = [
        { test: p => p.length >= 8, message: 'Password must be at least 8 characters long' },
        { test: p => /[A-Z]/.test(p), message: 'Password must contain at least one uppercase letter' },
        { test: p => /[a-z]/.test(p), message: 'Password must contain at least one lowercase letter' },
        { test: p => /[0-9]/.test(p), message: 'Password must contain at least one number' },
        { test: p => /[!@#$%^&*]/.test(p), message: 'Password must contain at least one special character (!@#$%^&*)' }
    ];

    const errors = rules
        .filter(rule => !rule.test(password))
        .map(rule => rule.message);

    return {
        success: errors.length === 0,
        errors
    };
}

/**
 * Validates form data
 * @param {Object} data - Form data to validate
 * @param {Object} rules - Validation rules
 * @returns {Object} - Validation result with success and errors
 */
export function validateForm(data, rules) {
    const errors = {};
    
    Object.entries(rules).forEach(([field, rule]) => {
        const value = data[field];
        const fieldErrors = validateField(field, value, rule);
        if (fieldErrors) {
            errors[field] = fieldErrors;
        }
    });
    
    return {
        success: Object.keys(errors).length === 0,
        errors
    };
}

function validateField(field, value, rule) {
    if (rule.required && !value) {
        return `${field} is required`;
    }

    if (!value) return null;

    if (rule.minLength && value.length < rule.minLength) {
        return `${field} must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
        return `${field} must be at most ${rule.maxLength} characters`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
        return rule.message || `${field} is invalid`;
    }

    if (rule.validate && !rule.validate(value)) {
        return rule.message || `${field} is invalid`;
    }

    return null;
}

/**
 * Checks if a value is empty
 * @param {*} value - Value to check
 * @returns {boolean} - Whether the value is empty
 */
export function isEmpty(value) {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
} 