document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");
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
        let valid = true; // Controla si el formulario es válido

        // Validar Sede FUNDER
        const sedeFunder = document.getElementById("sede_funder");
        if (sedeFunder.value.trim() === "") {
            alert("El campo 'Sede FUNDER' es obligatorio.");
            valid = false;
        }

        // Validar Nombres y Apellidos
        const nombresApellidos = document.getElementById("nombres_apellidos");
        if (nombresApellidos.value.trim() === "") {
            alert("El campo 'Nombres y Apellidos' es obligatorio.");
            valid = false;
        }

        // Validar Documento de Identidad (al menos uno seleccionado)
        const documentos = document.querySelectorAll("input[name='documento_identidad']:checked");
        if (documentos.length === 0) {
            alert("Seleccione al menos un tipo de documento de identidad.");
            valid = false;
        }

        // Validar Lugar de Nacimiento
        const lugarNacimiento = document.getElementById("lugar_nacimiento");
        if (lugarNacimiento.value.trim() === "") {
            alert("El campo 'Lugar y Fecha de Nacimiento' es obligatorio.");
            valid = false;
        }

        // Validar Edad
        const edad = document.getElementById("edad");
        if (!edad.value || isNaN(edad.value) || edad.value <= 0 || edad.value < 18) {
            alert("El campo 'Edad' debe ser un número positivo mayor o igual a 18.");
            valid = false;
        }

        // Validar Género (al menos uno seleccionado)
        const genero = document.querySelectorAll("input[name='genero']:checked");
        if (genero.length === 0) {
            alert("Seleccione al menos una opción en 'Identidad Sexo-Genérica'.");
            valid = false;
        }

        // Validar Estado Civil (al menos uno seleccionado)
        const estadoCivil = document.querySelectorAll("input[name='estado_civil']:checked");
        if (estadoCivil.length === 0) {
            alert("Seleccione al menos una opción en 'Estado Civil'.");
            valid = false;
        }

        // Validar Rol Familiar (al menos uno seleccionado)
        const rolFamiliar = document.querySelectorAll("input[name='rol_familiar']:checked");
        if (rolFamiliar.length === 0) {
            alert("Seleccione al menos una opción en 'Rol Familiar'.");
            valid = false;
        }

        // Validar Dirección Actual del Negocio
        const direccionNegocio = document.getElementById("direccion_negocio");
        if (direccionNegocio.value.trim() === "") {
            alert("El campo 'Dirección Actual del Negocio' es obligatorio.");
            valid = false;
        }

        // Validar Contacto
const telefonoCelular = document.getElementById("telefono_celular").value.trim();
const email = document.getElementById("email").value.trim();

// Expresión regular para validar teléfonos
const phoneRegex = /^0\d{9}$/;

// Expresión regular para validar correos electrónicos
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validar Teléfono Celular (Obligatorio y debe cumplir con el formato)
if (!telefonoCelular) {
    alert("El campo 'Teléfono Celular' es obligatorio.");
    valid = false;
} else if (!phoneRegex.test(telefonoCelular)) {
    alert("El teléfono celular debe comenzar con 0 y tener exactamente 10 dígitos.");
    valid = false;
}

// Validar Correo Electrónico (Obligatorio y debe cumplir con el formato)
if (!email) {
    alert("El campo 'Correo Electrónico' es obligatorio.");
    valid = false;
} else if (!emailRegex.test(email)) {
    alert("Ingrese un correo electrónico válido.");
    valid = false;
}

        // Validar Promedio Mensual de Ingresos
        const ingresosMensuales = document.getElementById("ingresos_mensuales");
        if (ingresosMensuales.value.trim() === "" || isNaN(ingresosMensuales.value)) {
            alert("El campo 'Promedio Mensual de Ingresos' debe ser un número.");
            valid = false;
        }

        // Validar Promedio Mensual de Gastos
        const gastosMensuales = document.getElementById("gastos_mensuales");
        if (gastosMensuales.value.trim() === "" || isNaN(gastosMensuales.value)) {
            alert("El campo 'Promedio Mensual de Gastos' debe ser un número.");
            valid = false;
        }

        // Validar Promedio Mensual de Utilidad
        const utilidadMensual = document.getElementById("utilidad_mensual");
        if (utilidadMensual.value.trim() === "" || isNaN(utilidadMensual.value)) {
            alert("El campo 'Promedio Mensual de Utilidad' debe ser un número.");
            valid = false;
        }

        // Validar Características del Negocio
        const caracteristicasNegocio = document.getElementById("caracteristicas_negocio");
        if (caracteristicasNegocio.value.trim() === "") {
            alert("El campo 'Describa las características del negocio' es obligatorio.");
            valid = false;
        }

        // Validar Temas de Capacitación
        const temasCapacitacion = document.getElementById("temas_capacitacion");
        if (temasCapacitacion.value.trim() === "") {
            alert("El campo 'Temas de Capacitación' es obligatorio.");
            valid = false;
        }

        // Si el formulario es válido
        if (valid) {
            alert("Formulario guardado con éxito.");
        } else {
            event.preventDefault(); // Prevenir envío del formulario si hay errores
        }

      

        
    
    });
});
