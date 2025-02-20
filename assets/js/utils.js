// Page Transition Animations
const pageTransition = {
    init() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.3s ease';
        window.addEventListener('load', () => {
            document.body.style.opacity = '1';
        });
    },
    
    beforeLeave() {
        document.body.style.opacity = '0';
    },
    
    enter() {
        document.body.style.opacity = '1';
    }
};

// Loading States
const loadingState = {
    show(message = 'Loading...') {
        const loader = document.createElement('div');
        loader.className = 'loading-overlay';
        loader.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <p>${message}</p>
            </div>
        `;
        document.body.appendChild(loader);
        setTimeout(() => loader.classList.add('active'), 0);
    },
    
    hide() {
        const loader = document.querySelector('.loading-overlay');
        if (loader) {
            loader.classList.remove('active');
            setTimeout(() => loader.remove(), 300);
        }
    }
};

// Toast Notifications
const toast = {
    show(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        
        requestAnimationFrame(() => {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        });
    }
};

// Focus Management
const focusManager = {
    trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable.focus();
                }
            }
        });
        
        firstFocusable.focus();
    }
};

// Export utilities
export { pageTransition, loadingState, toast, focusManager };