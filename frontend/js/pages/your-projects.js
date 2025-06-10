
import { getUsers, getStatuses, sendDecision } from '../api/api.js';
import { renderOptionList, clearContainer, toggleFiltros } from '../ui/ui.js';
import { abrirModalDecision, cerrarModalDecision, closeModal } from '../ui/modal.js';
import { verDetalle, selectedProjectId } from '../ui/detail.js';
import { loadProjects } from '../ui/list.js';
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
    renderOptionList("status-select", statuses, "name", "id");

    document.getElementById('user-select').addEventListener('change', onUserChange);
    document.getElementById('filter-form').addEventListener('submit', onFilterSubmit);
    document.getElementById('decision-form').addEventListener('submit', onDecisionSubmit);
    document.getElementById("toggle-filtros").addEventListener("click", toggleFiltros);

    const closeButton = document.querySelector('.close-button');
    if (closeButton) { closeButton.addEventListener('click', closeModal); }

    const closeButtonDecision = document.querySelector('.close-button-decision');
    if (closeButtonDecision) { closeButtonDecision.addEventListener('click', cerrarModalDecision); }
}

// === EVENTOS ===
async function onUserChange() {

    const userId = document.getElementById("user-select").value;
    selectedUser = userMap.get(userId) || null;
    clearContainer('projects-container');

    if (selectedUser) {
        await loadProjects(selectedUser, {});
    } else {
        document.getElementById('projects-container').innerHTML = '<p>Selecciona un usuario para ver sus proyectos.</p>';
    }
}

//Criterio 4: El usuario puede realizar búsquedas de sus proyectos además realizar búsquedas y filtrarlos.
async function onFilterSubmit(e) {
    e.preventDefault();
    if (!selectedUser) return alert("Selecciona un usuario primero.");

    const formData = new FormData(e.target);
    const filtros = Object.fromEntries([...formData.entries()].filter(([_, v]) => v.trim() !== ''));

    await loadProjects(selectedUser, filtros);
}

//Criterio 5: El usuario puede tomar una decisión sobre la aprobación de un proyecto
async function onDecisionSubmit(e) { 
    e.preventDefault();

    const stepId = document.getElementById('stepId').value;
    const statusId = document.getElementById('status').value;
    const observation = document.getElementById('observation').value;

    if (!statusId) return alert("Debe seleccionar un estado.");

    try {
        await sendDecision(
            selectedProjectId,
            stepId,
            parseInt(selectedUser.id),
            statusId,
            observation
        );
        alert('Decisión enviada correctamente.');
        cerrarModalDecision();
        //closeModal();
        verDetalle(selectedUser, selectedProjectId); // recargar detalle

    }catch (err) {
        console.error(err);
        alert("Error al decidir: " + err.message);
    }
 }



