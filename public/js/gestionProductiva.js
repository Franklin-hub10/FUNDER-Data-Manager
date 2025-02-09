document.addEventListener('DOMContentLoaded', function () {
    // Barra de progreso
    const steps = document.querySelectorAll('.progress-steps .step');
    const line = document.querySelector('.progress-steps .line');
    const step3 = steps[2]; // Step 3 en la barra de progreso (índice 2)

    // Obtener el elemento de la etiqueta dentro del Step 3
    const step3Label = step3.querySelector('.label');

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
    updateProgress(2); // Tercer paso (Gestión Organizacional)

    // Redirigir al hacer clic en un círculo
    steps.forEach((step, index) => {
        step.addEventListener('click', () => {
            const pages = [
                'fichaTecnica.html',
                'fichaDiagnostico.html',
                'gestionOrganizacional.html',
                'gestionProductiva.html',
                'gestionComercial.html',
                'gestionFinanciera.html'
            ];
            window.location.href = pages[index] || 'fichaTecnica.html';
        });
    });

    // Evento del botón de guardar
    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el envío del formulario

        alert("✅ Guardado con éxito."); // Mensaje de éxito

        // Redirigir a la página seleccionada en el select
        const gestionSelect = document.getElementById("gestion");
        const selectedPage = gestionSelect.value; // Obtiene la página seleccionada
        const selectedText = gestionSelect.options[gestionSelect.selectedIndex].text; // Obtiene el nombre de la gestión

        // Actualizar el texto de la etiqueta del Step 3
        if (step3Label) {
            step3Label.textContent = selectedText;
        }

        // Asegurar que Step 3 siga siendo visible
        step3.classList.add('active');

        setTimeout(() => {
            window.location.href = selectedPage; // Redirige a la página elegida
        }, 1000);
    });
});
