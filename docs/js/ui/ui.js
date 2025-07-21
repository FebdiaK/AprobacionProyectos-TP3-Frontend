
import { verDetalle } from './detail.js';
import { openEditModal } from './modal.js';
import { addSingleCardClassGeneral  } from '../utils/helpers.js';

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

    if (projects.length === 0) {
        const noProjectsMessage = document.createElement("p");
        noProjectsMessage.textContent = "No hay proyectos.";
        container.appendChild(noProjectsMessage);
        return;
    }

    const statusTranslations = { 'Pending': 'Pendiente', 'Approved': 'Aprobado', 'Rejected': 'Rechazado', 'Observed': 'Observado' };

    projects.forEach(project => {
        const statusProject = statusTranslations[project.status] || statusTranslations[project.status.name] || 'Desconocido';
        const div = document.createElement("div");
        div.className = "project-card";
        div.id = `project-card-${project.id}`;
        div.innerHTML = `
            <h2>${project.title}</h2>
            <p><strong>Estado:</strong> ${statusProject}</p>
            <p><strong>Área:</strong> ${project.area?.name || project.area}</p>
            <p><strong>Tipo:</strong> ${project.type?.name || project.type}</p>
            <div class="button-group">
            <button class="btn">Ver información detallada</button>
            </div>
        `;
        div.querySelector("button").addEventListener("click", () => verDetalle(selectedUser, project.id));
        container.appendChild(div);

        if (selectedUser !== null) {
            const editButton = document.createElement("button");
            editButton.textContent = "Editar";
            editButton.classList.add("btn", "edit-button");

            const isEditable = project.status.id === 4; // Observado

            if (isEditable) {
                editButton.addEventListener("click", () => openEditModal(project));
            } else {
                editButton.disabled = true;
                editButton.classList.add("btn-disabled");
            }

            const buttonGroup = div.querySelector(".button-group");
            buttonGroup.appendChild(editButton);
            container.appendChild(div);
        }
    });
    addSingleCardClassGeneral();
    
};

export const renderOptionList = (selectId, list, labelProp, valueProp) => {
    const select = document.getElementById(selectId);

    list.forEach(item => {
        const option = new Option(item[labelProp], item[valueProp]);
        select.appendChild(option);
    });
};
function toggleSection(button) {
    const content = button.parentElement.nextElementSibling;
    const isHidden = content.classList.contains('hidden');
    content.classList.toggle('hidden');
    button.textContent = isHidden ? '−' : '+';
}
export function toggleFiltros() {
    const filtros = document.getElementById('filtros');
    filtros.style.display = filtros.style.display === 'none' ? 'block' : 'none';
}
