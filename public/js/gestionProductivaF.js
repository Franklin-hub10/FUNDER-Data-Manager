document.addEventListener("DOMContentLoaded", async function () {
    console.log("📌 Script de navegación cargado correctamente.");

    // Obtener elementos del DOM
    const steps = document.querySelectorAll('.progress-steps .step');
    const line = document.querySelector('.progress-steps .line');
    const form = document.querySelector('form');
    const downloadBtn = document.getElementById("downloadBtn");

    // Obtener el id del colaborador logueado desde el localStorage
 const idColaborador = localStorage.getItem("idColaborador");

 if (!idColaborador) {
     console.warn("⚠️ No se encontró idColaborador en localStorage. Asegúrate de estar logueado.");
     return;
 }

 console.log("✅ idColaborador del usuario logueado:", idColaborador);

 // Asignar el idColaborador a un campo oculto si existe en el formulario
 const idColaboradorField = document.getElementById("idColaborador");
 if (idColaboradorField) {
     idColaboradorField.value = idColaborador;
 }

 // Obtener la sede del colaborador logueado desde el localStorage
 const sedeFunder = localStorage.getItem("sedeFunder");

 if (sedeFunder) {
   document.getElementById("sede_funder_display").innerText = sedeFunder; // Muestra la sede en el campo correspondiente
 } else {
   console.warn("⚠️ No se encontró sedeFunder en localStorage.");
 }

    // Verificar si downloadBtn existe antes de asignarle un evento
    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {
            window.location.href = "http://localhost:3000/gestionProductiva/download-csv";
        });
    }

    // Lista de pantallas en orden de pasos
    const pages = [
        'fichaTecnica.html',
        'fichaDiagnostico.html',
        'gestionOrganizacional.html',
        'gestionProductiva.html',
        'gestionComercial.html',
        'gestionFinanciera.html'
    ];

    // Determinar el paso actual basado en la URL
    let currentStep = pages.findIndex(page => window.location.pathname.includes(page));
    if (currentStep === -1) currentStep = 0;

    console.log("🔢 Paso actual detectado:", currentStep);

    // Función para actualizar la barra de progreso
    function updateProgress(step) {
        if (!steps.length || !line) return; // Verifica que los elementos existen

        steps.forEach((stepElement, index) => {
            stepElement.classList.toggle('completed', index < step);
            stepElement.classList.toggle('active', index === step);
        });

        const progressWidth = (step / (steps.length - 1)) * 100;
        line.style.width = `${progressWidth}%`;
        console.log("Progress actualizado. Paso actual:", step, " - Width:", progressWidth);
    }

    // Inicializar la barra de progreso en el paso actual
    updateProgress(currentStep);

    // Habilitar navegación haciendo clic en los pasos
    steps.forEach((step, index) => {
        step.addEventListener("click", function () {
            console.log("🔵 Paso clickeado:", index);
            if (index !== currentStep && pages[index]) {
                currentStep = index;
                updateProgress(currentStep);
                console.log("🚀 Redirigiendo a:", pages[index]);
                window.location.href = pages[index];
            }
        });
    });

    // Llamada al endpoint para obtener el último idEmprendedor desde la tabla emprendedor
    try {
        const response = await fetch("http://localhost:3000/fichaDiagnostico/ultimo-emprendedor");
        if (response.ok) {
            const data = await response.json();
            const idEmprendedorField = document.getElementById("idEmprendedor");
            if (idEmprendedorField) {
                idEmprendedorField.value = data.idEmprendedor;
                console.log("Campo oculto idEmprendedor actualizado:", data.idEmprendedor);
            } else {
                console.warn("El campo oculto 'idEmprendedor' no se encontró en el DOM.");
            }
        } else {
            console.error("Error al obtener idEmprendedor:", response.statusText);
        }
    } catch (error) {
        console.error("Error al obtener idEmprendedor:", error);
    }
 
    // Llamada al endpoint para obtener el último idEmprendimiento desde la tabla emprendimiento
    try {
        const response = await fetch("http://localhost:3000/fichaDiagnostico/ultimo-emprendimiento");
        if (response.ok) {
            const data = await response.json();
            const idEmprendimientoField = document.getElementById("idEmprendimiento");
            if (idEmprendimientoField) {
                idEmprendimientoField.value = data.idEmprendimiento; // <-- Corregido
                console.log("Campo oculto idEmprendimiento actualizado:", data.idEmprendimiento);
            } else {
                console.warn("El campo oculto 'idEmprendimiento' no se encontró en el DOM.");
            }
        } else {
            console.error("Error al obtener idEmprendimiento:", response.statusText);
        }
    } catch (error) {
        console.error("Error al obtener idEmprendimiento:", error);
    }
 
  // Obtener el id del colaborador logueado desde el localStorage
