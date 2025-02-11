document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const forgotPasswordBtn = document.getElementById("forgotPassword");
  
    // Evento para manejar el inicio de sesión
    form.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      // Obtener valores de los inputs
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();
  
      // Validar que los campos no estén vacíos
      if (!email || !password) {
        alert("Email y contraseña son obligatorios.");
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
          body: JSON.stringify({ email, password }),
        });
  
        // Leer la respuesta en formato JSON
        const data = await response.json();
  
        // Si el servidor indica que se debe cambiar la contraseña
        if (response.status === 403 && data.forceChange) {
          alert("Debes cambiar tu contraseña antes de continuar.");
          sessionStorage.setItem("tempUserId", data.userId);
          window.location.href = "/public/screens/cambiarPassword.html";
          return;
        }
  
        // Si la respuesta no es OK, mostrar error
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
      const email = prompt("Ingresa tu correo para recuperar tu contraseña:");
      if (!email) return;
      try {
        const response = await fetch("http://localhost:3000/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await response.json();
        alert(data.message);
      } catch (error) {
        console.error("❌ Error en recuperación:", error);
        alert("Error en el servidor. Intenta más tarde.");
      }
    });
  });
  
  // Función para guardar la sesión del usuario
  function saveUserSession(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("permisos", JSON.stringify(data.permisos));
    localStorage.setItem("userName", data.nombre); // Se asume que el servidor envía 'nombre'
    localStorage.setItem("loginTime", Date.now());
    console.log("✅ Token almacenado correctamente:", localStorage.getItem("token"));
  }
  