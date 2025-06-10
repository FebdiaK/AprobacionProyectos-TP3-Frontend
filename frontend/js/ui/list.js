
import { getProjectsQuery, getProjectDetailsById } from '../api/api.js';
import { renderAllSections } from './ui.js'; 
import { clasifyProjects } from '../utils/helpers.js'; // si querés separar esa lógica

export async function loadProjects(selectedUser, filtros = {}) {

    // Proyectos creados
    const proyectosCreados = await getProjectsQuery({ ...filtros, applicant: selectedUser.id });

    // Proyectos donde participa
    const proyectosParticipa = await getProjectsQuery({ ...filtros, approvalUser: selectedUser.id });
    const proyectosParticipaFiltrados = proyectosParticipa.filter(p => !proyectosCreados.some(c => c.id === p.id));

    const proyectosParticipaDetallados = await Promise.all(
        proyectosParticipaFiltrados.map(p => getProjectDetailsById(p.id))
    );

    const { puedeDecidir, yaParticipo } = clasifyProjects(proyectosParticipaDetallados, selectedUser.id);

    renderAllSections(selectedUser, proyectosCreados, puedeDecidir, yaParticipo);
}
