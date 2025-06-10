
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
