const express = require('express');
const cors = require('cors');
const rolesRoutes = require('./routes/roles');
const usuariosRoutes =require('./routes/usuarios')
const sedesRoutes = require('./routes/sedes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// Rutas
app.use('/roles', rolesRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/login', usuariosRoutes);

app.use('/sedes', sedesRoutes);

// Inicio del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
