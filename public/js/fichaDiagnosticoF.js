document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formulario"); // Ahora selecciona por ID
    const steps = document.querySelectorAll('.progress-steps .step');
    const line = document.querySelector('.progress-steps .line');

    // Función para actualizar el progreso
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

    // Redirigir al hacer clic en un círculo
    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            updateProgress(index);
            switch (index) {
                case 0:
                    window.location.href = 'fichaTecnica.html';
                    break;
                case 1:
                    window.location.href = 'fichaDiagnostico.html';
                    break;
                case 2:
                    window.location.href = 'gestionOrganizacional.html';
                    break;
                case 3:
                    window.location.href = 'gestionProductiva.html';
                    break;
                case 4:
                    window.location.href = 'gestionComercial.html';
                    break;
                case 5:
                    window.location.href = 'gestionFinanciera.html';
                    break;
                default:
                    break;
            }
        });
    });

    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevenir el envío del formulario inicialmente
        let valid = true;
        const mensajesErrores = [];

        // Validar campos de texto requeridos
        const requiredTextFields = [
            "nombre_comercial",
            "razon_social",
            "sede",
            "productos_servicios",
            "direccion",
            "ciudad",
            "canton",
            "parroquia",
            "contacto1",
            "contacto2",
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

        // Mostrar errores o redirigir
        if (!valid) {
            alert(`Errores encontrados:\n\n${mensajesErrores.join("\n")}`);
        } else {
            alert("Formulario guardado con éxito.");
            setTimeout(() => {
                window.location.href = '../screens/gestionOrganizacional.html'; // Redirige a la siguiente pantalla
            }, 1000);
        }
    });
});
