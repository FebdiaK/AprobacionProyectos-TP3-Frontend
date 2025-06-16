
import { getProjectsQuery, getProjectDetailsById } from '../api/api.js';
import { renderAllSections, renderProjects } from './ui.js'; 
import { clasifyProjects } from '../utils/helpers.js'; 

//para mostrar todos los proyectos separados por secciones 
export async function loadProjects(selectedUser, filtros = {}) {

    // proyectos creados
    const proyectosCreados = await getProjectsQuery({ ...filtros, applicant: selectedUser.id });

    // proyectos donde participa
    const proyectosParticipa = await getProjectsQuery({ ...filtros, approvalUser: selectedUser.id });
    const proyectosParticipaFiltrados = proyectosParticipa.filter(p => !proyectosCreados.some(c => c.id === p.id));

    //obtengo el detalle completo de c/ proyecto
    const proyectosParticipaDetallados = await Promise.all(
        proyectosParticipaFiltrados.map(p => getProjectDetailsById(p.id))
    );
    //los clasifico
    const { puedeDecidir, yaParticipo } = clasifyProjects(proyectosParticipaDetallados, selectedUser.id);

    renderAllSections(selectedUser, proyectosCreados, puedeDecidir, yaParticipo);
}

//para mostrar todos los proyectos el index general (sin secciones)
export async function loadProjectsGeneral(filtros = {}, container) {

    // aplico filtros
    const proyectosFiltrados = await getProjectsQuery({...filtros });

    const proyectosDetallados = await Promise.all(
        proyectosFiltrados.map(p => getProjectDetailsById(p.id))
    );

    renderProjects(proyectosDetallados, container.id, null);
}
