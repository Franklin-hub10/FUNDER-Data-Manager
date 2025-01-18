const express = require('express');
const router = express.Router();
const { getUsers, createUser, assignRole } = require('../controllers/userController');

// Ruta para obtener todos los usuarios
router.get('/', getUsers);

// Ruta para crear un usuario
router.post('/', createUser);

// Ruta para asignar un rol a un usuario
router.post('/:id/role', assignRole);

module.exports = router;
