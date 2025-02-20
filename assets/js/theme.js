// Get saved theme or default to light
const getTheme = () => localStorage.getItem('theme') || 'light';

// Update theme
const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
    
    // Update ARIA labels
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`);
        themeToggle.setAttribute('aria-pressed', theme === 'dark');
    }
};

// Update theme icon and animations
const updateThemeIcon = (theme) => {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');
    
    if (!sunIcon || !moonIcon) return;
    
    if (theme === 'dark') {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
        moonIcon.style.animation = 'rotateIn 0.5s ease-out';
    } else {
        moonIcon.style.display = 'none';
        sunIcon.style.display = 'block';
        sunIcon.style.animation = 'rotateIn 0.5s ease-out';
    }
};

// Setup keyboard navigation
const setupKeyboardNav = () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const currentTheme = getTheme();
                setTheme(currentTheme === 'light' ? 'dark' : 'light');
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

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = getTheme();
    setTheme(savedTheme);
    setupKeyboardNav();

    // Theme toggle click handler
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = getTheme();
            setTheme(currentTheme === 'light' ? 'dark' : 'light');
        });
    }

    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rotateIn {
            from { transform: rotate(-180deg); opacity: 0; }
            to { transform: rotate(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});

// Export for module usage
export { getTheme, setTheme };