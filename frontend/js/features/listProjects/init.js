import { loadInitialProjects } from './loader.js';
import { setupEventListeners } from './listeners.js';
import { showNotification } from '../../utils/helpers.js';

export async function initializeProjectList() {
    try {
        const container = document.getElementById('projects-container');
        if (!container) {
            console.error("No se encontró el contenedor de proyectos.");
            return;
        }
        await loadInitialProjects(container);
        await setupEventListeners(container);
    } catch (error) {
        console.error("Error al inicializar la lista de proyectos:", error);
        showNotification("Error al cargar los proyectos: " + error.message, "error", "general");
    }
}
