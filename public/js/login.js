document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const forgotPasswordLink = document.getElementById('forgotPassword');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Limpiar mensajes de error previos
        emailError.textContent = '';
        passwordError.textContent = '';

        let isValid = true;

        // Validar email
        if (!emailInput.value.trim()) {
            emailError.textContent = 'El campo de usuario o correo electrónico no puede estar vacío.';
            isValid = false;
        }

        // Validar contraseña
        if (!passwordInput.value.trim()) {
            passwordError.textContent = 'El campo de contraseña no puede estar vacío.';
            isValid = false;
        }

        if (!isValid) return;

        // Autenticación contra backend
        try {
            const response = await fetch("http://localhost:3000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: emailInput.value, password: passwordInput.value }),
            });

            const data = await response.json();
            
            if (response.ok) {
                if (data.forceChange) {
                    // 🚨 Si el backend indica que la contraseña debe ser cambiada, redirigir al usuario
                    alert("Debes cambiar tu contraseña antes de continuar.");
                    sessionStorage.setItem("tempUserId", data.userId); // Guardamos el ID del usuario temporalmente
                    window.location.href = "/public/screens/cambiarPassword.html"; 
                    return;
                }

                // Guardar sesión
                sessionStorage.setItem("token", data.token);
                sessionStorage.setItem("permisos", JSON.stringify(data.permisos));
                sessionStorage.setItem("loginTime", Date.now()); // Guardar tiempo de inicio
                window.location.href = "/public/screens/home.html";
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error("❌ Error en login:", error);
            alert("Error en el servidor, intenta más tarde.");
        }
    });

    // Mostrar alerta al hacer clic en "¿Olvidaste tu contraseña?"
    forgotPasswordLink.addEventListener('click', (event) => {
        event.preventDefault();
        alert('Por favor, contacte con su administrador para recuperar su contraseña.');
    });

    // Verificar sesión y cerrar después de 30 minutos de inactividad
    setInterval(() => {
        const loginTime = parseInt(sessionStorage.getItem('loginTime'), 10);
        const currentTime = Date.now();

        if (loginTime && currentTime - loginTime > 30 * 60 * 1000) { // 30 minutos
            sessionStorage.clear();
            alert('Su sesión ha expirado. Vuelva a iniciar sesión.');
            window.location.href = "/public/screens/index.html";
        }
    }, 60 * 1000);

    // Control de acceso a vistas según permisos
    const permisos = JSON.parse(sessionStorage.getItem("permisos")) || [];
    const vistasProtegidas = {
        "gestionUsuarios.html": "Gestionar Usuarios",
        "roles.html": "Gestionar Roles",
        "gestionFinanciera.html": "Gestionar Finanzas",
    };

    const pathname = window.location.pathname.split("/").pop();
    if (vistasProtegidas[pathname] && !permisos.includes(vistasProtegidas[pathname])) {
        alert("No tienes permiso para acceder a esta página.");
        window.location.href = "/public/screens/home.html";
    }
});
