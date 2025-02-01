    document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        let valid = true; // Controla si el formulario es válido
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
            if (field.value.trim() === "") {
                mensajesErrores.push(`El campo '${field.previousElementSibling.textContent}' es obligatorio.`);
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

        // Mostrar errores o mensaje de éxito
        if (!valid) {
            event.preventDefault(); // Evitar envío del formulario si hay errores
            alert(`Errores encontrados:\n\n${mensajesErrores.join("\n")}`);
        } else {
            alert("Formulario guardado con éxito.");
        }
    });
});
