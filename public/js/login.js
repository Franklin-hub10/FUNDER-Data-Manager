document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');
  const forgotPasswordBtn = document.getElementById("forgotPassword");

  // Evento para manejar el inicio de sesión
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Obtener valores de los inputs
    const usuario = document.getElementById("usuario").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validar que los campos no estén vacíos
    if (!usuario || !password) {
      alert("Usuario y contraseña son obligatorios.");
      return;
    }

    try {
      // Realizar la solicitud al servidor
      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ usuario, password }),
      });

      // Leer la respuesta en formato JSON
      const data = await response.json();

      // Verificar si la respuesta no es OK
      if (!response.ok) {
        alert(`❌ Error: ${data.message || "No se pudo iniciar sesión"}`);
        return;
      }

      // Guardar la sesión del usuario, incluyendo el nombre (data.nombre)
      saveUserSession(data);

      // Verificar que el token se haya guardado correctamente
      if (!localStorage.getItem("token")) {
        console.error("❌ El token no se guardó correctamente en localStorage.");
        alert("Hubo un problema al guardar tu sesión. Intenta nuevamente.");
        return;
      }

      // Redirigir a la página de inicio
      window.location.href = "/public/screens/home.html";

    } catch (error) {
      console.error("❌ Error en login:", error);
      alert("Error en el servidor, intenta más tarde.");
    }
  });

  // Evento para manejar "Olvidé mi contraseña"
  forgotPasswordBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const correo = prompt("Ingresa tu correo para recuperar tu contraseña:");
    if (!correo) return;

    try {
      const response = await fetch("http://localhost:3000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: correo }),
      });
      const data = await response.json();
      alert(data.message || "Solicitud procesada. Revisa tu correo.");
    } catch (error) {
      console.error("❌ Error en recuperación:", error);
      alert("Error en el servidor. Intenta más tarde.");
    }
  });
});

// Función para guardar la sesión del usuario
function saveUserSession(data) {
  // Guarda token y datos del usuario
  localStorage.setItem("token", data.token);
  localStorage.setItem("userName", data.nombre);
  localStorage.setItem("idColaborador", data.id);
  localStorage.setItem("loginTime", Date.now());

  // Guardar las vistas permitidas en localStorage
  if (data.vistas && Array.isArray(data.vistas)) {
    localStorage.setItem("vistas", JSON.stringify(data.vistas));
  } else {
    console.error("❌ Error: No se encontraron vistas en la respuesta del servidor.");
  }

  // Guardar la sede en localStorage
  if (data.sede) {
    localStorage.setItem("sedeFunder", data.sede);  // Guardar la sede
  }

  console.log("✅ Token almacenado correctamente:", localStorage.getItem("token"));
  console.log("✅ Vistas almacenadas correctamente:", localStorage.getItem("vistas"));
  console.log("✅ Sede almacenada correctamente:", localStorage.getItem("sedeFunder"));
}
