// Project grid management
const projectGrid = document.getElementById('projectGrid');

// Load and display projects
function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    projectGrid.innerHTML = projects.map(project => `
        <article class="preview-item p-6 rounded-2xl">
            <h3 class="text-xl font-bold mb-2">${project.title}</h3>
            <p class="text-secondary mb-4">${project.description}</p>
            <div class="flex flex-wrap gap-2 mb-4">
                ${project.technologies.map(tech => `
                    <span class="glass px-2 py-1 rounded-full text-sm">${tech}</span>
                `).join('')}
            </div>
            <a href="${project.github}" target="_blank" class="nav-button inline-flex items-center">
                <i data-feather="github" class="w-4 h-4 mr-2"></i>
                View on GitHub
            </a>
        </article>
    `).join('');
    
    // Refresh Feather icons
    feather.replace();
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
});

// Refresh projects when localStorage changes (for real-time updates)
window.addEventListener('storage', (e) => {
    if (e.key === 'projects') {
        loadProjects();
    }
}); 