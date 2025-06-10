
//Criterio 3: el usuario puede generar un nuevo proyecto

import { createProject, getAreas, getTypes, getUsers } from "../api/api.js";
import { renderOptionList } from "../ui/ui.js";

window.onload = async () => {

    const users = await getUsers("user");
    const areas = await getAreas("area");
    const types = await getTypes("projecttype");

    renderOptionList("user-select", users, "name", "id");
    renderOptionList("area-select", areas, "name", "id");
    renderOptionList("type-select", types, "name", "id");

};

document.getElementById("project-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const proyecto = {
        title: document.getElementById("title").value,
        description: document.getElementById("description").value,
        amount: parseFloat(document.getElementById("amount").value),
        duration: parseInt(document.getElementById("duration").value),
        area: parseInt(document.getElementById("area-select").value),
        user: parseInt(document.getElementById("user-select").value),
        type: parseInt(document.getElementById("type-select").value)
    };

    try {
        await createProject(proyecto);
        document.getElementById("form-message").textContent = "Proyecto creado con exito. Redirigiendo...";
        document.getElementById("project-form").reset();
        setTimeout(() => window.location.href = "index.html", 6000);

    } catch (error) {
        document.getElementById("form-message").textContent = "Error: " + error.message;
    }
});


