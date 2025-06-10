
//Criterio 1: Interfaz web donde se muestran los proyectos

import { getProjects } from "../api/api.js";
import { renderProjects } from "../ui/ui.js";
import { closeModal } from "../ui/modal.js";

window.onload = async () => {
    try {
        const container = document.getElementById('projects-container');

        if (!container) {
            console.error("No se encontro el contenedor de proyectos.");
            return;
        }
        
        const projects = await getProjects();

        if (projects.length === 0) {
            container.innerHTML = "<p>No hay proyectos creados. Crea un nuevo proyecto.</p>";
            return;
        }

        renderProjects(projects, container.id, null);

        const closeButton = document.querySelector('.close-button'); 
        if (closeButton) { closeButton.addEventListener('click', closeModal); }


    } catch (error) {
        console.error("Error al obtener proyectos:", error);
        document.getElementById("projects-container").innerHTML = "<p>No se pudieron cargar los proyectos.</p>";
    }
};

