 import { cargarOpciones } from './state.js';
import { bindEventListeners } from './listeners.js';

export async function initializeYourProjects() {
    await cargarOpciones();
    bindEventListeners();
}