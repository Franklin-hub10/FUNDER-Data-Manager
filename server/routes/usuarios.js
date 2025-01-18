const express = require('express');
const router = express.Router();
const db = require('../config/database');
const bcrypt = require('bcrypt'); // Para encriptar la contraseña

// Obtener todos los usuarios
router.get('/users', async (req, res) => {
    try {
        const [users] = await db.query('SELECT u.id, u.nombre, u.email, r.nombre AS rol FROM usuario u INNER JOIN rol r ON u.idRol = r.id');
        res.status(200).json({ users });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
});

// Crear un usuario
router.post('/create-user', async (req, res) => {
    const { nombre, email, password, idRol } = req.body;

    try {
        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar el usuario en la base de datos
        const result = await db.query('INSERT INTO usuario (nombre, email, password, idRol) VALUES (?, ?, ?, ?)', 
            [nombre, email, hashedPassword, idRol]);

        res.status(201).json({ message: 'Usuario creado', id: result[0].insertId });
    } catch (error) {
        console.error('Error al crear el usuario:', error);
        res.status(500).json({ message: 'Error al crear el usuario', error });
    }
});

// Obtener un usuario por ID
router.get('/user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [user] = await db.query('SELECT u.id, u.nombre, u.email, r.nombre AS rol FROM usuario u INNER JOIN rol r ON u.idRol = r.id WHERE u.id = ?', [id]);
        
        if (user.length === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        
        res.status(200).json({ user: user[0] });
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        res.status(500).json({ message: 'Error al obtener el usuario', error });
    }
});

// Actualizar un usuario
router.put('/update-user/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, email, password, idRol } = req.body;

    try {
        let updatedFields = [nombre, email, idRol];
        
        // Si se proporciona una nueva contraseña, encriptarla
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedFields.push(hashedPassword);
        } else {
            updatedFields.push(null); // No actualizar la contraseña si no se proporciona
        }

        const result = await db.query('UPDATE usuario SET nombre = ?, email = ?, idRol = ?, password = ? WHERE id = ?', 
            [...updatedFields, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado' });
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ message: 'Error al actualizar el usuario', error });
    }
});

// Eliminar un usuario
router.delete('/delete-user/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await db.query('DELETE FROM usuario WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado' });
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ message: 'Error al eliminar el usuario', error });
    }
});

// Asignar roles a un usuario
router.post('/assign-role', async (req, res) => {
    const { idUsuario, idRol } = req.body;
    try {
        await db.query('UPDATE usuario SET idRol = ? WHERE id = ?', [idRol, idUsuario]);
        res.status(200).json({ message: 'Rol asignado correctamente' });
    } catch (error) {
        console.error('Error al asignar el rol:', error);
        res.status(500).json({ message: 'Error al asignar el rol', error });
    }
});

// Asignar permisos a un rol (como en el código anterior)
router.post('/assign-permissions', async (req, res) => {
    const { idRol, permisos } = req.body;
    try {
        await db.query('DELETE FROM rol_permiso WHERE idRol = ?', [idRol]); // Eliminar permisos anteriores
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