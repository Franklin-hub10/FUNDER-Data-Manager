document.addEventListener('DOMContentLoaded', function () {
    // Mostrar/ocultar inputs basados en checkbox
    const checkboxRedes = document.querySelector('input[name="diagnostico8"]');
    const inputRedes = document.getElementById('redesSocialesInput');

    checkboxRedes.addEventListener('change', function () {
        inputRedes.style.display = this.checked ? 'table-row' : 'none';
    });

    const checkboxRecursos = document.querySelector('input[name="diagnostico10"]');
    const inputRecursos = document.getElementById('recursosInput');

    checkboxRecursos.addEventListener('change', function () {
        inputRecursos.style.display = this.checked ? 'table-row' : 'none';
    });

    const checkboxTemas = document.querySelector('input[name="diagnostico11"]');
    const inputTemas = document.getElementById('temasInput');

    checkboxTemas.addEventListener('change', function () {
        inputTemas.style.display = this.checked ? 'table-row' : 'none';
    });

    // Barra de progreso
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

    // Inicializar con el paso 5 activo
    updateProgress(4);

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
        const diagnostico = document.querySelectorAll('input[name^="diagnostico"]:checked').length;
        const intermedia = document.querySelectorAll('input[name^="intermedia"]:checked').length;
        const final = document.querySelectorAll('input[name^="final"]:checked').length;
        const final1 = document.querySelectorAll('input[name^="finalco"]:checked').length;
        const status = document.querySelectorAll('input[name^="status"]:checked').length;

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
            window.location.href = 'gestionFinanciera.html';
        }, 1000);
    });

});
