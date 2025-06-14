
export function clasifyProjects(proyectos, userId) {
    const puedeDecidir = [];
    const yaParticipo = [];

    for (const p of proyectos) {
        if (!p || !Array.isArray(p.steps)) continue;

        const aprobo = p.steps.some(step => step.approverUser?.id === userId);
        const tienePendiente = p.steps.some(step => [1, 4].includes(step.status.id));

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
            cards[0].classList.add('single-card');
        }
    });
}