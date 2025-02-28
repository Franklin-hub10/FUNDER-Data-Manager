const express = require('express');
const cors = require('cors');
const rolesRoutes = require('./routes/roles');
const usuariosRoutes = require('./routes/usuarios');
const sedesRoutes = require('./routes/sedes');
const authRoutes = require("./routes/auth");
const fichaDiagnosticoRoutes = require("./routes/fichaDiagnostico");
const fichaTecnicaRoutes = require("./routes/fichaTecnica");
const exportControllerRoutes = require("./routes/exportControllerRoutes");
const gestionFinancieraRoutes = require("./routes/gestionFinancieraRoutes");
const gestionComercialRoutes = require("./routes/gestionComercialRoutes");
const gestionOrganizacional = require("./routes/gestionOrganizacional");
const gestionProductivaRoutes = require("./routes/gestionProductiva");
 
 

 
const app = express();
 
// ✅ Middleware para permitir múltiples orígenes
app.use(cors({
    origin: ['http://localhost:5501', 'http://127.0.0.1:5501'], // Permite ambos orígenes
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true // Si usas cookies o tokens
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
app.use("/gestionfinanciera", gestionFinancieraRoutes);
app.use("/gestionComercial", gestionComercialRoutes);
app.use("/gestionOrganizacional", gestionOrganizacional);
app.use("/gestionProductiva", gestionProductivaRoutes);



 
// ✅ Manejo explícito para solicitudes preflight OPTIONS
app.options('*', cors());
 
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
 