import { PERFORMANCE } from './constants.js';

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * @param {Function} func - Function to debounce
 * @param {number} wait - Milliseconds to wait
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait = PERFORMANCE.DEBOUNCE_DELAY) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Creates a throttled function that only invokes func at most once per every limit milliseconds
 * @param {Function} func - Function to throttle
 * @param {number} limit - Milliseconds limit
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit = PERFORMANCE.THROTTLE_DELAY) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Safely parses JSON with a default value if parsing fails
 * @param {string} json - JSON string to parse
 * @param {*} defaultValue - Default value if parsing fails
 * @returns {*} - Parsed value or default value
 */
export function safeJSONParse(json, defaultValue = null) {
    try {
        return JSON.parse(json);
    } catch (e) {
        console.error('JSON Parse Error:', e);
        return defaultValue;
    }
}

/**
 * Generates a unique ID
 * @returns {string} - Unique ID
 */
export function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Formats a date to a readable string
 * @param {Date|string} date - Date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

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
 * Creates a DOM element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {Array|string} children - Child elements or text content
 * @returns {HTMLElement} - Created element
 */
export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key.startsWith('data-')) {
            element.setAttribute(key, value);
        } else {
            element[key] = value;
        }
    });

    if (typeof children === 'string') {
        element.textContent = children;
    } else {
        children.forEach(child => {
            if (child instanceof Node) {
                element.appendChild(child);
            } else if (child) {
                element.appendChild(document.createTextNode(String(child)));
            }
        });
    }

    return element;
}

/**
 * Handles API errors
 * @param {Error} error - Error object
 * @param {string} context - Error context
 */
export function handleError(error, context = '') {
    console.error(`Error in ${context}:`, error);
    throw error;
}

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object)
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