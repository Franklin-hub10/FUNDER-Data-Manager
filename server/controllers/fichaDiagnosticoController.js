const db = require('../config/database');

// Obtener todos los emprendimientos
exports.getEmprendimientos = async (req, res) => {
    try {
        const [emprendimientos] = await db.query('SELECT * FROM emprendimiento');
        res.status(200).json(emprendimientos);
    } catch (error) {
        console.error('Error al obtener emprendimientos:', error);
        res.status(500).json({ message: 'Error al obtener emprendimientos', error });
    }
};

// Obtener un emprendimiento por ID
exports.getEmprendimientoById = async (req, res) => {
    const { id } = req.params;
    try {
        const [emprendimiento] = await db.query('SELECT * FROM emprendimiento WHERE idEmprendimiento = ?', [id]);
        if (emprendimiento.length === 0) {
            return res.status(404).json({ message: 'Emprendimiento no encontrado' });
        }
        res.status(200).json(emprendimiento[0]);
    } catch (error) {
        console.error('Error al obtener emprendimiento:', error);
        res.status(500).json({ message: 'Error al obtener emprendimiento', error });
    }
};

// Crear un nuevo emprendimiento
exports.createEmprendimiento = async (req, res) => {
    const {
        nombreComercial, razonSocial, idSede, idProdServ, direccionNegocio, idParroquia,
        canton, ciudad, telefono1, telefono2, correo, numSocios, numEmpleados, antiguedad,
        nombreContacto1, telefonoContacto1, nombreContacto2, telefonoContacto2, referencia,
        nombreEvaluador, fechaEvaluacion, idEmprendedor, idColaborador
    } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO emprendimiento (
                nombreComercial, razonSocial, idSede, idProdServ, direccionNegocio, idParroquia,
                canton, ciudad, telefono1, telefono2, correo, numSocios, numEmpleados, antiguedad,
                nombreContacto1, telefonoContacto1, nombreContacto2, telefonoContacto2, referencia,
                nombreEvaluador, fechaEvaluacion, idEmprendedor, idColaborador
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                nombreComercial, razonSocial, idSede, idProdServ, direccionNegocio, idParroquia,
                canton, ciudad, telefono1, telefono2, correo, numSocios, numEmpleados, antiguedad,
                nombreContacto1, telefonoContacto1, nombreContacto2, telefonoContacto2, referencia,
                nombreEvaluador, fechaEvaluacion, idEmprendedor, idColaborador
            ]
        );

        res.status(201).json({ message: 'Emprendimiento registrado correctamente', id: result.insertId });
    } catch (error) {
        console.error('Error al registrar emprendimiento:', error);
        res.status(500).json({ message: 'Error al registrar emprendimiento', error });
    }
};
