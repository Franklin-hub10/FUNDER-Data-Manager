const db = require("../config/database");
const fs = require("fs");
const path = require("path");

exports.exportCSV = async (req, res) => {
    try {
        // 📌 Seleccionar todas las columnas de la tabla export_data
        const [rows] = await db.execute("SELECT * FROM export_data");
        console.log(rows); // Esto debe mostrar los datos en la consola
        

        if (rows.length === 0) {
            return res.status(404).send("No hay datos para exportar.");
        }

        // 📌 Obtener los nombres de las columnas dinámicamente
        const csvHeaders = Object.keys(rows[0]);

        // 📌 Construir los datos del CSV
        const csvData = [
            csvHeaders, // Primera fila: encabezados
            ...rows.map(row => csvHeaders.map(header => row[header] ?? "")) // Filas de datos
        ].map(e => e.join(",")).join("\n");

        // 📌 Verificar si la carpeta 'assets/uploads' existe
        const uploadsDir = path.join(__dirname, "../assets/uploads");
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir, { recursive: true });
        }

        // 📌 Guardar el archivo CSV
        const filePath = path.join(uploadsDir, "export_data.csv");
        fs.writeFileSync(filePath, csvData);

        console.log("✅ Archivo CSV generado correctamente:", filePath);
        res.download(filePath, "export_data.csv");

    } catch (error) {
        console.error("❌ Error al generar CSV:", error);
        res.status(500).send("Error al generar CSV.");
    }
};
