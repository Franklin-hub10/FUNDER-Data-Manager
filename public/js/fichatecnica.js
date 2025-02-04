document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("formulario"); // CORREGIDO: Se usa getElementById
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
    updateProgress(0);

    // Redirigir al hacer clic en un círculo
    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            updateProgress(index);
            const pages = [
                'fichaTecnica.html',
                'fichaDiagnostico.html',
                'gestionOrganizacional.html',
                'gestionProductiva.html',
                'gestionComercial.html',
                'gestionFinanciera.html'
            ];
            window.location.href = pages[index];
        });
    });

    // Manejo del envío del formulario
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita que el formulario se envíe automáticamente

        let valid = true;

        // Lista de campos obligatorios
        const requiredFields = [
            "sede_funder", "nombres_apellidos", "lugar_nacimiento", "fecha_nacimiento",
            "direccion_negocio", "telefono_celular", "email", "ingresos_mensuales",
            "gastos_mensuales", "utilidad_mensual", "caracteristicas_negocio", "temas_capacitacion"
        ];

        // Validar que los campos requeridos no estén vacíos
        requiredFields.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                alert(`El campo '${input.previousElementSibling.innerText}' es obligatorio.`);
                valid = false;
            }
        });

        // Validar Documento de Identidad (Debe haber al menos un seleccionado)
        const documentoIdentidad = document.querySelectorAll("input[name='documento_identidad']:checked");
        if (documentoIdentidad.length === 0) {
            alert("Seleccione al menos un tipo de documento de identidad.");
            valid = false;
        }

        // Validar teléfono celular
        const telefonoCelular = document.getElementById("telefono_celular").value.trim();
        const phoneRegex = /^0\d{9}$/;
        if (!phoneRegex.test(telefonoCelular)) {
            alert("El teléfono celular debe comenzar con 0 y tener exactamente 10 dígitos.");
            valid = false;
        }

        // Validar correo electrónico
        const email = document.getElementById("email").value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Ingrese un correo electrónico válido.");
            valid = false;
        }

        // Validar Edad
        const edad = document.getElementById("edad").value.trim();
        if (!edad || isNaN(edad) || edad < 18) {
            alert("El campo 'Edad' debe ser un número positivo mayor o igual a 18.");
            valid = false;
        }

        // Validar Promedio Mensual de Ingresos
        const ingresosMensuales = document.getElementById("ingresos_mensuales").value.trim();
        if (!ingresosMensuales || isNaN(ingresosMensuales)) {
            alert("El campo 'Promedio Mensual de Ingresos' debe ser un número.");
            valid = false;
        }

        // Validar Promedio Mensual de Gastos
        const gastosMensuales = document.getElementById("gastos_mensuales").value.trim();
        if (!gastosMensuales || isNaN(gastosMensuales)) {
            alert("El campo 'Promedio Mensual de Gastos' debe ser un número.");
            valid = false;
        }

        // Validar Promedio Mensual de Utilidad
        const utilidadMensual = document.getElementById("utilidad_mensual").value.trim();
        if (!utilidadMensual || isNaN(utilidadMensual)) {
            alert("El campo 'Promedio Mensual de Utilidad' debe ser un número.");
            valid = false;
        }

        // Validar que haya seleccionado al menos una opción en género
        const genero = document.querySelectorAll("input[name='genero']:checked");
        if (genero.length === 0) {
            alert("Seleccione al menos una opción en 'Identidad Sexo-Genérica'.");
            valid = false;
        }

        // Validar Estado Civil (Debe haber al menos uno seleccionado)
        const estadoCivil = document.querySelectorAll("input[name='estado_civil']:checked");
        if (estadoCivil.length === 0) {
            alert("Seleccione al menos una opción en 'Estado Civil'.");
            valid = false;
        }

        // Validar Rol Familiar (Debe haber al menos uno seleccionado)
        const rolFamiliar = document.querySelectorAll("input[name='rol_familiar']:checked");
        if (rolFamiliar.length === 0) {
            alert("Seleccione al menos una opción en 'Rol Familiar'.");
            valid = false;
        }

        // Validar Características del Negocio
        const caracteristicasNegocio = document.getElementById("caracteristicas_negocio").value.trim();
        if (!caracteristicasNegocio) {
            alert("El campo 'Describa las características del negocio' es obligatorio.");
            valid = false;
        }

        // Validar Temas de Capacitación
        const temasCapacitacion = document.getElementById("temas_capacitacion").value.trim();
        if (!temasCapacitacion) {
            alert("El campo 'Temas de Capacitación' es obligatorio.");
            valid = false;
        }

        // Si todas las validaciones son exitosas, enviar el formulario y redirigir
        if (valid) {
            console.log("Formulario válido. Redirigiendo...");
            alert("Formulario guardado con éxito.");
            setTimeout(() => {
                window.location.href = '../screens/fichaDiagnostico.html';
            }, 1000);
        }
    });
});
