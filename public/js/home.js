document.addEventListener("DOMContentLoaded", () => {
  // Obtener el id del colaborador logueado desde el localStorage
  const idColaborador = localStorage.getItem("idColaborador");

  if (!idColaborador) {
    console.warn("⚠️ No se encontró idColaborador en localStorage. Asegúrate de estar logueado.");
    return;
  }

  console.log("✅ idColaborador del usuario logueado:", idColaborador);

  // Asignar el idColaborador a un campo oculto si existe en el formulario
  const idColaboradorField = document.getElementById("idColaborador");
  if (idColaboradorField) {
    idColaboradorField.value = idColaborador;
  }

  // Obtener la sede del colaborador logueado desde el localStorage
  const sedeFunder = localStorage.getItem("sedeFunder");

  if (sedeFunder) {
    document.getElementById("sede_funder_display").innerText = sedeFunder; // Muestra la sede en el campo correspondiente
  } else {
    console.warn("⚠️ No se encontró sedeFunder en localStorage.");
  }

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
