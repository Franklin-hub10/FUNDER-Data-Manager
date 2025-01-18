const express = require('express');
const cors = require('cors');
const rolesRoutes = require('./routes/roles');
const usuariosRoutes =require('./routes/usuarios')

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/roles', rolesRoutes);
app.use('/usuarios', usuariosRoutes);

// Inicio del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
