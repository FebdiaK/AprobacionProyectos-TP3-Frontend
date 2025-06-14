
//Criterio 1: Interfaz web donde se muestran los proyectos

import { getProjects, getStatuses } from "../api/api.js";
import { renderProjects, toggleFiltros, renderOptionList } from "../ui/ui.js";
import { closeModal } from "../ui/modal.js";
import { loadProjectsGeneral } from '../ui/list.js';
import { showNotification, translateStatus, addSingleCardClassGeneral } from '../utils/helpers.js';

document.addEventListener('DOMContentLoaded', async () => {
    await init();
});

async function init() {
    try {
        const container = document.getElementById('projects-container');

        if (!container) { console.error("No se encontro el contenedor de proyectos."); return; }
        const projects = await getProjects();
        if (projects.length === 0) { showNotification("No se encontraron proyectos.", "alert", "general"); return; }

        renderProjects(projects, container.id, null);
        addSingleCardClassGeneral();

        const closeButton = document.querySelector('.close-button');
        if (closeButton) { closeButton.addEventListener('click', closeModal); }

        //filtros
        const statuses = await getStatuses();
        const translatedStatuses = statuses.map(status => ({ ...status, name: translateStatus(status.name) })); //traduzco
        renderOptionList("status-select", translatedStatuses, "name", "id");

        document.getElementById('filter-form').addEventListener('submit', onFilterSubmit);        
        document.getElementById("toggle-filtros").addEventListener("click", toggleFiltros);


    } catch (error) {
        console.error("Error al obtener proyectos:", error);
        showNotification("Error al obtener los proyectos: "+ error, "error", "general");
    }
};

async function onFilterSubmit(e) {
    e.preventDefault();

    const container = document.getElementById('projects-container');

    const formData = new FormData(e.target);
    const filtros = Object.fromEntries([...formData.entries()].filter(([_, v]) => v.trim() !== ''));

    await loadProjectsGeneral(filtros, container);
    addSingleCardClassGeneral();
};

