// Constants
const EVENTS = {
    FORM_SUBMIT: 'submit',
    INPUT: 'input',
    CLICK: 'click',
    UNLOAD: 'unload',
    SCROLL: 'scroll'
};

const CSS_CLASSES = {
    HIDDEN: 'hidden',
    SHADOW: 'shadow-lg',
    GLASS_CARD: 'glass-card card-hover'
};

const PERFORMANCE = {
    DEBOUNCE_DELAY: 300,
    ANIMATION_FRAME_RATE: 1000 / 60,
    MIN_ITEMS_FOR_VIRTUAL_SCROLL: 20,
    VIRTUAL_SCROLL_ITEM_HEIGHT: 300,
    IMAGE_LAZY_LOAD_OFFSET: 100,
    INTERSECTION_THRESHOLD: 0.1
};

// State Management
const DashboardState = {
    projects: [],
    selectedProjects: new Set(),
    contentUpdateQueue: [],
    virtualScroller: null,
    
    init() {
        try {
            console.log('Debug: Initializing DashboardState');
            this.projects = JSON.parse(localStorage.getItem('projects')) || [];
        } catch (error) {
            console.error('Debug: Error initializing DashboardState:', error);
            this.projects = [];
        }
    },
    
    save() {
        try {
            localStorage.setItem('projects', JSON.stringify(this.projects));
            console.log('Debug: Projects saved to localStorage');
        } catch (error) {
            console.error('Debug: Error saving projects:', error);
        }
    },

    addProject(project) {
        this.projects.push(project);
        this.save();
    },

    updateProject(id, updates) {
        const index = this.projects.findIndex(p => p.id === id);
        if (index !== -1) {
            this.projects[index] = { ...this.projects[index], ...updates };
            this.save();
        }
    },

    deleteProject(id) {
        this.projects = this.projects.filter(p => p.id !== id);
        this.save();
    },

    toggleProjectSelection(id) {
        if (this.selectedProjects.has(id)) {
            this.selectedProjects.delete(id);
        } else {
            this.selectedProjects.add(id);
        }
        DashboardUI.updateBulkActions();
    }
};

// UI Management
class DashboardUI {
    static instance = null;

    constructor() {
        if (DashboardUI.instance) {
            return DashboardUI.instance;
        }
        console.log('Debug: DashboardUI constructor called');
        this.elements = {};
        this.eventListeners = new Map(); // Store event listeners for cleanup
        this.isDropdownOpen = false;
        DashboardUI.instance = this;
    }

    static getInstance() {
        if (!DashboardUI.instance) {
            DashboardUI.instance = new DashboardUI();
        }
        return DashboardUI.instance;
    }

    static updateBulkActions() {
        console.log('Debug: updateBulkActions called');
    }
    
    init() {
        try {
            console.log('=== Debug: Initializing dashboard... ===');
            this.cacheElements();
            this.setupEventListeners();
            console.log('=== Debug: Dashboard initialization complete ===');
        } catch (error) {
            console.error('Debug: Error during initialization:', error);
        }
    }
    
    cacheElements() {
        console.log('Debug: Caching elements...');
        try {
            this.elements = {
                profileDropdown: document.getElementById('profileDropdown'),
                profileDropdownBtn: document.getElementById('profileDropdownBtn'),
                logoutBtn: document.querySelector('[data-action="logout"]')
            };

            Object.entries(this.elements).forEach(([key, element]) => {
                console.log(`Debug: ${key}: ${element ? 'Found' : 'Not found'}`);
            });
        } catch (error) {
            console.error('Debug: Error caching elements:', error);
        }
    }

    setupEventListeners() {
        this.setupDropdown();
        this.setupLogoutHandler();
    }

    addEventListenerWithCleanup(element, eventType, handler, options = false) {
        if (!element) return;
        
        const boundHandler = handler.bind(this);
        element.addEventListener(eventType, boundHandler, options);
        
        // Store for cleanup
        if (!this.eventListeners.has(element)) {
            this.eventListeners.set(element, []);
        }
        this.eventListeners.get(element).push({ eventType, handler: boundHandler, options });
    }

    setupDropdown() {
        const { profileDropdown, profileDropdownBtn } = this.elements;
        if (!profileDropdown || !profileDropdownBtn) {
            console.warn('Dropdown elements not found');
            return;
        }

        this.addEventListenerWithCleanup(profileDropdownBtn, 'click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleDropdown();
        });

