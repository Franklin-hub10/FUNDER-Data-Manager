const express = require('express');
const router = express.Router();
const { getRoles, createRole, assignPermissions } = require('../controllers/roleController');

// Ruta para obtener roles
router.get('/', getRoles);

// Ruta para crear un nuevo rol
router.post('/', createRole);

// Ruta para asignar permisos a un rol
router.post('/:id/permissions', assignPermissions);

module.exports = router;
