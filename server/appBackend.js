const express = require('express');
const cors = require('cors');
const rolesRoutes = require('./routes/roles');
const usuariosRoutes =require('./routes/usuarios')
const sedesRoutes = require('./routes/sedes');
const authRoutes = require("./routes/auth");
const fichaDiagnosticoRoutes = require("./routes/fichaDiagnostico");
const fichaTecnicaRoutes = require("./routes/fichaTecnica");
const exportControllerRoutes = require("./routes/exportControllerRoutes");

require("dotenv").config(); // Asegura que esto esté al inicio
console.log("📌 EMAIL_USER:", process.env.EMAIL_USER);
console.log("📌 EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "OK" : "FALTA");

const app = express();

// Middleware
app.use(cors({
    origin: 'http://localhost:5000',  // Ajusta esto con el puerto de tu frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }));
app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// Rutas
app.use('/roles', rolesRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/sedes', sedesRoutes);
app.use("/auth", authRoutes);
app.use("/fichaTecnica", fichaTecnicaRoutes);
app.use("/fichaDiagnostico", fichaDiagnosticoRoutes);
app.use("/export", exportControllerRoutes);




// Inicio del servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
