
# Aprobacion de Proyectos - Frontend - TP3

Este proyecto es una aplicación web frontend desarrollada con HTML, CSS y JavaScript puro, como parte del Trabajo Práctico Parte 3 de la materia "Proyecto de Software".
Consume los endpoints de la API RESTful desarrollada en la Parte 2 (TP2) para permitir la visualización, creación, edición, filtrado y aprobación de propuestas de proyectos por parte de los usuarios.
Su diseño apunta a una buena experiencia de usuario (UX) y una interfaz clara y accesible (UI).
 - Link: https://febdiak.github.io/AprobacionProyectos-TP3-Frontend/
 - Backend: https://github.com/FebdiaK/AprobacionProyectos-TP2-APIRESTful

---

## Características

La aplicación cumple con los criterios de aceptación definidos en la consigna:

1. Visualización general de proyectos.
2. Acceso a la información completa de un proyecto.
3. Creación de nuevos proyectos.
4. Búsqueda y filtrado de proyectos por distintos criterios.
5. Toma de decisiones sobre pasos de aprobación (aprobar, observar, rechazar).
6. Edición de proyectos en estado observado.

---

## Tecnologías utilizadas

- HTML
- CSS
- JavaScript
- http-server ( para levantar un servidor local )
- Fetch API ( para llamadas HTTP )

---

## Arquitectura del Proyecto

El proyecto está organizado con una estructura modular para mantener un código claro, escalable y mantenible:

```
docs/
│
├── start-frontend.bat           # Script para levantar el servidor local
├── index.html                   # Página principal con listado de proyectos
├── create.html                  # Formulario para crear proyecto
├── yourProjects.html           # Página de proyectos filtrados por usuario
│
├── css/
│   ├── base.css                 # Tipografía, colores y estilos generales
│   ├── layout.css               # Header, footer, containers, distribución
│   ├── components.css           # Modales, botones, formularios, etc.
│   └── yourProjects.css        # Estilos específicos de la sección de usuario
│
├── js/
│   ├── api/
│   │   └── api.js               # Funciones para llamar a la API REST
│   │
│   ├── features/                # Funcionalidades agrupadas por contexto
│   │   ├── yourProjects/
│   │   │   ├── init.js
│   │   │   ├── events.js
│   │   │   ├── setupValidation.js
│   │   │   ├── listeners.js
│   │   │   ├── state.js
│   │   │   └── yourProjectsIndex.js
│   │   ├── createProject/
│   │   │   ├── init.js
│   │   │   ├── options.js
│   │   │   ├── setupValidation.js
│   │   │   ├── submission.js
│   │   │   └── createIndex.js
│   │   └── listProjects/
│   │       ├── listIndex.js
│   │       ├── init.js
│   │       ├── loader.js
│   │       ├── listeners.js
│   │       └── filters.js
│   │
│   ├── ui/
│   │   ├── list.js              # Renderizado de tarjetas de proyecto
│   │   ├── modal.js             # Control de modales
│   │   ├── detail.js            # Lógica del modal de detalle
│   │   └── ui.js                # Renderizado general de interfaz y selects
│   │
│   └── utils/
│       ├── formValidators.js
│       ├── helpers.js
│       └── updateCardProject.js
```

---

## Ejecución de la aplicación

 - Opción recomendada (archivo .bat):

1. Asegurate de tener instalado Node.js (incluye npx).
2. Ejecutá el archivo start-frontend.bat ubicado en la raíz del proyecto: 

```batch		
@echo off
echo Iniciando servidor local en http://localhost:8080...
cd /d "%~dp0"
npx http-server -p 8080
pause
```

3. Esto abrirá un servidor local en la dirección: http://localhost:8080
4. Una vez iniciado el servidor, podés acceder desde el navegador a las páginas web del proyecto.

 - Alternativa manual:

1. Abrí una terminal en la raíz del proyecto.
2. Asegurate de tener instalado Node.js (incluye npx).
3. Ejecutá:

```
npx http-server -p 8080
```

4. Navegá a http://localhost:8080 para ver el trabajo realizado.

**Nota: No se recomienda abrir directamente el archivo index.html con doble clic por posibles errores de rutas. Usar un servidor local.**

---

## Diseño de UI

- Diseño limpio y moderno con foco en la legibilidad.
- Colores y tipografía consistentes.
- Tarjetas visuales para cada proyecto.
- Estructura con flexbox y separación visual clara entre secciones.

## Experiencia de Usuario (UX)

- Navegación intuitiva y fluida.
- Formularios validados con feedback inmediato.
- Confirmaciones visuales para creación, edición y decisiones.
- Mensajes de error claros.
- Carga dinámica sin recargar la página.

---

## Autor

- Nombre: Diaz Federico
- Año: 2025
- Materia: Proyecto de Software
- Universidad Nacional Arturo Jauretche

---

## Notas

- Este proyecto es un trabajo académico.
- Este frontend es la tercera parte del trabajo práctico y se basa en la API desarrollada en el TP2.
- Puede extenderse para incluir autenticación, validaciones más avanzadas o integración con frameworks frontend como React o Vue.
