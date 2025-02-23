// Modal Management
class Modal {
    constructor(id, options = {}) {
        this.id = id;
        this.options = {
            closeOnClickOutside: true,
            onClose: () => {},
            onOpen: () => {},
            ...options
        };
        this.modal = null;
        this.overlay = null;
        this.isOpen = false;
    }

    init() {
        // Create modal elements if they don't exist
        if (!document.getElementById(this.id)) {
            this.createModal();
        } else {
            this.modal = document.getElementById(this.id);
            this.overlay = document.getElementById(`${this.id}-overlay`);
        }

        // Add event listeners
        this.addEventListeners();
    }

    createModal() {
        // Create overlay
        this.overlay = document.createElement('div');
        this.overlay.id = `${this.id}-overlay`;
        this.overlay.className = 'fixed inset-0 bg-black/50 backdrop-blur-sm z-[6000] hidden opacity-0 transition-opacity duration-200';

        // Create modal
        this.modal = document.createElement('div');
        this.modal.id = this.id;
        this.modal.className = 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-[6001] hidden opacity-0 transform transition-all duration-200 scale-95';
        
        // Add to DOM
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.modal);
    }

    addEventListeners() {
        // Close on click outside
        if (this.options.closeOnClickOutside) {
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });
    }

    open() {
        if (!this.modal || !this.overlay) {
            this.init();
        }

        this.isOpen = true;
        this.overlay.classList.remove('hidden');
        this.modal.classList.remove('hidden');
        
        // Add animation classes
        requestAnimationFrame(() => {
            this.overlay.style.opacity = '1';
            this.modal.style.opacity = '1';
            this.modal.style.transform = 'translate(-50%, -50%) scale(1)';
        });

        // Call onOpen callback
        this.options.onOpen();

        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    close() {
        if (!this.modal || !this.overlay) return;

        this.isOpen = false;
        
        // Add closing animations
        this.overlay.style.opacity = '0';
        this.modal.style.opacity = '0';
        this.modal.style.transform = 'translate(-50%, -50%) scale(0.95)';
        
        // Hide after animation
        setTimeout(() => {
            this.overlay.classList.add('hidden');
            this.modal.classList.add('hidden');
            
            // Call onClose callback
            this.options.onClose();
            
            // Restore body scroll
            document.body.style.overflow = '';
        }, 200);
    }

    setContent(content) {
        if (!this.modal) {
            this.init();
        }
        this.modal.innerHTML = content;
    }
}

// Create and initialize modals immediately
(() => {
    // Create logout modal
    window.logoutModal = new Modal('logoutModal', {
        onOpen: () => {
            console.log('Logout modal opened');
        },
        onClose: () => {
            console.log('Logout modal closed');
        }
    });
    
    // Initialize modal immediately
    window.logoutModal.init();
    window.logoutModal.setContent(`
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl">
            <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Xác nhận đăng xuất</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6">Bạn có chắc chắn muốn đăng xuất không?</p>
            <div class="flex justify-end space-x-4">
                <button type="button" 
                        class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" 
                        onclick="window.logoutModal.close()">
                    Hủy
                </button>
                <button type="button" 
                        class="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        onclick="window.handleLogout()">
                    <i class="fas fa-sign-out-alt mr-2"></i>
                    Đăng xuất
                </button>
            </div>
        </div>
    `);

    // Create add project modal
    window.addProjectModal = new Modal('addProjectModal');
    window.addProjectModal.init();
    window.addProjectModal.setContent(`
        <div class="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-xl">
            <h3 class="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Thêm dự án mới</h3>
            <form id="addProjectForm" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tên dự án</label>
                    <input type="text" name="title" required class="form-input w-full" placeholder="Nhập tên dự án">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mô tả</label>
                    <textarea name="description" required class="form-input w-full" rows="3" placeholder="Nhập mô tả dự án"></textarea>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Hình ảnh</label>
                    <input type="file" name="image" accept="image/*" required class="form-input w-full">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Công nghệ sử dụng</label>
                    <input type="text" name="technologies" required class="form-input w-full" placeholder="VD: React, Node.js, MongoDB">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link Demo</label>
                    <input type="url" name="demoUrl" required class="form-input w-full" placeholder="https://...">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Link Github</label>
                    <input type="url" name="githubUrl" required class="form-input w-full" placeholder="https://...">
                </div>
                <div class="flex justify-end space-x-4 mt-6">
                    <button type="button" 
                            class="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors" 
                            onclick="window.addProjectModal.close()">
                        Hủy
                    </button>
                    <button type="submit" class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                        <i class="fas fa-plus mr-2"></i>
                        Thêm dự án
                    </button>
                </div>
            </form>
        </div>
    `);

    // Log modal initialization
    console.log('Modals initialized successfully');
})();

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
    const addProjectForm = document.getElementById('addProjectForm');
    if (addProjectForm) {
        addProjectForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            
            try {
                const response = await fetch('/api/projects', {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) throw new Error('Failed to add project');

                window.addProjectModal.close();
                // Reload projects
                if (typeof renderProjects === 'function') {
                    renderProjects();
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to add project. Please try again.');
            }
        });
    }
}); 