document.addEventListener('DOMContentLoaded', function () {
    console.log("📌 Script de navegación cargado correctamente.");

    // Selección de elementos de la barra de progreso
    const steps = document.querySelectorAll('.progress-steps .step');
    const line = document.querySelector('.progress-steps .line');
    const nextButton = document.getElementById("nextButton"); // Botón Siguiente
    const prevButton = document.getElementById("prevButton"); // Botón Atrás
    const form = document.querySelector('form'); // Formulario de guardado

    // Lista de pantallas en orden de pasos
    const pages = [
        'fichaTecnica.html',
        'fichaDiagnostico.html',
        'gestionOrganizacional.html',
        'gestionProductiva.html',
        'gestionComercial.html',
        'gestionFinanciera.html'
    ];

    // Determinar el paso actual basado en la URL
    let currentStep = pages.findIndex(page => window.location.pathname.includes(page));
    if (currentStep === -1) currentStep = 0; // Si la página no está en la lista, iniciar en 0

    console.log("🔢 Paso actual detectado:", currentStep);

    // Función para actualizar la barra de progreso
    function updateProgress(step) {
        console.log("📌 Actualizando progreso a paso:", step);
        steps.forEach((stepElement, index) => {
            stepElement.classList.toggle('completed', index < step);
            stepElement.classList.toggle('active', index === step);
        });

        const progressWidth = (step / (steps.length - 1)) * 100;
        if (line) line.style.width = `${progressWidth}%`;
    }

    // Inicializar la barra de progreso en el paso actual
    updateProgress(currentStep);

    // Evento para avanzar al siguiente paso
    if (nextButton) {
        nextButton.addEventListener("click", function () {
            console.log("➡️ Botón 'Siguiente' presionado");
            if (currentStep < pages.length - 1) {
                currentStep++;
                updateProgress(currentStep);
                console.log("⏭️ Redirigiendo a:", pages[currentStep]);
                window.location.href = pages[currentStep];
            }
        });
    } else {
        console.warn("⚠️ No se encontró el botón 'Siguiente'");
    }

    // Evento para retroceder al paso anterior
    if (prevButton) {
        prevButton.addEventListener("click", function () {
            console.log("⬅️ Botón 'Atrás' presionado");
            if (currentStep > 0) {
                currentStep--;
                updateProgress(currentStep);
                console.log("🔙 Redirigiendo a:", pages[currentStep]);
                window.location.href = pages[currentStep];
            }
        });
    } else {
        console.warn("⚠️ No se encontró el botón 'Atrás'");
    }

    // Habilitar navegación haciendo clic en los pasos (sin `select`)
    steps.forEach((step, index) => {
        step.addEventListener("click", function () {
            console.log("🔵 Círculo de la barra de progreso presionado, índice:", index);
            if (index !== currentStep && pages[index]) {
                currentStep = index;
                updateProgress(currentStep);
                console.log("🚀 Redirigiendo a:", pages[index]);
                window.location.href = pages[index];
            }
        });
    });

    // Evento del botón de guardar para avanzar automáticamente
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault(); // Evita el envío del formulario
            console.log("💾 Guardando formulario...");

            alert("✅ Guardado con éxito."); // Mensaje de éxito

            // Avanzar automáticamente al siguiente paso después de guardar
            if (currentStep < pages.length - 1) {
                setTimeout(() => {
                    currentStep++;
                    updateProgress(currentStep);
                    console.log("⏭️ Redirigiendo después de guardar:", pages[currentStep]);
                    window.location.href = pages[currentStep];
                }, 1000);
            }
        });
    } else {
        console.warn("⚠️ No se encontró el formulario");
    }
});
