document.addEventListener('DOMContentLoaded', function () {
    // Barra de progreso
    const steps = document.querySelectorAll('.progress-steps .step');
    const line = document.querySelector('.progress-steps .line');
    const step3Label = document.getElementById('step3Label'); // Obtiene el label de Step 3

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
    updateProgress(2); // Paso 3 (Gestión Organizacional)

    // Evento del botón de guardar
    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el envío del formulario

        alert("✅ Guardado con éxito."); // Mensaje de éxito

        // Obtener la página seleccionada y su nombre
        const gestionSelect = document.getElementById("gestion");
        const selectedPage = gestionSelect.value; // URL seleccionada
        const selectedText = gestionSelect.options[gestionSelect.selectedIndex].text; // Nombre de la gestión

        // Verificar si el elemento de Step 3 existe y actualizarlo
        if (step3Label) {
            step3Label.textContent = selectedText; // Cambia el texto del label en el Step 3
        }

        // Redirigir después de un pequeño retraso
        setTimeout(() => {
            window.location.href = selectedPage;
        }, 1000);
    });
});
