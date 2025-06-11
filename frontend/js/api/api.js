
const API_BASE = "https://localhost:7017/api";

export const getProjects = async () => {

    try {
        const response = await fetch(`${API_BASE}/project`);
        if (!response.ok) throw new Error("Error al obtener proyectos");
        return await response.json();
    } catch (error) {
        console.error(error);
    }

    const response = await fetch(`${API_BASE}/project`);
    if (!response.ok) throw new Error("Error al obtener proyectos");
    return await response.json();
};

export const getProjectsQuery = async (filters) => {
    const query = new URLSearchParams(filters).toString();
    const res = await fetch(`${API_BASE}/project?${query}`);
    return await res.json();
};

export const getProjectDetailsById = async (id) => {
    const response = await fetch(`${API_BASE}/project/${id}`);
    if (!response.ok) throw new Error("Error al obtener proyecto");
    return await response.json();
};

export const getUsers = async () => {
    const res = await fetch(`${API_BASE}/user`);
    return await res.json();
};

export const getStatuses = async () => {
    const res = await fetch(`${API_BASE}/ApprovalStatus`);
    return await res.json();
};

export const getTypes = async () => {
    const res = await fetch(`${API_BASE}/ProjectType`);
    return await res.json();
};

export const getAreas = async () => {
    const res = await fetch(`${API_BASE}/Area`);
    return await res.json();
};

export const getRoles = async () => {
    const res = await fetch(`${API_BASE}/Role`);
    return await res.json();
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


export async function sendDecision(projectId, stepId, userId, statusId, observation) {
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

//Criterio 6: Editar un proyecto, solo en estado de observacion 
export async function sendEdit(projectId, titulo, descripcion, duracion) {
    const res = await fetch(`${API_BASE}/project/${projectId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            title: titulo,
            description: descripcion,
            duration: duracion
        })
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Error al editar.");
    }
}

