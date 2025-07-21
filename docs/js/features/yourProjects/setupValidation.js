
import { allowOnlyNumbers, autoResizeTextarea, validateTitleInput } from '../../utils/formValidators.js';

export function setupEditFormValidations() {
    const titleInput = document.getElementById("edit-title");
    const descriptionInput = document.getElementById("edit-description");
    const durationInput = document.getElementById("edit-duration");

    if (titleInput) {
        titleInput.addEventListener("input", () => validateTitleInput(titleInput));
    }

    if (descriptionInput) {
        descriptionInput.addEventListener("input", () => autoResizeTextarea(descriptionInput, 96));
    }

    if (durationInput) {
        durationInput.addEventListener("input", () => allowOnlyNumbers(durationInput));
    }
}
