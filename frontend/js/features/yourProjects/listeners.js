
import { onUserChange, onFilterSubmit, onDecisionSubmit, onEditSubmit } from './events.js';
import { cerrarModalDecision, closeModal, closeEditModal, abrirModalDecision } from '../../ui/modal.js';
import { toggleFiltros } from '../../ui/ui.js';
import { setupEditFormValidations } from './setupValidation.js';

export function bindEventListeners() {

    document.getElementById('user-select').addEventListener('change', onUserChange);
    document.getElementById('filter-form').addEventListener('submit', onFilterSubmit);
    document.getElementById('decision-form').addEventListener('submit', onDecisionSubmit);
    document.getElementById('edit-form').addEventListener('submit', onEditSubmit);
    document.getElementById('toggle-filtros').addEventListener('click', toggleFiltros);

    const closeModalBtns = [
        ['.close-button', closeModal],
        ['.close-button-decision', cerrarModalDecision],
        ['.close-button-edit', closeEditModal]
    ];
    closeModalBtns.forEach(([selector, handler]) => {
        const btn = document.querySelector(selector);
        if (btn) btn.addEventListener('click', handler);
    });

    setupEditFormValidations();
    window.abrirModalDecision = abrirModalDecision;  // para que los modales funcionen con botones fuera de su scope
}