
import { allowOnlyNumbers, autoResizeTextarea, validateTitleInput } from "../../utils/formValidators.js";

export function setupFormValidations() {
    document.querySelectorAll('input[type="number"]').forEach(input =>
        input.addEventListener("input", () => allowOnlyNumbers(input))
    );

    const descriptionInput = document.getElementById("description");
    descriptionInput.addEventListener("input", () => autoResizeTextarea(descriptionInput, 96));

    const titleInput = document.getElementById("title");
    titleInput.addEventListener("input", () => validateTitleInput(titleInput));
}
