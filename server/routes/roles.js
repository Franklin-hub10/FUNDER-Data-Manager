const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Obtener todos los roles y permisos
router.get('/roles-and-permissions', async (req, res) => {
    try {
        const [roles] = await db.query('SELECT * FROM rol');
        const [permissions] = await db.query('SELECT * FROM permiso');
        res.status(200).json({ roles, permissions });
    } catch (error) {
        console.error('Error al obtener roles y permisos:', error);
        res.status(500).json({ message: 'Error al obtener roles y permisos', error });
    }
});

// Crear un rol
router.post('/create-role', async (req, res) => {
    const { nombre } = req.body;
    try {
        const result = await db.query('INSERT INTO rol (nombre) VALUES (?)', [nombre]);
        res.status(201).json({ message: 'Rol creado', id: result[0].insertId });
    } catch (error) {
        console.error('Error al crear el rol:', error);
        res.status(500).json({ message: 'Error al crear el rol', error });
    }
});

// Asignar permisos a un rol
router.post('/assign-permissions', async (req, res) => {
    const { idRol, permisos } = req.body;
    try {
        await db.query('DELETE FROM rol_permiso WHERE idRol = ?', [idRol]); // Elimina permisos anteriores
        for (const permiso of permisos) {
            await db.query('INSERT INTO rol_permiso (idRol, idPermiso) VALUES (?, ?)', [idRol, permiso]);
        }
        res.status(200).json({ message: 'Permisos asignados correctamente' });
    } catch (error) {
        console.error('Error al asignar permisos:', error);
        res.status(500).json({ message: 'Error al asignar permisos', error });
    }
});

module.exports = router;
