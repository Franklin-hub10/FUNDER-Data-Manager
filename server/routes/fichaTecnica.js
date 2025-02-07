const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Obtener todos los emprendedores
router.get('/emprendedores', async (req, res) => {
    try {
        const [emprendedores] = await db.query('SELECT * FROM emprendedor');
        res.status(200).json(emprendedores);
    } catch (error) {
        console.error('Error al obtener emprendedores:', error);
        res.status(500).json({ message: 'Error al obtener emprendedores', error });
    }
});

// Crear un nuevo emprendedor
router.post('/crear-emprendedor', async (req, res) => {
    const {
        nombres, apellidos, idPais, edad, idSede, generoIdentidad, estadoCivil, numeroCargas,
        rolFamiliar, etnia, discapacidad, estatusMigra, direccion, telefono1, telefono2,
        correo, servicioDeInternet, celular, computadora, tablet, nivelInstitucional,
        idColaborador, tipoNegocio, actividadEconomica, promMensualIngreso, promMensualGastos,
        promMensualUtilidad, caracteristicaDelNegocio, camposAsistenciaTecnica, temaCapacitacion
    } = req.body;

    try {
        const [result] = await db.query(
            `INSERT INTO emprendedor (
                nombres, apellidos, idPais, edad, idSede, generoIdentidad, estadoCivil, numeroCargas,
                rolFamiliar, etnia, discapacidad, estatusMigra, direccion, telefono1, telefono2,
                correo, servicioDeInternet, celular, computadora, tablet, nivelInstitucional,
                idColaborador, tipoNegocio, actividadEconomica, promMensualIngreso, promMensualGastos,
                promMensualUtilidad, caracteristicaDelNegocio, camposAsistenciaTecnica, temaCapacitacion
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
            [
                nombres, apellidos, idPais, edad, idSede, generoIdentidad, estadoCivil, numeroCargas,
                rolFamiliar, etnia, discapacidad, estatusMigra, direccion, telefono1, telefono2,
                correo, servicioDeInternet, celular, computadora, tablet, nivelInstitucional,
                idColaborador, tipoNegocio, actividadEconomica, promMensualIngreso, promMensualGastos,
                promMensualUtilidad, caracteristicaDelNegocio, camposAsistenciaTecnica, temaCapacitacion
            ]
        );

        res.status(201).json({ message: 'Emprendedor registrado correctamente', id: result.insertId });
    } catch (error) {
        console.error('Error al registrar emprendedor:', error);
        res.status(500).json({ message: 'Error al registrar emprendedor', error });
    }
});

module.exports = router;
