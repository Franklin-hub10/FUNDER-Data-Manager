document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.querySelector("form");
    const telefono1 = document.getElementById("telefono1");
    const telefono2 = document.getElementById("telefono2");
    const email = document.getElementById("email");

    // Función para mostrar mensajes de alerta
    const mostrarAlerta = (mensaje, tipo = "error") => {
        const alerta = document.createElement("div");
        alerta.textContent = mensaje;
        alerta.className = tipo === "error" ? "alert-error" : "alert-success";
        document.body.appendChild(alerta);

        setTimeout(() => alerta.remove(), 3000);
    };

    // Validar teléfonos
    const validarTelefonos = () => {
        let valido = true;

        if (telefono1.value.length !== 10) {
            mostrarAlerta("Teléfono 1 debe tener exactamente 10 dígitos.", "error");
            valido = false;
        }

        if (telefono2.value.length !== 10) {
            mostrarAlerta("Teléfono 2 debe tener exactamente 10 dígitos.", "error");
            valido = false;
        }

        return valido;
    };

    // Validar email
    const validarEmail = () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email.value)) {
            mostrarAlerta("El correo electrónico no es válido.", "error");
            return false;
        }

        return true;
    };

    // Validar el formulario completo
    const validarFormulario = () => {
        const telefonosValidos = validarTelefonos();
        const emailValido = validarEmail();

        return telefonosValidos && emailValido;
    };

    // Manejar evento de envío del formulario
    formulario.addEventListener("Guardar", (e) => {
        e.preventDefault(); // Prevenir el envío por defecto

        if (validarFormulario()) {
            mostrarAlerta("Guardado con éxito.", "success");
            formulario.reset(); // Limpia el formulario si es válido
        }
    });
});
