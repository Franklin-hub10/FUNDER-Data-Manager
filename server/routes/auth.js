const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const db = require("../config/database");
require("dotenv").config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "secreto_super_seguro";

// ================================================
// 📌 Middleware para verificar JWT
// ================================================
const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "Token requerido." });

    jwt.verify(token.split(" ")[1], SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Token inválido." });
        req.user = decoded;
        next();
    });
};

// ================================================
// 🔐 Autenticación de usuario (Login)
// ================================================
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Email y contraseña son requeridos." });
    }

    try {
        // 📌 Verificar si el usuario existe
        const [users] = await db.query(
            `SELECT idColaborador, email, password, idRol, password_temp FROM colaborador WHERE email = ?`,
            [email]
        );

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
        if (user.password_temp) {
            return res.status(403).json({
                message: "Debes cambiar tu contraseña antes de continuar.",
                forceChange: true,
                userId: user.idColaborador
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

// ================================================
// 🔑 Cambio de contraseña inicial
// ================================================
router.post("/cambiar-password", async (req, res) => {
    const { idColaborador, nuevaPassword } = req.body;

    if (!idColaborador || !nuevaPassword) {
        return res.status(400).json({ message: "Datos incompletos." });
    }

    try {
        const hashedPassword = await bcrypt.hash(nuevaPassword, 10);
        await db.query(
            `UPDATE colaborador SET password = ?, password_temp = FALSE WHERE idColaborador = ?`,
            [hashedPassword, idColaborador]
        );

        res.status(200).json({ message: "Contraseña cambiada exitosamente." });

    } catch (error) {
        console.error("❌ Error al cambiar contraseña:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
});

// ================================================
// 📩 Olvidé mi contraseña (Generar enlace de recuperación)
// ================================================
router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "El email es obligatorio." });
    }

    try {
        // 📌 Verificar si el usuario existe
        const [users] = await db.query("SELECT idColaborador FROM colaborador WHERE email = ?", [email]);
        if (users.length === 0) {
            return res.status(404).json({ message: "No se encontró un usuario con ese email." });
        }

        // 📌 Generar un token aleatorio
        const token = crypto.randomBytes(32).toString("hex");

        // 📌 Eliminar tokens previos y agregar nuevo token
        await db.query("DELETE FROM restablecer_password WHERE email = ?", [email]);
        await db.query("INSERT INTO restablecer_password (email, token, usado) VALUES (?, ?, FALSE)", [email, token]);

        // 📩 Configuración de nodemailer
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        // 📩 Enlace de recuperación
        const resetLink = `http://localhost:5501/public/screens/restablecerPassword.html?token=${token}`;

        // 📩 Enviar correo
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "🔑 Recupera tu contraseña",
            text: `Hola,\n\nHas solicitado restablecer tu contraseña. Usa el siguiente enlace:\n${resetLink}\n\nSi no solicitaste esto, ignora este mensaje.`,
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Correo enviado. Revisa tu bandeja de entrada." });

    } catch (error) {
        console.error("❌ Error en recuperación de contraseña:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
});

// ================================================
// 🔄 Restablecer contraseña con Token
// ================================================
router.post("/reset-password", async (req, res) => {
    const { token, nuevaPassword } = req.body;

    if (!token || !nuevaPassword) {
        return res.status(400).json({ message: "Datos incompletos." });
    }

    try {
        // 📌 Verificar si el token es válido y no ha sido usado
        const [result] = await db.query(
            "SELECT email FROM restablecer_password WHERE token = ? AND usado = FALSE", 
            [token]
        );

        if (result.length === 0) {
            return res.status(400).json({ message: "Token inválido o expirado." });
        }

        const email = result[0].email;
        const hashedPassword = await bcrypt.hash(nuevaPassword, 10);

        // 📌 Actualizar la contraseña del usuario
        await db.query("UPDATE colaborador SET password = ? WHERE email = ?", [hashedPassword, email]);

        // 📌 Marcar el token como usado
        await db.query("UPDATE restablecer_password SET usado = TRUE WHERE token = ?", [token]);

        res.status(200).json({ message: "Contraseña restablecida correctamente." });

    } catch (error) {
        console.error("❌ Error al restablecer contraseña:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
});

// ================================================
// ✅ Exportar rutas
// ================================================
module.exports = router;
