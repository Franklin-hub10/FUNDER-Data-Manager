const express = require('express');
const db = require('../config/database');
 
const router = express.Router();
 
// Endpoint para crear un nuevo emprendimiento
router.post('/crear-emprendimiento', async (req, res) => {
  const {
    nombreComercial,
    razonSocial,
    direccionNegocio,
    Parroquia, // Ahora es texto, no un número
    canton,
    ciudad,
    referencia,
    telefono1,
    telefono2,
    correo,
    numSocios,
    numEmpleados,
    antiguedad,
    nombreContacto1,
    telefonoContacto1,
    nombreContacto2,
    telefonoContacto2,
    nombreEvaluador,
    fechaEvaluacion,
    idEmprendedor,
    idColaborador
  } = req.body;
 
  // Validar que se hayan enviado los campos obligatorios
  if (
    !nombreComercial || !razonSocial || !direccionNegocio || !Parroquia || !canton ||
    !ciudad || !telefono1 || !correo || !numSocios || !numEmpleados || !antiguedad ||
    !nombreContacto1 || !telefonoContacto1 || !nombreEvaluador || !fechaEvaluacion ||
    !idEmprendedor
  ) {
    return res.status(400).json({ message: "❌ Faltan campos obligatorios en la solicitud." });
  }
 
  // Validar que 'Parroquia' sea un texto válido
  if (typeof Parroquia !== 'string' || Parroquia.trim() === '') {
    return res.status(400).json({ message: "❌ El valor de 'Parroquia' no es un texto válido." });
  }
 
  try {
    const sql = `
      INSERT INTO emprendimiento (
        nombreComercial, razonSocial, direccionNegocio, Parroquia, canton, ciudad,
        referencia, telefono1, telefono2, correo, numSocios, numEmpleados, antiguedad,
        nombreContacto1, telefonoContacto1, nombreContacto2, telefonoContacto2,
        nombreEvaluador, fechaEvaluacion, idEmprendedor, idColaborador
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      nombreComercial,
      razonSocial,
      direccionNegocio,
      Parroquia, // Ahora es texto
      canton,
      ciudad,
      referencia || null,
      telefono1,
      telefono2 || null,
      correo,
      Number(numSocios),
      Number(numEmpleados),
      Number(antiguedad),
      nombreContacto1,
      telefonoContacto1,
      nombreContacto2 || null,
      telefonoContacto2 || null,
      nombreEvaluador,
      fechaEvaluacion,
      Number(idEmprendedor),
      idColaborador ? Number(idColaborador) : null
    ];
 
    const [result] = await db.query(sql, values);
    res.status(201).json({ message: "✅ Emprendimiento registrado correctamente", id: result.insertId });
  } catch (error) {
    console.error("❌ Error al registrar emprendimiento:", error);
    res.status(500).json({ message: "Error al registrar emprendimiento", error: error.message });
  }
});
 
// Endpoint para actualizar un emprendimiento
router.put('/update-emprendimiento/:id', async (req, res) => {
  const { id } = req.params;
  const {
    nombreComercial,
    razonSocial,
    direccionNegocio,
    Parroquia,
    canton,
    ciudad,
    referencia,
    telefono1,
    telefono2,
    correo,
    numSocios,
    numEmpleados,
    antiguedad,
    nombreContacto1,
    telefonoContacto1,
    nombreContacto2,
    telefonoContacto2,
    nombreEvaluador,
    fechaEvaluacion,
    idEmprendedor,
    idColaborador
  } = req.body;
 
  // Validar campos obligatorios
  if (
    !nombreComercial || !razonSocial || !direccionNegocio || !Parroquia || !canton ||
    !ciudad || !telefono1 || !correo || !numSocios || !numEmpleados || !antiguedad ||
    !nombreContacto1 || !telefonoContacto1 || !nombreEvaluador || !fechaEvaluacion ||
    !idEmprendedor
  ) {
    return res.status(400).json({ message: "❌ Faltan campos obligatorios en la solicitud." });
  }
 
  try {
    const sql = `
      UPDATE emprendimiento SET
        nombreComercial = ?,
        razonSocial = ?,
        direccionNegocio = ?,
        Parroquia = ?,
        canton = ?,
        ciudad = ?,
        referencia = ?,
        telefono1 = ?,
        telefono2 = ?,
        correo = ?,
        numSocios = ?,
        numEmpleados = ?,
        antiguedad = ?,
        nombreContacto1 = ?,
        telefonoContacto1 = ?,
        nombreContacto2 = ?,
        telefonoContacto2 = ?,
        nombreEvaluador = ?,
        fechaEvaluacion = ?,
        idEmprendedor = ?,
        idColaborador = ?
      WHERE idEmprendimiento = ?
    `;
 
    const values = [
      nombreComercial,
      razonSocial,
      direccionNegocio,
      Number(Parroquia),
      canton,
      ciudad,
      referencia || null,
      telefono1,
      telefono2 || null,
      correo,
      Number(numSocios),
      Number(numEmpleados),
      Number(antiguedad),
      nombreContacto1,
      telefonoContacto1,
      nombreContacto2 || null,
      telefonoContacto2 || null,
      nombreEvaluador,
      fechaEvaluacion,
      Number(idEmprendedor),
      idColaborador ? Number(idColaborador) : null,
      id
    ];
 
    const [result] = await db.query(sql, values);
    res.status(200).json({ message: "✅ Emprendimiento actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar emprendimiento:", error);
    res.status(500).json({ message: "Error al actualizar emprendimiento", error });
  }
});
 
// NUEVO ENDPOINT: Obtener el último idEmprendedor
router.get('/ultimo-emprendedor', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT idEmprendedor FROM emprendedor ORDER BY idEmprendedor DESC LIMIT 1");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontró ningún empren  dedor." });
    }
    res.status(200).json({ idEmprendedor: rows[0].idEmprendedor });
  } catch (error) {
    console.error("❌ Error al obtener el último emprendedor:", error);
    res.status(500).json({ message: "Error al obtener el último emprendedor", error: error.message });
  }
 
});
 
// NUEVO ENDPOINT: Obtener el último idEmprendedor creado para vincularlo en emprendimiento
router.get('/ultimo-emprendimiento', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT idEmprendimiento FROM emprendimiento ORDER BY idEmprendimiento DESC LIMIT 1");
    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontró ningún emprendimiento." });
    }
    res.status(200).json({ idEmprendimiento: rows[0].idEmprendimiento });
  } catch (error) {
    console.error("❌ Error al obtener el último emprendimiento:", error);
    res.status(500).json({ message: "Error al obtener el último emprendimiento", error: error.message });
  }
 
 
 
});
 



// Endepoin para descargar archivo csv emprendimiento

router.get('/download-csv', async (req, res) => {
  try {
    // Realiza la consulta para obtener los datos desde la tabla 'emprendimiento'
    const [results] = await db.query("SELECT * FROM emprendimiento");

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "No se encontraron datos para generar CSV." });
    }

    // Obtener los encabezados (columnas) del primer registro
    const headers = Object.keys(results[0]).join(",");

    // Convertir cada fila a una cadena CSV
    const csvRows = results.map(row => {
      // Asegurarse de que si algún valor contiene comas se envuelva entre comillas
      return Object.values(row).map(value => {
        if (value === null || value === undefined) {
          return "";
        }
        if (typeof value === "string" && value.includes(",")) {
          return `"${value}"`;
        }
        return value;
      }).join(",");
    });

    // Combinar encabezados y filas
    const csv = headers + "\n" + csvRows.join("\n");

    // Configurar las cabeceras para forzar la descarga
    res.setHeader("Content-Disposition", "attachment; filename=emprendimientos.csv");
    res.setHeader("Content-Type", "text/csv");

    res.status(200).send(csv);
  } catch (error) {
    console.error("❌ Error al generar CSV:", error);
    res.status(500).json({ message: "Error al generar CSV", error: error.message });
  }
});
module.exports = router;