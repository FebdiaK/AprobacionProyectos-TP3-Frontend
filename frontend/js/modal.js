
export const openModal = () => {
    document.getElementById("modal").style.display = "block";
};

export const closeModal = () => {
    document.getElementById("modal").style.display = "none";
};

export const fillModal = (project) => {
    const modalBody = document.getElementById("modal-body");

    const stepsHtml = project.steps.map(step => `
        <div class="step">
            <p><strong>Orden:</strong> ${step.stepOrder}</p>
            <p><strong>Estado:</strong> ${step.status.name}</p>
            <p><strong>Observaciones:</strong> ${step.observations || 'Pendiente'}</p>
            <p><strong>Fecha de decision:</strong> ${step.decisionDate || 'Pendiente'}</p>
            <p><strong>Rol aprobador:</strong> ${step.approverRole.name}</p>
            <p><strong>Usuario aprobador:</strong> ${step.approverUser?.name || 'No asignado'} (${step.approverUser?.email || '-'})</p>
            <hr>
        </div>
    `).join("");

    modalBody.innerHTML = `
        <h2>${project.title}</h2>
        <p><strong>ID:</strong> ${project.id}</p>
        <p><strong>Descripcion:</strong> ${project.description}</p>
        <p><strong>Area:</strong> ${project.area.name}</p>
        <p><strong>Tipo:</strong> ${project.type.name}</p>
        <p><strong>Estado:</strong> ${project.status.name}</p>
        <p><strong>Duracion estimada:</strong> ${project.duration} dias</p>
        <p><strong>Costo estimado:</strong> $${project.amount}</p>
        <p><strong>Usuario creador:</strong></p>
        <p>${project.user.name} (${project.user.email})</p>
        <p>Rol: ${project.user.role.name}</p>
        <h3>Flujo de aprobación</h3>
        ${stepsHtml || "<p>No hay pasos de aprobación definidos.</p>"}
    `;
};
