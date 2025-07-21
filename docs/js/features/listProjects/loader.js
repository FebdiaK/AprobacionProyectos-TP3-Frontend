
import { getProjects } from "../../api/api.js";
import { renderProjects } from "../../ui/ui.js";
import { addSingleCardClassGeneral } from "../../utils/helpers.js";

export async function loadInitialProjects(container) {
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
