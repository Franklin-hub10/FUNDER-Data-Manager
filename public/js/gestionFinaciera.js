document.addEventListener('DOMContentLoaded', function () {
    // Barra de progreso
    const steps = document.querySelectorAll('.progress-steps .step');
    const line = document.querySelector('.progress-steps .line');

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

    updateProgress(5);

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

    // Función para formatear entrada de dinero con signo de $
    function formatCurrencyOnBlur(input) {
        let value = input.value.replace(/[^0-9.]/g, ''); // Permitir solo números y punto decimal
        if (value === "") return;
        let num = parseFloat(value);
        if (!isNaN(num)) {
            input.value = `$${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }
    }

    // Función para calcular el subtotal basado en los campos
    function calcularSubtotal() {
        const gasto = parseFloat(document.querySelector('input[name="diagnostico11"]').value.replace(/[^0-9.]/g, '')) || 0;
        const ingreso = parseFloat(document.querySelector('input[name="diagnostico13"]').value.replace(/[^0-9.]/g, '')) || 0;
        const utilidad = parseFloat(document.getElementById('diagnostico_utilidad').value.replace(/[^0-9.]/g, '')) || 0;

        // Subtotal = ingreso + utilidad - gasto
        const subtotal = ingreso + utilidad - gasto;

        // Mostrar el subtotal en todos los campos relacionados
        document.getElementById('subtotal_diagnostico').value = `$${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
        
    }

    // Evento para formatear entrada de dinero y calcular totales
    document.querySelectorAll('.money-input').forEach(input => {
        input.addEventListener('input', function () {
            if (!this.classList.contains('product')) { // Excluir campo de producto más vendido
                this.value = this.value.replace(/[^0-9.]/g, ''); // Permitir solo números
            }
        });

        input.addEventListener('blur', function () {
            if (!this.classList.contains('product')) { // Excluir campo de producto más vendido
                formatCurrencyOnBlur(this);
                calcularSubtotal(); // Recalcular totales después de formatear
            }
        });
    });

    // Evento del botón de guardar
    document.querySelector('form').addEventListener('submit', function (event) {
        event.preventDefault(); // Evita el envío del formulario

        // Mostrar alerta de éxito
        alert("Guardado con éxito.");

        // Redirigir tras un pequeño retraso
        setTimeout(() => {
            window.location.href = '../screens/fichaTecnica.html'; // Página de redirección
        }, 1000);
    });
});
