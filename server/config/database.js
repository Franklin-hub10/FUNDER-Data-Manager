    const mysql = require('mysql2');

    const pool = mysql.createPool({
        host: '127.0.0.1', // Cambia si tu host es diferente
        user: 'root', // Reemplaza con tu usuario
        password: '1234', // Reemplaza con tu contraseña
        database: 'funder', // Reemplaza con tu base de datos
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });

    module.exports = pool.promise(); // Exporta el pool para usarlo en otros módulos


    //host: '178.63.7.242',
// user: 'funderedu_cnig',
//password: 'c.b2s.25.nig',
//database: 'funderedu_cnig',
//100.121.64.34 