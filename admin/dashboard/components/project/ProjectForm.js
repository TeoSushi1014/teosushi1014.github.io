import { createElement } from '../../utils/dom.utils.js';
import { validateProject } from '../../utils/validation.utils.js';
import { projectService } from '../../services/ProjectService.js';
import { notificationService } from '../../services/NotificationService.js';

export class ProjectForm {
    constructor(onSubmitSuccess) {
        this.form = null;
        this.onSubmitSuccess = onSubmitSuccess;
        this.projectId = null;
        this.statusOptions = ['Planning', 'In Progress', 'Completed', 'On Hold'];
    }

    init() {
        this.form = this.createForm();
        this.bindEvents();
        return this.form;
    }

    createForm() {
        return createElement('form', {
            id: 'projectForm',
            className: 'project-form'
        }, [
            this.createInput('name', 'Project Name', 'text', true),
            this.createTextarea('description', 'Description', true),
            this.createInput('category', 'Category', 'text', true),
            this.createSelect('status', 'Status', this.statusOptions, true),
            this.createInput('demo', 'Demo URL', 'url'),
            this.createInput('source', 'Source URL', 'url'),
            this.createInput('tags', 'Tags (comma separated)', 'text'),
            this.createSubmitButton()
        ]);
    }

    createInput(name, label, type = 'text', required = false) {
        return createElement('div', { className: 'form-group' }, [
            createElement('label', { htmlFor: name }, label),
            createElement('input', {
                id: name,
                name,
                type,
                required,
                className: 'form-control'
            })
        ]);
    }

    createTextarea(name, label, required = false) {
        return createElement('div', { className: 'form-group' }, [
            createElement('label', { htmlFor: name }, label),
            createElement('textarea', {
                id: name,
                name,
                required,
                className: 'form-control'
            })
        ]);
    }

    createSelect(name, label, options, required = false) {
        return createElement('div', { className: 'form-group' }, [
            createElement('label', { htmlFor: name }, label),
            createElement('select', {
                id: name,
                name,
                required,
                className: 'form-control'
            }, options.map(option => 
                createElement('option', { value: option }, option)
            ))
        ]);
    }

    createSubmitButton() {
        return createElement('button', {
            type: 'submit',
            className: 'submit-btn'
        }, 'Save Project');
    }

    bindEvents() {
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
    }

    async handleSubmit(event) {
        event.preventDefault();
        const formData = this.getFormData();

        try {
            await this.saveProject(formData);
            this.resetForm();
            this.onSubmitSuccess();
        } catch (error) {
            console.error('Project submission failed:', error);
            notificationService.error('Error', 'Could not save project');
        }
    }

    async saveProject(formData) {
        if (this.projectId) {
            return projectService.updateProject(this.projectId, formData);
        }
        return projectService.addProject(formData);
    }

    getFormData() {
        const formElements = this.form.elements;
        return {
            name: formElements.name.value,
            description: formElements.description.value,
            category: formElements.category.value,
            status: formElements.status.value,
            demo: formElements.demo.value,
            source: formElements.source.value,
            tags: this.parseTags(formElements.tags.value)
        };
    }

    parseTags(tagsString) {
        return tagsString.split(',')
            .map(tag => tag.trim())
            .filter(Boolean);
    }

    setProject(project) {
        if (!project) return;
        
        this.projectId = project.id;
        Object.entries(project).forEach(([key, value]) => {
            const element = this.form.elements[key];
            if (element) {
                element.value = Array.isArray(value) ? value.join(', ') : value;
            }
        });
    }

    resetForm() {
        this.form.reset();
        this.projectId = null;
    }
} 