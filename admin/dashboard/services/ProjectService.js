import { STORAGE_KEYS } from '../constants.js';
import { safeJSONParse, validateProject, generateUniqueId, handleError } from '../utils.js';

class ProjectService {
    constructor() {
        this.projects = [];
        this.selectedProjects = new Set();
        this.eventEmitter = new EventTarget();
        this.init();
    }

    /**
     * Initializes the project service
     */
    init() {
        try {
            this.projects = safeJSONParse(localStorage.getItem(STORAGE_KEYS.PROJECTS), []);
            this.emit('projects:loaded', this.projects);
        } catch (error) {
            handleError(error, 'ProjectService initialization');
            this.projects = [];
        }
    }

    /**
     * Saves projects to localStorage
     */
    save() {
        try {
            localStorage.setItem(STORAGE_KEYS.PROJECTS, JSON.stringify(this.projects));
            this.emit('projects:saved', this.projects);
        } catch (error) {
            handleError(error, 'Saving projects');
            throw new Error('Failed to save projects');
        }
    }

    /**
     * Gets all projects
     * @returns {Array} Array of projects
     */
    getAllProjects() {
        return [...this.projects];
    }

    /**
     * Gets a project by ID
     * @param {string} id Project ID
     * @returns {Object|null} Project object or null if not found
     */
    getProjectById(id) {
        return this.projects.find(p => p.id === id) || null;
    }

    /**
     * Adds a new project
     * @param {Object} project Project object
     * @returns {Object} Added project
     */
    async addProject(project) {
        try {
            if (!validateProject(project)) {
                throw new Error('Invalid project data');
            }

            const newProject = {
                ...project,
                id: generateUniqueId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };

            this.projects.push(newProject);
            this.save();
            this.emit('project:added', newProject);
            return newProject;
        } catch (error) {
            handleError(error, 'Adding project');
            throw new Error('Failed to add project');
        }
    }

    /**
     * Updates an existing project
     * @param {string} id Project ID
     * @param {Object} updates Update object
     * @returns {Object} Updated project
     */
    async updateProject(id, updates) {
        try {
            const index = this.projects.findIndex(p => p.id === id);
            if (index === -1) {
                throw new Error('Project not found');
            }

            const updatedProject = {
                ...this.projects[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };

            if (!validateProject(updatedProject)) {
                throw new Error('Invalid project data');
            }

            this.projects[index] = updatedProject;
            this.save();
            this.emit('project:updated', updatedProject);
            return updatedProject;
        } catch (error) {
            handleError(error, 'Updating project');
            throw new Error('Failed to update project');
        }
    }

    /**
     * Deletes a project
     * @param {string} id Project ID
     * @returns {boolean} Success status
     */
    async deleteProject(id) {
        try {
            const initialLength = this.projects.length;
            this.projects = this.projects.filter(p => p.id !== id);
            
            if (this.projects.length === initialLength) {
                throw new Error('Project not found');
            }

            this.save();
            this.selectedProjects.delete(id);
            this.emit('project:deleted', id);
            return true;
        } catch (error) {
            handleError(error, 'Deleting project');
            throw new Error('Failed to delete project');
        }
    }

    /**
     * Toggles project selection
     * @param {string} id Project ID
     */
    toggleProjectSelection(id) {
        if (this.selectedProjects.has(id)) {
            this.selectedProjects.delete(id);
        } else {
            this.selectedProjects.add(id);
        }
        this.emit('selection:changed', Array.from(this.selectedProjects));
    }

    /**
     * Gets selected projects
     * @returns {Array} Array of selected project IDs
     */
    getSelectedProjects() {
        return Array.from(this.selectedProjects);
    }

    /**
     * Clears project selection
     */
    clearSelection() {
        this.selectedProjects.clear();
        this.emit('selection:changed', []);
    }

    /**
     * Filters projects by search term
     * @param {string} searchTerm Search term
     * @returns {Array} Filtered projects
     */
    searchProjects(searchTerm) {
        try {
            if (!searchTerm) return this.getAllProjects();

            const term = searchTerm.toLowerCase();
            return this.projects.filter(project => {
                return (
                    project.name.toLowerCase().includes(term) ||
                    project.description.toLowerCase().includes(term) ||
                    project.category.toLowerCase().includes(term) ||
                    project.tags.some(tag => tag.toLowerCase().includes(term))
                );
            });
        } catch (error) {
            handleError(error, 'Searching projects');
            return [];
        }
    }

    destroy() {
        this.projects = [];
        this.selectedProjects.clear();
        this.eventEmitter = null;
    }
}

export const projectService = new ProjectService(); 