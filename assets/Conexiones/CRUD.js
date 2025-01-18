const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;


// Middleware
app.use(cors());
app.use(bodyParser.json());


// Rutas CRUD para la tabla `emprendedor`

// Crear
app.post('/emprendedor', (req, res) => {
  const { nombres, apellidos, idPais, edad, idEstadoCivil } = req.body;
  const sql = 'INSERT INTO emprendedor (nombres, apellidos, idPais, edad, idEstadoCivil) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [nombres, apellidos, idPais, edad, idEstadoCivil], (err, result) => {
    if (err) {
      console.error('Error al insertar el registro:', err);
      res.status(500).json({ error: 'Error al insertar el registro.' });
    } else {
      res.status(201).json({ message: 'Registro creado exitosamente.', id: result.insertId });
    }
  });
});

// Leer todos los registros 
app.get('/emprendedor', (req, res) => {
  const sql = 'SELECT * FROM emprendedor';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener los registros:', err);
      res.status(500).json({ error: 'Error al obtener los registros.' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Leer un registro por ID 
app.get('/emprendedor/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM emprendedor WHERE idEmprendedor = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al obtener el registro:', err);
      res.status(500).json({ error: 'Error al obtener el registro.' });
    } else if (result.length === 0) {
      res.status(404).json({ error: 'Registro no encontrado.' });
    } else {
      res.status(200).json(result[0]);
    }
  });
});

// Actualizar 
app.put('/emprendedor/:id', (req, res) => {
  const { id } = req.params;
  const { nombres, apellidos, idPais, edad, idEstadoCivil } = req.body;
  const sql = 'UPDATE emprendedor SET nombres = ?, apellidos = ?, idPais = ?, edad = ?, idEstadoCivil = ? WHERE idEmprendedor = ?';
  db.query(sql, [nombres, apellidos, idPais, edad, idEstadoCivil, id], (err, result) => {
    if (err) {
      console.error('Error al actualizar el registro:', err);
      res.status(500).json({ error: 'Error al actualizar el registro.' });
    } else {
      res.status(200).json({ message: 'Registro actualizado exitosamente.' });
    }
  });
});

// Eliminar (Delete)
app.delete('/emprendedor/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM emprendedor WHERE idEmprendedor = ?';
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error al eliminar el registro:', err);
      res.status(500).json({ error: 'Error al eliminar el registro.' });
    } else {
      res.status(200).json({ message: 'Registro eliminado exitosamente.' });
    }
  });
});

// CRUD para la tabla `pais`

// Crear
app.post('/pais', (req, res) => {
  const { nombre } = req.body;
  const sql = 'INSERT INTO pais (nombre) VALUES (?)';
  db.query(sql, [nombre], (err, result) => {
    if (err) {
      console.error('Error al insertar el registro:', err);
      res.status(500).json({ error: 'Error al insertar el registro.' });
    } else {
      res.status(201).json({ message: 'Registro creado exitosamente.', id: result.insertId });
    }
  });
});

// Leer todos los registros
app.get('/pais', (req, res) => {
  const sql = 'SELECT * FROM pais';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener los registros:', err);
      res.status(500).json({ error: 'Error al obtener los registros.' });
    } else {
      res.status(200).json(results);
    }
  });
});

// CRUD para la tabla `estado_civil`

// Crear
app.post('/estado_civil', (req, res) => {
  const { nombre } = req.body;
  const sql = 'INSERT INTO estado_civil (nombre) VALUES (?)';
  db.query(sql, [nombre], (err, result) => {
    if (err) {
      console.error('Error al insertar el registro:', err);
      res.status(500).json({ error: 'Error al insertar el registro.' });
    } else {
      res.status(201).json({ message: 'Registro creado exitosamente.', id: result.insertId });
    }
  });
});

// Leer todos los registros
app.get('/estado_civil', (req, res) => {
  const sql = 'SELECT * FROM estado_civil';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener los registros:', err);
      res.status(500).json({ error: 'Error al obtener los registros.' });
    } else {
      res.status(200).json(results);
    }
  });
});

// CRUD para la tabla `producto`

// Crear
app.post('/producto', (req, res) => {
  const { nombre, precio, descripcion } = req.body;
  const sql = 'INSERT INTO producto (nombre, precio, descripcion) VALUES (?, ?, ?)';
  db.query(sql, [nombre, precio, descripcion], (err, result) => {
    if (err) {
      console.error('Error al insertar el registro:', err);
      res.status(500).json({ error: 'Error al insertar el registro.' });
    } else {
      res.status(201).json({ message: 'Registro creado exitosamente.', id: result.insertId });
    }
  });
});

// Leer todos los registros
app.get('/producto', (req, res) => {
  const sql = 'SELECT * FROM producto';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener los registros:', err);
      res.status(500).json({ error: 'Error al obtener los registros.' });
    } else {
      res.status(200).json(results);
    }
  });
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
