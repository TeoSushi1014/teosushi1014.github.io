import { TIME, STORAGE_KEYS, ROUTES, MESSAGES } from '../constants.js';
import { notificationService } from './NotificationService.js';

class AuthService {
    constructor() {
        this.timeoutId = null;
        this.initializeActivityMonitoring();
    }

    /**
     * Checks if user is authenticated
     * @returns {boolean}
     */
    isAuthenticated() {
        const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
        return Boolean(token);
    }

    /**
     * Redirects to login if not authenticated
     */
    checkAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = ROUTES.LOGIN;
            return false;
        }
        return true;
    }

    /**
     * Handles user logout
     */
    async logout() {
        try {
            // Clear storage
            sessionStorage.clear();
            localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
            
            // Show success notification
            notificationService.success(
                MESSAGES.LOGOUT_SUCCESS,
                MESSAGES.LOGOUT_REDIRECT
            );
            
            // Redirect after delay
            setTimeout(() => {
                window.location.href = ROUTES.LOGIN;
            }, TIME.REDIRECT_DELAY);
        } catch (error) {
            console.error('Logout failed:', error);
            notificationService.error('Error', MESSAGES.LOGOUT_ERROR);
        }
    }

    /**
     * Initializes activity monitoring for session timeout
     */
    initializeActivityMonitoring() {
        const resetTimeout = () => {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                if (confirm(MESSAGES.SESSION_EXPIRE)) {
                    resetTimeout();
                } else {
                    this.logout();
                }
            }, TIME.SESSION_TIMEOUT);
        };

        // Reset timeout on user activity
        ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.addEventListener(event, resetTimeout, { passive: true });
        });

        // Initial timeout
        resetTimeout();
    }

    /**
     * Cleans up activity monitoring
     */
    cleanup() {
        clearTimeout(this.timeoutId);
        ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach(event => {
            document.removeEventListener(event, this.resetTimeout);
        });
    }

    /**
     * Gets the current user's auth token
     * @returns {string|null}
     */
    getToken() {
        return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    }

    /**
     * Sets the auth token
     * @param {string} token
     */
    setToken(token) {
        localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }
}

export const authService = new AuthService(); 