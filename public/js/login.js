

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');
    const forgotPasswordLink = document.getElementById('forgotPassword');

    // Credenciales temporales
    const tempUser = "funder@gmail.com";
    const tempPassword = "123456789";

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Evitar el envío del formulario hasta validar

        let isValid = true;

        // Validar que el campo de correo no esté vacío
        if (emailInput.value.trim() === "") {
            emailError.textContent = 'El campo de usuario o correo electrónico no puede estar vacío.';
            isValid = false;
        } else {
            emailError.textContent = '';
        }

        // Validar que el campo de contraseña no esté vacío
        if (passwordInput.value.trim() === "") {
            passwordError.textContent = 'El campo de contraseña no puede estar vacío.';
            isValid = false;
        } else {
            passwordError.textContent = '';
        }

        // Verificar credenciales
        if (isValid) {
            if (emailInput.value === tempUser && passwordInput.value === tempPassword) {
                alert('Inicio de sesión exitoso');

                // Mantener sesión iniciada
                sessionStorage.setItem('isLoggedIn', 'true');
                sessionStorage.setItem('loginTime', new Date().getTime());
                window.location.href = "/public/screens/home.html";
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        }
    });

    // Mostrar alerta al hacer clic en "¿Olvidaste tu contraseña?"
    forgotPasswordLink.addEventListener('click', (event) => {
        event.preventDefault(); 
        alert('Por favor, contacte con su administrador para recuperar su contraseña.');
    });

    // Verificar sesión y mostrar alerta de cierre después de 30 minutos
    setInterval(() => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        const loginTime = parseInt(sessionStorage.getItem('loginTime'), 10);
        const currentTime = new Date().getTime();

        if (isLoggedIn === 'true' && currentTime - loginTime > 30 * 60 * 1000) { // 30 minutos
            const continueSession = confirm('Su sesión está a punto de cerrarse. ¿Desea continuar?');

            if (continueSession) {
                // Actualizar tiempo de inicio de sesión
                sessionStorage.setItem('loginTime', new Date().getTime());
            } else {
                alert('Su sesión ha sido cerrada.');
                sessionStorage.clear(); // Cerrar sesión
                window.location.href = "/public/screens/index.html"; // Redirigir a la página de inicio de sesión
            }
        }
    }, 60 * 1000); // Verificar cada minuto
});
