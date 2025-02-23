import { PERFORMANCE } from '../constants.js';

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
 * Batches DOM updates using requestAnimationFrame
 * @param {Function} updateFn - Function to batch
 * @returns {Promise} - Promise that resolves when the update is complete
 */
export function batchUpdate(updateFn) {
    return new Promise(resolve => {
        requestAnimationFrame(() => {
            updateFn();
            resolve();
        });
    });
}

/**
 * Creates an intersection observer for lazy loading
 * @param {Function} callback - Callback function
 * @param {Object} options - Observer options
 * @returns {IntersectionObserver} - Created observer
 */
export function createIntersectionObserver(callback, options = {}) {
    return new IntersectionObserver(callback, {
        rootMargin: `${PERFORMANCE.IMAGE_LAZY_LOAD_OFFSET}px`,
        threshold: PERFORMANCE.INTERSECTION_THRESHOLD,
        ...options
    });
}

/**
 * Virtual scroller for efficient rendering of large lists
 */
export class VirtualScroller {
    constructor(container, items, itemHeight, renderItem) {
        this.container = container;
        this.items = items;
        this.itemHeight = itemHeight;
        this.renderItem = renderItem;
        this.visibleItems = new Map();
        this.observer = null;
        this.scrollHandler = null;
        this.init();
    }
    
    init() {
        this.setupContainer();
        this.setupObserver();
        this.setupScrollHandler();
        this.updateVisibleItems();
    }

    setupContainer() {
        this.container.style.position = 'relative';
        this.container.style.height = `${this.items.length * this.itemHeight}px`;
    }

    setupObserver() {
        this.observer = createIntersectionObserver(
            this.handleIntersection.bind(this),
            { root: this.container, rootMargin: '100px 0px' }
        );
    }

    setupScrollHandler() {
        this.scrollHandler = throttle(
            () => this.updateVisibleItems(),
            PERFORMANCE.ANIMATION_FRAME_RATE
        );
        this.container.addEventListener('scroll', this.scrollHandler, { passive: true });
    }
    
    updateVisibleItems() {
        const { startIndex, endIndex } = this.calculateVisibleRange();
        this.removeInvisibleItems(startIndex, endIndex);
        this.addVisibleItems(startIndex, endIndex);
    }

    calculateVisibleRange() {
        const scrollTop = this.container.scrollTop;
        const containerHeight = this.container.clientHeight;
        const startIndex = Math.floor(scrollTop / this.itemHeight);
        const endIndex = Math.min(
            startIndex + Math.ceil(containerHeight / this.itemHeight) + 1,
            this.items.length
        );
        return { startIndex, endIndex };
    }

    removeInvisibleItems(startIndex, endIndex) {
        for (const [index, element] of this.visibleItems.entries()) {
            if (index < startIndex || index >= endIndex) {
                element.remove();
                this.visibleItems.delete(index);
            }
        }
    }

    addVisibleItems(startIndex, endIndex) {
        for (let i = startIndex; i < endIndex; i++) {
            if (!this.visibleItems.has(i)) {
                const element = this.createItemElement(i);
                this.container.appendChild(element);
                this.visibleItems.set(i, element);
                this.observer.observe(element);
            }
        }
    }

    createItemElement(index) {
        const element = this.renderItem(this.items[index]);
        element.style.position = 'absolute';
        element.style.top = `${index * this.itemHeight}px`;
        element.style.width = '100%';
        return element;
    }
    
    handleIntersection(entries) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                const index = this.findElementIndex(entry.target);
                if (index !== -1) {
                    entry.target.remove();
                    this.visibleItems.delete(index);
                }
            }
        });
    }
    
    findElementIndex(element) {
        for (const [index, el] of this.visibleItems.entries()) {
            if (el === element) return index;
        }
        return -1;
    }
    
    updateItems(newItems) {
        this.items = newItems;
        this.container.style.height = `${this.items.length * this.itemHeight}px`;
        this.updateVisibleItems();
    }
    
    cleanup() {
        this.observer?.disconnect();
        this.container.removeEventListener('scroll', this.scrollHandler);
        this.visibleItems.clear();
    }
} 