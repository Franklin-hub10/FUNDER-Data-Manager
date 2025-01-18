const pool = require('../config/database');

// Obtener usuarios
exports.getUsers = async (req, res) => {
    try {
        const [users] = await pool.query('SELECT * FROM usuario');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Crear un usuario
exports.createUser = async (req, res) => {
    const { nombre, correo, password } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO usuario (nombre, correo, password) VALUES (?, ?, ?)', [nombre, correo, password]);
        res.status(201).json({ message: 'Usuario creado exitosamente', id: result.insertId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Asignar un rol a un usuario
exports.assignRole = async (req, res) => {
    const { id } = req.params;
    const { idRol } = req.body;
    try {
        await pool.query('UPDATE usuario SET idRol = ? WHERE idUsuario = ?', [idRol, id]);
        res.status(200).json({ message: 'Rol asignado exitosamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
