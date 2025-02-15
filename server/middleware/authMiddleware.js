const jwt = require("jsonwebtoken");
const db = require("../config/database");
require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "secreto_super_seguro";

// Middleware para verificar el token JWT
const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(403).json({ message: "Token requerido." });
        }

        const token = authHeader.split(" ")[1]; // Extraer solo el token
        if (!token) {
            return res.status(403).json({ message: "Token inválido." });
        }

        // Verificar el token JWT
        jwt.verify(token, SECRET_KEY, async (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Token inválido." });
            }

            req.user = decoded; // Almacenar datos del usuario en la solicitud

            try {
                // Obtener permisos desde la base de datos
                const [permisos] = await db.query(
                    `SELECT p.nombre 
                     FROM permiso p
                     JOIN rol_permiso rp ON p.idPermiso = rp.idPermiso
                     WHERE rp.idRol = ?`,
                    [req.user.rol]
                );

                req.user.permisos = permisos.map(p => p.nombre); // Adjuntar permisos al usuario
                next(); // Pasar al siguiente middleware o ruta
            } catch (error) {
                console.error("❌ Error al obtener permisos:", error);
                return res.status(500).json({ message: "Error al obtener permisos." });
            }
        });
    } catch (error) {
        console.error("❌ Error en la autenticación:", error);
        return res.status(500).json({ message: "Error en la autenticación." });
    }
};

module.exports = { verifyToken };
