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
        const spinner = document.getElementById('loadingSpinner');
        if (!spinner) {
            const spinnerElement = document.createElement('div');
            spinnerElement.id = 'loadingSpinner';
            spinnerElement.className = 'loading';
            spinnerElement.innerHTML = `
                <div class="spinner"></div>
                <p class="loading-message">${message}</p>
            `;
            document.body.appendChild(spinnerElement);
        } else {
            spinner.querySelector('.loading-message').textContent = message;
            spinner.style.display = 'flex';
        }
    },
    
    hide() {
        const spinner = document.getElementById('loadingSpinner');
        if (spinner) {
            spinner.style.display = 'none';
        }
    }
};

// Toast Notifications
const toast = {
    show(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove toast after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
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
            const isTabPressed = e.key === 'Tab';
            if (!isTabPressed) return;

            if (e.shiftKey) {
                if (document.activeElement === firstFocusable) {
                    lastFocusable.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastFocusable) {
                    firstFocusable.focus();
                    e.preventDefault();
                }
            }
        });
    }
};

// Form validation
const formValidation = {
    validateInput(input) {
        const group = input.closest('.form-group');
        const isValid = input.checkValidity();
        
        group.classList.remove('success', 'error');
        group.classList.add(isValid ? 'success' : 'error');
        
        return isValid;
    },
    
    validateForm(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }
};

// Keyboard navigation
const keyboardNav = {
    init() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const modal = document.querySelector('.modal.active');
                if (modal) {
                    modal.classList.remove('active');
                }
            }
        });
    }
};

// Export utilities
export { pageTransition, loadingState, toast, focusManager, formValidation, keyboardNav };