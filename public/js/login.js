document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var username = document.getElementById('username').value.trim();
    var password = document.getElementById('password').value.trim();
    var errorMessage = document.getElementById('errorMessage');

    if (!username || !password) {
        errorMessage.textContent = 'Por favor, completa todos los campos.';
        errorMessage.style.display = 'block';
        return;
    } else {
        errorMessage.style.display = 'none';
    }

    // Reemplaza con tu usuario y contraseña correctos
    var correctUsername = 'Funder';
    var correctPassword = '1234';

    if (username === correctUsername && password === correctPassword) {
        // Redirigir a otra página
        window.location.href = 'home.html'; // Reemplaza con tu página de destino
    } else {
        alert('Usuario o contraseña incorrectos');
    }
});

document.getElementById('forgotPassword').addEventListener('click', function() {
    alert('Por favor, contacta con el soporte para recuperar tu contraseña.');
});
