
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

    const numericInputs = document.querySelectorAll('input[type="number"]');
    numericInputs.forEach(input => {
        input.addEventListener("input", function () {
            this.value = this.value.replace(/[^0-9]/g, '');
        });
    });

    const descriptionInput = document.getElementById("description");
    descriptionInput.addEventListener("input", () => {
        descriptionInput.style.height = "auto"; // reset height
        descriptionInput.style.height = Math.min(descriptionInput.scrollHeight, 96) + "px";
    });

    const titleInput = document.getElementById("title");
    titleInput.addEventListener("input", (e) => {
        const regex = /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ]+/g;
        if (regex.test(titleInput.value)) {
            titleInput.value = titleInput.value.replace(regex, "");
        }
    });
};

document.getElementById("project-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const titleInput = document.getElementById("title");
    let val = titleInput.value.trim();

    const descriptionInput = document.getElementById("description");
    let desc = descriptionInput.value.trim();

    if (val.length > 0) {
        titleInput.value = val.charAt(0).toUpperCase() + val.slice(1);
        val = titleInput.value;
    }
    if (desc.length > 0) {
        descriptionInput.value = desc.charAt(0).toUpperCase() + desc.slice(1);
        desc = descriptionInput.value;
    }

    const proyecto = {
        title: val,
        description: desc,
        amount: parseFloat(document.getElementById("amount").value),
        duration: parseInt(document.getElementById("duration").value),
        area: parseInt(document.getElementById("area-select").value),
        user: parseInt(document.getElementById("user-select").value),
        type: parseInt(document.getElementById("type-select").value)
    };

    const formMessage = document.getElementById("form-message");

    try {
        await createProject(proyecto);
        formMessage.textContent = "Proyecto creado con éxito. Redirigiendo al listado...";
        formMessage.className = "form-message success";
        document.getElementById("project-form").reset();
        setTimeout(() => window.location.href = "index.html", 4000);

    } catch (error) {
        formMessage.textContent = "Error: " + error.message;
        formMessage.className = "form-message error";

    }
});


