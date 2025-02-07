const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Obtener todos los emprendimientos
router.get('/emprendimientos', async (req, res) => {
    try {
        const [emprendimientos] = await db.query('SELECT * FROM emprendimiento');
        res.status(200).json(emprendimientos);
    } catch (error) {
        console.error('Error al obtener emprendimientos:', error);
        res.status(500).json({ message: 'Error al obtener emprendimientos', error });
    }
});

// Crear un nuevo emprendimiento
router.post('/crear-emprendimiento', async (req, res) => {
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
});

module.exports = router;
