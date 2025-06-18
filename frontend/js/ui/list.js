
import { getProjectsQuery, getProjectDetailsById } from '../api/api.js';
import { renderAllSections, renderProjects } from './ui.js'; 
import { clasifyProjects } from '../utils/helpers.js'; 

//para mostrar todos los proyectos separados por secciones 
export async function loadProjects(selectedUser, filtros = {}) {

    const proyectosCreados = await getProjectsQuery({ ...filtros, applicant: selectedUser.id });

    const proyectosParticipa = await getProjectsQuery({ ...filtros, approvalUser: selectedUser.id });
    const proyectosParticipaFiltrados = proyectosParticipa.filter(p => !proyectosCreados.some(c => c.id === p.id)); //solo los que no estan en proyectos creados

    const proyectosParticipaDetallados = await Promise.all(
        proyectosParticipaFiltrados.map(p => getProjectDetailsById(p.id))
    );
    const { puedeDecidir, yaParticipo } = clasifyProjects(proyectosParticipaDetallados, selectedUser.id); 

    renderAllSections(selectedUser, proyectosCreados, puedeDecidir, yaParticipo);
}

//para mostrar todos los proyectos el index general (sin secciones)
export async function loadProjectsGeneral(filtros = {}, container) {

    const proyectosFiltrados = await getProjectsQuery({...filtros }); //filtro vacio: todos

    const proyectosDetallados = await Promise.all(
        proyectosFiltrados.map(p => getProjectDetailsById(p.id))
    );

    renderProjects(proyectosDetallados, container.id, null);
}
