
import { fillSelectOptions, setupFormValidations, setupFormSubmission } from '../features/createForm.js';

//Criterio 3: el usuario puede generar un nuevo proyecto
window.onload = async () => {

    await initializeForm();

};

async function initializeForm() {
    await fillSelectOptions();
    setupFormValidations();
    setupFormSubmission();
}
