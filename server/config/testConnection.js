const pool = require('./database'); // Cambia la ruta según tu archivo de conexión

async function testConnection() {
    try {
        // Ejecutar una consulta simple para verificar la conexión
        const [rows] = await pool.query('SELECT 1 + 1 AS result');
        console.log('Conexión exitosa:', rows);
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
    } finally {
        pool.end(); // Cierra el pool de conexiones
    }
}

// Llamar a la función para probar la conexión
testConnection();
