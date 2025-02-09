document.addEventListener("DOMContentLoaded", () => {
    const token = sessionStorage.getItem("token");
    const permisos = JSON.parse(sessionStorage.getItem("permisos")) || [];

    // Redirigir si no está autenticado
    if (!token) {
        alert("No tienes acceso. Inicia sesión primero.");
        window.location.href = "/public/screens/index.html";
        return;
    }

    // Obtener la URL actual y asignar permisos necesarios
    const rutasConPermisos = {
        "/public/screens/gestionUsuarios.html": ["Gestionar Usuarios"],
        "/public/screens/roles.html": ["Gestionar Roles"],
        "/public/screens/gestionFinanciera.html": ["Gestionar Finanzas"]
    };

    const rutaActual = window.location.pathname;
    const permisosRequeridos = rutasConPermisos[rutaActual] || [];

    const tienePermiso = permisosRequeridos.length === 0 || permisos.some(p => permisosRequeridos.includes(p));

    if (!tienePermiso) {
        alert("No tienes permisos para ver esta página.");
        window.location.href = "/public/screens/home.html";
    }
});
