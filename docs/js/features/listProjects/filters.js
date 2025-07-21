
import { getStatuses } from "../../api/api.js";
import { translateStatus } from "../../utils/helpers.js";
import { renderOptionList, toggleFiltros } from "../../ui/ui.js";
import { loadProjectsGeneral } from '../../ui/list.js';
import { addSingleCardClassGeneral } from '../../utils/helpers.js';

export async function renderStatusFilters() {
    const statuses = await getStatuses();
    const translatedStatuses = statuses.map(status => ({
        ...status,
        name: translateStatus(status.name)
    }));
    renderOptionList("status-select", translatedStatuses, "name", "id");
}

export function handleFilterForm(container) {
    const form = document.getElementById('filter-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);
        const filtros = Object.fromEntries(
            [...formData.entries()].filter(([_, v]) => v.trim() !== '')
        );

        await loadProjectsGeneral(filtros, container);
        addSingleCardClassGeneral();
    });
}

export function setupFilterToggle() {
    const toggleButton = document.getElementById("toggle-filtros");
    toggleButton.addEventListener("click", toggleFiltros);
}
