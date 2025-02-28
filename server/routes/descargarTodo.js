
const express = require("express");
const fs = require("fs");
const path = require("path");
const archiver = require("archiver");
const db = require("../config/database"); // Asegúrate de importar tu conexión a la BD

const router = express.Router();

// 📌 Endpoint para generar y descargar todas las tablas en un solo ZIP
router.get("/download-all", async (req, res) => {
    try {
        const tables = [
            { name: "fichaDiagnostico", file: "fichaDiagnostico.csv" },
            { name: "fichaTecnica", file: "fichaTecnica.csv" },
            { name: "gestionOrganizacional", file: "gestionOrganizacional.csv" },
            { name: "gestionProductiva", file: "gestionProductiva.csv" },
            { name: "gestionComercial", file: "gestionComercial.csv" },
            { name: "gestionFinanciera", file: "gestionFinanciera.csv" }
        ];

        const csvFolder = path.join(__dirname, "../data");
        if (!fs.existsSync(csvFolder)) fs.mkdirSync(csvFolder);

        // 📝 Generar archivos CSV dinámicamente
        for (let table of tables) {
            const [rows] = await db.query(`SELECT * FROM ${table.name}`);
            const csvData = rows.map(row => Object.values(row).join(",")).join("\n");

            fs.writeFileSync(path.join(csvFolder, table.file), csvData, "utf8");
        }

        // 📌 Crear archivo ZIP
        const zipPath = path.join(csvFolder, "export_all.zip");
        const output = fs.createWriteStream(zipPath);
        const archive = archiver("zip", { zlib: { level: 9 } });

        output.on("close", () => res.download(zipPath));
        archive.on("error", err => res.status(500).json({ error: err.message }));

        archive.pipe(output);

        // 📌 Agregar archivos CSV al ZIP
        for (let table of tables) {
            archive.file(path.join(csvFolder, table.file), { name: table.file });
        }

        archive.finalize();
    } catch (error) {
        console.error("❌ Error al generar ZIP:", error);
        res.status(500).json({ message: "Error al generar el ZIP", error: error.message });
    }
});

module.exports = router;