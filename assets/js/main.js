// Global functions
window.handleLogout = function() {
    try {
        // Clear admin token
        localStorage.removeItem('adminToken');
        localStorage.removeItem('user');
        
        // Close the modal
        if (window.logoutModal) {
            window.logoutModal.close();
        }
        
        // Show success message
        alert('Đăng xuất thành công!');
        
        // Redirect to login page
        window.location.href = '/admin/login';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.');
    }
};

// Performance optimizations
window.PERFORMANCE = {
    // Use requestAnimationFrame for smooth animations
    rafCallbacks: new Set(),
    // Debounce scroll events
    scrollTimeout: null,
    // Throttle frequent updates
    throttleTimeout: null,
    // Track if an animation is in progress
    isAnimating: false
};

// DOM Elements
const langToggle = document.getElementById('langToggle');
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const html = document.documentElement;
const langIndicator = langToggle.querySelector('.lang-indicator');
const langText = langToggle.querySelector('.lang-text');
const langIcon = langToggle.querySelector('svg');

// Optimized spring animation helper
function applySpringAnimation(element, properties, duration = 200) {
    if (!element) return;
    
    // Cancel any existing animation
    element.style.transition = 'none';
    element.offsetHeight; // Force reflow
    
    // Batch style updates
    requestAnimationFrame(() => {
        element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        Object.entries(properties).forEach(([key, value]) => {
            element.style[key] = value;
        });
        
        // Cleanup after animation
        const cleanup = () => {
            element.style.transition = '';
            element.removeEventListener('transitionend', cleanup);
        };
        element.addEventListener('transitionend', cleanup, { once: true });
    });
}

// Initialize theme with light mode default
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

themeToggle.addEventListener('click', () => {
    themeToggle.classList.add('animate-spring');
    setTimeout(() => themeToggle.classList.remove('animate-spring'), 400);
    
    document.body.style.transition = 'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1)';
    html.classList.toggle('dark');
    
    // Update colors with smooth transitions
    if (html.classList.contains('dark')) {
        document.body.classList.add('dark:bg-gray-900');
        document.querySelectorAll('.text-gray-700').forEach(el => {
            el.classList.remove('text-gray-700');
            el.classList.add('text-gray-300');
        });
    } else {
        document.body.classList.remove('dark:bg-gray-900');
        document.querySelectorAll('.text-gray-300').forEach(el => {
            el.classList.remove('text-gray-300');
            el.classList.add('text-gray-700');
        });
    }
    
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
});

// Initialize language
let currentLang = localStorage.getItem('lang') || 'en';
langText.textContent = currentLang.toUpperCase();

// Set initial language in HTML tag
document.documentElement.lang = currentLang;

// Initial content update
updateContent(currentLang);

// Optimized content update function
function updateContent(lang) {
    if (PERFORMANCE.isAnimating) return;
    PERFORMANCE.isAnimating = true;
    
    const elements = document.querySelectorAll('[data-vi], [data-en]');
    const updates = new Map();
    
    // Batch all DOM reads
    elements.forEach(element => {
        const content = element.getAttribute(`data-${lang}`);
        if (content) {
            updates.set(element, {
                content,
                isInput: element.tagName === 'INPUT' || element.tagName === 'TEXTAREA',
                placeholder: element.getAttribute(`data-${lang}-placeholder`)
            });
        }
    });
    
    // Batch all DOM writes
    requestAnimationFrame(() => {
        updates.forEach((update, element) => {
            if (update.isInput && update.placeholder) {
                element.placeholder = update.placeholder;
            } else if (!update.isInput) {
                element.textContent = update.content;
                
                // Optimize animation
                element.style.transform = 'scale(0.98)';
                element.style.opacity = '0.5';
                
                requestAnimationFrame(() => {
                    applySpringAnimation(element, {
                        transform: 'scale(1)',
                        opacity: '1'
                    }, 300);
                });
            }
        });
        
        // Update projects if they exist
        if (typeof loadProjects === 'function') {
            loadProjects();
        }
        
        PERFORMANCE.isAnimating = false;
    });
}

// Language toggle animation
let isRotating = false;
let currentRotation = 0;

