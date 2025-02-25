const express = require("express");
const db = require("../config/database");
 
const router = express.Router();
 
// 📌 Middleware para el control de CORS
router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Ajusta según tu frontend
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   
    if (req.method === "OPTIONS") {
        return res.status(200).end(); // Manejo de solicitudes preflight
    }
   
    next();
});
 
// 📌 Obtener todas las respuestas de Gestión Productiva
router.get("/respuestas", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM respuestas_gestion_productiva");
        res.status(200).json(results);
    } catch (error) {
        console.error("❌ Error al obtener respuestas de gestión productiva:", error);
        res.status(500).json({ message: "Error al obtener respuestas", error });
    }
});
 
// 📌 Guardar respuestas de Gestión Productiva
router.post("/guardar-respuestas", async (req, res) => {
    try {
        const { idEmprendimiento, idEmprendedor, idColaborador, respuestas, observaciones } = req.body;
 
        // ✅ Validación de campos obligatorios
        if (!idEmprendimiento || !idEmprendedor || !idColaborador || !respuestas || respuestas.length === 0) {
            return res.status(400).json({ message: "❌ Faltan datos en la solicitud." });
        }
 
        // ✅ Verificar si los IDs existen en las tablas correspondientes
        const [emprendimiento] = await db.query("SELECT * FROM emprendimiento WHERE idEmprendimiento = ?", [idEmprendimiento]);
        const [emprendedor] = await db.query("SELECT * FROM emprendedor WHERE idEmprendedor = ?", [idEmprendedor]);
        const [colaborador] = await db.query("SELECT * FROM colaborador WHERE idColaborador = ?", [idColaborador]);
 
        if (!emprendimiento.length || !emprendedor.length || !colaborador.length) {
            return res.status(400).json({ message: "❌ Uno o más IDs no existen en la base de datos." });
        }
 
        // ✅ Estructura de la consulta
        const sql = `
            INSERT INTO respuestas_gestion_productiva
            (idEmprendimiento, idEmprendedor, idColaborador, idPregunta_Productiva, diagnostico, intermedia, final, mejora, status, observaciones)
            VALUES ?
        `;
 
        // ✅ Preparar datos para la consulta
        const values = respuestas.map(r => [
            idEmprendimiento,
            idEmprendedor,
            idColaborador,
            r.idPregunta_Productiva,
            r.diagnostico || "No",
            r.intermedia || "No",
            r.final || "No",
            r.mejora || "No",
            r.status || "No",
            observaciones || "Sin observaciones"
        ]);
 
        console.log("📡 Datos a insertar:", values); // Verifica los datos antes de enviar
 
        // ✅ Ejecutar la consulta
        const [result] = await db.query(sql, [values]);
 
        if (result.affectedRows > 0) {
            res.status(201).json({ message: "✅ Respuestas guardadas correctamente" });
        } else {
            res.status(400).json({ message: "❌ No se pudieron guardar las respuestas." });
        }
 
    } catch (error) {
        console.error("❌ Error al guardar respuestas:", error);
        res.status(500).json({ message: "Error al guardar respuestas", error: error.message });
    }
});
 
// 📌 Eliminar una respuesta por ID
router.delete("/eliminar-respuesta/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("DELETE FROM respuestas_gestion_productiva WHERE idRespuesta_Productiva = ?", [id]);
       
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "❌ Respuesta no encontrada" });
        }
 
        res.status(200).json({ message: "✅ Respuesta eliminada correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar respuesta:", error);
        res.status(500).json({ message: "Error al eliminar respuesta", error });
    }
});
 
// 📌 Actualizar una respuesta por ID
router.put("/actualizar-respuesta/:id", async (req, res) => {
    const { id } = req.params;
    const { diagnostico, intermedia, final, mejora, status, observaciones } = req.body;
 
    try {
        const [result] = await db.query(`
            UPDATE respuestas_gestion_productiva
            SET diagnostico = ?, intermedia = ?, final = ?, mejora = ?, status = ?, observaciones = ?
            WHERE idRespuesta_Productiva = ?
        `, [diagnostico, intermedia, final, mejora, status, observaciones, id]);
 
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "❌ Respuesta no encontrada para actualizar." });
        }
 
        res.status(200).json({ message: "✅ Respuesta actualizada correctamente" });
    } catch (error) {
        console.error("❌ Error al actualizar respuesta:", error);
        res.status(500).json({ message: "Error al actualizar respuesta", error });
    }
});
 
// Endpoint para obtener el último idEmprendedor de la tabla emprendedor
router.get('/ultimo-emprendedor', async (req, res) => {
    try {
      const [rows] = await db.query("SELECT idEmprendedor FROM emprendedor ORDER BY idEmprendedor DESC LIMIT 1");
      if (rows.length === 0) {
        return res.status(404).json({ message: "No se encontró ningún emprendedor." });
      }
      res.status(200).json({ idEmprendedor: rows[0].idEmprendedor });
    } catch (error) {
      console.error("❌ Error al obtener el último emprendedor:", error);
      res.status(500).json({ message: "Error al obtener el último emprendedor", error: error.message });
    }
});
 
// Endpoint para obtener el último idEmprendimiento creado para vincularlo en emprendimiento
router.get('/ultimo-emprendimiento', async (req, res) => {
    try {
      const [rows] = await db.query("SELECT idEmprendimiento FROM emprendimiento ORDER BY idEmprendimiento DESC LIMIT 1");
      if (rows.length === 0) {
        return res.status(404).json({ message: "No se encontró ningún emprendimiento." });
      }
      res.status(200).json({ idEmprendimiento: rows[0].idEmprendimiento });
    } catch (error) {
      console.error("❌ Error al obtener el último emprendimiento:", error);
      res.status(500).json({ message: "Error al obtener el último emprendimiento", error: error.message });
    }
});
 
// Endpoint para obtener el último idColaborador creado para vincularlo en emprendimiento
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
 
// Endpoint para descargar el archivo CSV de toda la tabla respuestas_gestion_productiva
 
router.get('/download-csv', async (req, res) => {
    try {
        // Realiza la consulta para obtener los datos desde la tabla 'respuestas_gestion_productiva'
        const [results] = await db.query("SELECT * FROM respuestas_gestion_productiva");
 
        // Verifica si hay resultados
        if (!results || results.length === 0) {
            return res.status(404).json({ message: "No se encontraron datos para generar CSV." });
        }
 
        // Obtener los encabezados (columnas) del primer registro
        const headers = Object.keys(results[0]).join(",");
 
        // Convertir cada fila a una cadena CSV
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
 
        // Combinar encabezados y filas
        const csv = headers + "\n" + csvRows.join("\n");
 
        // Configurar las cabeceras para forzar la descarga
        res.setHeader("Content-Disposition", "attachment; filename=respuestas_gestion_productiva.csv");
        res.setHeader("Content-Type", "text/csv");
 
        // Enviar el archivo CSV como respuesta
        res.status(200).send(csv);
    } catch (error) {
        console.error("❌ Error al generar CSV:", error);
        res.status(500).json({ message: "Error al generar CSV", error: error.message });
    }
});
 
module.exports = router;