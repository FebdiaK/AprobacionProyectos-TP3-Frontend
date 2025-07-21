
//Criterio 1: Interfaz web donde se muestran los proyectos

import { initializeProjectList } from './init.js';

document.addEventListener('DOMContentLoaded', async () => {

    await initializeProjectList();

});