langToggle.addEventListener('click', () => {
    // Add spring animation to button
    langToggle.classList.add('animate-spring');
    
    // Get elements
    const langIcon = langToggle.querySelector('svg');
    
    // If already rotating, reverse direction
    if (isRotating) {
        currentRotation = currentRotation > 180 ? 360 : 0;
        langIcon.style.transform = `rotate(${currentRotation}deg) scale(0.95)`;
        langIcon.style.opacity = '0.8';
        langIcon.style.transition = 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)';
    } else {
        // Start new rotation
        isRotating = true;
        currentRotation = currentRotation === 0 ? 360 : 0;
        langIcon.style.transform = `rotate(${currentRotation}deg) scale(0.95)`;
        langIcon.style.opacity = '0.8';
        langIcon.style.transition = 'all 500ms cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    // Scale down and fade out current text
    langText.style.transform = 'scale(0.95)';
    langText.style.opacity = '0';
    langText.style.transition = 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Toggle language with optimized timing
    setTimeout(() => {
        currentLang = currentLang === 'vi' ? 'en' : 'vi';
        localStorage.setItem('lang', currentLang);
        document.documentElement.lang = currentLang;
        
        // Update text with smooth animation
        requestAnimationFrame(() => {
            langText.textContent = currentLang.toUpperCase();
            langText.style.transform = 'scale(1)';
            langText.style.opacity = '1';
            
            // Update content with optimized fade effect
            updateContent(currentLang);
            
            // Dispatch language change event
            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { language: currentLang }
            }));
        });
    }, 200);
    
    // Reset rotation state after animation completes
    setTimeout(() => {
        isRotating = false;
        langToggle.classList.remove('animate-spring');
    }, 500);
});

// Enhanced mobile menu handling with spring animations
let isMenuOpen = false;

function toggleMenu(force = null) {
    isMenuOpen = force !== null ? force : !isMenuOpen;
    
    // Animate menu button with spring effect
    const menuIcon = mobileMenuBtn.querySelector('svg');
    applySpringAnimation(menuIcon, {
        transform: isMenuOpen ? 'rotate(90deg)' : 'rotate(0deg)'
    });
    
    if (isMenuOpen) {
        mobileMenu.classList.remove('hidden');
        requestAnimationFrame(() => {
            applySpringAnimation(mobileMenu, {
                opacity: '1',
                transform: 'translateY(0) scale(1)'
            });
            
            // Animate menu items with stagger
            mobileMenu.querySelectorAll('a').forEach((link, index) => {
                setTimeout(() => {
                    applySpringAnimation(link, {
                        opacity: '1',
                        transform: 'translateX(0)'
                    });
                }, index * 100);
            });
        });
    } else {
        applySpringAnimation(mobileMenu, {
            opacity: '0',
            transform: 'translateY(-10px) scale(0.96)'
        });
        
        // Animate menu items out
        mobileMenu.querySelectorAll('a').forEach((link, index) => {
            setTimeout(() => {
                applySpringAnimation(link, {
                    opacity: '0',
                    transform: 'translateX(-20px)'
                });
            }, index * 50);
        });
        
        setTimeout(() => mobileMenu.classList.add('hidden'), 300);
    }
}

// Initialize menu items state
mobileMenu.querySelectorAll('a').forEach(link => {
    link.style.opacity = '0';
    link.style.transform = 'translateX(-20px)';
});

mobileMenuBtn.addEventListener('click', () => toggleMenu());

// Enhanced smooth scrolling with spring effect
const navLinks = document.querySelectorAll('a[href^="#"]');
const sections = document.querySelectorAll('section[id]');

