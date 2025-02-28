const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/database");
 
const router = express.Router();
 
// 🔹 Obtener todos los colaboradores
router.get("/colaboradores", async (req, res) => {
    try {
        const [colaboradores] = await db.query(`
            SELECT c.idColaborador, c.nombres, c.apellidos, c.identificacion, c.email, c.usuario, c.cargo,
                   r.nombre AS rol, s.nombre AS sede
            FROM colaborador c
            JOIN rol r ON c.idRol = r.idRol
            JOIN sede s ON c.idSede = s.idSede
        `);
        res.status(200).json(colaboradores);
    } catch (error) {
        console.error("❌ Error al obtener colaboradores:", error);
        res.status(500).json({ message: "Error al obtener colaboradores" });
    }
});
 
// 🔹 Obtener un colaborador por ID
router.get("/colaborador/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [colaborador] = await db.query("SELECT * FROM colaborador WHERE idColaborador = ?", [id]);
 
        if (colaborador.length === 0) {
            return res.status(404).json({ message: "Colaborador no encontrado" });
        }
 
        res.status(200).json(colaborador[0]);
    } catch (error) {
        console.error("❌ Error al obtener colaborador:", error);
        res.status(500).json({ message: "Error al obtener colaborador" });
    }
});
 
// 🔹 Crear colaborador con contraseña encriptada
router.post("/createColaborador", async (req, res) => {
    console.log("📥 Recibiendo datos en el backend:", req.body);
 
    const { nombres, apellidos, identificacion, email, usuario, idRol, idSede, cargo, password } = req.body;
 
    if (!password) {
        return res.status(400).json({ message: "⚠️ La contraseña es obligatoria." });
    }
 
    try {
        const [existingUser] = await db.query(
            "SELECT * FROM colaborador WHERE identificacion = ? OR email = ? OR usuario = ?",
            [identificacion, email, usuario]
        );
 
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Ya existe un usuario con esta identificación, correo o usuario." });
        }
 
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("🔒 Contraseña encriptada:", hashedPassword);
 
        const [result] = await db.query(
            "INSERT INTO colaborador (idRol, nombres, apellidos, identificacion, email, usuario, password, idSede, cargo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [idRol, nombres, apellidos, identificacion, email, usuario, hashedPassword, idSede, cargo]
        );
 
        res.status(201).json({ message: "Colaborador creado exitosamente", idColaborador: result.insertId });
    } catch (error) {
        console.error("❌ Error al crear colaborador:", error);
        res.status(500).json({ message: "Error al crear colaborador" });
    }
});
 
// 🔹 Obtener la sede de un colaborador
router.get("/sede-colaborador/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [sede] = await db.query(`
            SELECT s.nombre AS sede
            FROM colaborador c
            JOIN sede s ON c.idSede = s.idSede
            WHERE c.idColaborador = ?`, [id]);
 
        if (sede.length === 0) {
            return res.status(404).json({ message: "Sede no encontrada para este colaborador." });
        }
 
        res.status(200).json({ sede: sede[0].sede });
    } catch (error) {
        console.error("❌ Error al obtener la sede del colaborador:", error);
        res.status(500).json({ message: "Error al obtener la sede del colaborador" });
    }
});
 
module.exports = router;