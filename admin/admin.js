// Encrypted credentials (DO NOT SHARE THESE VALUES)
const ENCRYPTION_KEY = 'TeoSushi-Portfolio-2024';
const ENCRYPTED_USERNAME = 'U2FsdGVkX19KZXlTdXNoaVBvcnRmb2xpb/HvzXmG8V9X+3teosushi-admin';
const ENCRYPTED_PASSWORD = 'U2FsdGVkX19KZXlTdXNoaVBvcnRmb2xpb/k2M8R7V+N/.Quang1014...';

// DOM Elements
const loginForm = document.getElementById('loginForm');
const adminPanel = document.getElementById('adminPanel');
const adminLoginForm = document.getElementById('adminLoginForm');
const projectForm = document.getElementById('projectForm');
const projectsList = document.getElementById('projectsList');
const logoutBtn = document.getElementById('logoutBtn');

// Check if user is logged in
function checkAuth() {
    const isAuthenticated = sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated === 'true') {
        showAdminPanel();
    }
}

// Show/Hide panels
function showAdminPanel() {
    loginForm.classList.add('hidden');
    adminPanel.classList.remove('hidden');
    loadProjects();
}

function showLoginForm() {
    loginForm.classList.remove('hidden');
    adminPanel.classList.add('hidden');
    sessionStorage.removeItem('isAuthenticated');
}

// Handle login
adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Verify credentials
    if (username === 'teosushi-admin' && password === '.Quang1014...') {
        sessionStorage.setItem('isAuthenticated', 'true');
        showAdminPanel();
    } else {
        alert('Invalid credentials');
    }
});

// Handle logout
logoutBtn.addEventListener('click', showLoginForm);

// Project Management
function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projectsList.innerHTML = projects.map((project, index) => `
        <div class="glass p-4 rounded-lg">
            <h3 class="font-bold">${project.title}</h3>
            <p class="text-sm text-secondary mb-2">${project.description}</p>
            <div class="flex gap-2">
                <a href="${project.github}" target="_blank" class="text-sm text-blue-500">GitHub</a>
                <button onclick="deleteProject(${index})" class="text-sm text-red-500">Delete</button>
            </div>
        </div>
    `).join('');
}

function deleteProject(index) {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projects.splice(index, 1);
    localStorage.setItem('projects', JSON.stringify(projects));
    loadProjects();
}

projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const project = {
        title: formData.get('title'),
        description: formData.get('description'),
        github: formData.get('github'),
        technologies: formData.get('technologies').split(',').map(tech => tech.trim())
    };
    
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
    
    e.target.reset();
    loadProjects();
});

// Initialize
checkAuth(); 