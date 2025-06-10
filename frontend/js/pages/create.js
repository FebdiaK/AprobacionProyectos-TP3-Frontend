
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
        area: parseInt(document.getElementById("area").value),
        user: parseInt(document.getElementById("user").value),
        type: parseInt(document.getElementById("type").value)
    };

    try {
        await createProject(proyecto);
        document.getElementById("form-message").textContent = "Proyecto creado con éxito. Redirigiendo...";
        document.getElementById("project-form").reset();
        setTimeout(() => window.location.href = "index.html", 6000);

    } catch (error) {
        document.getElementById("form-message").textContent = "Error: " + error.message;
    }
});

//

//async function cargarSelect(endpoint, selectId, textField = "name") {
//    const response = await fetch(`${API_BASE}/${endpoint}`);
//    const data = await response.json();

//    const select = document.getElementById(selectId);
//    data.forEach(item => {
//        const option = document.createElement("option");
//        option.value = item.id;
//        option.textContent = item[textField];
//        select.appendChild(option);
//    });
//}

//window.onload = async () => {
//    await cargarSelect("area", "area");
//    await cargarSelect("user", "user");
//    await cargarSelect("projecttype", "type");
//};

//document.getElementById("project-form").addEventListener("submit", async (e) => {
//    e.preventDefault();

//    const proyecto = {
//        title: document.getElementById("title").value,
//        description: document.getElementById("description").value,
//        amount: parseFloat(document.getElementById("amount").value),
//        duration: parseInt(document.getElementById("duration").value),
//        area: parseInt(document.getElementById("area").value),
//        user: parseInt(document.getElementById("user").value),
//        type: parseInt(document.getElementById("type").value)
//    };

//    try {
//        const response = await fetch(`${API_BASE}/project`, {
//            method: "POST",
//            headers: { "Content-Type": "application/json" },
//            body: JSON.stringify(proyecto)
//        });

//        if (!response.ok) throw new Error("Error al crear proyecto");

//        document.getElementById("form-message").textContent = "Proyecto creado con exito. Redirigiendo...";
//        document.getElementById("project-form").reset();
//        setTimeout(() => {
//            window.location.href = "index.html";
//        }, 7000);
//    } catch (error) {
//        document.getElementById("form-message").textContent = "Error: " + error.message;
//    }
//});
