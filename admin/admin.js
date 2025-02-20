// Credentials config
const CREDENTIALS = {
    username: 'teosushi-admin',
    password: '.Quang1014...',
    salt: 'portfolio-salt-2024'
};

// Function to encrypt text
function encryptText(text, salt) {
    return CryptoJS.AES.encrypt(text, salt).toString();
}

// Function to decrypt text
function decryptText(encrypted, salt) {
    const bytes = CryptoJS.AES.decrypt(encrypted, salt);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// Login form handling
const loginForm = document.getElementById('loginForm');
const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
        loginSection.style.display = 'none';
        dashboardSection.style.display = 'block';
        loadProjects();
    } else {
        alert('Invalid credentials!');
    }
});

// Password visibility toggle
const togglePassword = document.querySelector('.toggle-password');
const passwordInput = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    togglePassword.classList.toggle('fa-eye');
    togglePassword.classList.toggle('fa-eye-slash');
});

// Project management
const projectForm = document.getElementById('projectForm');
const projectsList = document.getElementById('projectsList');

// Load projects from localStorage
function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    projectsList.innerHTML = '';
    
    projects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'glass-card project-card';
        projectCard.innerHTML = `
            <button class="delete-btn" onclick="deleteProject(${index})">
                <i class="fas fa-times"></i>
            </button>
            <img src="${project.image}" alt="${project.title}">
            <h4>${project.title}</h4>
            <p>${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
            </div>
        `;
        projectsList.appendChild(projectCard);
    });
}

// Add new project
projectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newProject = {
        title: document.getElementById('projectTitle').value,
        description: document.getElementById('projectDescription').value,
        tags: document.getElementById('projectTags').value.split(',').map(tag => tag.trim()),
        image: document.getElementById('projectImage').value
    };
    
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));
    
    projectForm.reset();
    loadProjects();
});

// Delete project
function deleteProject(index) {
    if (confirm('Are you sure you want to delete this project?')) {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        projects.splice(index, 1);
        localStorage.setItem('projects', JSON.stringify(projects));
        loadProjects();
    }
}

// Logout handling
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    loginForm.reset();
}); 