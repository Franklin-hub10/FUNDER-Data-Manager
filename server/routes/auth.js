const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
require("dotenv").config(); 

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "secreto_super_seguro"; // Asegura que el SECRET_KEY existe

// 📌 Middleware para verificar JWT
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "Token requerido." });

    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Token inválido." });
        req.user = decoded;
        next();
    });
};

// 📌 Middleware para verificar permisos
const checkPermission = (permisoRequerido) => {
    return (req, res, next) => {
        if (!req.user || !req.user.rol) {
            return res.status(403).json({ message: "Acceso denegado." });
        }
        next();
    };
};

// 🔐 **Autenticación de usuario**
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son requeridos." });
    }

    try {
        const [users] = await db.query(`
            SELECT idColaborador, email, password, idRol, necesita_cambio_password
            FROM colaborador 
            WHERE email = ?`, [email]);

        if (users.length === 0) {
            return res.status(401).json({ message: "Usuario no encontrado." });
        }

        const user = users[0];

        // 📌 Verificar contraseña
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta." });
        }

        // 📌 Si la contraseña es temporal, forzar el cambio de contraseña
        if (user.necesita_cambio_password) {
            return res.status(403).json({ 
                message: "Debes cambiar tu contraseña antes de continuar.", 
                forceChange: true 
            });
        }

        // 📌 Generar el token JWT
        const token = jwt.sign(
            { id: user.idColaborador, email: user.email, rol: user.idRol }, 
            SECRET_KEY, 
            { expiresIn: "1h" }
        );

        res.json({ 
            token, 
            permisos: ["Gestionar Usuarios", "Gestionar Roles", "Gestionar Finanzas"] 
        });
    } catch (error) {
        console.error("❌ Error en login:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
});

// 🔑 **Cambio de contraseña inicial**
router.post("/cambiar-password", async (req, res) => {
    const { idColaborador, nuevaPassword } = req.body;

    if (!idColaborador || !nuevaPassword) {
        return res.status(400).json({ message: "Datos incompletos." });
    }

    try {
        const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
        await db.query(`
            UPDATE colaborador 
            SET password = ?, necesita_cambio_password = 0 
            WHERE idColaborador = ?`, 
            [hashedPassword, idColaborador]
        );

        res.status(200).json({ message: "Contraseña cambiada exitosamente." });
    } catch (error) {
        console.error("❌ Error al cambiar contraseña:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
});

// 🔐 **Ejemplo de ruta protegida**
router.get("/verificar-acceso", verifyToken, checkPermission("Gestionar Usuarios"), (req, res) => {
    res.status(200).json({ message: "Acceso permitido." });
});

module.exports = router;
