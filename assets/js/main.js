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

// Hiển thị dự án
function displayProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');

    projectsGrid.innerHTML = projects.map((project, index) => `
        <div class="project-card" style="animation-delay: ${index * 0.2}s">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="technologies">
                ${project.technologies.map(tech => 
                    `<span title="${tech}">${tech}</span>`
                ).join('')}
            </div>
            <a href="${project.link}" target="_blank" rel="noopener noreferrer">
                View Project
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </a>
        </div>
    `).join('');

    // Add intersection observer for animation
    const cards = document.querySelectorAll('.project-card');
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        },
        { threshold: 0.1 }
    );

    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        observer.observe(card);
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