const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../config/database");

const router = express.Router();

// Obtener todos los colaboradores
router.get("/colaboradores", async (req, res) => {
    try {
        const [colaboradores] = await db.query(`
            SELECT c.idColaborador, c.nombres, c.apellidos, c.identificacion, c.email, c.cargo,
                   r.nombre AS rol, s.nombre AS sede 
            FROM colaborador c
            JOIN rol r ON c.idRol = r.idRol
            JOIN sede s ON c.idSede = s.idSede
        `);
        res.status(200).json(colaboradores);
    } catch (error) {
        console.error("Error al obtener colaboradores:", error);
        res.status(500).json({ message: "Error al obtener colaboradores", error });
    }
});

// Obtener un colaborador por ID
router.get("/colaborador/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [colaborador] = await db.query("SELECT * FROM colaborador WHERE idColaborador = ?", [id]);

        if (colaborador.length === 0) {
            return res.status(404).json({ message: "Colaborador no encontrado" });
        }

        res.status(200).json(colaborador[0]);
    } catch (error) {
        console.error("Error al obtener colaborador:", error);
        res.status(500).json({ message: "Error al obtener colaborador", error });
    }
});

// Crear un colaborador
router.post("/createColaborador", async (req, res) => {
    console.log("📥 Recibiendo datos en el backend:", req.body);

    const { nombres, apellidos, identificacion, email, password, idRol, idSede, cargo } = req.body;

    try {
        // Verificar si ya existe un colaborador con la misma identificación o correo
        const [existingUser] = await db.query(`
            SELECT * FROM colaborador WHERE identificacion = ? OR email = ?
        `, [identificacion, email]);

        if (existingUser.length > 0) {
            if (existingUser[0].identificacion === identificacion) {
                return res.status(400).json({ message: "Ya existe un usuario con esta identificación." });
            }
            if (existingUser[0].email === email) {
                return res.status(400).json({ message: "Ya existe un usuario con este correo electrónico." });
            }
        }

        // Si no hay duplicados, proceder con la inserción
        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(`
            INSERT INTO colaborador (idRol, nombres, apellidos, identificacion, email, password, idSede, cargo)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [idRol, nombres, apellidos, identificacion, email, hashedPassword, idSede, cargo]);

        res.status(201).json({ message: "Colaborador creado exitosamente", idColaborador: result.insertId });
    } catch (error) {
        console.error("❌ Error al crear colaborador:", error);
        res.status(500).json({ message: "Error al crear colaborador", error });
    }
});



// Guardar o actualizar un colaborador
router.put("/updateColaborador/:id", async (req, res) => {
    const { id } = req.params;
    const { nombres, apellidos, identificacion, email, password, idRol, idSede, cargo } = req.body;

    try {
        // Verificar si la cédula o el email ya existen en otro usuario
        const [existingUsers] = await db.query(`
            SELECT * FROM colaborador WHERE (identificacion = ? OR email = ?) AND idColaborador != ?
        `, [identificacion, email, id]);

        if (existingUsers.length > 0) {
            if (existingUsers.some(user => user.identificacion === identificacion)) {
                return res.status(400).json({ message: "Ya existe un usuario con esta identificación." });
            }
            if (existingUsers.some(user => user.email === email)) {
                return res.status(400).json({ message: "Ya existe un usuario con este correo electrónico." });
            }
        }

        // Construcción dinámica del query para manejar la contraseña
        let query = `
            UPDATE colaborador 
            SET nombres = ?, apellidos = ?, identificacion = ?, email = ?, idRol = ?, idSede = ?, cargo = ?
        `;
        let values = [nombres, apellidos, identificacion, email, idRol, idSede, cargo];

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            query += ", password = ?";
            values.push(hashedPassword);
        }

        query += " WHERE idColaborador = ?";
        values.push(id);

        await db.query(query, values);
        res.status(200).json({ message: "Colaborador actualizado exitosamente" });
    } catch (error) {
        console.error("Error al actualizar colaborador:", error);
        res.status(500).json({ message: "Error al actualizar colaborador", error });
    }
});



// Eliminar un colaborador
router.delete("/deleteColaborador/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM colaborador WHERE idColaborador = ?", [id]);
        res.status(200).json({ message: "Colaborador eliminado correctamente" });
    } catch (error) {
        console.error("Error al eliminar colaborador:", error);
        res.status(500).json({ message: "Error al eliminar colaborador", error });
    }
});

module.exports = router;
