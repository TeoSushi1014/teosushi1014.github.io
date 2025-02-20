// Theme handling
const STORAGE_KEY = 'theme-preference';
const HTML = document.documentElement;

const getColorPreference = () => {
    if (localStorage.getItem(STORAGE_KEY)) {
        return localStorage.getItem(STORAGE_KEY);
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const setThemePreference = () => {
    const theme = getColorPreference();
    HTML.setAttribute('data-theme', theme);
    updateThemeIcon(theme);

    // Apply theme-specific CSS variables
    if (theme === 'dark') {
        document.body.style.background = 'var(--bg-gradient-dark)';
        document.body.style.color = 'var(--text-primary-dark)';
    } else {
        document.body.style.background = 'var(--bg-gradient-light)';
        document.body.style.color = 'var(--text-primary-light)';
    }
}

const updateThemeIcon = (theme) => {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (sunIcon && moonIcon) {
        if (theme === 'dark') {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        } else {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        }
    }
}

// Theme toggle functionality
const toggleTheme = () => {
    const current = getColorPreference();
    const newTheme = current === 'light' ? 'dark' : 'light';
    
    HTML.setAttribute('data-theme', newTheme);
    localStorage.setItem(STORAGE_KEY, newTheme);
    setThemePreference();
}

// Event Listeners
window.addEventListener('DOMContentLoaded', () => {
    setThemePreference();

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
});

// Watch for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ({ matches: isDark }) => {
    const theme = isDark ? 'dark' : 'light';
    HTML.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    setThemePreference();
});

// Setup keyboard navigation
const setupKeyboardNav = () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
            }
        });
    }

    // Add keyboard navigation for nav links
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach((link, index) => {
        link.setAttribute('role', 'menuitem');
        link.setAttribute('tabindex', '0');
        
        link.addEventListener('keydown', (e) => {
            let targetLink;
            
            switch (e.key) {
                case 'ArrowRight':
                case 'ArrowDown':
                    e.preventDefault();
                    targetLink = navLinks[index + 1] || navLinks[0];
                    targetLink.focus();
                    break;
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    targetLink = navLinks[index - 1] || navLinks[navLinks.length - 1];
                    targetLink.focus();
                    break;
                case 'Home':
                    e.preventDefault();
                    navLinks[0].focus();
                    break;
                case 'End':
                    e.preventDefault();
                    navLinks[navLinks.length - 1].focus();
                    break;
            }
        });
    });
};

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes rotateIn {
        from { transform: rotate(-180deg); opacity: 0; }
        to { transform: rotate(0); opacity: 1; }
    }
`;
document.head.appendChild(style);

// Export for module usage
export { getColorPreference, setThemePreference, toggleTheme };