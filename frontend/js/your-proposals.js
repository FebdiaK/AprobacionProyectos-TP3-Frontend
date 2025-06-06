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
    userSelect.addEventListener('change', () => {
        selectedUserId = userSelect.value;

        if (selectedUserId) {
            fetchProjects({ applicant: selectedUserId });
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
        const query = new URLSearchParams();

        // Forzar que el filtro de applicant sea el usuario seleccionado
        //query.append("applicant", selectedUserId);

        for (const [key, value] of formData.entries()) {
            if (value.trim() !== '') query.append(key, value);
        }

        fetchProjectsFromQuery(query.toString());

        //try {
        //    const response = await fetch(`${API_BASE}/project?${query.toString()}`);
        //    const data = await response.json();

        //    renderProjects(data);
        //} catch (error) {
        //    console.error('Error al obtener proyectos:', error);
        //}
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

    function fetchProjects(filters) {
        const query = new URLSearchParams(filters).toString();
        fetchProjectsFromQuery(query);
    }

    async function fetchProjectsFromQuery(queryString) {
        try {
            const res = await fetch(`${ API_BASE }/project?${queryString}`);
            const data = await res.json();
            renderProjects(data);
        } catch (error) {
            console.error('Error al obtener proyectos:', error);
        }
    }

    function renderProjects(projects) {
        container.innerHTML = '';

        if (projects.length === 0) {
            container.innerHTML = '<p>No se encontraron proyectos.</p>';
            return;
        }

        projects.forEach(project => {
            const div = document.createElement('div');
            div.className = 'project-card';
            div.innerHTML = `
                <h3>${project.title}</h3>
                <p><strong>Area:</strong> ${project.area}</p>
                <p><strong>Tipo:</strong> ${project.type}</p>
                <p><strong>Estado:</strong> ${project.status}</p>
                <button onclick="verDetalle('${project.id}')">Ver mas</button>
            `;
            container.appendChild(div);
        });
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
                <p><strong>Descripcion:</strong> ${data.description}</p>
                <p><strong>Area:</strong> ${data.area}</p>
                <p><strong>Tipo:</strong> ${data.type}</p>
                <p><strong>Estado:</strong> ${data.status}</p>
                <p><strong>Monto estimado:</strong> $${data.amount}</p>
                <p><strong>Duracion estimada:</strong> ${data.duration} dias</p>
            `;
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
