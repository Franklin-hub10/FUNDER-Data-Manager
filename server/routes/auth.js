const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../config/database");
require("dotenv").config();
const jwtMiddleware = require("../middleware/authMiddleware"); // Importa el middleware

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY || "secreto_super_seguro";

// Ruta de login
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

    // 3. Verificar la contraseña
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log(`🔑 Comparación de contraseña: ${passwordMatch}`);

    if (!passwordMatch) {
      console.warn(`⚠️ Contraseña incorrecta para "${usuario}".`);
      return res.status(401).json({ message: "⚠️ Usuario o contraseña incorrectos." });
    }

    // 4. Generar el token JWT
    const token = jwt.sign(
      { id: user.idColaborador, usuario: user.usuario, rol: user.idRol },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    console.log(`✅ Usuario "${user.usuario}" inició sesión correctamente.`);

    // 5. Devolver info al frontend
    res.json({
      token,
      vistas: [],  // Aquí puedes devolver las vistas si las necesitas
      nombre: `${user.nombres} ${user.apellidos}`,
      id: user.idColaborador,
      sede: user.sede  // Aquí añadimos la sede al JSON de respuesta
    });

  } catch (error) {
    console.error("❌ Error en login:", error);
    res.status(500).json({ message: "❌ Error en el servidor. Intenta más tarde." });
  }
});

// Endpoint para obtener la sede del colaborador
router.get("/sede", jwtMiddleware.verifyToken, async (req, res) => {
  const { id } = req.user;  // Obtener el id desde el token JWT (decodificado)

  if (!id) {
    return res.status(400).json({ message: "⚠️ No se ha proporcionado el id del usuario." });
  }

  try {
    // Buscar la sede asociada al colaborador logueado
    const [result] = await db.query(`
      SELECT s.nombre AS sede
        FROM colaborador c
        JOIN sede s ON c.idSede = s.idSede
       WHERE c.idColaborador = ?
    `, [id]);

    if (result.length === 0) {
      return res.status(404).json({ message: "⚠️ Sede no encontrada para este colaborador." });
    }

    const sede = result[0].sede;
    res.json({ sede });

  } catch (error) {
    console.error("❌ Error al obtener la sede:", error);
    res.status(500).json({ message: "❌ Error en el servidor. Intenta más tarde." });
  }
});

module.exports = router;
