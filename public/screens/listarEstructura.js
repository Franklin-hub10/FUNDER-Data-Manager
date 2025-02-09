const fs = require("fs");
const path = require("path");

function listarArchivos(dir, nivel = 0, resultado = []) {
    const archivos = fs.readdirSync(dir);
    archivos.forEach(archivo => {
        const rutaCompleta = path.join(dir, archivo);
        const esDirectorio = fs.statSync(rutaCompleta).isDirectory();

        resultado.push("  ".repeat(nivel) + "|-- " + archivo);

        if (esDirectorio) {
            listarArchivos(rutaCompleta, nivel + 1, resultado);
        }
    });

    return resultado;
}

// Guardar la estructura en un archivo
const estructura = listarArchivos(__dirname);
fs.writeFileSync("estructura_proyecto.txt", estructura.join("\n"), "utf-8");

console.log("📄 Estructura guardada en estructura_proyecto.txt");
