
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
    document.getElementById("edit-message").textContent = "";
    document.getElementById("edit-modal").style.display = "block";
}
export function closeEditModal() {
    document.getElementById("edit-modal").style.display = "none";
}

export const fillModal = (project, selectedUser) => {

    const modalBody = document.getElementById("modal-body");

    const primerPendiente = project.steps.find(s => [1, 4].includes(s.status.id));
    const puedeDecidir = primerPendiente && primerPendiente.approverRole?.id === selectedUser?.role.id;

    const stepsHtml = project.steps.map(step => {
        const esActual = step.id === primerPendiente?.id && puedeDecidir;

        return `
            <div class="step">
                <p><strong>Orden:</strong> ${step.stepOrder}</p>
                <p><strong>Estado:</strong> ${step.status.name}</p>
                <p><strong>Observaciones:</strong> ${step.observations || 'Pendiente'}</p>
                <p><strong>Fecha de decision:</strong> ${step.decisionDate || 'Pendiente'}</p>
                <p><strong>Rol aprobador:</strong> ${step.approverRole.name}</p>
                <p><strong>Usuario aprobador:</strong> ${step.approverUser?.name || 'No asignado'} (${step.approverUser?.email || '-'})</p>
                ${esActual ? `<button onclick="window.abrirModalDecision(${step.id})">Decidir</button>` : ""}
            </div>
        `;
    }).join("");

    modalBody.innerHTML = `
        <h2>${project.title}</h2>
        <p><strong>ID:</strong> ${project.id}</p>
        <p><strong>Descripcion:</strong> ${project.description}</p>
        <p><strong>Area:</strong> ${project.area.name}</p>
        <p><strong>Tipo:</strong> ${project.type.name}</p>
        <p><strong>Estado:</strong> ${project.status.name}</p>
        <p><strong>Duracion estimada:</strong> ${project.duration} dias</p>
        <p><strong>Costo estimado:</strong> $${project.amount}</p>
        <p><strong>Usuario creador: </strong> ${project.user.name} (${project.user.email})<p>
        <p><strong>Rol:</strong> ${project.user.role.name}</p><br>
        <h2>Flujo de aprobacion</h2>
        ${stepsHtml || "<p>No hay pasos de aprobación definidos.</p>"}
    `;
};
