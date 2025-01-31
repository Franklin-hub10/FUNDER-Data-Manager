const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Obtener todas las sedes
router.get('/', async (req, res) => {
    try {
        console.log("🔹 Solicitando sedes de la base de datos...");
        const [sedes] = await db.query('SELECT idSede, nombre FROM sede');
        console.log("✅ Sedes obtenidas:", sedes);
        res.status(200).json(sedes);
    } catch (error) {
        console.error("❌ Error al obtener sedes:", error);
        res.status(500).json({ message: "Error al obtener sedes", error });
    }
});

module.exports = router;
