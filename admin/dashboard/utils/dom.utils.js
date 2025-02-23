/**
 * Creates a DOM element with attributes and children
 * @param {string} tag - HTML tag name
 * @param {Object} attributes - Element attributes
 * @param {Array|string} children - Child elements or text content
 * @returns {HTMLElement} - Created element
 */
export function createElement(tag, attributes = {}, children = []) {
    const element = document.createElement(tag);
    setAttributes(element, attributes);
    appendChildren(element, children);
    return element;
}

function setAttributes(element, attributes) {
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'className') {
            element.className = value;
        } else if (key.startsWith('data-')) {
            element.setAttribute(key, value);
        } else if (key.startsWith('on') && typeof value === 'function') {
            element.addEventListener(key.substring(2).toLowerCase(), value);
        } else {
            element[key] = value;
        }
    });
}

function appendChildren(element, children) {
    if (typeof children === 'string') {
        element.textContent = children;
        return;
    }

    children.forEach(child => {
        if (child instanceof Node) {
            element.appendChild(child);
        } else if (child) {
            element.appendChild(document.createTextNode(String(child)));
        }
    });
}

/**
 * Safely queries an element by selector
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (defaults to document)
 * @returns {Element|null} - Found element or null
 */
export function $(selector, context = document) {
    return context.querySelector(selector);
}

/**
 * Safely queries multiple elements by selector
 * @param {string} selector - CSS selector
 * @param {Element} context - Context element (defaults to document)
 * @returns {Element[]} - Array of found elements
 */
export function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

/**
 * Adds event listener with automatic cleanup
 * @param {Element} element - Target element
 * @param {string} event - Event name
 * @param {Function} handler - Event handler
 * @returns {Function} - Cleanup function
 */
export function addEvent(element, event, handler) {
    element.addEventListener(event, handler);
    return () => element.removeEventListener(event, handler);
}

/**
 * Adds multiple event listeners with automatic cleanup
 * @param {Element} element - Target element
 * @param {Object} events - Event map {eventName: handler}
 * @returns {Function} - Cleanup function
 */
export function addEvents(element, events) {
    const cleanups = Object.entries(events).map(([event, handler]) => 
        addEvent(element, event, handler)
    );
    return () => cleanups.forEach(cleanup => cleanup());
}

/**
 * Creates a document fragment from HTML string
 * @param {string} html - HTML string
 * @returns {DocumentFragment} - Created fragment
 */
export function createFragment(html) {
    const template = document.createElement('template');
    template.innerHTML = html.trim();
    return template.content;
}

/**
 * Toggles classes on an element
 * @param {Element} element - Target element
 * @param {Object} classes - Class map {className: boolean}
 */
export function toggleClasses(element, classes) {
    Object.entries(classes).forEach(([className, force]) => {
        element.classList.toggle(className, force);
    });
} 