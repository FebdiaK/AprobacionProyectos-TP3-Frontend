
import { closeModal } from "../../ui/modal.js";
import { renderStatusFilters, handleFilterForm, setupFilterToggle } from "./filters.js";

export async function setupEventListeners(container) {
    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }

    await renderStatusFilters();
    handleFilterForm(container);
    setupFilterToggle();
}
