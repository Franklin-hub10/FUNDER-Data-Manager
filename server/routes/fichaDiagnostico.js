// routes/fichaDiagnostico.js
const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Endpoint para crear un nuevo emprendimiento (ficha diagnóstico)
router.post('/crear-emprendimiento', async (req, res) => {
  const {
    nombreComercial,
    razonSocial,
    idSede,
    idProdServ,
    direccionNegocio,
    idParroquia,
    canton,
    ciudad,
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
    referencia,
    nombreEvaluador,
    fechaEvaluacion,
    idEmprendedor,
    idColaborador,
    idGestion,      // nuevo campo: id de la gestión
    nombreGestion   // nuevo campo: nombre de la gestión
  } = req.body;

  // Validar que se hayan enviado los campos obligatorios (ajusta según lo que necesites)
  if (
    !nombreComercial || !razonSocial || !idSede || !idProdServ || !direccionNegocio ||
    !idParroquia || !canton || !ciudad || !telefono1 || !correo || !numSocios ||
    !numEmpleados || !antiguedad || !nombreContacto1 || !telefonoContacto1 ||
    !nombreContacto2 || !telefonoContacto2 || !referencia || !nombreEvaluador ||
    !fechaEvaluacion || !idEmprendedor
  ) {
    return res.status(400).json({ message: "❌ Faltan campos obligatorios en la solicitud." });
  }

  try {
    const sql = `
      INSERT INTO emprendimiento (
        nombreComercial, razonSocial, idSede, idProdServ, direccionNegocio, idParroquia,
        canton, ciudad, telefono1, telefono2, correo, numSocios, numEmpleados, antiguedad,
        nombreContacto1, telefonoContacto1, nombreContacto2, telefonoContacto2, referencia,
        nombreEvaluador, fechaEvaluacion, idEmprendedor, idColaborador, idGestion, nombreGestion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      nombreComercial,
      razonSocial,
      idSede,
      idProdServ,
      direccionNegocio,
      idParroquia,
      canton,
      ciudad,
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
      referencia,
      nombreEvaluador,
      fechaEvaluacion,
      idEmprendedor,
      idColaborador || null,
      idGestion || null,
      nombreGestion || null
    ];

    const [result] = await db.query(sql, values);
    res.status(201).json({ message: "Emprendimiento registrado correctamente", id: result.insertId });
  } catch (error) {
    console.error("Error al registrar emprendimiento:", error);
    res.status(500).json({ message: "Error al registrar emprendimiento", error });
  }
});

// Endpoint para actualizar un emprendimiento (incluye los nuevos campos)
router.put('/update-emprendimiento/:id', async (req, res) => {
  const { id } = req.params;
  const {
    nombreComercial,
    razonSocial,
    idSede,
    idProdServ,
    direccionNegocio,
    idParroquia,
    canton,
    ciudad,
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
    referencia,
    nombreEvaluador,
    fechaEvaluacion,
    idEmprendedor,
    idColaborador,
    idGestion,
    nombreGestion
  } = req.body;

  if (
    !nombreComercial || !razonSocial || !idSede || !idProdServ || !direccionNegocio ||
    !idParroquia || !canton || !ciudad || !telefono1 || !correo || !numSocios ||
    !numEmpleados || !antiguedad || !nombreContacto1 || !telefonoContacto1 ||
    !nombreContacto2 || !telefonoContacto2 || !referencia || !nombreEvaluador ||
    !fechaEvaluacion || !idEmprendedor
  ) {
    return res.status(400).json({ message: "❌ Faltan campos obligatorios en la solicitud." });
  }

  try {
    const sql = `
      UPDATE emprendimiento SET
        nombreComercial = ?,
        razonSocial = ?,
        idSede = ?,
        idProdServ = ?,
        direccionNegocio = ?,
        idParroquia = ?,
        canton = ?,
        ciudad = ?,
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
        referencia = ?,
        nombreEvaluador = ?,
        fechaEvaluacion = ?,
        idEmprendedor = ?,
        idColaborador = ?,
        idGestion = ?,
        nombreGestion = ?
      WHERE idEmprendimiento = ?
    `;

    const values = [
      nombreComercial,
      razonSocial,
      idSede,
      idProdServ,
      direccionNegocio,
      idParroquia,
      canton,
      ciudad,
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
      referencia,
      nombreEvaluador,
      fechaEvaluacion,
      idEmprendedor,
      idColaborador || null,
      idGestion || null,
      nombreGestion || null,
      id
    ];

    const [result] = await db.query(sql, values);
    res.status(200).json({ message: "Emprendimiento actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar emprendimiento:", error);
    res.status(500).json({ message: "Error al actualizar emprendimiento", error });
  }
});

module.exports = router;
