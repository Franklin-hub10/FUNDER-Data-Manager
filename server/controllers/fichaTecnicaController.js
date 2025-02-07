const db = require('../config/database');

// Obtener todos los emprendedores
exports.getEmprendedores = async (req, res) => {
    try {
        const [emprendedores] = await db.query('SELECT * FROM emprendedor');
        res.status(200).json(emprendedores);
    } catch (error) {
        console.error('Error al obtener emprendedores:', error);
        res.status(500).json({ message: 'Error al obtener emprendedores', error });
    }
};

// Obtener un emprendedor por ID
exports.getEmprendedorById = async (req, res) => {
    const { id } = req.params;
    try {
        const [emprendedor] = await db.query('SELECT * FROM emprendedor WHERE idEmprendedor = ?', [id]);
        if (emprendedor.length === 0) {
            return res.status(404).json({ message: 'Emprendedor no encontrado' });
        }
        res.status(200).json(emprendedor[0]);
    } catch (error) {
        console.error('Error al obtener emprendedor:', error);
        res.status(500).json({ message: 'Error al obtener emprendedor', error });
    }
};

// Crear un nuevo emprendedor
exports.createEmprendedor = async (req, res) => {
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
};

// Actualizar un emprendedor
exports.updateEmprendedor = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('UPDATE emprendedor SET ? WHERE idEmprendedor = ?', [req.body, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Emprendedor no encontrado' });
        }
        res.status(200).json({ message: 'Emprendedor actualizado correctamente' });
    } catch (error) {
        console.error('Error al actualizar emprendedor:', error);
        res.status(500).json({ message: 'Error al actualizar emprendedor', error });
    }
};

// Eliminar un emprendedor
exports.deleteEmprendedor = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM emprendedor WHERE idEmprendedor = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Emprendedor no encontrado' });
        }
        res.status(200).json({ message: 'Emprendedor eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar emprendedor:', error);
        res.status(500).json({ message: 'Error al eliminar emprendedor', error });
    }
};
