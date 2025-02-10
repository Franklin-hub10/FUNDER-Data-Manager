const express = require("express");
const db = require("../config/database");

const router = express.Router();

// Helper: convierte valores booleanos a 1 o 0
function boolToInt(value) {
    return value ? 1 : 0;
}

// 📌 Obtener todas las fichas técnicas
router.get("/fichas", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM emprendedor");
        res.status(200).json(results);
    } catch (error) {
        console.error("Error al obtener fichas técnicas:", error);
        res.status(500).json({ message: "Error al obtener fichas técnicas", error });
    }
});

// 📌 Obtener una ficha técnica por ID
router.get("/ficha/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("SELECT * FROM emprendedor WHERE idEmprendedor = ?", [id]);
        if (result.length === 0) {
            return res.status(404).json({ message: "Ficha no encontrada" });
        }
        res.status(200).json(result[0]);
    } catch (error) {
        console.error("Error al obtener ficha técnica:", error);
        res.status(500).json({ message: "Error al obtener ficha técnica", error });
    }
});

// 📌 Crear una ficha técnica
router.post("/createFicha", async (req, res) => {
    try {
        // Incluir el nuevo campo "numeroIdentificacion" en la desestructuración
        const {
            nombres, apellidos, numeroIdentificacion, edad, idSede, generoIdentidad, estadoCivil, numeroCargas, rolFamiliar,
            etnia, discapacidad, Nacionalidad, pais, estatusMigratorio, tiempoDeResidenciaPais,
            direccion, telefono1, telefono2, correo, servicioDeInternet, celular, computadora, tablet,
            nivelInstitucional, tipoNegocio, actividadEconomica, promMensualIngreso, promMensualGastos,
            caracteristicaDelNegocio, camposAsistenciaTecnica, temaCapacitacion,
            idColaborador
        } = req.body;

        // Validar que los campos obligatorios no estén vacíos (agrega numeroIdentificacion en la validación)
        if (!nombres || !apellidos || !numeroIdentificacion || !edad || !idSede || !generoIdentidad || !estadoCivil ||
            numeroCargas === undefined || !rolFamiliar || !etnia || !discapacidad || !direccion ||
            !telefono1 || !telefono2 || !correo || !nivelInstitucional || !tipoNegocio || !actividadEconomica ||
            promMensualIngreso === undefined || promMensualGastos === undefined || !caracteristicaDelNegocio ||
            !camposAsistenciaTecnica || !temaCapacitacion) {
            return res.status(400).json({ message: "❌ Faltan campos obligatorios en la solicitud." });
        }

        // Convertir valores numéricos y calcular utilidad
        const ingreso = Number(promMensualIngreso) || 0;
        const gastos = Number(promMensualGastos) || 0;
        const utilidad = ingreso - gastos;

        // Convertir booleanos a 1 o 0 para MySQL
        const internet = boolToInt(servicioDeInternet);
        const celularDisponible = boolToInt(celular);
        const pcDisponible = boolToInt(computadora);
        const tabletDisponible = boolToInt(tablet);

        // Asignar "Ecuador" por defecto si no se envía el país
        const paisFinal = pais || "Ecuador";

        // Si se envía tiempoDeResidenciaPais, se espera en formato "YYYY-MM-DD"
        const tiempoResidencia = tiempoDeResidenciaPais ? tiempoDeResidenciaPais : null;

      
   

        // La consulta ahora incluye el nuevo campo "numeroIdentificacion" y "idPais"
        const sql = `
            INSERT INTO emprendedor (
                nombres, apellidos, numeroIdentificacion, edad, idSede, generoIdentidad, estadoCivil, numeroCargas, rolFamiliar,
                etnia, discapacidad, Nacionalidad, pais, estatusMigratorio, tiempoDeResidenciaPais, direccion, telefono1, telefono2, correo,
                servicioDeInternet, celular, computadora, tablet, nivelInstitucional, tipoNegocio, actividadEconomica, promMensualIngreso,
                promMensualGastos, promMensualUtilidad, caracteristicaDelNegocio, camposAsistenciaTecnica, temaCapacitacion,
                idColaborador
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            nombres, apellidos, numeroIdentificacion, edad, idSede, generoIdentidad, estadoCivil, numeroCargas, rolFamiliar,
            etnia, discapacidad, Nacionalidad || null, paisFinal, estatusMigratorio || null, tiempoResidencia, direccion, telefono1, telefono2, correo,
            internet, celularDisponible, pcDisponible, tabletDisponible, nivelInstitucional, tipoNegocio, actividadEconomica, ingreso,
            gastos, utilidad, caracteristicaDelNegocio, camposAsistenciaTecnica, temaCapacitacion,
            idColaborador || null
        ];

        // Ejecutar la consulta SQL
        const [result] = await db.query(sql, values);

        res.status(201).json({ message: "✅ Ficha técnica creada correctamente", idEmprendedor: result.insertId });
    } catch (error) {
        console.error("❌ Error al crear ficha técnica:", error);
        res.status(500).json({ message: "Error al crear ficha técnica", error });
    }
});

// 📌 Actualizar una ficha técnica
router.put("/updateFicha/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const {
            nombres, apellidos, numeroIdentificacion, edad, idSede, generoIdentidad, estadoCivil, numeroCargas, rolFamiliar,
            etnia, discapacidad, Nacionalidad, pais, estatusMigratorio, tiempoDeResidenciaPais,
            direccion, telefono1, telefono2, correo, servicioDeInternet, celular, computadora, tablet,
            nivelInstitucional, tipoNegocio, actividadEconomica, promMensualIngreso, promMensualGastos,
            caracteristicaDelNegocio, camposAsistenciaTecnica, temaCapacitacion,
            idColaborador
        } = req.body;

        const ingreso = Number(promMensualIngreso) || 0;
        const gastos = Number(promMensualGastos) || 0;
        const promMensualUtilidad = ingreso - gastos;

        const internet = boolToInt(servicioDeInternet);
        const celularDisponible = boolToInt(celular);
        const pcDisponible = boolToInt(computadora);
        const tabletDisponible = boolToInt(tablet);

        const paisFinal = pais || "Ecuador";
        const tiempoResidencia = tiempoDeResidenciaPais ? tiempoDeResidenciaPais : null;

        // Asignar idPais = 1 (puedes ajustar este valor según corresponda)
      

        await db.query(`
            UPDATE emprendedor SET
                nombres = ?,
                apellidos = ?,
                numeroIdentificacion = ?,
              
                edad = ?,
                idSede = ?,
                generoIdentidad = ?,
                estadoCivil = ?,
                numeroCargas = ?,
                rolFamiliar = ?,
                etnia = ?,
                discapacidad = ?,
                Nacionalidad = ?,
                pais = ?,
                estatusMigratorio = ?,
                tiempoDeResidenciaPais = ?,
                direccion = ?,
                telefono1 = ?,
                telefono2 = ?,
                correo = ?,
                servicioDeInternet = ?,
                celular = ?,
                computadora = ?,
                tablet = ?,
                nivelInstitucional = ?,
                tipoNegocio = ?,
                actividadEconomica = ?,
                promMensualIngreso = ?,
                promMensualGastos = ?,
                promMensualUtilidad = ?,
                caracteristicaDelNegocio = ?,
                camposAsistenciaTecnica = ?,
                temaCapacitacion = ?,
                idColaborador = ?
            WHERE idEmprendedor = ?
        `, [
            nombres, apellidos, numeroIdentificacion, edad, idSede, generoIdentidad, estadoCivil, numeroCargas, rolFamiliar,
            etnia, discapacidad, Nacionalidad || null, paisFinal, estatusMigratorio || null, tiempoResidencia, direccion, telefono1, telefono2, correo,
            internet, celularDisponible, pcDisponible, tabletDisponible, nivelInstitucional, tipoNegocio, actividadEconomica, ingreso,
            gastos, promMensualUtilidad, caracteristicaDelNegocio, camposAsistenciaTecnica, temaCapacitacion,
            idColaborador || null, id
        ]);

        res.status(200).json({ message: "Ficha técnica actualizada" });
    } catch (error) {
        console.error("Error al actualizar ficha técnica:", error);
        res.status(500).json({ message: "Error al actualizar ficha técnica", error });
    }
});

// 📌 Eliminar una ficha técnica
router.delete("/deleteFicha/:id", async (req, res) => {
    const { id } = req.params;
    try {
        await db.query("DELETE FROM emprendedor WHERE idEmprendedor = ?", [id]);
        res.status(200).json({ message: "Ficha técnica eliminada correctamente" });
    } catch (error) {
        console.error("Error al eliminar ficha técnica:", error);
        res.status(500).json({ message: "Error al eliminar ficha técnica", error });
    }
});

module.exports = router;