document.addEventListener("DOMContentLoaded", () => {
    const idColaborador = localStorage.getItem("idColaborador");
   
    if (!idColaborador) {
        console.warn("⚠️ No se encontró idColaborador en localStorage. Asegúrate de estar logueado.");
        return;
    }
   
    console.log("✅ idColaborador del usuario logueado:", idColaborador);
   
    // Asignar el idColaborador a un campo oculto si existe en el formulario
    const idColaboradorField = document.getElementById("idColaborador");
    if (idColaboradorField) {
        idColaboradorField.value = idColaborador;
    }
  });
 
    ///  boton de descarga aarchivo csv
 
    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {
            window.location.href = "http://localhost:3000/gestionProductiva/download-csv";
        });
      }
    
    // Función para actualizar la barra de progreso
    function updateProgress(step) {
        console.log("📌 Actualizando progreso a paso:", step);
        steps.forEach((stepElement, index) => {
            stepElement.classList.toggle('completed', index < step);
            stepElement.classList.toggle('active', index === step);
        });
 
        const progressWidth = (step / (steps.length - 1)) * 100;
        if (line) line.style.width = `${progressWidth}%`;
        console.log("Progress actualizado. Paso actual:", step, " - Width:", progressWidth);
    }
 
    // Inicializar la barra de progreso en el paso actual
    updateProgress(currentStep);
 
   
    const gestionSelect = document.getElementById("gestion");
    function updateGestionStepLabel() {
        if (gestionSelect) {
            const selectedText = gestionSelect.options[gestionSelect.selectedIndex].text;
            const dynamicStepLabel = steps[2].querySelector('.label');
            if (dynamicStepLabel) {
                dynamicStepLabel.textContent = selectedText;
            }
        }
    }
 
    updateGestionStepLabel();
    if (gestionSelect) {
        gestionSelect.addEventListener("change", updateGestionStepLabel);
    }
 
    // Habilitar navegación haciendo clic en los pasos (sin `select`)
    steps.forEach((step, index) => {
        step.addEventListener("click", function () {
            console.log("🔵 Círculo de la barra de progreso presionado, índice:", index);
            if (index !== currentStep && pages[index]) {
                currentStep = index;
                updateProgress(currentStep);
                console.log("🚀 Redirigiendo a:", pages[index]);
                window.location.href = pages[index];
            }
        });
    });
 
    // Evento del botón de guardar para avanzar automáticamente
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault(); // Evita el envío del formulario
            console.log("💾 Guardando formulario...");
 
            // ✅ Captura los valores de los campos principales (IDs relacionados con la base de datos)
            const idEmprendimiento = document.getElementById("idEmprendimiento")?.value.trim();
            const idEmprendedor = document.getElementById("idEmprendedor")?.value.trim();
            const idColaborador = document.getElementById("idColaborador")?.value.trim();
 
            // ✅ Verifica que los campos obligatorios no estén vacíos
            if (!idEmprendimiento || !idEmprendedor || !idColaborador) {
                alert("❌ Debes completar los campos obligatorios: Emprendimiento, Emprendedor y Colaborador.");
                return;
            }
 
            const respuestas = [];
 
            // 🔄 Recorre cada fila para capturar la información de las respuestas
            const preguntas = document.querySelectorAll("table tr[data-idPregunta]");
 
            preguntas.forEach(row => {
                const idPregunta_Productiva = row.dataset.idpregunta; // Captura el data-idPregunta
 
                if (!idPregunta_Productiva) {
                    console.warn("⚠️ Pregunta sin ID encontrada y omitida.");
                    return; // Salta si no hay ID de pregunta
                }
 
                // ✅ Verifica si los checkboxes están marcados y asigna "Sí" o "No"
                const diagnostico = row.querySelector(`input[name="diagnostico${idPregunta_Productiva}"]`)?.checked ? "Sí" : "No";
                const intermedia = row.querySelector(`input[name="intermedia${idPregunta_Productiva}"]`)?.checked ? "Sí" : "No";
                const final = row.querySelector(`input[name="final${idPregunta_Productiva}"]`)?.checked ? "Sí" : "No";
                const mejora = row.querySelector(`input[name="mejora${idPregunta_Productiva}"]`)?.checked ? "Sí" : "No";
                const status = row.querySelector(`input[name="status${idPregunta_Productiva}"]`)?.checked ? "Sí" : "No";
 
                respuestas.push({
                    idPregunta_Productiva,
                    diagnostico,
                    intermedia,
                    final,
                    mejora,
                    status
                });
            });
 
            // ✅ Captura las observaciones del formulario
            const observaciones = document.getElementById("observaciones")?.value.trim() || "Sin observaciones";
 
            // 📦 Prepara el objeto de datos para enviar al backend
            const data = {
                idEmprendimiento,
                idEmprendedor,
                idColaborador,
                respuestas,
                observaciones
            };
 
            console.log("📌 Datos enviados al backend:", JSON.stringify(data, null, 2));
 
            try {
                const response = await fetch("http://localhost:3000/gestionProductiva/guardar-respuestas", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
 
                const result = await response.json();
 
                if (response.ok) {
                    alert("✅ Respuestas guardadas exitosamente.");
                    form.reset(); // Limpia el formulario después de guardar
                } else {
                    alert(`❌ Error al guardar: ${result.message || "Error desconocido"}`);
                }
 
            } catch (error) {
                console.error("❌ Error al enviar respuestas:", error);
                alert("❌ Hubo un error al guardar los datos. Intenta nuevamente más tarde.");
            }
        });
    } else {
        console.warn("⚠️ No se encontró el formulario");
    }
});