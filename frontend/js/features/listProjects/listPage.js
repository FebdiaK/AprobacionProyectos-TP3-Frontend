
import { getProjects, getStatuses } from "../../api/api.js";
import { renderProjects, toggleFiltros, renderOptionList } from "../../ui/ui.js";
import { closeModal } from "../../ui/modal.js";
import { loadProjectsGeneral } from '../../ui/list.js';
import { showNotification, translateStatus, addSingleCardClassGeneral } from '../../utils/helpers.js';

//cargo la lista de proyectos
export async function initializeProjectList() {
    try {
        const container = document.getElementById('projects-container');
        if (!container) {
            console.error("No se encontró el contenedor de proyectos.");
            return;
        }
        await loadInitialProjects(container);
        setupEventListeners(container);

    } catch (error) {
        console.error("Error al inicializar la lista de proyectos:", error);
        showNotification("Error al cargar los proyectos: " + error.message, "error", "general");
    }
}

async function loadInitialProjects(container) {
    const projects = await getProjects();
    if (!projects || projects.length === 0) {
        const noProjectsMessage = document.createElement("p");
        noProjectsMessage.textContent = "No hay proyectos. Cree uno.";
        container.appendChild(noProjectsMessage);
        return;
    }
    renderProjects(projects, container.id, null);
    addSingleCardClassGeneral();
}

async function setupEventListeners(container) {
    const closeButton = document.querySelector('.close-button');
    if (closeButton) {
        closeButton.addEventListener('click', closeModal);
    }
    await renderStatusFilters();

    document.getElementById('filter-form')
        .addEventListener('submit', (e) => onFilterSubmit(e, container));

    document.getElementById("toggle-filtros")
        .addEventListener("click", toggleFiltros);
}

async function onFilterSubmit(e, container) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const filtros = Object.fromEntries(
        [...formData.entries()].filter(([_, v]) => v.trim() !== '')
    );

    await loadProjectsGeneral(filtros, container);
    addSingleCardClassGeneral();
}

async function renderStatusFilters() {
    const statuses = await getStatuses();
    const translatedStatuses = statuses.map(status => ({
        ...status,
        name: translateStatus(status.name)
    }));

    renderOptionList("status-select", translatedStatuses, "name", "id");
}