import { getProjectDetailsById } from "../api/api.js";
import { verDetalle } from "../ui/detail.js";
import { openEditModal } from "../ui/modal.js";

export async function updateCardProject(projectToEdit, selectedUser) {

    const projectId = typeof projectToEdit === 'object' ? projectToEdit.id : projectToEdit;

    const updatedProject = await getProjectDetailsById(projectId); //projecto actualizado
    const card = document.getElementById(`project-card-${projectId}`);
    
    if (card) {
        const newCard = createProjectCard(updatedProject, selectedUser);
        card.replaceWith(newCard);
    }
}
function createProjectCard(project, selectedUser) {
    const statusTranslations = { 'Pending': 'Pendiente', 'Approved': 'Aprobado', 'Rejected': 'Rechazado', 'Observed': 'Observado' };
    const statusProject = statusTranslations[project.status] || statusTranslations[project.status.name] || 'Desconocido';

    const div = document.createElement("div");
    div.className = "project-card";
    div.id = `project-card-${project.id}`;

    div.innerHTML = `
            <h2>${project.title}</h2>
            <p><strong>Estado:</strong> ${statusProject}</p>
            <p><strong>Área:</strong> ${project.area?.name || project.area}</p>
            <p><strong>Tipo:</strong> ${project.type?.name || project.type}</p>
            <div class="button-group">
            <button class="btn">Ver información detallada</button>
            </div>
        `;
    div.querySelector("button").addEventListener("click", () => verDetalle(selectedUser, project.id));

    if (selectedUser !== null) {
        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.classList.add("btn", "edit-button");

        const isEditable = project.status.id === 4; // Observado

        if (isEditable) {
            editButton.addEventListener("click", () => openEditModal(project));
        } else {
            editButton.disabled = true;
            editButton.classList.add("btn-disabled");
        }

        const buttonGroup = div.querySelector(".button-group");
        buttonGroup.appendChild(editButton);
    }
    return div;
}

