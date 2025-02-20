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
            title: 'Project 1',
            description: 'A modern web application with stunning UI/UX design.',
            tags: ['React', 'Node.js', 'MongoDB'],
            image: 'https://via.placeholder.com/300x200',
            liveLink: '#',
            githubLink: '#'
        },
        {
            title: 'Project 2',
            description: 'Innovative mobile-first responsive design implementation.',
            tags: ['HTML5', 'CSS3', 'JavaScript'],
            image: 'https://via.placeholder.com/300x200',
            liveLink: '#',
            githubLink: '#'
        },
        {
            title: 'Project 3',
            description: 'Full-stack application with real-time features.',
            tags: ['Vue.js', 'Express', 'Socket.io'],
            image: 'https://via.placeholder.com/300x200',
            liveLink: '#',
            githubLink: '#'
        }
    ];

    projectsGrid.innerHTML = '';
    projects.forEach(project => {
        const projectCard = document.createElement('div');
        projectCard.className = 'glass-card project-card';
        projectCard.innerHTML = `
            <div class="project-card-image">
                <img src="${project.image}" alt="${project.title}">
            </div>
            <div class="project-card-content">
                <h3>${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.liveLink}" target="_blank" class="btn primary btn-sm">
                        <i class="fas fa-external-link-alt"></i> Live Demo
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

// Load projects on page load
loadProjects();

// Form handling with validation
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    };
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Here you would typically send the form data to a server
    console.log('Form submitted:', formData);
    
    // Clear form
    contactForm.reset();
    
    // Show success message
    alert('Message sent successfully!');
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