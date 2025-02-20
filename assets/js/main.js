// Khởi tạo dự án mẫu nếu chưa có dữ liệu
if (!localStorage.getItem('projects')) {
    const sampleProjects = [
        {
            id: 1,
            title: 'Portfolio Website',
            description: 'Personal portfolio with glassmorphism effect',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            link: 'https://teosushi1014.github.io'
        }
    ];
    localStorage.setItem('projects', JSON.stringify(sampleProjects));
}

// Project display and animation handling
function displayProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');

    projectsGrid.innerHTML = projects.map((project, index) => `
        <div class="project-card" 
             style="animation: fadeInUp ${0.2 + index * 0.1}s ease-out forwards"
             data-aos="fade-up" 
             data-aos-delay="${index * 100}">
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
            <div class="tech-stack">
                ${project.technologies.map(tech => 
                    `<span class="tech-tag">${tech}</span>`
                ).join('')}
            </div>
            <a href="${project.link}" 
               target="_blank" 
               rel="noopener noreferrer" 
               class="project-link">
                View Project
                <svg xmlns="http://www.w3.org/2000/svg" 
                     width="16" height="16" 
                     viewBox="0 0 24 24" 
                     fill="none" 
                     stroke="currentColor" 
                     stroke-width="2" 
                     stroke-linecap="round" 
                     stroke-linejoin="round"
                     class="link-icon">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </a>
        </div>
    `).join('');

    // Add hover effects
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', (e) => {
            const { left, top } = card.getBoundingClientRect();
            const x = e.clientX - left;
            const y = e.clientY - top;

            card.style.background = `
                radial-gradient(
                    circle at ${x}px ${y}px,
                    var(--glass-light) 0%,
                    var(--glass-bg) 50%
                )
            `;
        });

        card.addEventListener('mouseleave', () => {
            card.style.background = 'var(--glass-light)';
        });
    });
}

// Kiểm tra xem có phải trang admin không
const isAdminPage = window.location.pathname.includes('admin');

if (isAdminPage) {
    // Admin functionality
    function addProject(project) {
        const projects = JSON.parse(localStorage.getItem('projects'));
        projects.push({
            id: Date.now(),
            ...project
        });
        localStorage.setItem('projects', JSON.stringify(projects));
        displayProjects();
    }

    function deleteProject(id) {
        let projects = JSON.parse(localStorage.getItem('projects'));
        projects = projects.filter(project => project.id !== id);
        localStorage.setItem('projects', JSON.stringify(projects));
        displayProjects();
    }
} else {
    // Load projects on main page
    document.addEventListener('DOMContentLoaded', displayProjects);
}

// Smooth scroll handling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            
            // Update active state
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Scroll-based animations
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            if (entry.target.hasAttribute('data-aos')) {
                entry.target.classList.add('aos-animate');
            }
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    displayProjects();
});