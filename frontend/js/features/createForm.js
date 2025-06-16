
import { createProject, getAreas, getTypes, getUsers } from "../api/api.js";
import { renderOptionList } from "../ui/ui.js";
import { showNotification, capitalizeFirstLetter } from '../utils/helpers.js';
import { allowOnlyNumbers, autoResizeTextarea, validateTitleInput, isValidTitle } from '../utils/formValidators.js';


export async function fillSelectOptions() {
    try {
        const [users, areas, types] = await Promise.all([
            getUsers("user"),
            getAreas("area"),
            getTypes("projecttype"),
        ]);

        renderOptionList("user-select", users, "name", "id");
        renderOptionList("area-select", areas, "name", "id");
        renderOptionList("type-select", types, "name", "id");
    } catch (error) {
        showNotification("Error al cargar datos del formulario: " + error.message, "error", "create");
    }
}

export function setupFormValidations() {
    document.querySelectorAll('input[type="number"]').forEach(input =>
        input.addEventListener("input", () => allowOnlyNumbers(input))
    );

    const descriptionInput = document.getElementById("description");
    descriptionInput.addEventListener("input", () => autoResizeTextarea(descriptionInput, 96));

    const titleInput = document.getElementById("title");
    titleInput.addEventListener("input", () => validateTitleInput(titleInput));
}

export function setupFormSubmission() {
    const form = document.getElementById("project-form");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const btn = document.getElementById("btn-create-submit");
        btn.disabled = true;
        btn.classList.add("btn-disabled");

        const proyecto = buildProjectFromForm();

        if (!proyecto) {
            btn.disabled = false;
            btn.classList.remove("btn-disabled");
            return;
        }

        try {
            await createProject(proyecto);
            showNotification("Proyecto creado con éxito. Redirigiendo al listado...", "success", "create");
            setTimeout(() => window.location.href = "index.html", 4000);

        } catch (error) {
            showNotification("Error al crear proyecto: " + error.message, "error", "create");
            btn.disabled = false;
            btn.classList.remove("btn-disabled");
        }
    });
}

function buildProjectFromForm() {
    const titleInput = document.getElementById("title");
    const descriptionInput = document.getElementById("description");

    let title = capitalizeFirstLetter(titleInput.value.trim());
    let description = capitalizeFirstLetter(descriptionInput.value.trim());

    if (!isValidTitle(title)) {
        showNotification("El título debe tener al menos 5 caracteres.", "alert", "create");
        return null;
    }

    if (description.length < 10) {
        showNotification("La descripción mínima es de 10 caracteres.", "alert", "create");
        return null;
    }
    // seteo a mayuscula al input
    titleInput.value = title;
    descriptionInput.value = description;

    return {
        title,
        description,
        amount: parseFloat(document.getElementById("amount").value),
        duration: parseInt(document.getElementById("duration").value),
        area: parseInt(document.getElementById("area-select").value),
        user: parseInt(document.getElementById("user-select").value),
        type: parseInt(document.getElementById("type-select").value)
    };
}