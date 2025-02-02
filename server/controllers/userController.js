const pool = require('../config/database');
const bcrypt = require('bcrypt');

// Obtener todos los usuarios
const getUsers = async (req, res) => {
    try {
        const [users] = await pool.promise().query('SELECT idUsuario, nombre, correo, idRol FROM usuario');
        res.status(200).json(users);
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
};

module.exports = { getUsers };


const createColaborador = async (req, res) => {
    const { nombres, apellidos, idRol, idSede, cargo } = req.body;

    try {
        // Verificar si el rol existe en la base de datos
        const [roleCheck] = await pool.promise().query('SELECT idRol FROM rol WHERE idRol = ?', [idRol]);

        if (roleCheck.length === 0) {
            return res.status(400).json({ message: 'El rol proporcionado no existe.' });
        }

        // Verificar si la sede existe en la base de datos
        const [sedeCheck] = await pool.promise().query('SELECT idSede FROM sede WHERE idSede = ?', [idSede]);

        if (sedeCheck.length === 0) {
            return res.status(400).json({ message: 'La sede proporcionada no existe.' });
        }

        // Insertar el colaborador en la base de datos
        const [result] = await pool.promise().query(
            'INSERT INTO colaborador (idRol, nombres, apellidos, idSede, cargo) VALUES (?, ?, ?, ?, ?)',
            [idRol, nombres, apellidos, idSede, cargo]
        );

        // Obtener el id del colaborador creado
        const idColaborador = result.insertId;

        res.status(201).json({
            message: 'Colaborador creado exitosamente.',
            idColaborador,
        });
    } catch (error) {
        console.error('Error al crear colaborador:', error);
        res.status(500).json({ message: 'Error al crear colaborador', error: error.message });
    }
};

module.exports = { createColaborador };

// Asignar un rol a un usuario
const assignRole = async (req, res) => {
    const { id } = req.params;
    const { idRol } = req.body;

    try {
        const [result] = await pool.query('UPDATE usuario SET idRol = ? WHERE idUsuario = ?', [idRol, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Rol asignado exitosamente' });
    } catch (error) {
        console.error('Error al asignar rol:', error);
        res.status(500).json({ message: 'Error al asignar rol', error: error.message });
    }
};

// Exportar las funciones del controlador
module.exports = {
    getUsers,
    createUser,
    assignRole
};
