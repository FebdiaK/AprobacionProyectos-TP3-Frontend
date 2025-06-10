export function renderTodo(creados, puedeDecidir, yaParticipo) {
    const container = document.getElementById('projects-container');
    container.innerHTML = '';
    renderSeccion('Proyectos creados por el usuario', creados);
    renderSeccion('Proyectos donde puede decidir', puedeDecidir);
    renderSeccion('Proyectos donde tomó una decisión', yaParticipo);
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
                <button onclick="verDetalle('${project.id}')">Ver informacion detallada</button>
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

//render listado de proyectos simple para el index
export const renderProjectsIndex = (projects, containerId, onDetailClick) => {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    if (projects.length === 0) {
        container.innerHTML = "<p>No hay proyectos creados. Crea un nuevo proyecto.</p>";
        return;
    }

    projects.forEach(project => {
        const div = document.createElement("div");
        div.className = "project-card";
        div.innerHTML = `
            <h3>${project.title}</h3>
            <p><strong>Estado:</strong> ${project.status}</p>
            <p><strong>Area:</strong> ${project.area}</p>
            <p><strong>Tipo:</strong> ${project.type}</p>
            <button class="btn">Ver informacion detallada</button>
        `;

        div.querySelector("button").addEventListener("click", () => onDetailClick(project.id));
        container.appendChild(div);
    });
};

