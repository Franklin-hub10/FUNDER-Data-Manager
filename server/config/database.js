const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'your-database-host',
    user: 'your-database-user',
    password: 'your-database-password',
    database: 'your-database-name',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

module.exports = pool.promise(); // Exporta el pool para usarlo en otros módulos
