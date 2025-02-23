import { createElement } from '../../utils/dom.utils.js';
import { CSS_CLASSES } from '../../constants.js';

export class ProjectCard {
    constructor(project, onEdit, onDelete) {
        this.project = project;
        this.onEdit = onEdit;
        this.onDelete = onDelete;
    }

    render() {
        return createElement('div', {
            className: CSS_CLASSES.GLASS_CARD,
            'data-id': this.project.id
        }, [
            this.renderHeader(),
            this.renderBody(),
            this.renderFooter()
        ]);
    }

    renderHeader() {
        return createElement('div', { className: 'card-header' }, [
            createElement('h3', { className: 'card-title' }, this.project.name),
            createElement('span', { className: 'card-category' }, this.project.category)
        ]);
    }

    renderBody() {
        return createElement('div', { className: 'card-body' }, [
            createElement('p', { className: 'card-description' }, this.project.description),
            this.renderTags()
        ]);
    }

    renderTags() {
        return createElement('div', { className: 'card-tags' }, 
            this.project.tags.map(tag => 
                createElement('span', { className: 'tag' }, tag)
            )
        );
    }

    renderFooter() {
        return createElement('div', { className: 'card-footer' }, [
            createElement('button', {
                className: 'edit-btn',
                onclick: () => this.onEdit(this.project.id)
            }, 'Edit'),
            createElement('button', {
                className: 'delete-btn',
                onclick: () => this.onDelete(this.project.id)
            }, 'Delete')
        ]);
    }
} 