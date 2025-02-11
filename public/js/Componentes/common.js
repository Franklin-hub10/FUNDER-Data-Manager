document.addEventListener("DOMContentLoaded", () => {
  // Extraer el nombre del usuario del almacenamiento
  const userName = localStorage.getItem("userName") || "Usuario";
  const userNameElement = document.getElementById("userName");
  if (userNameElement) {
    userNameElement.textContent = userName;
  }

  // Configurar los botones dropdown del menú lateral
  const dropdownBtns = document.querySelectorAll('.dropdown-btn');
  dropdownBtns.forEach((btn) => {
    btn.addEventListener('click', function () {
      const container = this.nextElementSibling;
      if (container) {
        container.classList.toggle('show');
      }
    });
  });

  // Configurar el cierre de sesión
  const logoutLink = document.getElementById('logoutLink');
  if (logoutLink) {
    logoutLink.addEventListener('click', (event) => {
      event.preventDefault();
      // Limpiar el almacenamiento y redirigir a la página de login
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = './index.html';
    });
  }
});
