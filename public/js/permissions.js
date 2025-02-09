document.addEventListener("DOMContentLoaded", () => {
    const permisos = JSON.parse(sessionStorage.getItem("permisos")) || [];

    const elementosConPermiso = [
        { selector: ".btn-gestionar-usuarios", permiso: "Gestionar Usuarios" },
        { selector: ".btn-gestionar-roles", permiso: "Gestionar Roles" },
        { selector: ".btn-gestionar-finanzas", permiso: "Gestionar Finanzas" }
    ];

    elementosConPermiso.forEach(({ selector, permiso }) => {
        const elemento = document.querySelector(selector);
        if (elemento && !permisos.includes(permiso)) {
            elemento.style.display = "none";
        }
    });
});
