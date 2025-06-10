

//Criterio 1: Interfaz web donde se muestran los proyectos

const API_URL = "https://localhost:7017/api/Project";

import { getProjects, getProjectById } from "./api.js";
import { renderProjects } from "./ui.js";
import { openModal, fillModal } from "./modal.js";

window.onload = async () => {
    try {
        const projects = await getProjects();
        renderProjects(projects, "projects-container", verDetalle);
    } catch (error) {
        console.error("Error al obtener proyectos:", error);
        document.getElementById("projects-container").innerHTML = "<p>No se pudieron cargar los proyectos.</p>";
    }
};

async function verDetalle(id) {
    try {
        const project = await getProjectById(id);
        fillModal(project);
        openModal();
    } catch (error) {
        console.error("Error al obtener detalles:", error);
    }
}

// exponer función para cerrar modal desde HTML
window.cerrarModal = () => {
    closeModal();
};

