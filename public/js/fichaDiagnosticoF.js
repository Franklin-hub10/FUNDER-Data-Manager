const API_BASE_URL = 'http://localhost:3000';
const API_ROLES = `${API_BASE_URL}/emprendimientos`;
const API_FICHA_DIAGNOSTICO = `${API_BASE_URL}/fichaDiagnostico/crear-emprendimiento`;


document.addEventListener("DOMContentLoaded", async function () {
    const form = document.getElementById("formulario");
    const steps = document.querySelectorAll('.progress-steps .step');
    const line = document.querySelector('.progress-steps .line');
    const gestionSelect = document.getElementById("gestion");
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



    // Configurar el botón de descarga
    if (downloadBtn) {
        downloadBtn.addEventListener("click", function () {
            window.location.href = "http://localhost:3000/fichaDiagnostico/download-csv";
        });
    }

    // Función para actualizar la barra de progreso
    function updateProgress(currentStep) {
        steps.forEach((step, index) => {
            if (index < currentStep) {
                step.classList.add('completed');
                step.classList.remove('active');
            } else if (index === currentStep) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active', 'completed');
            }
        });
        const progressWidth = (currentStep / (steps.length - 1)) * 100;
        line.style.width = `${progressWidth}%`;
    }

    // Inicializar con el primer paso activo
    updateProgress(1);

    // Actualizar el label del paso dinámico según el select "gestion"
    function updateGestionStepLabel() {
        if (gestionSelect) {
            const selectedText = gestionSelect.options[gestionSelect.selectedIndex].text;
            const dynamicStepLabel = steps[2].querySelector('.label');
            if (dynamicStepLabel) {
                dynamicStepLabel.textContent = selectedText;
            }
        }
    }

    // Actualizar el label al cargar y cada vez que se cambie el select
    updateGestionStepLabel();
    if (gestionSelect) {
        gestionSelect.addEventListener("change", updateGestionStepLabel);
    }

    // Redirección entre pasos
    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            updateProgress(index);
            const pages = [
                '/public/screens/fichaTecnica.html',
                '/public/screens/fichaDiagnostico.html',
                gestionSelect ? gestionSelect.value : '/public/screens/gestionOrganizacional.html',
                '/public/screens/gestionProductiva.html',
                '/public/screens/gestionComercial.html',
                '/public/screens/gestionFinanciera.html'
            ];
            if (pages[index]) window.location.href = pages[index];
        });
    });

    // Event listener para el envío del formulario
    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Validar campos del formulario
        const { valid, mensajesErrores } = validarFormulario();

        if (!valid) {
            alert(`Errores encontrados:\n\n${mensajesErrores.join("\n")}`);
            return;
        }

        // Construir los datos del formulario
        const data = construirDatosFormulario();

        // Enviar los datos al backend
        try {
            const response = await fetch(API_FICHA_DIAGNOSTICO, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Error: ${errorMessage}`);
            }

            alert("✅ Ficha de diagnóstico guardada correctamente");
            window.location.href = "/public/screens/gestionOrganizacional.html";
        } catch (error) {
            console.error("Error al guardar ficha de diagnóstico:", error);
            alert(`❌ Error: ${error.message}`);
        }
    });
});

// Función para validar el formulario
function validarFormulario() {
    let valid = true;
    const mensajesErrores = [];

    // Validar campos de texto requeridos
    const requiredTextFields = [
        "nombre_comercial",
        "razon_social",
        "direccion",
        "ciudad",
        "canton",
        "parroquia",
        "telefonoContacto1",
        "telefonoContacto2",
        "referencia",
        "tecnico"
    ];
    requiredTextFields.forEach((id) => {
        const field = document.getElementById(id);
        if (!field || field.value.trim() === "") {
            mensajesErrores.push(`El campo '${id}' es obligatorio.`);
            valid = false;
        }
    });

    // Validar números de teléfono (10 dígitos)
    const telefono1 = document.getElementById("telefono1").value.trim();
    const telefono2 = document.getElementById("telefono2").value.trim();
    if (!/^\d{10}$/.test(telefono1)) {
        mensajesErrores.push("El 'Teléfono 1' debe contener exactamente 10 dígitos.");
        valid = false;
    }
    if (!/^\d{10}$/.test(telefono2)) {
        mensajesErrores.push("El 'Teléfono 2' debe contener exactamente 10 dígitos.");
        valid = false;
    }

    // Validar correo electrónico
    const email = document.getElementById("email").value.trim();
    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        mensajesErrores.push("El campo 'Email' debe contener una dirección de correo válida.");
        valid = false;
    }

    // Validar números requeridos (socios, empleados, antigüedad)
    const requiredNumberFields = [
        { id: "num_socios", label: "Número de socios" },
        { id: "num_empleados", label: "Número de empleados" },
        { id: "antiguedad", label: "Antigüedad de la empresa" }
    ];
    requiredNumberFields.forEach((field) => {
        const value = document.getElementById(field.id).value.trim();
        if (value === "" || isNaN(value) || value <= 0) {
            mensajesErrores.push(`El campo '${field.label}' debe ser un número mayor a 0.`);
            valid = false;
        }
    });

    // Validar fecha de evaluación
    const fechaEvaluacion = document.getElementById("fecha_evaluacion").value.trim();
    if (fechaEvaluacion === "") {
        mensajesErrores.push("El campo 'Fecha de la evaluación' es obligatorio.");
        valid = false;
    }

    return { valid, mensajesErrores };
}

// Función para construir los datos del formulario

function construirDatosFormulario() {
    return {
        nombreComercial: document.getElementById("nombre_comercial").value.trim(),
        razonSocial: document.getElementById("razon_social").value.trim(),
        direccionNegocio: document.getElementById("direccion").value.trim(),
        Parroquia: document.getElementById("parroquia").value.trim(),
        canton: document.getElementById("canton").value.trim(),
        ciudad: document.getElementById("ciudad").value.trim(),
        referencia: document.getElementById("referencia").value.trim(),
        telefono1: document.getElementById("telefono1").value.trim(),
        telefono2: document.getElementById("telefono2").value.trim(),
        correo: document.getElementById("email").value.trim(),
        numSocios: parseInt(document.getElementById("num_socios").value.trim()),
        numEmpleados: parseInt(document.getElementById("num_empleados").value.trim()),
        antiguedad: parseInt(document.getElementById("antiguedad").value.trim()),
        nombreContacto1: document.getElementById("nombreContacto1").value.trim(),
        telefonoContacto1: document.getElementById("telefonoContacto1").value.trim(),
        nombreContacto2: document.getElementById("nombreContacto2").value.trim(),
        telefonoContacto2: document.getElementById("telefonoContacto2").value.trim(),
        nombreEvaluador: document.getElementById("tecnico").value.trim(),
        fechaEvaluacion: document.getElementById("fecha_evaluacion").value.trim(),
        idEmprendedor: document.getElementById("idEmprendedor").value,
        idColaborador: document.getElementById("idColaborador").value,
    };
}


document.addEventListener("DOMContentLoaded", function () {
    const downloadBtn = document.getElementById("downloadBtn");
    if (downloadBtn) {
        downloadBtn.style.display = "none"; // Oculta el botón
    }
});
