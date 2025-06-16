
//Criterio 1: Interfaz web donde se muestran los proyectos

import { initializeProjectList } from '../features/listPage.js';

document.addEventListener('DOMContentLoaded', async () => {

    await initializeProjectList();

});

