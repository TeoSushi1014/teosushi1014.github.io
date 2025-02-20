// Language handling
const langBtns = document.querySelectorAll('.lang-btn');
const langElements = document.querySelectorAll('[data-vi]');

// Set initial language
const savedLang = localStorage.getItem('lang') || 'vi';
setLanguage(savedLang);

// Language toggle
langBtns.forEach(btn => {
    if (btn.dataset.lang === savedLang) {
        btn.classList.add('active');
    }
    
    btn.addEventListener('click', () => {
        const lang = btn.dataset.lang;
        langBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        setLanguage(lang);
        localStorage.setItem('lang', lang);
    });
});

function setLanguage(lang) {
    langElements.forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = text;
        } else {
            el.textContent = text;
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

// Load projects from localStorage
const projectsGrid = document.querySelector('.projects-grid');
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
    
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'glass-card project-card';
        projectCard.innerHTML = `
            <div class="project-card-image">
                <img src="${project.image}" alt="${currentLang === 'vi' ? project.title : project.titleEn}">
            </div>
            <div class="project-card-content">
                <h3>${currentLang === 'vi' ? project.title : project.titleEn}</h3>
                <p class="project-description">${currentLang === 'vi' ? project.description : project.descriptionEn}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.liveLink}" target="_blank" class="btn primary btn-sm">
                        <i class="fas fa-external-link-alt"></i> 
                        <span data-vi="Xem Demo" data-en="Live Demo">
                            ${currentLang === 'vi' ? 'Xem Demo' : 'Live Demo'}
                        </span>
                    </a>
                    <a href="${project.githubLink}" target="_blank" class="btn secondary btn-sm">
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

// Form handling with validation
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        const currentLang = localStorage.getItem('lang') || 'vi';
        alert(currentLang === 'vi' ? 'Vui lòng nhập email hợp lệ.' : 'Please enter a valid email address.');
        return;
    }
    
    console.log('Form submitted:', formData);
    contactForm.reset();
    
    const currentLang = localStorage.getItem('lang') || 'vi';
    alert(currentLang === 'vi' ? 'Gửi tin nhắn thành công!' : 'Message sent successfully!');
});

// Intersection Observer for fade-in animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease-out';
    observer.observe(section);
}); 