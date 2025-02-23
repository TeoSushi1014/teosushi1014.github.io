import { TIME, NOTIFICATION_TYPES, CSS_CLASSES } from '../constants.js';
import { createElement, handleError } from '../utils.js';

class NotificationService {
    constructor() {
        try {
            this.container = this.createNotificationContainer();
            document.body.appendChild(this.container);
            this.notifications = new Set();
        } catch (error) {
            handleError(error, 'NotificationService initialization');
        }
    }

    createNotificationContainer() {
        return createElement('div', {
            id: 'notification-container',
            className: 'fixed top-4 right-4 z-50 flex flex-col gap-2'
        });
    }

    /**
     * Shows a notification
     * @param {string} type - Notification type (success, error, warning, info)
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     * @param {number} duration - Duration in milliseconds
     */
    show(type = NOTIFICATION_TYPES.INFO, title, message, duration = TIME.NOTIFICATION_DURATION) {
        try {
            const notification = this.createNotification(type, title, message);
            this.container.appendChild(notification);
            this.notifications.add(notification);

            // Add slide-in animation
            requestAnimationFrame(() => {
                notification.classList.add('notification-show');
            });

            this.setupAutoDismiss(notification, duration);
        } catch (error) {
            handleError(error, 'Showing notification');
            console.error('Failed to show notification:', { type, title, message });
        }
    }

    createNotification(type, title, message) {
        try {
            const notification = createElement('div', {
                className: `notification ${type}`
            }, [
                createElement('div', {
                    className: 'notification-content'
                }, [
                    createElement('h4', {
                        className: 'notification-title'
                    }, title),
                    createElement('p', {
                        className: 'notification-message'
                    }, message)
                ]),
                createElement('div', {
                    className: 'notification-progress'
                })
            ]);

            const closeButton = createElement('button', {
                className: 'notification-close',
                onclick: () => this.dismissNotification(notification)
            }, '×');

            notification.appendChild(closeButton);
            return notification;
        } catch (error) {
            handleError(error, 'Creating notification');
            throw new Error('Failed to create notification');
        }
    }

    setupAutoDismiss(notification, duration) {
        setTimeout(() => {
            this.dismissNotification(notification);
        }, duration);
    }

    dismissNotification(notification) {
        try {
            notification.classList.add(CSS_CLASSES.SLIDE_OUT);
            this.notifications.delete(notification);
            
            setTimeout(() => {
                if (notification.parentNode === this.container) {
                    this.container.removeChild(notification);
                }
            }, 500);
        } catch (error) {
            handleError(error, 'Dismissing notification');
        }
    }

    /**
     * Shows a success notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     */
    success(title, message) {
        this.show(NOTIFICATION_TYPES.SUCCESS, title, message);
    }

    /**
     * Shows an error notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     */
    error(title, message) {
        this.show(NOTIFICATION_TYPES.ERROR, title, message);
    }

    /**
     * Shows a warning notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     */
    warning(title, message) {
        this.show(NOTIFICATION_TYPES.WARNING, title, message);
    }

    /**
     * Shows an info notification
     * @param {string} title - Notification title
     * @param {string} message - Notification message
     */
    info(title, message) {
        this.show(NOTIFICATION_TYPES.INFO, title, message);
    }

    clearAll() {
        try {
            this.notifications.forEach(notification => {
                this.dismissNotification(notification);
            });
            this.notifications.clear();
        } catch (error) {
            handleError(error, 'Clearing all notifications');
        }
    }

    destroy() {
        try {
            this.clearAll();
            if (this.container && this.container.parentNode) {
                this.container.parentNode.removeChild(this.container);
            }
            this.container = null;
            this.notifications = null;
        } catch (error) {
            handleError(error, 'Destroying notification service');
        }
    }
}

export const notificationService = new NotificationService(); 