
import { verDetalle } from '../ui/detail.js';

export const clearContainer = (id) => {
    document.getElementById(id).innerHTML = '';
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
    content.id = 'content';

    renderProjects(proyectos, content.id, selectedUser);

    section.appendChild(header);
    section.appendChild(content);
    document.getElementById('projects-container').appendChild(section);
}

export const renderProjects = (projects, containerId, selectedUser) => {
    const container = document.getElementById(containerId);
    clearContainer(containerId);

    projects.forEach(project => {
        const div = document.createElement("div");
        div.className = "project-card";
        div.innerHTML = `
            <h2>${project.title}</h2>
            <p><strong>Estado:</strong> ${project.status}</p>
            <p><strong>Area:</strong> ${project.area}</p>
            <p><strong>Tipo:</strong> ${project.type}</p>
            <button class="btn">Ver informacion detallada</button>
        `;
        div.querySelector("button").addEventListener("click", () => verDetalle(selectedUser, project.id));
        container.appendChild(div);
    });
};

export const renderOptionList = (selectId, list, labelProp, valueProp) => {
    const select = document.getElementById(selectId);
    clearContainer(select.id);
    
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

