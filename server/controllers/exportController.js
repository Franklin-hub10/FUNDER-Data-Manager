const db = require("../config/database");
const fs = require("fs");
const path = require("path");

exports.exportCSV = async (req, res) => {
    try {
        const [rows] = await db.execute("SELECT * FROM export_data");
        if (rows.length === 0) {
            return res.status(404).send("No hay datos para exportar.");
        }

        const csvData = [
            ["ID", "Tipo Formulario", "Datos", "Fecha"],
            ...rows.map(row => [row.id, row.tipo_formulario, JSON.stringify(row.datos), row.fecha])
        ].map(e => e.join(",")).join("\n");

        // 📌 Verificar si la carpeta 'assets/uploads' existe
        const uploadsDir = path.join(__dirname, "../assets/uploads");
        console.log("📂 Verificando carpeta:", uploadsDir);

        if (!fs.existsSync(uploadsDir)) {
            console.log("🚨 Carpeta no encontrada. Creando...");
            fs.mkdirSync(uploadsDir, { recursive: true });
            console.log("✅ Carpeta creada correctamente.");
        } else {
            console.log("✅ La carpeta ya existe.");
        }

        // 📌 Escribir el archivo CSV
        const filePath = path.join(uploadsDir, "export_data.csv");
        console.log("✍️ Escribiendo archivo en:", filePath);
        
        fs.writeFileSync(filePath, csvData);
        console.log("✅ Archivo creado correctamente.");

        res.download(filePath, "export_data.csv");
    } catch (error) {
        console.error("❌ Error al generar CSV:", error);
        res.status(500).send("Error al generar CSV.");
    }
};
