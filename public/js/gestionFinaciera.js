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
 
    // Llamada al endpoint para obtener el último idColaborador desde la tabla colaborador
    try {
        const response = await fetch("http://localhost:3000/usuarios/ultimo-colaborador");
        if (response.ok) {
            const data = await response.json();
            const idColaboradorField = document.getElementById("idColaborador");
            if (idColaboradorField) {
                idColaboradorField.value = data.idColaborador;
                console.log("Campo oculto idColaborador actualizado:", data.idColaborador);
            } else {
                console.warn("El campo oculto 'idColaborador' no se encontró en el DOM.");
            }
        } else {
            console.error("Error al obtener idColaborador:", response.statusText);
        }
    } catch (error) {
        console.error("Error al obtener idColaborador:", error);
    }
 
    // Resto del código existente:
    const steps = document.querySelectorAll('.progress-steps .step');
    const line = document.querySelector('.progress-steps .line');
    const nextButton = document.getElementById("nextButton");
    const prevButton = document.getElementById("prevButton");
    const form = document.querySelector('form');
    const downloadBtn = document.getElementById("downloadBtn");
 
 
    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {
          // Cambia la URL para que coincida con el endpoint del backend
          window.location.href = "http://localhost:3000/gestionFinanciera/download-csv";
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
            const diagnostico_valor = row.querySelector("input[name^='diagnostico_valor']")?.value || "0.0";
            const intermedia_valor = row.querySelector("input[name^='intermedia_valor']")?.value || "0.0";
            const final_valor = row.querySelector("input[name^='final_valor']")?.value || "0.0";
            const mejora_valor = row.querySelector("input[name^='mejora_valor']")?.value || "0.0";
            const status_valor = row.querySelector("input[name^='status_valor']")?.value || "0.0";


 
            respuestas.push({
                idPregunta_Organizacional,
                diagnostico,
                intermedia,
                final,
                mejora,
                status,
                diagnostico_valor,
                intermedia_valor,
                final_valor,
                mejora_valor,
                status_valor,
                

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
            observaciones,
            tecnico_responsable,


        };
 
        console.log("📌 Datos enviados al backend:", JSON.stringify(data, null, 2));
 
        try {
            const response = await fetch("http://localhost:3000/gestionFinanciera/guardarRespuestasFinanciera", {
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