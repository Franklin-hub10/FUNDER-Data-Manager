const checkPermission = (permisoRequerido) => {
    return (req, res, next) => {
        if (!req.user || !req.user.permisos) {
            return res.status(403).json({ message: "Acceso denegado." });
        }

        if (!req.user.permisos.includes(permisoRequerido)) {
            return res.status(403).json({ message: "No tienes permiso para esta acción." });
        }

        next();
    };
};

module.exports = { checkPermission };
