const API_BASE = "https://localhost:7017/api";

let selectedUserId = null;

document.addEventListener('DOMContentLoaded', () => {
    const userSelect = document.getElementById('user-select');
    const statusSelect = document.getElementById('status-select');
    const form = document.getElementById('filter-form');
    const container = document.getElementById('projects-container');

    // Cargar usuarios y estados al inicio
    fetchUsers();
    fetchStatuses();

    // Selección de usuario
    userSelect.addEventListener('change', async () => {
        selectedUserId = userSelect.value;
        container.innerHTML = '';

        if (selectedUserId) {
            await cargarProyectosPorUsuario(selectedUserId);
        } else {
            container.innerHTML = '<p>Selecciona un usuario para ver sus proyectos.</p>';
        }

    });

    // Formulario de filtros
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedUserId) {
            alert("Selecciona un usuario primero.");
            return;
        }

        const formData = new FormData(form);
        const filtros = {};

        for (const [key, value] of formData.entries()) {
            if (value.trim() !== '') filtros[key] = value;
        }

        filtros.applicant = selectedUserId;
        const proyectosCreados = await fetchProjects(filtros);

        filtros.approvalUser = selectedUserId;
        delete filtros.applicant;
        const proyectosParticipa = await fetchProjects(filtros);

        // quitar duplicados (proyectos ya listados como "creados")
        const creadosIds = new Set(proyectosCreados.map(p => p.id));
        const participaUnicamente = proyectosParticipa.filter(p => !creadosIds.has(p.id));

        container.innerHTML = '';
        renderSeccion('Proyectos creados por el usuario', proyectosCreados);
        renderSeccion('Proyectos donde participa como aprobador', participaUnicamente);
    });


    // === FUNCIONES AUXILIARES ===

    async function fetchUsers() {
        try {
            const res = await fetch(`${API_BASE}/user`);
            const users = await res.json();

            users.forEach(user => {
                const option = document.createElement('option');
                option.value = user.id;
                option.textContent = `${user.name}`;
                userSelect.appendChild(option);
            });

        } catch (error) {
            console.error('Error al cargar usuarios:', error);
        }
    }

async function fetchStatuses() {
    try {
        const res = await fetch(`${API_BASE}/ApprovalStatus`);
            const statuses = await res.json();

            statuses.forEach(status => {
                const option = document.createElement('option');
                option.value = status.id;
                option.textContent = status.name;
                statusSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error al cargar estados:', error);
        }
    }

    async function fetchProjects(filters) {
        const query = new URLSearchParams(filters).toString();
        try {
            const res = await fetch(`${API_BASE}/project?${query}`);
            return await res.json();
        } catch (error) {
            console.error('Error al obtener proyectos:', error);
            return [];
        }
    }

    async function cargarProyectosPorUsuario(userId) {
        const proyectosCreados = await fetchProjects({ applicant: userId });
        const proyectosParticipa = await fetchProjects({ approvalUser: userId });

        const creadosIds = new Set(proyectosCreados.map(p => p.id));
        const participaUnicamente = proyectosParticipa.filter(p => !creadosIds.has(p.id));

        renderSeccion('Proyectos creados por el usuario', proyectosCreados);
        renderSeccion('Proyectos donde puede decidir', participaUnicamente);
    }


    function renderSeccion(titulo, proyectos) {
        const section = document.createElement('section');
        section.classList.add('collapsible-section');

        // Header con botón de colapso
        // Header con título y botón
        const header = document.createElement('div');
        header.className = 'section-header';

        const titleEl = document.createElement('h2');
        titleEl.textContent = titulo;

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'toggle-btn';
        toggleBtn.textContent = '−';
        toggleBtn.onclick = function () {
            toggleSection(toggleBtn);
        };

        header.appendChild(titleEl);
        header.appendChild(toggleBtn);

        const content = document.createElement('div');
        content.className = 'section-content';

        if (proyectos.length === 0) {
            const emptyMsg = document.createElement('p');
            emptyMsg.textContent = 'No hay proyectos en esta seccion.';
            section.appendChild(emptyMsg);
        } else {
            proyectos.forEach(project => {
                const div = document.createElement('div');
                div.className = 'project-card';
                div.innerHTML = `
                    <h3>${project.title}</h3>
                    <p><strong>Area:</strong> ${project.area}</p>
                    <p><strong>Tipo:</strong> ${project.type}</p>
                    <p><strong>Estado:</strong> ${project.status}</p>
                    <button onclick="verDetalle('${project.id}')">Ver mas</button>
                `;
                content.appendChild(div);
            });
        }

        section.appendChild(header);
        section.appendChild(content);

        document.getElementById('projects-container').appendChild(section);
    }

});



// Modal detalle
function verDetalle(id) {
    fetch(`${API_BASE}/project/${id}`)
        .then(response => response.json())
        .then(data => {
            const modal = document.getElementById('modal');
            const modalBody = document.getElementById('modal-body');
            modalBody.innerHTML = `
                <h2>${data.title}</h2>
                <p><strong>ID:</strong> ${data.id}</p>
                <p><strong>Descripcion:</strong> ${data.description}</p>
                <p><strong>Area:</strong> ${data.area.name}</p>
                <p><strong>Tipo:</strong> ${data.type.name}</p>
                <p><strong>Estado:</strong> ${data.status.name}</p>
                <p><strong>Duracion estimada:</strong> ${data.duration} dias</p>
                <p><strong>Costo estimado:</strong> $${data.amount}</p>
                <p><strong>Usuario creador:</strong><p>
                <p> ${data.user.name} (${data.user.email})<p>
                <p>Rol: ${data.user.role.name}</p>
                <h3>Flujo de aprobacion</h3>
                ${data.steps.map(step => `
                    <div class="step">
                        <p><strong>Orden:</strong> ${step.stepOrder}</p>
                        <p><strong>Estado:</strong> ${step.status.name}</p>
                        <p><strong>Observaciones:</strong> ${step.observations || 'Pendiente'}</p>
                        <p><strong>Fecha de decision:</strong> ${step.decisionDate || 'Pendiente'}</p>
                        <p><strong>Rol aprobador:</strong> ${step.approverRole.name}</p>
                        <p><strong>Usuario aprobador:</strong> ${step.approverUser?.name || 'No asignado todavia'} (${step.approverUser?.email || ' - '})</p>
                        <hr>
                    </div>
                `).join('')}`;

            modal.style.display = 'block';
        });
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
}

// Función para mostrar/ocultar filtros
function toggleFiltros() {
    const filtros = document.getElementById('filtros');
    filtros.style.display = filtros.style.display === 'none' ? 'block' : 'none';
}

function toggleSection(button) {
    const content = button.parentElement.nextElementSibling;
    const isVisible = content.style.display !== 'none';

    content.style.display = isVisible ? 'none' : 'block';
    button.textContent = isVisible ? '+' : '−';
}

