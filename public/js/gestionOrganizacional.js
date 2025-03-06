document.addEventListener('DOMContentLoaded', async function () {
    console.log("DOMContentLoaded: Script iniciado.");
 

    
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
 
    // Resto del código existente:
    const steps = document.querySelectorAll('.progress-steps .step');
    const line = document.querySelector('.progress-steps .line');
    const nextButton = document.getElementById("nextButton");
    const prevButton = document.getElementById("prevButton");
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
    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {
          // Cambia la URL para que coincida con el endpoint del backend
          window.location.href = "http://localhost:3000/gestionOrganizacional/download-csv";
        });
      }
 
    const pages = [
        'fichaTecnica.html',
        'fichaDiagnostico.html',
        'gestionOrganizacional.html',
        'gestionProductiva.html',
        'gestionComercial.html',
        'gestionFinanciera.html'
    ];
 
    let currentStep = pages.findIndex(page => window.location.pathname.includes(page));
    if (currentStep === -1) currentStep = 0;
    console.log("Current step inicial:", currentStep);
 
    function updateProgress(step) {
        steps.forEach((stepElement, index) => {
            stepElement.classList.toggle('completed', index < step);
            stepElement.classList.toggle('active', index === step);
        });
        const progressWidth = (step / (steps.length - 1)) * 100;
        if (line) line.style.width = `${progressWidth}%`;
        console.log("Progress actualizado. Paso actual:", step, " - Width:", progressWidth);
    }
 
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
 
    steps.forEach((step, index) => {
        step.addEventListener("click", function () {
            if (index !== currentStep && pages[index]) {
                currentStep = index;
                updateProgress(currentStep);
                console.log("Step clickeado. Redirigiendo a:", pages[index]);
                window.location.href = pages[index];
            }
        });
    });
 
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            alert("✅ Guardado con éxito.");
            if (currentStep < pages.length - 1) {
                setTimeout(() => {
                    currentStep++;
                    updateProgress(currentStep);
                    window.location.href = pages[currentStep];
                }, 1000);
            }
        });
    }
 
    // Event listener para el envío del formulario con respuestas
    document.getElementById("formulario").addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log("Submit del formulario detectado.");
 
        const respuestas = [];
        const preguntas = document.querySelectorAll("table tr[data-idPregunta]");
        console.log("Número de preguntas encontradas:", preguntas.length);
 
        preguntas.forEach(row => {
            const idPregunta_Organizacional = row.dataset.idpregunta;
            console.log("Procesando pregunta con ID:", idPregunta_Organizacional);
 
            if (!idPregunta_Organizacional) {
                console.warn("⚠️ Pregunta sin ID encontrada y omitida.");
                return;
            }
 
            const diagnostico = row.querySelector("input[name^='diagnostico']")?.checked ? "Sí" : "No";
            const intermedia = row.querySelector("input[name^='intermedia']")?.checked ? "Sí" : "No";
            const final = row.querySelector("input[name^='final']")?.checked ? "Sí" : "No";
            const mejora = row.querySelector("input[name^='mejora']")?.checked ? "Sí" : "No";
            const status = row.querySelector("input[name^='status']")?.checked ? "Sí" : "No";
 
            respuestas.push({
                idPregunta_Organizacional,
                diagnostico,
                intermedia,
                final,
                mejora,
                status
            });
        });
 
        const observaciones = document.getElementById("observaciones")?.value.trim() || "Sin observaciones";
        console.log("Observaciones:", observaciones);
 
        // Obtener valores de los campos ocultos
        const idEmprendimientoEl = document.getElementById("idEmprendimiento");
        const idEmprendedorEl = document.getElementById("idEmprendedor");
        const idColaboradorEl = document.getElementById("idColaborador");
 
        const idEmprendimiento = idEmprendimientoEl ? parseInt(idEmprendimientoEl.value) : null;
        const idEmprendedor = idEmprendedorEl ? parseInt(idEmprendedorEl.value) : null;
        const idColaborador = idColaboradorEl && idColaboradorEl.value ? parseInt(idColaboradorEl.value) : null;
 
        console.log("Variables globales:",
            "idEmprendimiento:", idEmprendimiento,
            " idEmprendedor:", idEmprendedor,
            " idColaborador:", idColaborador
        );
 
        // Validar campos ocultos
        if (!idEmprendimiento || !idEmprendedor || !idColaborador) {
            console.error("❌ Campos ocultos no están definidos o son inválidos.");
            alert("❌ Error: Campos ocultos no están definidos. Recarga la página e intenta nuevamente.");
            return;
        }
 
        const data = {
            idEmprendimiento,
            idEmprendedor,
            idColaborador,
            respuestas,
            observaciones
        };
 
        console.log("📌 Datos enviados al backend:", JSON.stringify(data, null, 2));
 
        try {
            const response = await fetch("http://localhost:3000/gestionOrganizacional/guardar-respuestas", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
            console.log("📌 Response del fetch:", response);
 
            const result = await response.json();
            console.log("📌 Resultado JSON:", result);
 
            if (response.ok) {
                alert("✅ Respuestas guardadas exitosamente.");
                form.reset();
                if (currentStep < pages.length - 1) {
                    setTimeout(() => {
                        currentStep++;
                        updateProgress(currentStep);
                        window.location.href = pages[currentStep];
                    }, 1000);
                }
            } else {
                alert(`❌ Error al guardar: ${result.message || "Error desconocido"}`);
            }
        } catch (error) {
            console.error("❌ Error al enviar respuestas:", error);
            alert("❌ Hubo un error al guardar los datos. Intenta nuevamente más tarde.");
        }
    });
});