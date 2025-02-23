// Project data
const projects = [
    {
        title: 'Project 1',
        description: 'Description for project 1',
        image: 'assets/images/project1.jpg',
        tags: ['HTML', 'CSS', 'JavaScript'],
        link: '#'
    },
    {
        title: 'Project 2',
        description: 'Description for project 2',
        image: 'assets/images/project2.jpg',
        tags: ['React', 'Node.js', 'MongoDB'],
        link: '#'
    }
];

// Render projects
function renderProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    projectsGrid.innerHTML = projects.map(project => `
        <div class="glass-card animate-hover">
            <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover rounded-lg mb-4">
            <h3 class="text-xl font-semibold mb-2">${project.title}</h3>
            <p class="text-muted mb-4">${project.description}</p>
            <div class="flex flex-wrap gap-2 mb-4">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
            <a href="${project.link}" class="btn-primary inline-flex items-center">
                <span>View Project</span>
                <i class="fas fa-arrow-right ml-2"></i>
            </a>
        </div>
    `).join('');
}

// Initialize projects
document.addEventListener('DOMContentLoaded', renderProjects); 