
const API_BASE = "https://localhost:7017/api";
const userMap = new Map();
let selectedUser = null;
let selectedProjectId = null;


document.addEventListener('DOMContentLoaded', () => {
    init();
});

function init() {
    const userSelect = document.getElementById('user-select');
    const form = document.getElementById('filter-form');
    const formDecision = document.getElementById('decision-form');

    fetchUsers();
    fetchStatuses();

    userSelect.addEventListener('change', onUserChange);
    form.addEventListener('submit', onFilterSubmit);
    formDecision.addEventListener('submit', onDecisionSubmit);
}

// === EVENTOS ===

// eleccion de usuario
async function onUserChange() {
    const userSelect = document.getElementById('user-select');
    const selectedId = userSelect.value;
    const container = document.getElementById('projects-container');
    container.innerHTML = '';

    selectedUser = selectedId ? userMap.get(selectedId) : null;

    if (selectedUser) {
        await cargarProyectosPorUsuario(selectedUser.id);
    } else {
        container.innerHTML = '<p>Selecciona un usuario para ver sus proyectos.</p>';
    }
}

//Criterio 4: El usuario puede realizar búsquedas de sus proyectos además realizar búsquedas y filtrarlos.
async function onFilterSubmit(e) {
    e.preventDefault();
    if (!selectedUser) return alert("Selecciona un usuario primero.");

    const formData = new FormData(e.target);
    const filtros = Object.fromEntries([...formData.entries()].filter(([_, v]) => v.trim() !== ''));

    // Proyectos creados
    const proyectosCreados = await fetchProjects({ ...filtros, applicant: selectedUser.id });

    // Proyectos donde participa
    const proyectosParticipa = await fetchProjects({ ...filtros, approvalUser: selectedUser.id });
    const proyectosParticipaSimples = proyectosParticipa.filter(p => !proyectosCreados.some(c => c.id === p.id));//
    const proyectosParticipaDetallados = await fetchDetallesDeProyectos(proyectosParticipaSimples);

    const { puedeDecidir, yaParticipo } = clasificarProyectos(proyectosParticipaDetallados, selectedUser.id);

    renderTodo(proyectosCreados, puedeDecidir, yaParticipo);
}

//Criterio 5: El usuario puede tomar una decisión sobre la aprobación de un proyecto
async function onDecisionSubmit(e) { 
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
 }

// === FETCHERS ===

