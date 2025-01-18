const db = require('../config/database');

// Crear un nuevo rol
exports.createRole = async (req, res) => {
    const { nombre, permisos, vistas } = req.body;
    if (!nombre || !permisos || !vistas) {
        return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }
    try {
        // Insertar el rol
        const [result] = await db.promise().query('INSERT INTO rol (nombre) VALUES (?)', [nombre]);
        const idRol = result.insertId;

        // Insertar permisos asociados al rol
        for (let permiso of permisos) {
            await db.promise().query('INSERT INTO rol_permiso (idRol, idPermiso) VALUES (?, ?)', [idRol, permiso]);
        }

        // Insertar vistas asociadas al rol
        for (let vista of vistas) {
            await db.promise().query('INSERT INTO rol_vista (idRol, idVista) VALUES (?, ?)', [idRol, vista]);
        }

        res.status(201).json({ message: 'Rol creado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el rol.', error });
    }
};

// Obtener todos los roles con permisos y vistas
exports.getRoles = async (req, res) => {
    try {
        const [roles] = await db.promise().query('SELECT * FROM rol');
        const rolesWithDetails = [];

        for (let rol of roles) {
            const [permisos] = await db.promise().query(
                'SELECT p.nombre FROM permiso p JOIN rol_permiso rp ON p.idPermiso = rp.idPermiso WHERE rp.idRol = ?',
                [rol.idRol]
            );
            const [vistas] = await db.promise().query(
                'SELECT v.nombreVista FROM vistas v JOIN rol_vista rv ON v.idVista = rv.idVista WHERE rv.idRol = ?',
                [rol.idRol]
            );
            rolesWithDetails.push({ ...rol, permisos, vistas });
        }

        res.status(200).json(rolesWithDetails);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener los roles.', error });
    }
};

// Actualizar un rol
exports.updateRole = async (req, res) => {
    const { idRol, nombre, permisos, vistas } = req.body;
    if (!idRol || !nombre || !permisos || !vistas) {
        return res.status(400).json({ message: 'Faltan datos obligatorios.' });
    }
    try {
        await db.promise().query('UPDATE rol SET nombre = ? WHERE idRol = ?', [nombre, idRol]);

        // Actualizar permisos
        await db.promise().query('DELETE FROM rol_permiso WHERE idRol = ?', [idRol]);
        for (let permiso of permisos) {
            await db.promise().query('INSERT INTO rol_permiso (idRol, idPermiso) VALUES (?, ?)', [idRol, permiso]);
        }

        // Actualizar vistas
        await db.promise().query('DELETE FROM rol_vista WHERE idRol = ?', [idRol]);
        for (let vista of vistas) {
            await db.promise().query('INSERT INTO rol_vista (idRol, idVista) VALUES (?, ?)', [idRol, vista]);
        }

        res.status(200).json({ message: 'Rol actualizado con éxito.' });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar el rol.', error });
    }
};
