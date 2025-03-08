document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    const vistasPermitidas = JSON.parse(localStorage.getItem("vistas")) || [];
  
    // Redirigir si no está autenticado
    if (!token) {
      alert("No tienes acceso. Inicia sesión primero.");
      window.location.href = "/public/screens/index.html";
      return;
    }
  
    // Obtener la URL actual y asignar permisos necesarios
    const rutasConPermisos = {
      "/public/screens/restablecerPassword.html": ["Restablecer Contraseña"],
      "/public/screens/home.html": ["Home"],
      "/public/screens/fichaTecnica.html": ["Ficha Técnica"],
      "/public/screens/gestionComercial.html": ["Gestión Comercial"],
      "/public/screens/gestionFinanciera.html": ["Gestión Financiera"],
      "/public/screens/gestionOrganizacional.html": ["Gestión Organizacional"],
      "/public/screens/gestionProductiva.html": ["Gestión Productiva"],
      "/public/screens/dashboard.html": ["Dashboard"],
      "/public/screens/Usuarios.html": ["Usuarios"],  // Permiso para la vista de Usuarios
      "/public/screens/roles.html": ["Roles"]  // Permiso para la vista de Roles
    };
  
    const rutaActual = window.location.pathname;
    const permisosRequeridos = rutasConPermisos[rutaActual] || [];
  
    // Verificar si el usuario tiene acceso
    const tienePermiso = permisosRequeridos.length === 0 || vistasPermitidas.some(v => rutasConPermisos[rutaActual].includes(v.nombre));
  
    if (!tienePermiso) {
      alert("No tienes permisos para ver esta página.");
      window.location.href = "/public/screens/home.html";
    }
  });
  