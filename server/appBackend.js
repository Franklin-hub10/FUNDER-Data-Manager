const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Importar rutas
const authRoutes = require('./routes/auth');
const roleRoutes = require('./routes/roles');
const userRoutes = require('./routes/users');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);

// Puerto del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
