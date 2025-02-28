const express = require("express");
const db = require("../config/database");

const router = express.Router();

// Obtener todas las preguntas de Gestión Financiera
router.get("/preguntas", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM preguntas_gestion_Financiera");
        res.status(200).json(results);
    } catch (error) {
        console.error("❌ Error al obtener preguntas de gestión financiera:", error);
        res.status(500).json({ message: "Error al obtener preguntas", error });
    }
});

// Obtener todas las respuestas de Gestión Financiera
router.get("/respuestas", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM respuestas_gestion_Financiera");
        res.status(200).json(results);
    } catch (error) {
        console.error("❌ Error al obtener respuestas de gestión financiera:", error);
        res.status(500).json({ message: "Error al obtener respuestas", error });
    }
});

// Obtener una respuesta por ID
router.get("/respuestas/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await db.query("SELECT * FROM respuestas_gestion_Financiera WHERE idRespuesta_Financiera = ?", [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: "❌ Respuesta no encontrada" });
        }
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("❌ Error al obtener la respuesta:", error);
        res.status(500).json({ message: "Error al obtener la respuesta", error });
    }
});

// Insertar una nueva respuesta de Gestión Financiera
router.post("/guardarRespuestasFinanciera", async (req, res) => {
    try {
        const { idEmprendimiento, idEmprendedor, idColaborador, respuestas, observaciones, tecnico_responsable, } = req.body;

        if (!idEmprendimiento || !idEmprendedor || !idColaborador || !Array.isArray(respuestas) || respuestas.length === 0) {
            return res.status(400).json({ message: "❌ Faltan datos en la solicitud. Verifique los campos obligatorios." });
        }

        const sql = `
            INSERT INTO respuestas_gestion_Financiera 
            (idEmprendimiento, idEmprendedor, idColaborador, idPregunta_Financiera, diagnostico, intermedia, final, mejora, status, diagnostico_valor, intermedia_valor, final_valor, mejora_valor, status_valor, observaciones, tecnico_responsable) 
            VALUES ?
        `;

        const values = respuestas.map(r => {
            if (!r.idPregunta_Financiera) {
                throw new Error("❌ Falta el ID de la pregunta en una de las respuestas.");
            }
            return [
                idEmprendimiento,
                idEmprendedor,
                idColaborador,
                r.idPregunta_Financiera,
                r.diagnostico || "No",
                r.intermedia || "No",
                r.final || "No",
                r.mejora || "No",
                r.status || "No",
                r.diagnostico_valor || 0.00,
                r.intermedia_valor || 0.00,
                r.final_valor || 0.00,
                r.mejora_valor || 0.00,
                r.status_valor || 0.00,
                observaciones || "Sin observaciones",
                tecnico_responsable || "Sin tecnico responsable"
            ];
        });

        await db.query(sql, [values]);

        res.status(201).json({ message: "✅ Respuestas guardadas correctamente" });
    } catch (error) {
        console.error("❌ Error al guardar respuestas:", error);
        res.status(500).json({ message: "Error al guardar respuestas", error: error.message });
    }
});

// Actualizar una respuesta por ID
router.put("/actualizar-respuesta/:id", async (req, res) => {
    const { id } = req.params;
    const { diagnostico, intermedia, final, mejora, status, diagnostico_valor, intermedia_valor, final_valor, mejora_valor, status_valor, observaciones,tecnico_responsable } = req.body;

    try {
        const [result] = await db.query(`
            UPDATE respuestas_gestion_Financiera 
            SET diagnostico = ?, intermedia = ?, final = ?, mejora = ?, status = ?, 
                diagnostico_valor = ?, intermedia_valor = ?, final_valor = ?, mejora_valor = ?, status_valor = ?, 
                observaciones = ?, tecnico_responsable = ?
            WHERE idRespuesta_Financiera = ?
        `, [diagnostico, intermedia,tecnico_responsable, final, mejora, status, diagnostico_valor, intermedia_valor, final_valor, mejora_valor, status_valor, observaciones, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "❌ Respuesta no encontrada para actualizar." });
        }

        res.status(200).json({ message: "✅ Respuesta actualizada correctamente" });
    } catch (error) {
        console.error("❌ Error al actualizar respuesta:", error);
        res.status(500).json({ message: "Error al actualizar respuesta", error });
    }
});

// Eliminar una respuesta por ID
router.delete("/eliminar-respuesta/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query("DELETE FROM respuestas_gestion_Financiera WHERE idRespuesta_Financiera = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "❌ Respuesta no encontrada." });
        }

        res.status(200).json({ message: "✅ Respuesta eliminada correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar respuesta:", error);
        res.status(500).json({ message: "Error al eliminar respuesta", error });
    }
});




// Endpoin pra descargar el archivo csv de toda la tabla  gestion Organizacional

router.get('/download-csv', async (req, res) => {
    try {
      
      const [results] = await db.query("SELECT * FROM respuestas_gestion_Financiera");
  
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
        res.setHeader("Content-Disposition", "attachment; filename=respuestas_gestion_Financiera.csv");
        res.setHeader("Content-Type", "text/csv");
        res.status(200).send(csv);
      } catch (error) {
        console.error("❌ Error al generar CSV:", error);
        res.status(500).json({ message: "Error al generar CSV", error: error.message });
      }
    });
    module.exports = router;