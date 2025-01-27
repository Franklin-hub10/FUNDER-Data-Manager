const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Obtener permisos
router.get('/permissions', async (req, res) => {
    try {
        const [permissions] = await db.query('SELECT * FROM permiso');
        res.status(200).json(permissions);
    } catch (error) {
        console.error('Error al obtener permisos:', error);
        res.status(500).json({ message: 'Error al obtener permisos', error });
    }
});

// Obtener roles con permisos
router.get('/roles', async (req, res) => {
    try {
        const [roles] = await db.query(`
            SELECT r.idRol, r.nombre AS rol, 
                   GROUP_CONCAT(p.nombre) AS permisos, 
                   GROUP_CONCAT(p.idPermiso) AS permisosIds
            FROM rol r
            LEFT JOIN rol_permiso rp ON r.idRol = rp.idRol
            LEFT JOIN permiso p ON rp.idPermiso = p.idPermiso
            GROUP BY r.idRol
        `);
        res.status(200).json(roles);
    } catch (error) {
        console.error('Error al obtener roles:', error);
        res.status(500).json({ message: 'Error al obtener roles', error });
    }
});

// Crear un rol con permisos
router.post('/create-role', async (req, res) => {
    const { nombre, permisos } = req.body;

    try {
        // Crear el rol
        const [result] = await db.query('INSERT INTO rol (nombre) VALUES (?)', [nombre]);
        const idRol = result.insertId;

        // Asignar permisos al rol
        if (permisos && permisos.length > 0) {
            const permisoQueries = permisos.map((permiso) =>
                db.query('INSERT INTO rol_permiso (idRol, idPermiso) VALUES (?, ?)', [idRol, permiso])
            );
            await Promise.all(permisoQueries);
        }

        res.status(201).json({ message: 'Rol creado con permisos.', idRol });
    } catch (error) {
        console.error('Error al crear rol:', error);
        res.status(500).json({ message: 'Error al crear rol', error });
    }
});

// Actualizar un rol (nombre y permisos)
router.put('/update-role/:idRol', async (req, res) => {
    const { idRol } = req.params;
    const { rol, permisos } = req.body;

    try {
        // Actualizar el nombre del rol
        if (rol) {
            await db.query('UPDATE rol SET nombre = ? WHERE idRol = ?', [rol, idRol]);
        }

        // Actualizar los permisos
        if (permisos) {
            await db.query('DELETE FROM rol_permiso WHERE idRol = ?', [idRol]);
            const permisoQueries = permisos.map(permiso =>
                db.query('INSERT INTO rol_permiso (idRol, idPermiso) VALUES (?, ?)', [idRol, permiso])
            );
            await Promise.all(permisoQueries);
        }

        res.status(200).json({ message: 'Rol actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar rol:', error);
        res.status(500).json({ message: 'Error al actualizar rol', error });
    }
});

// Eliminar un rol
router.delete('/delete-role/:idRol', async (req, res) => {
    const { idRol } = req.params; // Verifica que este ID sea recibido
    console.log("ID recibido en backend:", idRol);


    try {
        // Elimina los permisos asociados al rol
        await db.query('DELETE FROM rol_permiso WHERE idRol = ?', [idRol]);
        // Elimina el rol
        await db.query('DELETE FROM rol WHERE idRol = ?', [idRol]);

        res.status(200).json({ message: 'Rol eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar el rol:', error);
        res.status(500).json({ message: 'Error al eliminar el rol', error });
    }
});

// Asignar permisos a un rol existente
router.post('/assign-permissions', async (req, res) => {
    const { idRol, permisos } = req.body;

    console.log("ID Rol recibido para permisos:", idRol);
    console.log("Permisos recibidos:", permisos);

    try {
        // Elimina los permisos existentes del rol
        await db.query('DELETE FROM rol_permiso WHERE idRol = ?', [idRol]);

        // Inserta los nuevos permisos
        const permisoQueries = permisos.map(permiso =>
            db.query('INSERT INTO rol_permiso (idRol, idPermiso) VALUES (?, ?)', [idRol, permiso])
        );
        await Promise.all(permisoQueries);

        res.status(200).json({ message: 'Permisos asignados correctamente' });
    } catch (error) {
        console.error('Error al asignar permisos:', error);
        res.status(500).json({ message: 'Error al asignar permisos', error });
    }
});


module.exports = router;
