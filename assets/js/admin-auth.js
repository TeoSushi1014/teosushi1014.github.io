// Constants
const AUTH_TOKEN_KEY = 'adminAuth';
const THEME_KEY = 'theme';
const LANG_KEY = 'lang';

// Language data
const translations = {
    vi: {
        username: 'Tên đăng nhập',
        password: 'Mật khẩu',
        signIn: 'Đăng nhập',
        backToHome: 'Về trang chủ',
        pleaseSignIn: 'Vui lòng đăng nhập để tiếp tục',
        invalidCredentials: 'Thông tin đăng nhập không chính xác',
        adminLogin: 'Đăng nhập quản trị'
    },
    en: {
        username: 'Username',
        password: 'Password',
        signIn: 'Sign In',
        backToHome: 'Back to Home',
        pleaseSignIn: 'Please sign in to continue',
        invalidCredentials: 'Invalid credentials',
        adminLogin: 'Admin Login'
    }
};

// Theme handling
function initTheme() {
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    
    // Check saved theme or system preference
    if (localStorage.getItem(THEME_KEY) === 'dark' || 
        (!localStorage.getItem(THEME_KEY) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        html.classList.add('dark');
        updateThemeIcon(true);
    }

    // Theme toggle click handler
    themeToggle?.addEventListener('click', () => {
        const isDark = html.classList.toggle('dark');
        localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
        updateThemeIcon(isDark);
    });
}

function updateThemeIcon(isDark) {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    const sunIcon = `<svg class="w-6 h-6 text-primary-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"/>
        <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>`;
    
    const moonIcon = `<svg class="w-6 h-6 text-primary-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>`;

    themeToggle.innerHTML = isDark ? moonIcon : sunIcon;
}

// Language handling
function initLanguage() {
    const langToggle = document.getElementById('langToggle');
    const currentLang = localStorage.getItem(LANG_KEY) || 'vi';
    
    updateLanguage(currentLang);
    
    langToggle?.addEventListener('click', () => {
        const newLang = localStorage.getItem(LANG_KEY) === 'en' ? 'vi' : 'en';
        localStorage.setItem(LANG_KEY, newLang);
        updateLanguage(newLang);
    });
}

function updateLanguage(lang) {
    // Update language indicator
    const langText = document.querySelector('.lang-text');
    if (langText) {
        langText.textContent = lang.toUpperCase();
    }

    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
            if (element.tagName === 'INPUT') {
                element.placeholder = translations[lang][key];
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
}

// Login form handling
function initLoginForm() {
    const form = document.getElementById('loginForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        try {
            const success = await handleLogin(username, password);
            if (success) {
                window.location.href = '/admin/dashboard';
            } else {
                showError(translations[localStorage.getItem(LANG_KEY) || 'vi'].invalidCredentials);
            }
        } catch (error) {
            showError(error.message);
        }
    });
}

async function handleLogin(username, password) {
    // Here you would typically make an API call to your backend
    // For demo purposes, we'll use a simple check
    if (username === 'admin' && password === 'admin') {
        // Set session token
        localStorage.setItem(AUTH_TOKEN_KEY, 'demo-token');
        return true;
    }
    return false;
}

function showError(message) {
    // Create or update error message element
    let errorDiv = document.getElementById('loginError');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.id = 'loginError';
        errorDiv.className = 'text-red-500 text-center mt-4 animate-fade-in';
        document.getElementById('loginForm').appendChild(errorDiv);
    }
    errorDiv.textContent = message;

    // Auto hide after 3 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Animation handling
function initAnimations() {
    // Add fade-in animation to main content
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('animate-fade-in');
    }

    // Add hover animations to buttons
    document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
        button.addEventListener('mouseenter', (e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
        });
        button.addEventListener('mouseleave', (e) => {
            e.currentTarget.style.transform = 'translateY(0)';
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initLanguage();
    initLoginForm();
    initAnimations();
}); 