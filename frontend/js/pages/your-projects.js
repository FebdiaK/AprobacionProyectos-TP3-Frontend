
import { getUsers, getStatuses, sendDecision, sendEdit } from '../api/api.js';
import { renderOptionList, clearContainer, toggleFiltros } from '../ui/ui.js';
import { abrirModalDecision, cerrarModalDecision, closeModal, closeEditModal, projectToEdit } from '../ui/modal.js';
import { verDetalle, selectedProjectId } from '../ui/detail.js';
import { loadProjects } from '../ui/list.js';
import { updateCardProject } from '../utils/updateCardProject.js';
import { showNotification, translateStatus, addSingleCardClass } from '../utils/helpers.js';
window.abrirModalDecision = abrirModalDecision;

const userMap = new Map();
let selectedUser = null;

document.addEventListener('DOMContentLoaded', async () => {
    await init();
});

async function init() {
    const users = await getUsers();
    users.forEach(u => userMap.set(u.id.toString(), u));
    renderOptionList("user-select", users, "name", "id");

    const statuses = await getStatuses();
    const translatedStatuses = statuses.map(status => ({...status, name: translateStatus(status.name)})); //traduzco
    renderOptionList("status-select", translatedStatuses, "name", "id");

    document.getElementById('user-select').addEventListener('change', onUserChange);
    document.getElementById('filter-form').addEventListener('submit', onFilterSubmit);
    document.getElementById('decision-form').addEventListener('submit', onDecisionSubmit);
    document.getElementById("toggle-filtros").addEventListener("click", toggleFiltros);
    document.getElementById("edit-form").addEventListener("submit", onEditSubmit);

    const closeButton = document.querySelector('.close-button');
    if (closeButton) { closeButton.addEventListener('click', closeModal); }

    const closeButtonDecision = document.querySelector('.close-button-decision');
    if (closeButtonDecision) { closeButtonDecision.addEventListener('click', cerrarModalDecision); }

    const closeButtonEdit = document.querySelector('.close-button-edit');
    if (closeButtonDecision) { closeButtonEdit.addEventListener('click', closeEditModal); }
}

// === EVENTOS ===
async function onUserChange() {

    const userId = document.getElementById("user-select").value;
    selectedUser = userMap.get(userId) || null;
    clearContainer('projects-container');

    if (selectedUser) {
        const userRole = selectedUser.role?.name || 'Rol desconocido';
        document.getElementById("user-role").innerHTML = `<p><strong>Rol:</strong> ${userRole}</p>`;
        
        await loadProjects(selectedUser, {});
        addSingleCardClass(); //para mostrar cards individuales centradas (meramente estético)

    } else {

        document.getElementById("user-role").innerHTML = '';
        showNotification("Selecciona un usuario para ver sus proyectos.", "alert", "user");
    }   
};
    
//Criterio 4: El usuario puede realizar búsquedas de sus proyectos además realizar búsquedas y filtrarlos.
async function onFilterSubmit(e) {
    e.preventDefault();
    if (!selectedUser) {
        showNotification("Selecciona un usuario primero.", "error", "filtro");
        return;
    }

    const formData = new FormData(e.target);
    const filtros = Object.fromEntries([...formData.entries()].filter(([_, v]) => v.trim() !== ''));

    await loadProjects(selectedUser, filtros);
    addSingleCardClass();
};

//Criterio 5: El usuario puede tomar una decisión sobre la aprobación de un proyecto
async function onDecisionSubmit(e) { 
    e.preventDefault();

    const stepId = document.getElementById('stepId').value;
    const statusId = document.getElementById('status').value;
    const observation = document.getElementById('observation').value;

    if (!statusId) {
        showNotification("Debe seleccionar un estado.", "error", "decision");
        return;
    }

    try {
        await sendDecision(
            selectedProjectId,
            stepId,
            parseInt(selectedUser.id),
            statusId,
            observation
        );
        showNotification("Decisión tomada correctamente.", "success", "decision");
        updateCardProject(selectedProjectId, selectedUser);

        verDetalle(selectedUser, selectedProjectId); // recargar detalle


        setTimeout(() => cerrarModalDecision(), 4000);

    }catch (err) {
        console.error(err);
        showNotification("Error al decidir: " + err.message, "error");
    }
};

async function onEditSubmit(e) {
    e.preventDefault();

    const titleInput = document.getElementById("edit-title").value.trim();
    const descriptionInput = document.getElementById("edit-description").value?.trim();
    const durationInput = parseInt(document.getElementById("edit-duration").value);


    if (isNaN(durationInput) || durationInput <= 0) { showNotification("La duración debe ser un número positivo.", "alert", "edit");return;}
    
    if (descriptionInput && descriptionInput.length < 10) { showNotification("La descripción mínima es de 10 caracteres.", "alert", "edit");return;}

    const title = titleInput || projectToEdit.title;
    const description = descriptionInput || projectToEdit.description;

    try {
        await sendEdit(projectToEdit.id, title, description, durationInput);
        
        updateCardProject(projectToEdit, selectedUser);
        showNotification("Decisión tomada correctamente.", "success", "edit");

        setTimeout(() => closeEditModal(), 4000); 

    } catch (err) {
        showNotification("Error al editar. " + err.message, "error", "edit");
    }
};








