
const API_BASE = "https://localhost:7017/api";

let selectedUser = null;

document.addEventListener('DOMContentLoaded', () => {
    const userSelect = document.getElementById('user-select');
    const statusSelect = document.getElementById('status-select');
    const form = document.getElementById('filter-form');
    const container = document.getElementById('projects-container');

    // cargar usuarios y estados al inicio
    fetchUsers();
    fetchStatuses();

    // eleccion de usuario
    userSelect.addEventListener('change', async () => {

        const selectedId = userSelect.value;

        selectedUser = selectedId ? userMap.get(selectedId) : null;

        container.innerHTML = '';

        if (selectedUser) {
            await cargarProyectosPorUsuario(selectedUser.id);
        } else {
            container.innerHTML = '<p>Selecciona un usuario para ver sus proyectos.</p>';
        }

    });

    // Formulario de filtros
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!selectedUser) {
            alert("Selecciona un usuario primero.");
            return;
        }

        const formData = new FormData(form);
        const filtros = {};

        for (const [key, value] of formData.entries()) {
            if (value.trim() !== '') filtros[key] = value;
        }

        // Sección 1: Proyectos creados por el usuario
        filtros.applicant = selectedUser.id
        const proyectosCreados = await fetchProjects(filtros);

        // Sección 2 y 3: Proyectos donde el usuario puede decidir o ya participó
        filtros.approvalUser = selectedUser.id;
        delete filtros.applicant;
        const proyectosParticipar = await fetchProjects(filtros);

        const creadosIds = new Set(proyectosCreados.map(p => p.id));

        const proyectosSimples = proyectosParticipar.filter(p => !creadosIds.has(p.id));

        // Fetch extendido para cada proyecto
        const proyectosDetallados = await Promise.all(
            proyectosSimples.map(async p => {
                try {
                    const res = await fetch(`${API_BASE}/project/${p.id}`);
                    return await res.json();
                } catch (error) {
                    console.error(`Error al cargar detalles del proyecto ${p.id}:`, error);
                    return null;
                }
            })
        );

        const puedeDecidir = [];
        const yaParticipo = [];

        for (const proyecto of proyectosDetallados) {
            if (!proyecto || !Array.isArray(proyecto.steps)) continue;

            const aproboAntes = proyecto.steps.some(step => step.approverUser?.id === selectedUser.id);
            const tienePasoPendiente = proyecto.steps.some(
                step => (step.status.id === 1 || step.status.id === 4) // pendiente u observado
            );

            if (aproboAntes) {
                yaParticipo.push(proyecto);
            } else if (tienePasoPendiente) {
                puedeDecidir.push(proyecto);
            }
        }

        console.log("Aplico filtros...")
        container.innerHTML = '';
        renderSeccion('Proyectos creados por el usuario', proyectosCreados);
        renderSeccion('Proyectos donde puede decidir', puedeDecidir);
        renderSeccion('Proyectos donde tomó decisión', yaParticipo);
    });


    // === FUNCIONES AUXILIARES ===

    const userMap = new Map();
    async function fetchUsers() {
        try {
            const res = await fetch(`${API_BASE}/user`);
            const users = await res.json();

            users.forEach(user => {
                userMap.set(user.id.toString(), user); //guardo el user completo en el map

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
        const proyectosParticipar = await fetchProjects({ approvalUser: userId });

        //proyectos creados por el usuario
        const creadosIds = new Set(proyectosCreados.map(p => p.id));

        const proyectosSimples = proyectosParticipar.filter(p => !creadosIds.has(p.id));

        // Fetch extendido para cada proyecto
        const proyectosDetallados = await Promise.all(
            proyectosSimples.map(async p => {
                try {
                    const res = await fetch(`${API_BASE}/project/${p.id}`);
                    return await res.json();
                } catch (error) {
                    console.error(`Error al cargar detalles del proyecto ${p.id}:`, error);
                    return null;
                }
            })
        );

        const puedeDecidir = [];
        const yaParticipo = [];

        for (const proyecto of proyectosDetallados) {
            if (!proyecto || !Array.isArray(proyecto.steps)) continue;

            const aproboAntes = proyecto.steps.some(step => step.approverUser?.id === userId);
            const tienePasoPendiente = proyecto.steps.some(
                step => (step.status.id === 1 || step.status.id === 4) // pendiente u observado
            );

            if (aproboAntes) {
                yaParticipo.push(proyecto);
            } else if (tienePasoPendiente) {
                puedeDecidir.push(proyecto);    
            }
        }

        renderSeccion('Proyectos creados por el usuario', proyectosCreados);
        renderSeccion('Proyectos donde puede decidir', puedeDecidir);
        renderSeccion('Proyectos donde tomó decisión', yaParticipo);
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
                    <p><strong>Area:</strong> ${project.area?.name || project.area}</p>
                    <p><strong>Tipo:</strong> ${project.type?.name || project.type}</p>
                    <p><strong>Estado:</strong> ${project.status?.name ||  project.status }</p>
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



// Modal detalle|
function verDetalle(id) {

    //selectedUserId = parseInt(document.getElementById('user-select').value);

    selectedProjectId = id; // Guardar el ID del proyecto seleccionado

    fetch(`${API_BASE}/project/${id}`)
        .then(response => response.json())
        .then(data => {

            const modal = document.getElementById('modal');
            const modalBody = document.getElementById('modal-body');

            //let primerPendiente = data.steps.find(s => s.status.id === 1);
            let primerPendiente2 = data.steps.find(s => s.status.id === 4 || s.status.id === 1);

            let puedeDecidir = primerPendiente2 && primerPendiente2.approverRole?.id == selectedUser.role.id;

            console.log("Usuario logueado:", selectedUser);
            console.log("Paso pendiente:", primerPendiente2);
            console.log("Puede decidir:", puedeDecidir);

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
                ${data.steps.map(step => {

                    const esPasoActual = step.id === primerPendiente2?.id && puedeDecidir;
                    return `
                    <div class="step">
                        <p><strong>Orden:</strong> ${step.stepOrder}</p>
                        <p><strong>Estado:</strong> ${step.status.name}</p>
                        <p><strong>Observaciones:</strong> ${step.observations || 'Pendiente'}</p>
                        <p><strong>Fecha de decisión:</strong> ${step.decisionDate || 'Pendiente'}</p>
                        <p><strong>Rol aprobador:</strong> ${step.approverRole.name}</p>
                        <p><strong>Usuario aprobador:</strong> ${step.approverUser?.name || 'No asignado'} (${step.approverUser?.email || ' - '})</p>
                         ${esPasoActual ? `<button onclick="abrirModalDecision(${step.id})">DECIDIR</button>` : ''}
                    </div>
                `}).join('')}`;

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

function abrirModalDecision(stepId) {
    document.getElementById('stepId').value = stepId;
    document.getElementById('status').value = '';
    document.getElementById('observation').value = '';
    document.getElementById('modal-decision').style.display = 'block';
}

function cerrarModalDecision() {
    document.getElementById('modal-decision').style.display = 'none';
}

// formulario para decidir
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('decision-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const stepId = document.getElementById('stepId').value;
        const statusId = document.getElementById('status').value;
        const observation = document.getElementById('observation').value;

        if (!statusId) {
            alert("Debe seleccionar un estado.");
            return;
        }

        try {
            const res = await fetch(`${API_BASE}/project/${selectedProjectId}/decision`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: parseInt(stepId),
                    user: parseInt(selectedUser.id),
                    status: parseInt(statusId),
                    observation: observation
                })

            });

            if (!res.ok) {
                const error = await res.json();
                alert("Error: " + (error.message || "al decidir."));
                throw new Error(error.message || "Error al decidir.");
            }

            alert('Decisión enviada correctamente.');
            cerrarModalDecision();
            cerrarModal();
            verDetalle(selectedProjectId); // recargar detalle

        } catch (err) {
            console.error(err);
            alert("Error al decidir.");
        }
    });
});
