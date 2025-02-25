const express = require("express");
const db = require("../config/database");

const router = express.Router();

// Obtener todas las preguntas de Gestión Comercial
router.get("/preguntas", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM preguntas_gestion_Comercial");
        res.status(200).json(results);
    } catch (error) {
        console.error("❌ Error al obtener preguntas de gestión comercial:", error);
        res.status(500).json({ message: "Error al obtener preguntas", error });
    }
});

// Obtener todas las respuestas de Gestión Comercial
router.get("/respuestas", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM respuestas_gestion_Comercial");
        res.status(200).json(results);
    } catch (error) {
        console.error("❌ Error al obtener respuestas de gestión comercial:", error);
        res.status(500).json({ message: "Error al obtener respuestas", error });
    }
});

// Obtener una respuesta por ID
router.get("/respuestas/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const [results] = await db.query("SELECT * FROM respuestas_gestion_Comercial WHERE idRespuesta_Comercial = ?", [id]);
        if (results.length === 0) {
            return res.status(404).json({ message: "Respuesta no encontrada" });
        }
        res.status(200).json(results[0]);
    } catch (error) {
        console.error("❌ Error al obtener la respuesta:", error);
        res.status(500).json({ message: "Error al obtener la respuesta", error });
    }
});

// Insertar una nueva respuesta de Gestión Comercial
router.post("/guardarRespuestasComercial", async (req, res) => {
    try {
        const { idEmprendimiento, idEmprendedor, idColaborador, respuestas, observaciones } = req.body;

        if (!idEmprendimiento || !idEmprendedor  || !Array.isArray(respuestas) || respuestas.length === 0) {
            return res.status(400).json({ message: "❌ Faltan datos en la solicitud. Verifique los campos obligatorios." });
        }

        const sql = `
            INSERT INTO respuestas_gestion_Comercial 
            (idEmprendimiento, idEmprendedor, idColaborador, idPregunta_Comercial, diagnostico, intermedia, final, mejora, status, recursos, redesSociales, observaciones) 
            VALUES ?
        `;

        const values = respuestas.map(r => {
            if (!r.idPregunta_Comercial) {
                throw new Error("❌ Falta el ID de la pregunta en una de las respuestas.");
            }
            return [
                idEmprendimiento,
                idEmprendedor,
                idColaborador,
                r.idPregunta_Comercial,
                r.diagnostico || "No",
                r.intermedia || "No",
                r.final || "No",
                r.mejora || "No",
                r.status || "No",
                r.recursos || "Sin recursos",
                r.redesSociales || "Sin redes",
                observaciones || "Sin observaciones",
        
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
    const { diagnostico, intermedia, final, mejora, status, recursos, redesSociales, observaciones } = req.body;
    
    try {
        const [result] = await db.query(`
            UPDATE respuestas_gestion_Comercial 
            SET diagnostico = ?, intermedia = ?, final = ?, mejora = ?, status = ?, recursos = ?, redesSociales = ?, observaciones = ?
            WHERE idRespuesta_Comercial = ?
        `, [diagnostico, intermedia, final, mejora, status, recursos, redesSociales, observaciones, id]);

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
        const [result] = await db.query("DELETE FROM respuestas_gestion_Comercial WHERE idRespuesta_Comercial = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "❌ Respuesta no encontrada." });
        }

        res.status(200).json({ message: "✅ Respuesta eliminada correctamente" });
    } catch (error) {
        console.error("❌ Error al eliminar respuesta:", error);
        res.status(500).json({ message: "Error al eliminar respuesta", error });
    }

    // Endpoint para obtener el último idEmprendedor 
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
    
    // Endpoint para obtener el último idEmprendimiento 
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
    
    // Endpoint para obtener el último idColaborador 
    
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
    
    // Endpoin pra descargar el archivo csv de toda la tabla  gestion Organizacional
    
    router.get('/download-csv', async (req, res) => {
        try {
          
          const [results] = await db.query("SELECT * FROM respuestas_gestion_organizacional");
      
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
            res.setHeader("Content-Disposition", "attachment; filename=respuestas_gestion_organizacional.csv");
            res.setHeader("Content-Type", "text/csv");
            res.status(200).send(csv);
          } catch (error) {
            console.error("❌ Error al generar CSV:", error);
            res.status(500).json({ message: "Error al generar CSV", error: error.message });
          }
        });
});

module.exports = router;