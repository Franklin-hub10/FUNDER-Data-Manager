// routes/roles.js
const express = require('express');
const router = express.Router();
const db = require('../config/database');

// ─── ENDPOINTS PARA CARGA DINÁMICA ─────────────────────────

// Obtener categorías únicas (de la tabla vista)
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

// Obtener permisos asociados a una vista
router.get('/view-permissions/:idVista', async (req, res) => {
  const { idVista } = req.params;
  try {
    const [permissions] = await db.query(`
      SELECT p.*
      FROM vista_permiso vp
      JOIN permiso p ON vp.idPermiso = p.idPermiso
      WHERE vp.idVista = ?
    `, [idVista]);
    res.status(200).json(permissions);
  } catch (error) {
    console.error('Error al obtener permisos para la vista:', error);
    res.status(500).json({ message: 'Error al obtener permisos para la vista', error });
  }
});

// Obtener todos los permisos
router.get('/permissions', async (req, res) => {
  try {
    const [permissions] = await db.query('SELECT * FROM permiso');
    res.status(200).json(permissions);
  } catch (error) {
    console.error('Error al obtener permisos:', error);
    res.status(500).json({ message: 'Error al obtener permisos', error });
  }
});

// ─── ENDPOINTS PARA GESTIÓN DE ROLES ─────────────────────────

// Listar roles con vistas y permisos
router.get('/roles', async (req, res) => {
  try {
    const [roles] = await db.query(`
      SELECT r.idRol, r.nombre AS rol,
             GROUP_CONCAT(DISTINCT v.nombre SEPARATOR ', ') AS vistas,
             GROUP_CONCAT(DISTINCT v.idVista SEPARATOR ', ') AS vistasIds,
             GROUP_CONCAT(DISTINCT p.nombre SEPARATOR ', ') AS permisos,
             GROUP_CONCAT(DISTINCT p.idPermiso SEPARATOR ', ') AS permisosIds
      FROM rol r
      LEFT JOIN rol_vista rv ON r.idRol = rv.idRol
      LEFT JOIN vista v ON rv.idVista = v.idVista
      LEFT JOIN rol_permiso rp ON r.idRol = rp.idRol
      LEFT JOIN permiso p ON rp.idPermiso = p.idPermiso
      GROUP BY r.idRol
    `);
    res.status(200).json(roles);
  } catch (error) {
    console.error('Error al obtener roles:', error);
    res.status(500).json({ message: 'Error al obtener roles', error });
  }
});

// Crear un rol con múltiples vistas y permisos
router.post('/create-role', async (req, res) => {
  const { nombre, vistas } = req.body;
  if (!nombre || !vistas || !Array.isArray(vistas) || vistas.length === 0) {
    return res.status(400).json({ message: 'Faltan datos: nombre y vistas son requeridos.' });
  }
  try {
    // Insertar el rol (solo el nombre)
    const [result] = await db.query('INSERT INTO rol (nombre) VALUES (?)', [nombre]);
    const idRol = result.insertId;
    
    // Por cada vista seleccionada, insertar en rol_vista y acumular los permisos
    const permisosSet = new Set();
    for (const item of vistas) {
      const { idVista, permisos } = item;
      if (!idVista) continue;
      await db.query('INSERT INTO rol_vista (idRol, idVista, acciones) VALUES (?, ?, ?)', [idRol, idVista, 'default']);
      if (Array.isArray(permisos)) {
        permisos.forEach(p => permisosSet.add(p));
      }
    }
    // Insertar los permisos únicos en rol_permiso
    const permisoQueries = Array.from(permisosSet).map(permiso =>
      db.query('INSERT INTO rol_permiso (idRol, idPermiso) VALUES (?, ?)', [idRol, permiso])
    );
    await Promise.all(permisoQueries);
    
    res.status(201).json({ message: 'Rol creado con vistas y permisos.', idRol });
  } catch (error) {
    console.error('Error al crear rol:', error);
    res.status(500).json({ message: 'Error al crear rol', error });
  }
});

// Actualizar un rol (nombre, vistas y permisos)
router.put('/update-role/:idRol', async (req, res) => {
  const { idRol } = req.params;
  const { rol, permisos, vistas } = req.body;
  try {
    if (rol) await db.query('UPDATE rol SET nombre = ? WHERE idRol = ?', [rol, idRol]);
    if (vistas) {
      await db.query('DELETE FROM rol_vista WHERE idRol = ?', [idRol]);
      const vistaQueries = vistas.map(item =>
         db.query('INSERT INTO rol_vista (idRol, idVista, acciones) VALUES (?, ?, ?)', [idRol, item.idVista, 'default'])
      );
      await Promise.all(vistaQueries);
    }
    if (permisos) {
      await db.query('DELETE FROM rol_permiso WHERE idRol = ?', [idRol]);
      const permisoQueries = permisos.map(permiso =>
         db.query('INSERT INTO rol_permiso (idRol, idPermiso) VALUES (?, ?)', [idRol, permiso])
      );
      await Promise.all(permisoQueries);
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
    await db.query('DELETE FROM rol_permiso WHERE idRol = ?', [idRol]);
    await db.query('DELETE FROM rol_vista WHERE idRol = ?', [idRol]);
    await db.query('DELETE FROM rol WHERE idRol = ?', [idRol]);
    res.status(200).json({ message: 'Rol eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar el rol:', error);
    res.status(500).json({ message: 'Error al eliminar el rol', error });
  }
});

router.post('/assign-permissions', async (req, res) => {
  const { idRol, permisos } = req.body;
  try {
    await db.query('DELETE FROM rol_permiso WHERE idRol = ?', [idRol]);
    const permisoQueries = permisos.map(permiso =>
      db.query('INSERT INTO rol_permiso (idRol, idPermiso) VALUES (?, ?)', [idRol, permiso])
    );
    await Promise.all(permisoQueries);
    res.status(200).json({ message: 'Permisos asignados correctamente' });
  } catch (error) {
    console.error('Error al asignar permisos:', error);
    res.status(500).json({ message: 'Error al asignar permisos', error });
  }
});

module.exports = router;
