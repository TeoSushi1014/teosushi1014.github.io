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
        loadProjects(); // Reload projects with new language
    });
});

function setLanguage(lang) {
    langElements.forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = el.getAttribute(`data-${lang}-placeholder`);
        } else {
            el.textContent = text;
        }
    });
}

// Credentials
const CREDENTIALS = {
    username: 'teosushi-admin',
    password: '.Quang1014...'
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
        const currentLang = localStorage.getItem('lang') || 'vi';
        alert(currentLang === 'vi' ? 'Thông tin đăng nhập không chính xác!' : 'Invalid credentials!');
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
    const currentLang = localStorage.getItem('lang') || 'vi';
    projectsList.innerHTML = '';
    
    projects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'glass-card project-card';
        projectCard.innerHTML = `
            <div class="project-card-header">
                <h4>${currentLang === 'vi' ? project.title : project.titleEn}</h4>
                <button class="delete-btn" onclick="deleteProject(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="project-card-image">
                <img src="${project.image}" alt="${currentLang === 'vi' ? project.title : project.titleEn}">
            </div>
            <div class="project-card-content">
                <p class="project-description">${currentLang === 'vi' ? project.description : project.descriptionEn}</p>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="skill-tag">${tag}</span>`).join('')}
                </div>
                <div class="project-links">
                    <a href="${project.liveLink}" target="_blank" class="btn primary btn-sm">
                        <i class="fas fa-external-link-alt"></i> 
                        <span>${currentLang === 'vi' ? 'Xem Demo' : 'Live Demo'}</span>
                    </a>
                    <a href="${project.githubLink}" target="_blank" class="btn secondary btn-sm">
                        <i class="fab fa-github"></i> GitHub
                    </a>
                </div>
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
        titleEn: document.getElementById('projectTitleEn').value,
        description: document.getElementById('projectDescription').value,
        descriptionEn: document.getElementById('projectDescriptionEn').value,
        tags: document.getElementById('projectTags').value.split(',').map(tag => tag.trim()),
        image: document.getElementById('projectImage').value,
        liveLink: document.getElementById('projectLiveLink').value,
        githubLink: document.getElementById('projectGithubLink').value
    };
    
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    projects.push(newProject);
    localStorage.setItem('projects', JSON.stringify(projects));
    
    projectForm.reset();
    loadProjects();
    
    const currentLang = localStorage.getItem('lang') || 'vi';
    alert(currentLang === 'vi' ? 'Thêm dự án thành công!' : 'Project added successfully!');
});

// Delete project
function deleteProject(index) {
    const currentLang = localStorage.getItem('lang') || 'vi';
    const confirmMessage = currentLang === 'vi' 
        ? 'Bạn có chắc chắn muốn xóa dự án này?' 
        : 'Are you sure you want to delete this project?';
    
    if (confirm(confirmMessage)) {
        const projects = JSON.parse(localStorage.getItem('projects')) || [];
        projects.splice(index, 1);
        localStorage.setItem('projects', JSON.stringify(projects));
        loadProjects();
        
        const successMessage = currentLang === 'vi'
            ? 'Xóa dự án thành công!'
            : 'Project deleted successfully!';
        alert(successMessage);
    }
}

// Logout handling
const logoutBtn = document.getElementById('logoutBtn');
logoutBtn.addEventListener('click', () => {
    loginSection.style.display = 'block';
    dashboardSection.style.display = 'none';
    loginForm.reset();
    
    const currentLang = localStorage.getItem('lang') || 'vi';
    alert(currentLang === 'vi' ? 'Đã đăng xuất!' : 'Logged out successfully!');
}); 