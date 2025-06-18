
import { getAreas, getTypes, getUsers } from "../../api/api.js";
import { renderOptionList } from "../../ui/ui.js";
import { showNotification } from "../../utils/helpers.js";

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
