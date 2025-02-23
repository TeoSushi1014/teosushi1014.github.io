import { ProjectCard } from './ProjectCard.js';
import { projectService } from '../../services/ProjectService.js';
import { PERFORMANCE } from '../../constants.js';

export class ProjectList {
    constructor(container) {
        this.container = container;
        this.virtualScroller = null;
        this.projects = [];
    }

    init() {
        this.loadProjects();
        this.setupVirtualScroll();
        return this.container;
    }

    async loadProjects() {
        this.projects = projectService.getAllProjects();
        await this.render();
    }

    async render() {
        this.container.innerHTML = '';
        this.virtualScroller ? this.renderVirtual() : this.renderProjects();
    }

    renderVirtual() {
        this.virtualScroller.updateItems(this.projects);
    }

    renderProjects() {
        this.projects.forEach(project => {
            const card = this.createProjectCard(project);
            this.container.appendChild(card);
        });
    }

    createProjectCard(project) {
        const card = new ProjectCard(
            project,
            this.handleEdit.bind(this),
            this.handleDelete.bind(this)
        );
        return card.render();
    }

    setupVirtualScroll() {
        if (this.shouldUseVirtualScroll()) {
            this.initializeVirtualScroller();
        }
    }

    shouldUseVirtualScroll() {
        return this.projects.length > PERFORMANCE.MIN_ITEMS_FOR_VIRTUAL_SCROLL;
    }

    initializeVirtualScroller() {
        this.virtualScroller = new VirtualScroller(
            this.container,
            this.projects,
            PERFORMANCE.VIRTUAL_SCROLL_ITEM_HEIGHT,
            this.createProjectCard.bind(this)
        );
    }

    async handleEdit(projectId) {
        const project = projectService.getProjectById(projectId);
        if (project) {
            this.emitEditEvent(project);
        }
    }

    emitEditEvent(project) {
        this.container.dispatchEvent(new CustomEvent('project:edit', {
            detail: { project }
        }));
    }

    async handleDelete(projectId) {
        if (this.confirmDelete()) {
            await this.deleteProject(projectId);
        }
    }

    confirmDelete() {
        return confirm('Are you sure you want to delete this project?');
    }

    async deleteProject(projectId) {
        const success = await projectService.deleteProject(projectId);
        if (success) {
            await this.loadProjects();
        }
    }

    filter(searchTerm) {
        this.projects = projectService.searchProjects(searchTerm);
        this.render();
    }

    cleanup() {
        if (this.virtualScroller) {
            this.virtualScroller.cleanup();
            this.virtualScroller = null;
        }
    }
} 