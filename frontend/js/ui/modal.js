import { formatearFechaArgentina } from "../utils/helpers.js";

export let projectToEdit = null;

export const openModal = () => {
    document.getElementById("modal").style.display = "block";
};

export const closeModal = () => {
    document.getElementById("modal").style.display = "none";
};
export function abrirModalDecision(stepId) {
    document.getElementById("stepId").value = stepId;
    document.getElementById("status").value = "";
    document.getElementById("observation").value = "";
    document.getElementById("modal-decision").style.display = "block";
}
export const cerrarModalDecision = () => {
    document.getElementById("modal-decision").style.display = "none";
}

export function openEditModal(project) {

    projectToEdit = project;

    document.getElementById("edit-title").value = project.title;
    document.getElementById("edit-description").value = project.description;
    document.getElementById("edit-duration").value = project.duration;
    document.getElementById("edit-modal").style.display = "block";
}
export function closeEditModal() {
    document.getElementById("edit-modal").style.display = "none";
}

export const fillModal = (project, selectedUser) => {

    console.log(project);

    const modalBody = document.getElementById("modal-body");

    const primerPendiente = project.steps.find(s => [1, 4].includes(s.status.id));
    const puedeDecidir = primerPendiente && primerPendiente.approverRole?.id === selectedUser?.role.id;
    const statusLabels = { 1: 'Pendiente', 2: 'Aprobado', 3: 'Rechazado', 4: 'En observacion' };
    const statusProject = statusLabels[project.status.id] || 'Desconocido';

    const hayRechazado = project.steps.some(s => s.status.id === 3);

    const stepsHtml = project.steps.map(step => {
        const esActual = step.id === primerPendiente?.id && puedeDecidir;
        const statusStep = statusLabels[step.status.id] || 'Desconocido';

        let accionHtml = "";
        if (esActual) {
            if (hayRechazado) { accionHtml = `<div class="notification error" style="display: block;"">Este proyecto ya fue rechazado. No se pueden tomar más decisiones.</div>`; }
            else {accionHtml = `<button onclick="window.abrirModalDecision(${step.id})">Decidir</button>`;}
        }

        return `
            <div class="step">
                <p><strong>Orden:</strong> ${step.stepOrder}</p>
                <p><strong>Estado:</strong> ${statusStep}</p>
                <p><strong>Observaciones:</strong> ${step.observations || '( - ) '}</p>
                <p><strong>Fecha de decisión:</strong> ${formatearFechaArgentina(step.decisionDate)|| '( - )'}</p>
                <p><strong>Rol aprobador:</strong> ${step.approverRole.name}</p>
                <p><strong>Usuario aprobador:</strong> ${step.approverUser?.name || '( - )'} ${step.approverUser?.email || ''}</p>
                ${accionHtml}
            </div>
        `;
    }).join("");

    modalBody.innerHTML = `
        <h2>${project.title}</h2>
        <div class="modal-section">
            <p><strong>ID:</strong> ${project.id}</p>
            <p><strong>Descripción:</strong> ${project.description}</p>
            <p><strong>Área:</strong> ${project.area.name}</p>
            <p><strong>Tipo:</strong> ${project.type.name}</p>
            <p><strong>Estado:</strong> ${statusProject}</p>
            <p><strong>Duración estimada:</strong> ${project.duration} dias</p>
            <p><strong>Fecha de creación:</strong> ${formatearFechaArgentina(project.createdAt) }</p>
            <p><strong>Costo estimado:</strong> $${project.amount}</p>
            <p><strong>Usuario creador: </strong> ${project.user.name} (${project.user.email})<p>
            <p><strong>Rol:</strong> ${project.user.role.name}</p>
        </div>
        <h2>Flujo de aprobación</h2>
        <div class="steps-container">
        ${stepsHtml || "<p>No hay pasos de aprobación definidos.</p>"}
        </div>
    `;
};