async function fetchUsers() {
    try {
        const res = await fetch(`${API_BASE}/user`);
        const users = await res.json();

        const select = document.getElementById('user-select');
        users.forEach(user => {
            userMap.set(user.id.toString(), user);
            select.appendChild(new Option(user.name, user.id));
        });
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

async function fetchStatuses() {
    try {
        const res = await fetch(`${API_BASE}/ApprovalStatus`);
        const statuses = await res.json();

        const select = document.getElementById('status-select');
        statuses.forEach(s => {
            select.appendChild(new Option(s.name, s.id));
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

async function fetchDetallesDeProyectos(proyectos) {
    return await Promise.all(
        proyectos.map(async ({ id }) => {
            try {
                const res = await fetch(`${API_BASE}/project/${id}`);
                return await res.json();
            } catch (error) {
                console.error(`Error al obtener detalles del proyecto ${id}:`, error);
                return null;
            }
        })
    );
}

// === LÓGICA DE PROYECTOS ===

async function cargarProyectosPorUsuario(userId) {
    const creados = await fetchProjects({ applicant: userId });
    const otros = await fetchProjects({ approvalUser: userId });

    const otrosFiltrados = otros.filter(p => !creados.some(c => c.id === p.id));
    const otrosDetallados = await fetchDetallesDeProyectos(otrosFiltrados);

    const { puedeDecidir, yaParticipo } = clasificarProyectos(otrosDetallados, userId);

    renderTodo(creados, puedeDecidir, yaParticipo);
}

function clasificarProyectos(proyectos, userId) {
    const puedeDecidir = [];
    const yaParticipo = [];

    for (const p of proyectos) {
        if (!p || !Array.isArray(p.steps)) continue;

        const aprobo = p.steps.some(step => step.approverUser?.id === userId);
        const tienePendiente = p.steps.some(step => [1, 4].includes(step.status.id));

        if (aprobo) yaParticipo.push(p);
        else if (tienePendiente) puedeDecidir.push(p);
    }

    return { puedeDecidir, yaParticipo };
}

// === UI ===

function renderTodo(creados, puedeDecidir, yaParticipo) {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';

    renderSeccion('Proyectos creados por el usuario', creados);
    renderSeccion('Proyectos donde puede decidir', puedeDecidir);
    renderSeccion('Proyectos donde tomó decisión', yaParticipo);
}

function renderSeccion(titulo, proyectos) {
    const section = document.createElement('section');
    section.classList.add('collapsible-section');

    const header = document.createElement('div');
    header.className = 'section-header';

    const titleEl = document.createElement('h2');
    titleEl.textContent = titulo;

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'toggle-btn';
    toggleBtn.textContent = '−';
    toggleBtn.onclick = () => toggleSection(toggleBtn);

    header.appendChild(titleEl);
    header.appendChild(toggleBtn);

    const content = document.createElement('div');
    content.className = 'section-content';

    if (proyectos.length === 0) {
        content.innerHTML = '<p>No hay proyectos en esta sección.</p>';
    } else {
        proyectos.forEach(project => {
            const div = document.createElement('div');
            div.className = 'project-card';
            div.innerHTML = `
                <h3>${project.title}</h3>
                <p><strong>Área:</strong> ${project.area.name}</p>
                <p><strong>Tipo:</strong> ${project.type.name}</p>
                <p><strong>Estado:</strong> ${project.status.name}</p>
                <button onclick="verDetalle('${project.id}')">Ver más</button>
            `;
            content.appendChild(div);
        });
    }

    section.appendChild(header);
    section.appendChild(content);
    document.getElementById('projects-container').appendChild(section);
}

function toggleSection(button) {
    const content = button.parentElement.nextElementSibling;
    const visible = content.style.display !== 'none';

    content.style.display = visible ? 'none' : 'block';
    button.textContent = visible ? '+' : '−';
}

function toggleFiltros() {
    const filtros = document.getElementById('filtros');
    filtros.style.display = filtros.style.display === 'none' ? 'block' : 'none';
}



// === MODAL DETALLE ===

function verDetalle(id) {

    selectedProjectId = id

    fetch(`${API_BASE}/project/${id}`)
        .then(res => res.json())
        .then(data => mostrarDetalleModal(data));
}

function mostrarDetalleModal(data) {
    const modal = document.getElementById('modal');
    const body = document.getElementById('modal-body');

    const primerPendiente = data.steps.find(s => [1, 4].includes(s.status.id));
    const puedeDecidir = primerPendiente && primerPendiente.approverRole?.id === selectedUser?.role.id;

    body.innerHTML = `
        <h2>${data.title}</h2>
        <p><strong>ID:</strong> ${data.id}</p>
        <p><strong>Descripción:</strong> ${data.description}</p>
        <p><strong>Area:</strong> ${data.area.name}</p>
        <p><strong>Tipo:</strong> ${data.type.name}</p>
        <p><strong>Estado:</strong> ${data.status.name}</p>
        <p><strong>Duracion estimada:</strong> ${data.duration} días</p>
        <p><strong>Costo estimado:</strong> $${data.amount}</p>
        <p><strong>Usuario creador:</strong><br>${data.user.name} (${data.user.email})<br>Rol: ${data.user.role.name}</p>

        <h2>Flujo de aprobacion</h2>
        ${data.steps.map(step => {
        const esActual = step.id === primerPendiente?.id && puedeDecidir;
        return `
                <div class="step">
                    <p><strong>Orden:</strong> ${step.stepOrder}</p>
                    <p><strong>Estado:</strong> ${step.status.name}</p>
                    <p><strong>Observaciones:</strong> ${step.observations || 'Pendiente'}</p>
                    <p><strong>Fecha decision:</strong> ${step.decisionDate || 'Pendiente'}</p>
                    <p><strong>Rol aprobador:</strong> ${step.approverRole.name}</p>
                    <p><strong>Usuario aprobador:</strong> ${step.approverUser?.name || 'No asignado'} (${step.approverUser?.email || '-'})</p>
                    ${esActual ? `<button onclick="abrirModalDecision(${step.id})"> Decidir </button>` : ''}
                </div>`;
    }).join('')}
    `;

    modal.style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modal').style.display = 'none';
}

// === MODAL DECISION ===
function abrirModalDecision(stepId) {
    document.getElementById('stepId').value = stepId;
    document.getElementById('status').value = '';
    document.getElementById('observation').value = '';
    document.getElementById('modal-decision').style.display = 'block';
}
function cerrarModalDecision() {
    document.getElementById('modal-decision').style.display = 'none';
}



