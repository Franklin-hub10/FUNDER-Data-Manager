const db = require("../config/database");

// 📌 Obtener todas las fichas técnicas
exports.getAll = async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM emprendedor");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener fichas técnicas:", error);
        res.status(500).json({ message: "Error al obtener fichas técnicas", error });
    }
};

// 📌 Obtener una ficha técnica por ID
exports.getById = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("SELECT * FROM emprendedor WHERE idEmprendedor = ?", [id]);
        if (result.length === 0) return res.status(404).json({ message: "Ficha no encontrada" });

        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error al obtener ficha técnica:", error);
        res.status(500).json({ message: "Error al obtener ficha técnica", error });
    }
};

// 📌 Crear una ficha técnica
exports.create = async (req, res) => {
    try {
        const {
            nombres, apellidos, idPais, edad, idSede, generoIdentidad, estadoCivil,
            numeroCargas, rolFamiliar, etnia, discapacidad, estatusMigra, direccion,
            telefono1, telefono2, correo, servicioDeInternet, celular, computadora,
            tablet, idNivel, idColaborador, tipoNegocio, actividadEconomica,
            promMensualIngreso, promMensualGastos, promMensualUtilidad,
            caracteristicaDelNegocio, camposAsistenciaTecnica, temaCapacitacion,
            cabezaHogar = "No"  // 👈 Si no viene en el JSON, se asigna "No"
        } = req.body;

        const query = `
            INSERT INTO emprendedor (
                nombres, apellidos, idPais, edad, idSede, generoIdentidad, estadoCivil,
                numeroCargas, rolFamiliar, etnia, discapacidad, estatusMigra, direccion,
                telefono1, telefono2, correo, servicioDeInternet, celular, computadora,
                tablet, idNivel, idColaborador, tipoNegocio, actividadEconomica,
                promMensualIngreso, promMensualGastos, promMensualUtilidad,
                caracteristicaDelNegocio, camposAsistenciaTecnica, temaCapacitacion,
                cabezaHogar  -- 👈 Agregamos este campo
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            nombres, apellidos, idPais, edad, idSede, generoIdentidad, estadoCivil,
            numeroCargas, rolFamiliar, etnia, discapacidad, estatusMigra, direccion,
            telefono1, telefono2, correo, servicioDeInternet, celular, computadora,
            tablet, idNivel, idColaborador, tipoNegocio, actividadEconomica,
            promMensualIngreso, promMensualGastos, promMensualUtilidad,
            caracteristicaDelNegocio, camposAsistenciaTecnica, temaCapacitacion,
            cabezaHogar // 👈 Agregamos este valor
        ];

        const [result] = await db.query(query, values);
        res.status(201).json({ message: "Ficha técnica creada", idEmprendedor: result.insertId });

    } catch (error) {
        console.error("❌ Error al crear ficha técnica:", error);
        res.status(500).json({ message: "Error al crear ficha técnica", error });
    }
};



// 📌 Actualizar una ficha técnica
exports.update = async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    try {
        await db.query("UPDATE emprendedor SET ? WHERE idEmprendedor = ?", [data, id]);
        res.status(200).json({ message: "Ficha técnica actualizada" });
    } catch (error) {
        console.error("Error al actualizar ficha técnica:", error);
        res.status(500).json({ message: "Error al actualizar ficha técnica", error });
    }
};

// 📌 Eliminar una ficha técnica
exports.delete = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM emprendedor WHERE idEmprendedor = ?", [id]);
        res.status(200).json({ message: "Ficha técnica eliminada" });
    } catch (error) {
        console.error("Error al eliminar ficha técnica:", error);
        res.status(500).json({ message: "Error al eliminar ficha técnica", error });
    }
};
