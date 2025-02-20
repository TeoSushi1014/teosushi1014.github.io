// DOM Elements
const projectGrid = document.getElementById('projectGrid');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Mobile Menu Toggle
function toggleMobileMenu() {
    mobileMenu.classList.toggle('hidden');
    const isOpen = !mobileMenu.classList.contains('hidden');
    
    // Animate menu icon
    const menuIcon = menuToggle.querySelector('svg');
    menuIcon.style.transform = isOpen ? 'rotate(90deg)' : '';
    menuIcon.style.transition = 'transform 0.3s ease';
}

menuToggle.addEventListener('click', toggleMobileMenu);

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (!mobileMenu.classList.contains('hidden')) {
            toggleMobileMenu();
        }
    });
});

// Smooth scroll to sections
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            window.scrollTo({
                top: targetSection.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Project grid animations
function initProjectAnimations() {
    gsap.from('.preview-item', {
        scrollTrigger: {
            trigger: '.preview-grid',
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2
    });
}

// Load and display projects with enhanced animations
function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    projectGrid.innerHTML = projects.map(project => `
        <article class="preview-item p-6 rounded-2xl">
            <div class="project-header mb-4">
                <div class="project-title-wrapper flex items-center justify-between">
                    <h3 class="text-xl font-bold">${project.title}</h3>
                    <div class="project-links flex gap-2">
                        <a href="${project.github}" target="_blank" class="project-link" title="View on GitHub">
                            <i data-feather="github"></i>
                        </a>
                        ${project.demo ? `
                            <a href="${project.demo}" target="_blank" class="project-link" title="Live Demo">
                                <i data-feather="external-link"></i>
                            </a>
                        ` : ''}
                    </div>
                </div>
                <div class="project-meta flex items-center gap-2 mt-2 text-sm text-secondary">
                    <i data-feather="calendar" class="w-4 h-4"></i>
                    <span>${new Date().toLocaleDateString()}</span>
                </div>
            </div>
            
            <div class="project-content">
                <p class="text-secondary mb-4 line-clamp-3">${project.description}</p>
                
                <div class="project-tech mb-4">
                    <div class="tech-title text-sm font-medium mb-2">Technologies</div>
                    <div class="tech-tags flex flex-wrap gap-2">
                        ${project.technologies.map(tech => `
                            <span class="tech-tag glass px-2 py-1 rounded-full text-sm">
                                ${tech}
                            </span>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <div class="project-footer mt-4 pt-4 border-t border-glass flex justify-between items-center">
                <button class="btn-details text-sm" onclick="toggleProjectDetails(this)">
                    <span class="flex items-center gap-1">
                        <i data-feather="info"></i>
                        More Details
                    </span>
                </button>
                <a href="${project.github}" target="_blank" class="btn-primary text-sm">
                    <i data-feather="code" class="w-4 h-4 mr-1"></i>
                    View Code
                </a>
            </div>
            
            <div class="project-details hidden mt-4 pt-4 border-t border-glass">
                <div class="details-content">
                    <h4 class="font-medium mb-2">Project Details</h4>
                    <p class="text-secondary text-sm mb-2">${project.description}</p>
                    ${project.features ? `
                        <div class="features mt-3">
                            <h4 class="font-medium mb-2">Key Features</h4>
                            <ul class="list-disc list-inside text-sm text-secondary">
                                ${project.features.map(feature => `
                                    <li>${feature}</li>
                                `).join('')}
                            </ul>
                        </div>
                    ` : ''}
                </div>
            </div>
        </article>
    `).join('');
    
    // Refresh Feather icons
    feather.replace();
    
    // Initialize project animations
    initProjectAnimations();
    
    // Initialize hover effects
    initProjectHoverEffects();
}

// Project hover effects
function initProjectHoverEffects() {
    const projects = document.querySelectorAll('.preview-item');
    
    projects.forEach(project => {
        project.addEventListener('mouseenter', () => {
            gsap.to(project, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        project.addEventListener('mouseleave', () => {
            gsap.to(project, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}

// Toggle project details
function toggleProjectDetails(button) {
    const project = button.closest('.preview-item');
    const details = project.querySelector('.project-details');
    const isHidden = details.classList.contains('hidden');
    
    if (isHidden) {
        details.classList.remove('hidden');
        gsap.from(details, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
        });
        button.querySelector('span').innerHTML = `
            <i data-feather="chevron-up"></i>
            Less Details
        `;
    } else {
        gsap.to(details, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: 'power2.in',
            onComplete: () => {
                details.classList.add('hidden');
                details.style.height = 'auto';
                details.style.opacity = 1;
            }
        });
        button.querySelector('span').innerHTML = `
            <i data-feather="info"></i>
            More Details
        `;
    }
    feather.replace();
}

// Scroll-based navigation highlight
function updateNavHighlight() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// Skills animations
function initSkillsAnimation() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    gsap.from(skillItems, {
        scrollTrigger: {
            trigger: '.skills-grid',
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        opacity: 0,
        y: 30,
        duration: 0.6,
        stagger: 0.1
    });
    
    const progressBars = document.querySelectorAll('.skill-progress');
    progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        
        gsap.to(bar, {
            scrollTrigger: {
                trigger: bar,
                start: 'top center+=200',
                toggleActions: 'play none none reverse'
            },
            width: `${progress}%`,
            duration: 1.5,
            ease: 'power2.out'
        });
    });
}

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <svg class="animate-spin h-5 w-5 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        `;
        
        try {
            // Here you would typically send the data to your server
            // For now, we'll simulate a server response
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            // Show success message
            showToast('Message sent successfully!', 'success');
            contactForm.reset();
        } catch (error) {
            // Show error message
            showToast('Failed to send message. Please try again.', 'error');
        } finally {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalContent;
        }
    });
}

// Toast Notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type} glass`;
    toast.innerHTML = `
        <div class="toast-content flex items-center gap-2">
            <i data-feather="${type === 'success' ? 'check-circle' : 'alert-circle'}" 
               class="w-5 h-5 ${type === 'success' ? 'text-green-500' : 'text-red-500'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    feather.replace();
    
    // Remove toast after animation
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    updateNavHighlight();
    initSkillsAnimation();
    initContactForm();
    
    // Hero section animations
    gsap.from('.hero-title', {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-subtitle', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.3,
        ease: 'power3.out'
    });
    
    gsap.from('.hero-cta', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out'
    });
    
    // About section animations
    gsap.from('.achievement-card', {
        scrollTrigger: {
            trigger: '.achievements',
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2
    });
    
    gsap.from('.timeline-item', {
        scrollTrigger: {
            trigger: '.timeline',
            start: 'top center+=100',
            toggleActions: 'play none none reverse'
        },
        x: -30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2
    });
});

// Refresh projects when localStorage changes
window.addEventListener('storage', (e) => {
    if (e.key === 'projects') {
        loadProjects();
    }
}); 