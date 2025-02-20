// Admin Dashboard functionality
import { getColorPreference, setThemePreference, toggleTheme } from './theme.js';

// Authentication state
let isAuthenticated = false;

// Initialize admin dashboard
function initAdminDashboard() {
    const authContainer = document.getElementById('authContainer');
    const authForm = document.getElementById('authForm');
    const projectForm = document.getElementById('projectForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const userInfo = document.getElementById('userInfo');
    const themeToggle = document.getElementById('themeToggle');

    // Check authentication
    checkAuth();

    // Event listeners
    authForm?.addEventListener('submit', handleLogin);
    projectForm?.addEventListener('submit', handleProjectSubmit);
    logoutBtn?.addEventListener('click', handleLogout);
    themeToggle?.addEventListener('click', toggleTheme);

    // Initialize theme
    setThemePreference();
    
    // Display projects if authenticated
    if (isAuthenticated) {
        displayProjects();
    }
}

// Authentication functions
function checkAuth() {
    const token = localStorage.getItem('adminToken');
    isAuthenticated = !!token;
    updateAuthUI();
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple authentication (replace with proper backend auth)
    if (username === 'admin' && password === 'admin123') {
        localStorage.setItem('adminToken', 'dummy-token');
        isAuthenticated = true;
        updateAuthUI();
        displayProjects();
        showToast('Login successful!', 'success');
    } else {
        showToast('Invalid credentials!', 'error');
    }
}

function handleLogout() {
    localStorage.removeItem('adminToken');
    isAuthenticated = false;
    updateAuthUI();
    showToast('Logged out successfully!', 'success');
}

function updateAuthUI() {
    const authContainer = document.getElementById('authContainer');
    const userInfo = document.getElementById('userInfo');
    const logoutBtn = document.getElementById('logoutBtn');
    const adminContent = document.getElementById('adminContent');

    if (isAuthenticated) {
        authContainer.style.display = 'none';
        userInfo.style.display = 'block';
        logoutBtn.style.display = 'block';
        adminContent.style.display = 'block';
        userInfo.textContent = 'Admin';
    } else {
        authContainer.style.display = 'flex';
        userInfo.style.display = 'none';
        logoutBtn.style.display = 'none';
        adminContent.style.display = 'none';
    }
}

// Project management functions
function handleProjectSubmit(e) {
    e.preventDefault();
    
    try {
        const formData = new FormData(e.target);
        const project = {
            id: Date.now(),
            title: formData.get('title'),
            description: formData.get('description'),
            technologies: formData.get('technologies').split(',').map(tech => tech.trim()),
            link: formData.get('link')
        };

        // Validation
        if (!validateProject(project)) {
            return;
        }

        // Add project
        addProject(project);
        e.target.reset();
        showToast('Project added successfully!', 'success');
    } catch (error) {
        console.error('Error adding project:', error);
        showToast('Error adding project. Please try again.', 'error');
    }
}

function validateProject(project) {
    if (!project.title || project.title.length < 3) {
        showToast('Title must be at least 3 characters long', 'error');
        return false;
    }
    if (!project.description || project.description.length < 10) {
        showToast('Description must be at least 10 characters long', 'error');
        return false;
    }
    if (!project.technologies.length) {
        showToast('At least one technology must be specified', 'error');
        return false;
    }
    if (!project.link || !isValidUrl(project.link)) {
        showToast('Please enter a valid URL', 'error');
        return false;
    }
    return true;
}

function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

function addProject(project) {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
    displayProjects();
}

function deleteProject(id) {
    try {
        let projects = JSON.parse(localStorage.getItem('projects') || '[]');
        projects = projects.filter(project => project.id !== id);
        localStorage.setItem('projects', JSON.stringify(projects));
        displayProjects();
        showToast('Project deleted successfully!', 'success');
    } catch (error) {
        console.error('Error deleting project:', error);
        showToast('Error deleting project. Please try again.', 'error');
    }
}

function displayProjects() {
    const projectsGrid = document.getElementById('projectsGrid');
    if (!projectsGrid) return;

    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    
    projectsGrid.innerHTML = projects.map((project, index) => `
        <div class="project-card" data-id="${project.id}">
            <div class="project-header">
                <h3>${project.title}</h3>
                <button class="delete-btn" onclick="deleteProject(${project.id})">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"></path>
                        <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"></path>
                    </svg>
                </button>
            </div>
            <p>${project.description}</p>
            <div class="tech-stack">
                ${project.technologies.map(tech => `
                    <span class="tech-tag">${tech}</span>
                `).join('')}
            </div>
            <a href="${project.link}" target="_blank" rel="noopener noreferrer" class="project-link">
                View Project
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
            </a>
        </div>
    `).join('');
}

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', initAdminDashboard);

// Export functions for global access
window.deleteProject = deleteProject; 