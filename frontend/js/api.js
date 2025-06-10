
const API_BASE = "https://localhost:7017/api";

export const getProjects = async () => {
    const response = await fetch(`${API_BASE}/project`);
    if (!response.ok) throw new Error("Error al obtener proyectos");
    return await response.json();
};

export const getProjectById = async (id) => {
    const response = await fetch(`${API_BASE}/project/${id}`);
    if (!response.ok) throw new Error("Error al obtener proyecto");
    return await response.json();
};

export const createProject = async (project) => {
    const response = await fetch(`${API_BASE}/project`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
    });
    if (!response.ok) throw new Error("Error al crear proyecto");
    return await response.json();
};

export const getEntities = async (entity) => {
    const response = await fetch(`${API_BASE}/${entity}`);
    if (!response.ok) throw new Error(`Error al obtener ${entity}`);
    return await response.json();
};

//------------//



////

export async function fetchUsers(userMap) {
    const res = await fetch(`${API_BASE}/user`);
    const users = await res.json();

    const select = document.getElementById('user-select');
    users.forEach(user => {
        userMap.set(user.id.toString(), user);
        select.appendChild(new Option(user.name, user.id));
    });
}

export async function fetchStatuses() {
    const res = await fetch(`${API_BASE}/ApprovalStatus`);
    const statuses = await res.json();
    const select = document.getElementById('status-select');

    statuses.forEach(s => {
        select.appendChild(new Option(s.name, s.id));
    });
}

export async function fetchProjects(filters) {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/project?${query}`);
    return await res.json();
}

export async function fetchProjectDetails(projects) {
    return await Promise.all(
        projects.map(async ({ id }) => {
            const res = await fetch(`${API_BASE}/project/${id}`);
            return await res.json();
        })
    );
}

export async function submitDecision(projectId, stepId, userId, statusId, observation) {
    const res = await fetch(`${API_BASE}/project/${projectId}/decision`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: parseInt(stepId),
            user: parseInt(userId),
            status: parseInt(statusId),
            observation
        })
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al decidir.");
    }
}
