// Language handling
const langBtns = document.querySelectorAll('.lang-btn');
const langElements = document.querySelectorAll('[data-vi]');

// Set initial language
const savedLang = localStorage.getItem('lang') || 'vi';
setLanguage(savedLang);

// Enhanced Language Toggle Animation
function animateLanguageSwitch(lang) {
    const elements = document.querySelectorAll('[data-vi], [data-en]');
    
    // Add transition class to all elements
    elements.forEach(el => {
        el.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
    });
    
    // Wait for fade out
    setTimeout(() => {
        setLanguage(lang);
        localStorage.setItem('lang', lang);
        loadProjects();
        
        // Animate elements back in
        elements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 50);
        });
    }, 300);
}

// Enhanced Language Toggle
langBtns.forEach(btn => {
    if (btn.dataset.lang === savedLang) {
        btn.classList.add('active');
    }
    
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        document.body.classList.add('lang-switching');
        animateLanguageSwitch(lang);
        
        setTimeout(() => {
            document.body.classList.remove('lang-switching');
        }, 800);
    });
});

function setLanguage(lang) {
    langElements.forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = el.getAttribute(`data-${lang}-placeholder`) || text;
        } else {
            el.textContent = text;
            
            // Add animation for text elements
            el.style.opacity = '0';
            el.style.transform = 'translateY(10px)';
            
            requestAnimationFrame(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            });
        }
    });
}

// Theme toggling
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
}

// Handle theme toggle click
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    const icon = themeToggle.querySelector('i');
    
    if (body.classList.contains('dark-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    }
});

// Mobile menu handling
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target) && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        icon.classList.add('fa-bars');
        icon.classList.remove('fa-times');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        // Close mobile menu if open
        if (mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }
        
        target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// Active link highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 60) {
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

// Enhanced Project Card Loading
function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('projects')) || [
        {
            title: 'Dự án 1',
            titleEn: 'Project 1',
            description: 'Ứng dụng web hiện đại với thiết kế UI/UX đẹp mắt.',
            descriptionEn: 'A modern web application with stunning UI/UX design.',
            tags: ['React', 'Node.js', 'MongoDB'],
            image: 'https://via.placeholder.com/300x200',
            liveLink: '#',
            githubLink: '#'
        },
        {
            title: 'Dự án 2',
            titleEn: 'Project 2',
            description: 'Thiết kế responsive ưu tiên mobile sáng tạo.',
            descriptionEn: 'Innovative mobile-first responsive design implementation.',
            tags: ['HTML5', 'CSS3', 'JavaScript'],
            image: 'https://via.placeholder.com/300x200',
            liveLink: '#',
            githubLink: '#'
        },
        {
            title: 'Dự án 3',
            titleEn: 'Project 3',
            description: 'Ứng dụng full-stack với tính năng thời gian thực.',
            descriptionEn: 'Full-stack application with real-time features.',
            tags: ['Vue.js', 'Express', 'Socket.io'],
            image: 'https://via.placeholder.com/300x200',
            liveLink: '#',
            githubLink: '#'
        }
    ];

    const currentLang = localStorage.getItem('lang') || 'vi';
    projectsGrid.innerHTML = '';
    
    projects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'glass-card project-card';
        projectCard.style.setProperty('--card-index', index);
        
        // Add hover animation
        projectCard.addEventListener('mouseenter', () => {
            projectCard.style.transform = 'translateY(-8px) scale(1.02)';
            projectCard.style.boxShadow = 'var(--shadow-lg)';
        });
        
        projectCard.addEventListener('mouseleave', () => {
            projectCard.style.transform = 'translateY(0) scale(1)';
            projectCard.style.boxShadow = 'var(--shadow-md)';
        });
        
        projectCard.innerHTML = `
            <div class="project-card-image">
                <img src="${project.image}" alt="${currentLang === 'vi' ? project.title : project.titleEn}"
                     loading="lazy">
            </div>
            <div class="project-card-content">
                <h3>${currentLang === 'vi' ? project.title : project.titleEn}</h3>
                <p class="project-description">${currentLang === 'vi' ? project.description : project.descriptionEn}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.liveLink}" target="_blank" class="btn primary btn-sm" 
                       rel="noopener noreferrer">
                        <i class="fas fa-external-link-alt"></i> 
                        <span data-vi="Xem Demo" data-en="Live Demo">
                            ${currentLang === 'vi' ? 'Xem Demo' : 'Live Demo'}
                        </span>
                    </a>
                    <a href="${project.githubLink}" target="_blank" class="btn secondary btn-sm"
                       rel="noopener noreferrer">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                </div>
            </div>
        `;
        projectsGrid.appendChild(projectCard);
    });
}

// Load projects on page load and language change
loadProjects();
langBtns.forEach(btn => {
    btn.addEventListener('click', loadProjects);
});

// Enhanced Form Validation
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        message: document.getElementById('message').value.trim()
    };
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const currentLang = localStorage.getItem('lang') || 'vi';
    
    if (!formData.name) {
        alert(currentLang === 'vi' ? 'Vui lòng nhập họ tên.' : 'Please enter your name.');
        return;
    }
    
    if (!emailRegex.test(formData.email)) {
        alert(currentLang === 'vi' ? 'Vui lòng nhập email hợp lệ.' : 'Please enter a valid email address.');
        return;
    }
    
    if (!formData.message) {
        alert(currentLang === 'vi' ? 'Vui lòng nhập tin nhắn.' : 'Please enter your message.');
        return;
    }
    
    // Simulate form submission
    const submitButton = contactForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.innerHTML = `<i class="fas fa-spinner fa-spin"></i> ${currentLang === 'vi' ? 'Đang gửi...' : 'Sending...'}`;
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Form submitted:', formData);
        contactForm.reset();
        alert(currentLang === 'vi' ? 'Gửi tin nhắn thành công!' : 'Message sent successfully!');
    } catch (error) {
        console.error('Error submitting form:', error);
        alert(currentLang === 'vi' ? 'Có lỗi xảy ra. Vui lòng thử lại.' : 'An error occurred. Please try again.');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = `<i class="fas fa-paper-plane"></i> <span data-vi="Gửi Tin Nhắn" data-en="Send Message">${currentLang === 'vi' ? 'Gửi Tin Nhắn' : 'Send Message'}</span>`;
    }
});

// Enhanced Intersection Observer
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0) scale(1)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all sections with enhanced animation
document.querySelectorAll('section').forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px) scale(0.95)';
    section.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
    observer.observe(section);
}); 