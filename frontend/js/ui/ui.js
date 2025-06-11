
import { verDetalle } from './detail.js';
import { openEditModal } from './modal.js';

export const clearContainer = (id) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';

};
export function renderAllSections(selectedUser, creados, puedeDecidir, yaParticipo) {
    clearContainer('projects-container');
    renderSection('Proyectos creados por el usuario', creados, selectedUser);
    renderSection('Proyectos donde puede decidir', puedeDecidir, selectedUser);
    renderSection('Proyectos donde tomó una decisión', yaParticipo, selectedUser);
}
function renderSection(titulo, proyectos, selectedUser) {
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

    const sectionId = titulo.toLowerCase().replace(/\s+/g, '-') + '-content'; // ID unico basado en el titulo
    content.id = sectionId;


    section.appendChild(header);
    section.appendChild(content);
    document.getElementById('projects-container').appendChild(section);

    renderProjects(proyectos, content.id, selectedUser);
}

export const renderProjects = (projects, containerId, selectedUser) => {

    const container = document.getElementById(containerId);
    if (!container) {
        console.error("No se encontró el contenedor:", containerId);
        return;
    }
    clearContainer(containerId);

    projects.forEach(project => {
        const div = document.createElement("div");
        div.className = "project-card";
        div.id = `project-card-${project.id}`;
        div.innerHTML = `
            <h2>${project.title}</h2>
            <p><strong>Estado:</strong> ${project.status?.name || project.status}</p>
            <p><strong>Area:</strong> ${project.area?.name || project.area}</p>
            <p><strong>Tipo:</strong> ${project.type?.name || project.type}</p>
            <button class="btn">Ver informacion detallada</button>
        `;
        div.querySelector("button").addEventListener("click", () => verDetalle(selectedUser, project.id));
        container.appendChild(div);

        if (project.status.id === 4) { // 4 = Observado
            const editButton = document.createElement("button");
            editButton.textContent = "Editar";
            editButton.classList.add("edit-button");
            editButton.addEventListener("click", () => {
                openEditModal(project); // funcion a definir
            });
            div.appendChild(editButton);
        }
    });
};

export const renderOptionList = (selectId, list, labelProp, valueProp) => {
    const select = document.getElementById(selectId);
    //clearContainer(select.id);
    
    list.forEach(item => {
        const option = new Option(item[labelProp], item[valueProp]);
        select.appendChild(option);
    });
};

export const toggleVisibility = (id) => {
    const el = document.getElementById(id);
    el.style.display = el.style.display === 'none' ? 'block' : 'none';
};

function toggleSection(button) {
    const content = button.parentElement.nextElementSibling;
    const visible = content.style.display !== 'none';

    content.style.display = visible ? 'none' : 'block';
    button.textContent = visible ? '+' : '−';
}
export function toggleFiltros() {
    const filtros = document.getElementById('filtros');
    filtros.style.display = filtros.style.display === 'none' ? 'block' : 'none';
}
