// Khởi tạo dự án mẫu nếu chưa có dữ liệu
if (!localStorage.getItem('projects')) {
    const sampleProjects = [
        {
            id: 1,
            title: 'Portfolio Website',
            description: 'Personal portfolio with glassmorphism effect',
            technologies: ['HTML', 'CSS', 'JavaScript'],
            link: 'https://teosuhi1014.github.io'
        }
    ];
    localStorage.setItem('projects', JSON.stringify(sampleProjects));
}

// Hiển thị dự án
function displayProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    const projects = JSON.parse(localStorage.getItem('projects'));

    projectsGrid.innerHTML = projects.map(project => `
        <div class="project-card">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="technologies">
                ${project.technologies.map(tech => `<span>${tech}</span>`).join('')}
            </div>
            <a href="${project.link}" target="_blank">View Project</a>
        </div>
    `).join('');
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