        this.addEventListenerWithCleanup(document, 'click', (e) => {
            if (this.isDropdownOpen && 
                !profileDropdown.contains(e.target) && 
                !profileDropdownBtn.contains(e.target)) {
                this.closeDropdown();
            }
        });

        this.closeDropdown();
    }

    setupLogoutHandler() {
        console.log('=== Debug: Starting setupLogoutHandler ===');
        
        try {
            const { logoutBtn } = this.elements;
            if (!logoutBtn) {
                console.warn('Debug: ERROR - Logout button not found');
                return;
            }

            this.addEventListenerWithCleanup(logoutBtn, 'click', this.handleLogoutClick, true);
            console.log('Debug: Added click handler to logout button');

        } catch (error) {
            console.error('Debug: Error in setupLogoutHandler:', error);
        }
    }

    handleLogoutClick(e) {
        console.log('Debug: handleLogoutClick called');
        e.preventDefault();
        e.stopPropagation();
        this.showLogoutConfirmation();
    }

    showLogoutConfirmation() {
        console.log('Debug: showLogoutConfirmation called');
        
        const dialog = document.createElement('div');
        dialog.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[9999]';
        dialog.innerHTML = `
            <div class="glass-card max-w-sm w-full mx-4 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl text-center transform transition-all duration-300 scale-95 opacity-0">
                <svg class="w-16 h-16 mx-auto mb-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <h3 class="text-xl font-bold mb-4">Xác nhận đăng xuất</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-6">Bạn có chắc chắn muốn đăng xuất?</p>
                <div class="flex justify-center gap-4">
                    <button id="cancelLogout" class="px-6 py-2 rounded-xl border-2 border-primary-500/30 hover:bg-primary-500/10 transition-all duration-300">
                        Hủy
                    </button>
                    <button id="confirmLogout" class="px-6 py-2 rounded-xl bg-gradient-to-r from-[#00B0FF] to-[#EC4899] text-white hover:opacity-90 transition-all duration-300">
                        Đăng xuất
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(dialog);

        requestAnimationFrame(() => {
            const dialogCard = dialog.querySelector('.glass-card');
            dialogCard.style.transform = 'scale(1)';
            dialogCard.style.opacity = '1';
        });

        const closeDialog = () => {
            const dialogCard = dialog.querySelector('.glass-card');
            dialogCard.style.transform = 'scale(0.95)';
            dialogCard.style.opacity = '0';
            setTimeout(() => dialog.remove(), 300);
        };

        dialog.querySelector('#cancelLogout').onclick = closeDialog;
        dialog.querySelector('#confirmLogout').onclick = () => {
            this.handleLogout();
            closeDialog();
        };

        dialog.onclick = (e) => {
            if (e.target === dialog) closeDialog();
        };

        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeDialog();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
    }

    handleLogout() {
        console.log('=== Debug: Logout Sequence Started ===');
        try {
            sessionStorage.clear();
            localStorage.clear();
            window.location.href = '../../admin/login/index.html';
        } catch (error) {
            console.error('Debug: Error during logout:', error);
        }
    }

    cleanup() {
        // Clean up all registered event listeners
        this.eventListeners.forEach((listeners, element) => {
            listeners.forEach(({ eventType, handler, options }) => {
                element.removeEventListener(eventType, handler, options);
            });
        });
        this.eventListeners.clear();
    }

    toggleDropdown() {
        this.isDropdownOpen ? this.closeDropdown() : this.openDropdown();
    }

    openDropdown() {
        const { profileDropdown } = this.elements;
        if (!profileDropdown) return;
        profileDropdown.classList.remove(CSS_CLASSES.HIDDEN);
        this.isDropdownOpen = true;
    }

    closeDropdown() {
        const { profileDropdown } = this.elements;
        if (!profileDropdown) return;
        profileDropdown.classList.add(CSS_CLASSES.HIDDEN);
        this.isDropdownOpen = false;
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('=== Debug: DOM Content Loaded ===');
    try {
        const dashboard = DashboardUI.getInstance();
        DashboardState.init();
        dashboard.init();
        console.log('Debug: Dashboard initialized successfully');
    } catch (error) {
        console.error('Debug: Error initializing dashboard:', error);
    }
});
    
// ... rest of the file ... 