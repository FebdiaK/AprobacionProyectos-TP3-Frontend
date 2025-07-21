export function allowOnlyNumbers(inputElement) {
    inputElement.value = inputElement.value.replace(/[^0-9]/g, '');
}

export function autoResizeTextarea(textarea, maxHeight = 96) {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, maxHeight) + "px";
}

export function validateTitleInput(inputElement) {
    const regex = /[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9 ]+/g;
    inputElement.value = inputElement.value.replace(regex, '');
}
export function formToFilters(form) {
    const formData = new FormData(form);
    return Object.fromEntries(
        [...formData.entries()].filter(([_, value]) => value.trim() !== ''));
}

export function isValidDuration(value) {
    return !isNaN(value) && value > 0;
}

export function isValidDescription(description) {
    return !description || description.length >= 10;
}

export function isValidTitle(title) {
    return title && title.length >= 5;
}
