// Time Constants
export const TIME = {
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
    NOTIFICATION_DURATION: 3000,
    REDIRECT_DELAY: 1500,
};

// Performance Constants
export const PERFORMANCE = {
    DEBOUNCE_DELAY: 300,
    THROTTLE_DELAY: 100,
    ANIMATION_FRAME_RATE: 16,
    IMAGE_LAZY_LOAD_OFFSET: 100,
    INTERSECTION_THRESHOLD: 0.1,
    VIRTUAL_SCROLL_ITEM_HEIGHT: 300,
    MIN_ITEMS_FOR_VIRTUAL_SCROLL: 20
};

// Storage Keys
export const STORAGE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    PROJECTS: 'projects',
    THEME: 'theme',
    LANGUAGE: 'language'
};

// Routes
export const ROUTES = {
    LOGIN: '../../login/',
    DASHBOARD: './dashboard.html'
};

// CSS Classes
export const CSS_CLASSES = {
    SHOW: 'show',
    HIDDEN: 'hidden',
    SHADOW: 'shadow-lg',
    SLIDE_OUT: 'slide-out',
    GLASS_CARD: 'glass-card group hover:shadow-lg transition-all duration-300'
};

// Event Types
export const EVENTS = {
    USER_ACTIVITY: ['mousedown', 'keydown', 'scroll', 'touchstart'],
    FORM_SUBMIT: 'submit',
    CLICK: 'click',
    INPUT: 'input',
    KEYDOWN: 'keydown',
    SCROLL: 'scroll',
    RESIZE: 'resize',
    UNLOAD: 'unload'
};

// Notification Types
export const NOTIFICATION_TYPES = {
    SUCCESS: 'success',
    ERROR: 'error',
    WARNING: 'warning',
    INFO: 'info'
};

// Messages
export const MESSAGES = {
    LOGOUT_SUCCESS: 'Đăng xuất thành công',
    LOGOUT_REDIRECT: 'Bạn sẽ được chuyển hướng...',
    LOGOUT_ERROR: 'Không thể đăng xuất. Vui lòng thử lại.',
    SESSION_EXPIRE: 'Phiên làm việc sắp hết hạn. Bạn có muốn tiếp tục?',
    PROJECT_SAVE_SUCCESS: 'Dự án đã được lưu',
    PROJECT_SAVE_ERROR: 'Không thể lưu dự án'
}; 