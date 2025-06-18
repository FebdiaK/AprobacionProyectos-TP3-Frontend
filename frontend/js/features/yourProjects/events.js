import { clearContainer } from '../../ui/ui.js';
import { showNotification, addSingleCardClass } from '../../utils/helpers.js';
import { loadProjects } from '../../ui/list.js';
import { verDetalle, selectedProjectId } from '../../ui/detail.js';
import { sendDecision, sendEdit } from '../../api/api.js';
import { updateCardProject } from '../../utils/updateCardProject.js';
import { cerrarModalDecision, closeEditModal, projectToEdit } from '../../ui/modal.js';
import { formToFilters, isValidTitle, isValidDescription, isValidDuration } from '../../utils/formValidators.js';
import { userMap, setSelectedUser, selectedUser } from './state.js';

// ========== EVENTOS ==========

//Criterio 2: El usuario debe poder ver la informacion completa de los proyectos.
export async function onUserChange() {
    const userId = document.getElementById("user-select").value;
    const user = userMap.get(userId) || null;
    setSelectedUser(user);
    clearContainer('projects-container');

    const roleContainer = document.getElementById("user-role");
    if (!user) {
        roleContainer.innerHTML = '';
        showNotification("Selecciona un usuario para ver sus proyectos.", "alert", "user");
        return;
    }
    roleContainer.innerHTML = `<p><strong>Rol:</strong> ${user.role?.name || 'Rol desconocido'}</p>`;
    await loadProjects(user, {});
    addSingleCardClass();
}

//Criterio 4: El usuario puede realizar búsquedas de sus proyectos además realizar búsquedas y filtrarlos.
export async function onFilterSubmit(e) {
    e.preventDefault();
    if (!selectedUser) {
        showNotification("Selecciona un usuario primero.", "error", "filtro");
        return;
    }

    const filtros = formToFilters(e.target);
    await loadProjects(selectedUser, filtros);
    addSingleCardClass();
}

//Criterio 5: El usuario puede tomar una decisión sobre la aprobación de un proyecto
export async function onDecisionSubmit(e) {
    e.preventDefault();
    const btn = e.submitter;
    btn.disabled = true;
    btn.classList.add('btn-disabled');

    const stepId = document.getElementById('stepId').value;
    const statusId = document.getElementById('status').value;
    const observation = document.getElementById('observation').value;

    if (!statusId) {
        showNotification("Debe seleccionar un estado.", "error", "decision");
        btn.disabled = false;
        btn.classList.remove('btn-disabled');
        return;
    }

    try {
        await sendDecision(selectedProjectId, stepId, parseInt(selectedUser.id), statusId, observation);
        await updateCardProject(selectedProjectId, selectedUser);
        showNotification("Decisión tomada correctamente.", "success", "decision");
        verDetalle(selectedUser, selectedProjectId);
        setTimeout(() => {
            cerrarModalDecision()
            btn.disabled = false;
            btn.classList.remove('btn-disabled');
        }, 4000);
    } catch (err) {
        showNotification("Error al decidir: " + err.message, "error", "decision");
        btn.disabled = false;
        btn.classList.remove('btn-disabled');
    }
}

// Criterio 6:  El usuario puede editar un proyecto.
export async function onEditSubmit(e) {
    e.preventDefault();
    const btn = e.submitter; // botón que disparó el submit
    btn.disabled = true;     // lo deshabilitamos
    btn.classList.add('btn-disabled');

    const titleValue = document.getElementById("edit-title").value.trim();
    const descriptionValue = document.getElementById("edit-description").value?.trim();
    const durationValue = parseInt(document.getElementById("edit-duration").value);

    if (!isValidTitle(titleValue)) {
        showNotification("El título debe tener al menos 5 caracteres.", "alert", "edit");
        btn.disabled = false;
        btn.classList.remove('btn-disabled');
        return;
    }

    if (!isValidDescription(descriptionValue)) {
        showNotification("La descripción mínima es de 10 caracteres.", "alert", "edit");
        btn.disabled = false;
        btn.classList.remove('btn-disabled');
        return;
    }

    if (!isValidDuration(durationValue)) {
        showNotification("La duración debe ser un número positivo.", "alert", "edit");
        btn.disabled = false;
        btn.classList.remove('btn-disabled');
        return;
    }

    const title = titleValue || projectToEdit.title;
    const description = descriptionValue || projectToEdit.description;

    try {
        const res = await sendEdit(projectToEdit.id, title, description, durationValue);
        if (!res) {
            await updateCardProject(projectToEdit, selectedUser);
            showNotification("Edición realizada correctamente.", "success", "edit");
            addSingleCardClass();
            setTimeout(() => {
                closeEditModal();
                btn.disabled = false;
                btn.classList.remove('btn-disabled'); // se vuelve a habilitar al cerrar
            }, 4000);
        }
    } catch (err) {
        showNotification("Error al editar. " + err.message, "error", "edit");
        btn.disabled = false; // se habilita si falla
        btn.classList.remove('btn-disabled');
    }
}