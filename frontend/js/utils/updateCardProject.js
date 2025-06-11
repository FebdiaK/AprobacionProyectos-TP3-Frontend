import { getProjectDetailsById } from "../api/api.js";
import { verDetalle } from "../ui/detail.js";
import { openEditModal } from "../ui/modal.js";

export async function updateCardProject(projectToEdit, selectedUser) {

    const updatedProject = await getProjectDetailsById(projectToEdit.id); //projecto actualizado
    const card = document.getElementById(`project-card-${projectToEdit.id}`);
    
    if (card) {
        const newCard = createProjectCard(updatedProject, selectedUser); 
        card.replaceWith(newCard);
    }
}
function createProjectCard(project, selectedUser) {

    const div = document.createElement("div");
    div.className = "project-card";
    div.id = `project-card-${project.id}`;

    div.innerHTML += `
        <h2>${project.title}</h2>
        <p><strong>Estado:</strong> ${project.status?.name || project.status}</p>
        <p><strong>Area:</strong> ${project.area?.name || project.area}</p>
        <p><strong>Tipo:</strong> ${project.type?.name || project.type}</p>
        <button class="btn">Ver informacion detallada</button>
    `;
    div.querySelector("button.btn").addEventListener("click", () =>
        verDetalle(selectedUser, project.id)
    );

    if (project.status.id === 4) {
        const editButton = document.createElement("button");
        editButton.textContent = "Editar";
        editButton.classList.add("edit-button");
        editButton.addEventListener("click", () => {
            openEditModal(project);
        });
        div.appendChild(editButton);
    }
    return div;
}

