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
        const {
            nombresApellidos, documentoIdentidad, numeroIdentificacion, visaAmparo, lugarNacimiento, edad, fechaNacimiento,
            instruccion, nacionalidad, pais, estatusMigratorio, aniosResidencia, mesesResidencia, generoIdentidad,
            estadoCivil, etnia, rolFamiliar, numeroCargas, direccionNegocio, telefonoConvencional, telefonoCelular,
            correo, servicioDeInternet, celular, computadora, tablet, tipoNegocio, otroNegocio, actividadEconomica,
            caracteristicasNegocio, asistenciaTecnica, temasCapacitacion, idColaborador
        } = req.body;
 
        // Validar campos obligatorios
        if (!nombresApellidos || !documentoIdentidad || !numeroIdentificacion || !lugarNacimiento || !edad || !fechaNacimiento ||
            !instruccion || !nacionalidad || !generoIdentidad || !estadoCivil || !etnia || !rolFamiliar || !direccionNegocio ||
            !telefonoConvencional || !telefonoCelular || !correo || !tipoNegocio || !actividadEconomica || !caracteristicasNegocio ||
            !asistenciaTecnica || !temasCapacitacion) {
            return res.status(400).json({ message: "❌ Faltan campos obligatorios en la solicitud." });
        }
 
        // Convertir booleanos a 1 o 0 para MySQL
        const internet = boolToInt(servicioDeInternet);
        const celularDisponible = boolToInt(celular);
        const pcDisponible = boolToInt(computadora);
        const tabletDisponible = boolToInt(tablet);
 
        // Consulta SQL
        const sql = `
            INSERT INTO emprendedor (
                nombresApellidos, documentoIdentidad, numeroIdentificacion, visaAmparo, lugarNacimiento, edad, fechaNacimiento,
                instruccion, nacionalidad, pais, estatusMigratorio, aniosResidencia, mesesResidencia, generoIdentidad,
                estadoCivil, etnia, rolFamiliar, numeroCargas, direccionNegocio, telefonoConvencional, telefonoCelular,
                correo, servicioDeInternet, celular, computadora, tablet, tipoNegocio, otroNegocio, actividadEconomica,
                caracteristicasNegocio, asistenciaTecnica, temasCapacitacion, idColaborador
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
 
        const values = [
            nombresApellidos, documentoIdentidad, numeroIdentificacion, visaAmparo || null, lugarNacimiento, edad, fechaNacimiento,
            instruccion, nacionalidad, pais || null, estatusMigratorio || null, aniosResidencia || null, mesesResidencia || null,
            generoIdentidad, estadoCivil, etnia, rolFamiliar, numeroCargas || 0, direccionNegocio, telefonoConvencional, telefonoCelular,
            correo, internet, celularDisponible, pcDisponible, tabletDisponible, tipoNegocio, otroNegocio || null, actividadEconomica,
            caracteristicasNegocio, asistenciaTecnica, temasCapacitacion, idColaborador || null
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
            nombresApellidos, documentoIdentidad, numeroIdentificacion, visaAmparo, lugarNacimiento, edad, fechaNacimiento,
            instruccion, nacionalidad, pais, estatusMigratorio, aniosResidencia, mesesResidencia, generoIdentidad,
            estadoCivil, etnia, rolFamiliar, numeroCargas, direccionNegocio, telefonoConvencional, telefonoCelular,
            correo, servicioDeInternet, celular, computadora, tablet, tipoNegocio, otroNegocio, actividadEconomica,
            caracteristicasNegocio, asistenciaTecnica, temasCapacitacion, idColaborador
        } = req.body;
 
        // Convertir booleanos a 1 o 0 para MySQL
        const internet = boolToInt(servicioDeInternet);
        const celularDisponible = boolToInt(celular);
        const pcDisponible = boolToInt(computadora);
        const tabletDisponible = boolToInt(tablet);
 
        // Consulta SQL
        await db.query(`
            UPDATE emprendedor SET
                nombresApellidos = ?,
                documentoIdentidad = ?,
                numeroIdentificacion = ?,
                visaAmparo = ?,
                lugarNacimiento = ?,
                edad = ?,
                fechaNacimiento = ?,
                instruccion = ?,
                nacionalidad = ?,
                pais = ?,
                estatusMigratorio = ?,
                aniosResidencia = ?,
                mesesResidencia = ?,
                generoIdentidad = ?,
                estadoCivil = ?,
                etnia = ?,
                rolFamiliar = ?,
                numeroCargas = ?,
                direccionNegocio = ?,
                telefonoConvencional = ?,
                telefonoCelular = ?,
                correo = ?,
                servicioDeInternet = ?,
                celular = ?,
                computadora = ?,
                tablet = ?,
                tipoNegocio = ?,
                otroNegocio = ?,
                actividadEconomica = ?,
                caracteristicasNegocio = ?,
                asistenciaTecnica = ?,
                temasCapacitacion = ?,
                idColaborador = ?
            WHERE idEmprendedor = ?
        `, [
            nombresApellidos, documentoIdentidad, numeroIdentificacion, visaAmparo || null, lugarNacimiento, edad, fechaNacimiento,
            instruccion, nacionalidad, pais || null, estatusMigratorio || null, aniosResidencia || null, mesesResidencia || null,
            generoIdentidad, estadoCivil, etnia, rolFamiliar, numeroCargas || 0, direccionNegocio, telefonoConvencional, telefonoCelular,
            correo, internet, celularDisponible, pcDisponible, tabletDisponible, tipoNegocio, otroNegocio || null, actividadEconomica,
            caracteristicasNegocio, asistenciaTecnica, temasCapacitacion, idColaborador || null, id
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
 
// NUEVO ENDPOINT: Obtener el último idColaborador creado para vincularlo en emprendimiento
router.get('/ultimo-colaborador', async (req, res) => {
    try {
      const [rows] = await db.query("SELECT idColaborador FROM colaborador ORDER BY idColaborador DESC LIMIT 1");
      if (rows.length === 0) {
        return res.status(404).json({ message: "No se encontró ningún colaborador." });
      }
      res.status(200).json({ idColaborador: rows[0].idColaborador });
    } catch (error) {
      console.error("❌ Error al obtener el último colaborador:", error);
      res.status(500).json({ message: "Error al obtener el último colaborador", error: error.message });
    }
 
});
 
// Endpoin para descargar en archivo csv de  todos los datos de la tabla emprendedor 

router.get('/download-csv', async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM emprendedor");
        if (!results || results.length === 0) {
          return res.status(404).json({ message: "No se encontraron datos para generar CSV." });
        }
        const headers = Object.keys(results[0]).join(",");
        const csvRows = results.map(row => {
          return Object.values(row).map(value => {
              if (value === null || value === undefined) {
                return "";
              }
              if (typeof value === "string" && value.includes(",")) {
                return `"${value}"`;
              }
              return value;
            }).join(",");
          });
          const csv = headers + "\n" + csvRows.join("\n");
          res.setHeader("Content-Disposition", "attachment; filename=fichas_tecnicas.csv");
          res.setHeader("Content-Type", "text/csv");
          res.status(200).send(csv);
        } catch (error) {
          console.error("❌ Error al generar CSV:", error);
          res.status(500).json({ message: "Error al generar CSV", error: error.message });
        }
      });


module.exports = router;

