
import { fillSelectOptions } from './options.js';
import { setupFormValidations } from './setupValidation.js';
import { setupFormSubmission } from './submission.js';

export async function initializeCreateProjectForm() {
    await fillSelectOptions();
    setupFormValidations();
    await setupFormSubmission();
}