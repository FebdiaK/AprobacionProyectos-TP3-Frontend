const API_URL = "https://localhost:7017/api/Project";

window.onload = async () => {
    try {
        const response = await fetch(API_URL);
        const projects = await response.json();
        renderProjects(projects);
    } catch (error) {
        console.error("Error al obtener proyectos:", error);
        document.getElementById("projects-container").innerHTML = "<p>No se pudieron cargar los proyectos.</p>";
    }
};

function renderProjects(projects) {
    const container = document.getElementById("projects-container");
    container.innerHTML = "";

    projects.forEach(project => {
        const div = document.createElement("div");
        div.className = "project-card";
        div.innerHTML = `
            <h3>${project.title}</h3>
            <p><strong>Estado:</strong> ${project.status}</p>
            <p><strong>Area:</strong> ${project.area}</p>
            <p><strong>Tipo:</strong> ${project.type}</p>
            <button onclick="verDetalle('${project.id}')">Ver informacion detallada</button>
        `;
        container.appendChild(div);
    });
}

async function verDetalle(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const project = await response.json();

        const modalBody = document.getElementById("modal-body");

        // Generar HTML para los pasos de aprobación
        const stepsHtml = project.steps.map(step => `
            <div class="step">
                <p><strong>Orden:</strong> ${step.stepOrder}</p>
                <p><strong>Estado:</strong> ${step.status.name}</p>
                <p><strong>Observaciones:</strong> ${step.observations || 'Pendiente'}</p>
                <p><strong>Fecha de decision:</strong> ${step.decisionDate || 'Pendiente'}</p>
                <p><strong>Rol aprobador:</strong> ${step.approverRole.name}</p>
                <p><strong>Usuario aprobador:</strong> ${step.approverUser?.name || 'No asignado todavia'} (${step.approverUser?.email || ' - '})</p>
                <hr>
            </div>
        `).join("");

        //HTML con la informacion completa
        modalBody.innerHTML = `
            <h2>${project.title}</h2>
            <p><strong>ID:</strong> ${project.id}</p>
            <p><strong>Descripcion:</strong> ${project.description}</p>
            <p><strong>Area:</strong> ${project.area.name}</p>
            <p><strong>Tipo:</strong> ${project.type.name}</p>
            <p><strong>Estado:</strong> ${project.status.name}</p>
            <p><strong>Duracion estimada:</strong> ${project.duration} dias</p>
            <p><strong>Costo estimado:</strong> $${project.amount}</p>
            <p><strong>Usuario creador:</strong><p>
            <p> ${project.user.name} (${project.user.email})<p>
            <p>Rol: ${project.user.role.name}</p>
            <h3>Flujo de aprobacion</h3>
            ${stepsHtml || "<p>No hay pasos de aprobacion definidos.</p>"}
        `;

        document.getElementById("modal").style.display = "block";
    } catch (error) {
        console.error("Error al obtener detalles:", error);
    }
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}


