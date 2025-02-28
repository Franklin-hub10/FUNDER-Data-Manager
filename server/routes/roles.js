const express = require('express');
const router = express.Router();
const db = require('../config/database');
 
// ─── ENDPOINTS PARA CARGA DINÁMICA ─────────────────────────
 
// Obtener categorías únicas
router.get('/categories', async (req, res) => {
  try {
    const [categories] = await db.query('SELECT DISTINCT categoria FROM vista');
    res.status(200).json(categories);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ message: 'Error al obtener categorías', error });
  }
});
 
// Obtener vistas según la categoría
router.get('/views', async (req, res) => {
  const { categoria } = req.query;
  try {
    const [views] = await db.query('SELECT * FROM vista WHERE categoria = ?', [categoria]);
    res.status(200).json(views);
  } catch (error) {
    console.error('Error al obtener vistas:', error);
    res.status(500).json({ message: 'Error al obtener vistas', error });
  }
});
 
// ─── ENDPOINTS PARA GESTIÓN DE ROLES ─────────────────────────
 
// Listar roles con vistas
router.get('/roles', async (req, res) => {
  try {
    const [roles] = await db.query(`
      SELECT r.idRol, r.nombre AS rol,
             GROUP_CONCAT(DISTINCT v.nombre SEPARATOR ', ') AS vistas,
             GROUP_CONCAT(DISTINCT v.idVista SEPARATOR ', ') AS vistasIds
      FROM rol r
      LEFT JOIN rol_vista rv ON r.idRol = rv.idRol
      LEFT JOIN vista v ON rv.idVista = v.idVista
      GROUP BY r.idRol
    `);
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ message: 'Error al obtener roles', error });
  }
});
 
// Crear un rol solo con vistas
router.post('/create-role', async (req, res) => {
  console.log("Datos recibidos en la API:", req.body);
  const { nombre, vistas } = req.body;
 
  if (!nombre || !vistas || !Array.isArray(vistas) || vistas.length === 0) {
    return res.status(400).json({ message: 'Faltan datos: nombre y vistas son requeridos.' });
  }
 
  try {
    // Insertar el nuevo rol
    const [result] = await db.query('INSERT INTO rol (nombre) VALUES (?)', [nombre]);
    const idRol = result.insertId;
 
    // Insertar las vistas asociadas al rol
    const vistaQueries = vistas
      .filter(idVista => idVista)
      .map(idVista => db.query(
        'INSERT INTO rol_vista (idRol, idVista, acciones) VALUES (?, ?, ?)',
        [idRol, idVista, 'default']
      ));
 
    await Promise.all(vistaQueries);
 
    res.status(201).json({ message: 'Rol creado con vistas.', idRol });
  } catch (error) {
    console.error('Error al crear rol:', error);
    res.status(500).json({ message: 'Error al crear rol', error });
  }
});
 
// Actualizar un rol (solo nombre y vistas)
router.put('/update-role/:idRol', async (req, res) => {
  const { idRol } = req.params;
  const { rol, vistas } = req.body;
  try {
    if (rol) await db.query('UPDATE rol SET nombre = ? WHERE idRol = ?', [rol, idRol]);
    if (vistas) {
      await db.query('DELETE FROM rol_vista WHERE idRol = ?', [idRol]);
      const vistaQueries = vistas.map(idVista =>
        db.query('INSERT INTO rol_vista (idRol, idVista, acciones) VALUES (?, ?, ?)', [idRol, idVista, 'default'])
      );
      await Promise.all(vistaQueries);
    }
    res.status(200).json({ message: 'Rol actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar rol:', error);
    res.status(500).json({ message: 'Error al actualizar rol', error });
  }
});
 
// Eliminar un rol
router.delete('/delete-role/:idRol', async (req, res) => {
  const { idRol } = req.params;
  try {
    await db.query('DELETE FROM rol_vista WHERE idRol = ?', [idRol]);
    await db.query('DELETE FROM rol WHERE idRol = ?', [idRol]);
    res.status(200).json({ message: 'Rol eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el rol:', error);
    res.status(500).json({ message: 'Error al eliminar el rol', error });
  }
});
 
module.exports = router;