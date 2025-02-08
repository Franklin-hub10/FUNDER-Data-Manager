document.addEventListener('DOMContentLoaded', function () {
    const steps = document.querySelectorAll('.progress-steps .step');
    const line = document.querySelector('.progress-steps .line');
    const step3Label = document.getElementById('step3Label'); // Contenedor para el paso 3

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

    // Inicializar con el paso 3 activo
    updateProgress(2);

    // Cambiar el nombre de la página en el paso 3
    function actualizarNombrePagina() {
        // Si ya tienes un valor seleccionado en algún select, úsalo aquí.
        const paginaSeleccionada = document.querySelector('select[name="pagina"]'); // Este es solo un ejemplo
        const nombrePagina = paginaSeleccionada ? paginaSeleccionada.value : 'Gestión Organizacional';

        step3Label.textContent = nombrePagina; // Actualiza el nombre en el paso 3
    }

    // Llama a la función para actualizar el nombre de la página al cargar
    actualizarNombrePagina();

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

    // Función para calcular los subtotales
    function calcularSubtotales() {
        // Contar checkboxes marcados en cada columna
        const diagnostico = document.querySelectorAll('input[name^="diagnostico"]:checked').length;
        const intermedia = document.querySelectorAll('input[name^="intermedia"]:checked').length;
        const final = document.querySelectorAll('input[name^="final"]:checked').length;
        const final1 = document.querySelectorAll('input[name^="final1"]:checked').length;
        const status = document.querySelectorAll('input[name^="status"]:checked').length;

        // Actualizar los campos de subtotal
        document.getElementById('subtotal_diagnostico').value = diagnostico;
        document.getElementById('subtotal_intermedia').value = intermedia;
        document.getElementById('subtotal_final').value = final;
        document.getElementById('subtotal_final1').value = final1;
        document.getElementById('status_final').value = status;
    }

    // Evento para calcular subtotales automáticamente al marcar/desmarcar un checkbox
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', calcularSubtotales);
    });

    // ✅ Evento para mostrar mensaje de éxito y redirigir sin validar casillas marcadas
    const form = document.querySelector("form");
    form.addEventListener("submit", function (event) {
        event.preventDefault(); // Evita el envío por defecto

        alert("✅ Guardado con éxito."); // Mensaje de éxito

        // Redirección después de 1 segundo
        setTimeout(() => {
            window.location.href = '../screens/gestionProductiva.html';
        }, 1000);
    });

});