// Update active link based on scroll position
function updateActiveLink() {
    const scrollPosition = window.scrollY + 100; // Offset for better UX

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to current section link
            const correspondingLink = document.querySelector(`a[href="#${sectionId}"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }
        }
    });
}

// Optimized scroll handler
function optimizedScrollHandler() {
    if (PERFORMANCE.scrollTimeout) {
        cancelAnimationFrame(PERFORMANCE.scrollTimeout);
    }
    
    PERFORMANCE.scrollTimeout = requestAnimationFrame(() => {
        updateActiveLink();
    });
}

// Smooth scroll handling
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').slice(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // Close mobile menu if open
            if (isMenuOpen) {
                toggleMenu(false);
            }
            
            // Add quick feedback animation
            link.classList.add('animate-spring');
            setTimeout(() => link.classList.remove('animate-spring'), 300);
            
            // Smooth scroll to target
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Update active link
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            link.classList.add('active');
        }
    });
});

// Optimized intersection observer
const optimizedObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            requestAnimationFrame(() => {
                entry.target.classList.add('section-visible');
                
                const children = entry.target.querySelectorAll('.animate-on-scroll');
                if (children.length) {
                    children.forEach((child, index) => {
                        setTimeout(() => {
                            child.classList.add('child-visible');
                        }, index * 50);
                    });
                }
                
                optimizedObserver.unobserve(entry.target);
            });
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '-50px 0px -10%'
});

// Add these styles to the head for better performance
const style = document.createElement('style');
style.textContent = `
    .section-hidden {
        opacity: 0;
        transform: translateY(20px);
    }
    
    .section-visible {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.4s ease-out, transform 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    }
    
    .child-hidden {
        opacity: 0;
        transform: translateY(10px);
    }
    
    .child-visible {
        opacity: 1;
        transform: translateY(0);
        transition: opacity 0.3s ease-out, transform 0.3s cubic-bezier(0.17, 0.67, 0.83, 0.67);
    }

    /* Gradient Animations */
    @keyframes gradientFlow {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    @keyframes gradientSpin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .gradient-text {
        background: linear-gradient(135deg, #0EA5E9, #EC4899, #0EA5E9);
        background-size: 200% auto;
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
        animation: gradientFlow 8s ease infinite;
    }

    .btn-primary {
        position: relative;
        overflow: hidden;
        z-index: 1;
    }

    .btn-primary::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #0EA5E9, #EC4899, #0EA5E9);
        background-size: 200% auto;
        animation: gradientFlow 5s ease infinite;
        z-index: -1;
    }

    .skill-tag {
        position: relative;
        overflow: hidden;
        z-index: 1;
    }

    .skill-tag::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, #0EA5E9, #EC4899, #0EA5E9);
        background-size: 200% auto;
        animation: gradientFlow 4s ease infinite;
        z-index: -1;
    }

    .nav-link.active::after {
        background: linear-gradient(135deg, #0EA5E9, #EC4899);
        background-size: 200% auto;
        animation: gradientFlow 4s ease infinite;
    }

    .glass-card-border {
        position: relative;
    }

    .glass-card-border::after {
        content: '';
        position: absolute;
        inset: 0;
        border: 2px solid transparent;
        background: linear-gradient(135deg, #0EA5E9, #EC4899, #0EA5E9) border-box;
        -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
        mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
        -webkit-mask-composite: destination-out;
        mask-composite: exclude;
        background-size: 200% auto;
        animation: gradientFlow 8s ease infinite;
        border-radius: inherit;
        pointer-events: none;
    }
`;
document.head.appendChild(style);

// Add gradient classes to elements
function initGradientEffects() {
    // Add gradient text effect to headings
    document.querySelectorAll('h1, h2, h3').forEach(heading => {
        heading.classList.add('gradient-text');
    });

    // Add gradient border to cards
    document.querySelectorAll('.glass-card').forEach(card => {
        card.classList.add('glass-card-border');
    });

    // Add gradient effect to skill tags
    document.querySelectorAll('.skill-tag').forEach(tag => {
        tag.classList.add('gradient-border');
    });
}

// Initialize gradient effects
document.addEventListener('DOMContentLoaded', initGradientEffects);

// Project Card Interactions
const projectCards = document.querySelectorAll('#projectsGrid > div');

projectCards.forEach(card => {
    // Add hover animation
    card.addEventListener('mouseenter', () => {
        applySpringAnimation(card, {
            transform: 'translateY(-8px)',
        }, 300);
    });

    card.addEventListener('mouseleave', () => {
        applySpringAnimation(card, {
            transform: 'translateY(0)',
        }, 300);
    });

    // Add click animation
    card.addEventListener('click', () => {
        applySpringAnimation(card, {
            transform: 'scale(0.98)',
        }, 150);
    });

    // Add button hover effects
    const buttons = card.querySelectorAll('.btn-primary, .btn-secondary');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            const icon = button.querySelector('svg');
            if (icon) {
                applySpringAnimation(icon, {
                    transform: 'rotate(12deg) scale(1.1)',
                }, 200);
            }
        });

        button.addEventListener('mouseleave', () => {
            const icon = button.querySelector('svg');
            if (icon) {
                applySpringAnimation(icon, {
                    transform: 'rotate(0deg) scale(1)',
                }, 200);
            }
        });
    });
});

// Initialize project data
const projects = [
    {
        title: {
            en: "Project 1",
            vi: "Dự án 1"
        },
        description: {
            en: "Modern web application with beautiful UI/UX design.",
            vi: "Ứng dụng web hiện đại với thiết kế UI/UX đẹp mắt."
        },
        image: "path_to_project_image.jpg",
        technologies: ["React", "Node.js", "MongoDB"],
        demoUrl: "#",
        githubUrl: "#"
    },
    // Add more projects as needed
];

// Optimized project card rendering
function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;
    
    // Create document fragment for batch DOM update
    const fragment = document.createDocumentFragment();
    const template = document.querySelector('#projectsGrid > div');
    
    if (!template) return;
    
    projects.forEach(project => {
        const card = template.cloneNode(true);
        
        // Batch DOM updates
        requestAnimationFrame(() => {
            // Update text content
            card.querySelector('h3').textContent = project.title[currentLang];
            card.querySelector('p').textContent = project.description[currentLang];
            
            // Update attributes
            card.querySelector('img').src = project.image;
            card.querySelector('.btn-primary').href = project.demoUrl;
            card.querySelector('.btn-secondary').href = project.githubUrl;
            
            // Update tags
            const tagsContainer = card.querySelector('.flex.flex-wrap.gap-2');
            tagsContainer.innerHTML = project.technologies.map(tech => 
                `<span class="px-3 py-1 text-xs rounded-full bg-primary-500/20 text-primary-400 backdrop-blur-sm">${tech}</span>`
            ).join('');
            
            // Add to fragment
            fragment.appendChild(card);
        });
    });
    
    // Single DOM update
    requestAnimationFrame(() => {
        projectsGrid.innerHTML = '';
        projectsGrid.appendChild(fragment);
        
        // Animate cards
        const cards = projectsGrid.children;
        Array.from(cards).forEach((card, index) => {
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    });
}

// Optimized event listeners
function addOptimizedEventListeners() {
    // Throttled scroll listener
    window.addEventListener('scroll', optimizedScrollHandler, { passive: true });
    
    // Optimized resize handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (resizeTimeout) {
            cancelAnimationFrame(resizeTimeout);
        }
        resizeTimeout = requestAnimationFrame(() => {
            updateLayout();
        });
    }, { passive: true });
    
    // Optimized intersection observer
    sections.forEach(section => {
        optimizedObserver.observe(section);
    });
}

// Initialize optimizations
function initOptimizations() {
    // Remove unnecessary event listeners
    window.removeEventListener('scroll', updateActiveLink);
    
    // Add optimized event listeners
    addOptimizedEventListeners();
    
    // Initial render with optimizations
    renderProjects();
    
    // Initialize gradient effects with optimization
    requestAnimationFrame(() => {
        initGradientEffects();
    });
}

// Call optimized initialization
document.addEventListener('DOMContentLoaded', initOptimizations, { once: true });

// Initialize language toggle and admin buttons
function initGradientButtons() {
    // Add gradient animation to language toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        const langIndicator = langToggle.querySelector('.lang-indicator');
        if (langIndicator) {
            langIndicator.classList.add('animate-gradient');
        }
    }
}

// Call initialization on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    initGradientButtons();
    initGradientEffects();
});

// Profile dropdown
function setupProfileDropdown() {
    const profileDropdownBtn = document.querySelector('.avatar-container');
    if (!profileDropdownBtn) {
        console.error('Profile dropdown button not found');
        return;
    }

    // Create dropdown content
    const dropdownContent = document.createElement('div');
    dropdownContent.id = 'profileDropdown';
    dropdownContent.className = 'fixed mt-2 w-48 rounded-xl overflow-hidden bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg border border-white/20 dark:border-gray-700/20 z-[9999] hidden transform-gpu transition-all duration-200 ease-out opacity-0 translate-y-[-10px]';
    dropdownContent.innerHTML = `
        <div class="p-4">
            <p class="text-sm font-medium text-gray-900 dark:text-white">Hoàng Việt Quang</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">teosushi1014@gmail.com</p>
        </div>
        <div class="border-t border-gray-200 dark:border-gray-700">
            <button type="button" 
                    id="logoutBtn"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">
                <i class="fas fa-sign-out-alt mr-2"></i>
                Đăng xuất
            </button>
        </div>
    `;

    // Add dropdown to DOM
    document.body.appendChild(dropdownContent);

    let isDropdownOpen = false;

    function updateDropdownPosition() {
        const buttonRect = profileDropdownBtn.getBoundingClientRect();
        const dropdownRect = dropdownContent.getBoundingClientRect();
        
        // Calculate position
        let top = buttonRect.bottom + 8;
        let right = window.innerWidth - buttonRect.right;
        
        // Ensure dropdown doesn't go off screen
        if (top + dropdownRect.height > window.innerHeight) {
            top = buttonRect.top - dropdownRect.height - 8;
        }
        
        if (right + dropdownRect.width > window.innerWidth) {
            right = window.innerWidth - dropdownRect.width - 8;
        }
        
        dropdownContent.style.top = `${top}px`;
        dropdownContent.style.right = `${right}px`;
    }

    function toggleDropdown(show) {
        isDropdownOpen = show;
        
        if (show) {
            dropdownContent.classList.remove('hidden');
            updateDropdownPosition();
            requestAnimationFrame(() => {
                dropdownContent.style.opacity = '1';
                dropdownContent.style.transform = 'translateY(0)';
            });
        } else {
            dropdownContent.style.opacity = '0';
            dropdownContent.style.transform = 'translateY(-10px)';
            setTimeout(() => {
                dropdownContent.classList.add('hidden');
            }, 200);
        }
    }

    // Click handler for avatar button
    profileDropdownBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleDropdown(!isDropdownOpen);
    });

    // Click outside handler
    document.addEventListener('click', (e) => {
        if (isDropdownOpen && !dropdownContent.contains(e.target) && !profileDropdownBtn.contains(e.target)) {
            toggleDropdown(false);
        }
    });

    // Update position on scroll and resize
    window.addEventListener('scroll', () => {
        if (isDropdownOpen) {
            updateDropdownPosition();
        }
    }, { passive: true });

    window.addEventListener('resize', () => {
        if (isDropdownOpen) {
            updateDropdownPosition();
        }
    }, { passive: true });

    // Setup logout button click handler
    const logoutBtn = dropdownContent.querySelector('#logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown(false);
            if (window.logoutModal) {
                window.logoutModal.open();
            } else {
                console.error('Logout modal not found');
            }
        });
    }
}

// Mobile menu
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    if (!mobileMenuBtn || !mobileMenu) return;

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Contact form
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData.entries());

        try {
            // Add your API endpoint here
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Failed to send message');

            // Success handling
            alert('Message sent successfully!');
            contactForm.reset();
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send message. Please try again later.');
        }
    });
}

// Setup add project button
function setupAddProject() {
    const addProjectBtn = document.querySelector('a[href="#projects"]');
    if (!addProjectBtn) return;

    addProjectBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.addProjectModal) {
            window.addProjectModal.open();
        }
    });
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    // Wait for modals to be initialized
    setTimeout(() => {
        initTheme();
        setupThemeToggle();
        setupLanguageToggle();
        setupProfileDropdown();
        setupMobileMenu();
        setupContactForm();
        setupAddProject();
        initGradientEffects();
        initGradientButtons();
    }, 100);
});

// Theme management
function initTheme() {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// Language toggle
function setupLanguageToggle() {
    const langToggle = document.getElementById('langToggle');
    if (!langToggle) return;

    langToggle.addEventListener('click', () => {
        const currentLang = document.documentElement.getAttribute('lang') || 'en';
        const newLang = currentLang === 'en' ? 'vi' : 'en';
        document.documentElement.setAttribute('lang', newLang);
        
        // Update content based on language
        document.querySelectorAll('[data-en]').forEach(el => {
            const viText = el.getAttribute('data-vi');
            const enText = el.getAttribute('data-en');
            el.textContent = newLang === 'en' ? enText : viText;
        });

        // Update placeholders
        document.querySelectorAll('[data-en-placeholder]').forEach(el => {
            const viPlaceholder = el.getAttribute('data-vi-placeholder');
            const enPlaceholder = el.getAttribute('data-en-placeholder');
            el.setAttribute('placeholder', newLang === 'en' ? enPlaceholder : viPlaceholder);
        });
    });
}

// DOM Elements initialization
function initializeElements() {
    const elements = {
        langToggle: document.getElementById('langToggle'),
        themeToggle: document.getElementById('themeToggle'),
        mobileMenuBtn: document.getElementById('mobileMenuBtn'),
        mobileMenu: document.getElementById('mobileMenu'),
        html: document.documentElement
    };

    // Verify all required elements exist
    if (!elements.langToggle) console.error('Language toggle button not found');
    if (!elements.themeToggle) console.error('Theme toggle button not found');
    if (!elements.mobileMenuBtn) console.error('Mobile menu button not found');
    if (!elements.mobileMenu) console.error('Mobile menu not found');

    return elements;
}

// Initialize elements after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const elements = initializeElements();
    
    // Only proceed if we have the required elements
    if (elements.langToggle) {
        const langIndicator = elements.langToggle.querySelector('.lang-indicator');
        const langText = elements.langToggle.querySelector('.lang-text');
        const langIcon = elements.langToggle.querySelector('svg');
        
        if (langIndicator && langText && langIcon) {
            setupLanguageToggle(elements.langToggle, langText, langIcon);
        }
    }

    if (elements.themeToggle) {
        setupThemeToggle(elements.themeToggle);
    }

    // Initialize other components
    setupProfileDropdown();
    setupMobileMenu();
    setupContactForm();
    setupAddProject();
    initGradientEffects();
    initGradientButtons();
}); 