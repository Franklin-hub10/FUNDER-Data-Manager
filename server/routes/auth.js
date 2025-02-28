const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");
require("dotenv").config();

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "secreto_super_seguro";

// =====================================================
// 🔐 Autenticación de usuario (Login con usuario o email y contraseña)
// =====================================================
router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    console.warn("⚠️ Datos incompletos en el login.");
    return res.status(400).json({ message: "⚠️ Usuario y contraseña son requeridos." });
  }

  try {
    console.log(`🔍 Buscando usuario en la BD: "${usuario}"`);

    // 1. Buscar al usuario por 'usuario' o 'email'
    const [users] = await db.query(`
      SELECT c.idColaborador, c.usuario, c.email, c.password, c.idRol, c.nombres, c.apellidos,
             c.idSede, s.nombre AS sede, c.estado
        FROM colaborador c
        JOIN sede s ON c.idSede = s.idSede
       WHERE c.usuario = ? OR c.email = ?
    `, [usuario, usuario]);

    if (users.length === 0) {
      console.warn(`⚠️ Usuario "${usuario}" no encontrado.`);
      return res.status(401).json({ message: "⚠️ Usuario o contraseña incorrectos." });
    }

    const user = users[0];

    // 2. Verificar si el usuario está activo
    if (user.estado !== "activo") {
      console.warn(`⚠️ Usuario "${usuario}" está inactivo.`);
      return res.status(403).json({ message: "⚠️ Cuenta inactiva. Contacte al administrador." });
    }

    // 3. Verificar que tenga una contraseña almacenada
    if (!user.password) {
      console.error(`❌ Error: El usuario "${usuario}" no tiene contraseña almacenada.`);
      return res.status(500).json({ message: "⚠️ Error en la cuenta. Contacte al soporte." });
    }

    // 4. Comparar la contraseña ingresada con la de la base de datos
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(`🔑 Comparación de contraseña: ${passwordMatch}`);

    if (!passwordMatch) {
      console.warn(`⚠️ Contraseña incorrecta para "${usuario}".`);
      return res.status(401).json({ message: "⚠️ Usuario o contraseña incorrectos." });
    }

    // 5. Obtener las vistas de este rol
    const [views] = await db.query(`
      SELECT v.idVista, v.nombre, v.url, v.categoria
        FROM rol_vista rv
        JOIN vista v ON rv.idVista = v.idVista
       WHERE rv.idRol = ?
    `, [user.idRol]);

    // 6. Generar el token JWT
    const token = jwt.sign(
      { id: user.idColaborador, usuario: user.usuario, rol: user.idRol },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log(`✅ Usuario "${user.usuario}" inició sesión correctamente.`);

    // 7. Devolver info al frontend
    res.json({
      token,
      vistas: views,  // Array de {idVista, nombre, url, categoria}
      nombre: `${user.nombres} ${user.apellidos}`,
      id: user.idColaborador
    });

  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ message: "❌ Error en el servidor. Intenta más tarde." });
  }
});

module.exports = router;
  