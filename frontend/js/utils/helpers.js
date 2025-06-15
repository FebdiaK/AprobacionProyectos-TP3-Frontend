
export function clasifyProjects(proyectos, userId) {
    const puedeDecidir = [];
    const yaParticipo = [];

    for (const p of proyectos) {
        if (!p || !Array.isArray(p.steps)) continue;

        const aprobo = p.steps.some(step => step.approverUser?.id === userId); //si el usuario ya decidio en el proyecto
        const tienePendiente = p.steps.some(step => [1, 4].includes(step.status.id)); //si hay un paso pendiente de decision para el usuario

        if (aprobo) yaParticipo.push(p);
        else if (tienePendiente) puedeDecidir.push(p);
    }

    return { puedeDecidir, yaParticipo };
}

export function showNotification(message, type = 'info', containerName) {

    const notification = document.getElementById(`notification-${containerName}`);

    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';

    setTimeout(() => {
        notification.style.display = 'none';
    }, 4000);
}

export function translateStatus(statusName) {
    const statusTranslations = {
        "Pending": "Pendiente",
        "Approved": "Aprobado",
        "Rejected": "Rechazado",
        "Observed": "Observado"
    };

    return statusTranslations[statusName] || statusName;
}

export function addSingleCardClass() {

    const sections = document.querySelectorAll('.section-content');
    sections.forEach(section => {
        const cards = section.querySelectorAll('.project-card');
        cards.forEach(card => card.classList.remove('single-card')); // limpiar clases anteriores
        if (cards.length === 1) {
            console.log("Se aplica single-card a", cards[0]);
            cards[0].classList.add('single-card');
        }
    });
}

export function addSingleCardClassGeneral() {

    const section = document.getElementById('projects-container');
    const cards = section.querySelectorAll('.project-card');
    cards.forEach(card => card.classList.remove('single-card')); // limpiar clases anteriores
    if (cards.length === 1) {
        cards[0].classList.add('single-card');
    }
}

export function formatearFechaArgentina(fechaIso) {

    console.log(fechaIso);
    if (!fechaIso) return '( - )';
    const fecha = new Date(fechaIso);

    const horas = String(fecha.getHours()).padStart(2, '0');
    const minutos = String(fecha.getMinutes()).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // 
    const anio = fecha.getFullYear();

    return `${horas}:${minutos} hrs - ${dia}/${mes}/${anio}`;

}
