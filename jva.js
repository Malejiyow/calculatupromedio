document.addEventListener("DOMContentLoaded", function () {
    
    const notasContainer = document.getElementById("notas-container");
    const agregarNotaBtn = document.getElementById("agregar-nota");
    const calcularBtn = document.getElementById("calcular");
    const notaMinimaInput = document.getElementById("nota-minima");
    const notaMaximaInput = document.getElementById("nota-maxima");
    const notaAprobacionInput = document.getElementById("nota-aprobacion");
    const configuracionBtn = document.getElementById("configuracion-btn");
    const configuracionRec = document.getElementById("configuracion-rec");
    const configuracionForm = document.getElementById("configuracion-form");
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");
    const mensajeResultado = document.getElementById("mensaje-resultado");
    const modoOscuroBtn = document.getElementById("modo-oscuro");
    const mensajeGuardar = document.getElementById("mensaje-guardar");
    const mensajeError = document.getElementById("mensaje-error");

    
    let notaMinima = 0.0;
    let notaMaxima = 5.0;
    let notaAprobacion = 3.0;

 
    notaMinimaInput.value = notaMinima;
    notaMaximaInput.value = notaMaxima;
    notaAprobacionInput.value = notaAprobacion;

    
    function mostrarMensajeGuardar(mensaje) {
        mensajeGuardar.textContent = mensaje;
        mensajeGuardar.classList.add("mostrar");

     
        setTimeout(() => {
            mensajeGuardar.classList.remove("mostrar");
        }, 3000);
    }

   
    function mostrarError(mensaje) {
        mensajeError.textContent = mensaje;
        mensajeError.classList.add("mostrar");

     
        setTimeout(() => {
            mensajeError.classList.remove("mostrar");
        }, 3000);
    }

   
    function agregarGrupoNota() {
        const nuevoGrupo = document.createElement("div");
        nuevoGrupo.classList.add("input-group");

        const label = document.createElement("label");
        label.textContent = `Nota ${notasContainer.children.length + 1}:`;
        label.classList.add("input-label");
        nuevoGrupo.appendChild(label);

        const inputNota = document.createElement("input");
        inputNota.type = "number";
        inputNota.classList.add("nota");
        inputNota.placeholder = "Ej: 4.2";
        inputNota.min = "0";
        inputNota.max = "10";
        inputNota.step = "0.1";
        inputNota.required = true;
        nuevoGrupo.appendChild(inputNota);

        const etiquetaNota = document.createElement("span");
        etiquetaNota.textContent = "Porcentaje";
        etiquetaNota.classList.add("etiqueta-movil");
        nuevoGrupo.appendChild(etiquetaNota);   

        const inputPorcentaje = document.createElement("input");
        inputPorcentaje.type = "number";
        inputPorcentaje.classList.add("porcentaje");
        inputPorcentaje.placeholder = "% (Ej: 30)";
        inputPorcentaje.min = "0";
        inputPorcentaje.max = "100";
        inputPorcentaje.required = true;
        nuevoGrupo.appendChild(inputPorcentaje);

        const etiquetaPorcentaje = document.createElement("span");
        etiquetaPorcentaje.textContent = "%";
        etiquetaPorcentaje.classList.add("etiqueta-movil");
        nuevoGrupo.appendChild(etiquetaPorcentaje);

        const eliminarBtn = document.createElement("button");
        eliminarBtn.textContent = "✕";
        eliminarBtn.type = "button";
        eliminarBtn.classList.add("eliminar-nota");
        eliminarBtn.setAttribute("aria-label", "Eliminar nota");
        eliminarBtn.addEventListener("click", function () {
            nuevoGrupo.remove();
            actualizarEtiquetasNotas();
        });
        nuevoGrupo.appendChild(eliminarBtn);

        notasContainer.appendChild(nuevoGrupo);
        actualizarEtiquetasNotas();
    }


    function actualizarEtiquetasNotas() {
        const grupos = notasContainer.querySelectorAll(".input-group");
        grupos.forEach((grupo, index) => {
            grupo.querySelector("label").textContent = `Nota ${index + 1}:`;
        });
    }

    
    function calcularPromedio() {
        const notas = document.querySelectorAll(".nota");
        const porcentajes = document.querySelectorAll(".porcentaje");

        let sumaTotal = 0;
        let sumaPorcentajes = 0;

        
        if (isNaN(notaMinima) || isNaN(notaMaxima) || isNaN(notaAprobacion)) {
            mostrarError("Ingrese valores válidos en todos los campos de configuración.");
            return;
        }

        if (notaMinima < 0 || notaMaxima < 0 || notaAprobacion < 0) {
            mostrarError("Las notas no pueden ser negativas.");
            return;
        }

        if (notaAprobacion < notaMinima || notaAprobacion > notaMaxima) {
            mostrarError("La nota para aprobar debe estar entre la nota mínima y la nota máxima.");
            return;
        }

        
        for (let i = 0; i < notas.length; i++) {
            const nota = parseFloat(notas[i].value);
            const porcentaje = parseFloat(porcentajes[i].value);

            if (isNaN(nota)) {
                mostrarError(`Ingrese un valor válido para la Nota ${i + 1}.`);
                return;
            }

            if (isNaN(porcentaje)) {
                mostrarError(`Ingrese un valor válido para el Porcentaje ${i + 1}.`);
                return;
            }

            if (nota < 0 || porcentaje < 0 || porcentaje > 100) {
                mostrarError("Las notas y porcentajes deben ser positivos y los porcentajes entre 0 y 100.");
                return;
            }

            sumaTotal += nota * (porcentaje / 100);
            sumaPorcentajes += porcentaje;
        }

 
        if (sumaPorcentajes > 100) {
            mostrarError("La suma de los porcentajes no puede superar el 100%.");
            return;
        }

     
        document.getElementById("promedio-texto").textContent = sumaTotal.toFixed(2);
        document.getElementById("porcentaje-texto").textContent = `${sumaPorcentajes}%`;

        if (sumaPorcentajes < 100) {
            const porcentajeFaltante = 100 - sumaPorcentajes;
            const notaNecesaria = ((notaAprobacion - sumaTotal) / (porcentajeFaltante / 100)).toFixed(2);

            document.getElementById("porcentaje-faltante-texto").textContent = `${porcentajeFaltante}%`;
            document.getElementById("nota-faltante-texto").textContent = notaNecesaria;

           
            if (notaNecesaria > notaMaxima) {
                mostrarMensaje("Lo siento, no has alcanzado la nota mínima para aprobar.", "suspendido");
            } else {
                mensajeResultado.style.display = "none";
            }
        } else {
            document.getElementById("porcentaje-faltante-texto").textContent = "0%";
            document.getElementById("nota-faltante-texto").textContent = "-";

            if (sumaTotal < notaAprobacion) {
                mostrarMensaje("Lo siento, no has alcanzado la nota mínima para aprobar.", "suspendido");
            } else {
                mostrarMensaje("¡Felicidades! Has aprobado.", "aprobado");
            }
        }
    }

    function mostrarMensaje(mensaje, tipo) {
        mensajeResultado.textContent = mensaje;
        mensajeResultado.className = `mensaje-resultado ${tipo}`;
        mensajeResultado.style.display = "block";
    }

    function toggleConfiguracion(event) {
        event.preventDefault();
        configuracionRec.classList.toggle("abierto");

        if (configuracionRec.classList.contains("abierto")) {
            configuracionRec.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }
    }

    function guardarConfiguracion(event) {
        event.preventDefault();

        const nuevaNotaMinima = parseFloat(notaMinimaInput.value);
        const nuevaNotaMaxima = parseFloat(notaMaximaInput.value);
        const nuevaNotaAprobacion = parseFloat(notaAprobacionInput.value);

        if (isNaN(nuevaNotaMinima) || isNaN(nuevaNotaMaxima) || isNaN(nuevaNotaAprobacion)) {
            mostrarError("Ingrese valores válidos en todos los campos.");
            return;
        }

        if (nuevaNotaMinima < 0 || nuevaNotaMaxima < 0 || nuevaNotaAprobacion < 0) {
            mostrarError("Las notas no pueden ser negativas.");
            return;
        }

        if (nuevaNotaAprobacion < nuevaNotaMinima || nuevaNotaAprobacion > nuevaNotaMaxima) {
            mostrarError("La nota para aprobar debe estar entre la nota mínima y la nota máxima.");
            return;
        }

        notaMinima = nuevaNotaMinima;
        notaMaxima = nuevaNotaMaxima;
        notaAprobacion = nuevaNotaAprobacion;

        configuracionRec.classList.remove("abierto");

        mostrarMensajeGuardar("Configuración guardada correctamente.");
    }

    function toggleMenu() {
        navMenu.classList.toggle("menu-open");
        menuToggle.setAttribute("aria-expanded", navMenu.classList.contains("menu-open"));
    }

    function cerrarMenu(event) {
        if (!navMenu.contains(event.target) && !menuToggle.contains(event.target)) {
            navMenu.classList.remove("menu-open");
            menuToggle.setAttribute("aria-expanded", false);
        }
    }

    
function toggleModoOscuro() {
    const temaActual = document.documentElement.getAttribute("data-tema");
    const nuevoTema = temaActual === "claro" ? "oscuro" : "claro";
    document.documentElement.setAttribute("data-tema", nuevoTema);

    modoOscuroBtn.classList.toggle("rotado");
}

    agregarNotaBtn.addEventListener("click", agregarGrupoNota);
    calcularBtn.addEventListener("click", calcularPromedio);
    configuracionBtn.addEventListener("click", toggleConfiguracion);
    configuracionForm.addEventListener("submit", guardarConfiguracion);
    menuToggle.addEventListener("click", toggleMenu);
    document.addEventListener("click", cerrarMenu);
    modoOscuroBtn.addEventListener("click", toggleModoOscuro);
});