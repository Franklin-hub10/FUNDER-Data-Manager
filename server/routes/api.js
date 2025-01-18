const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const userController = require('../controllers/userController');

// Rutas CRUD para Roles
router.get('/roles', roleController.getAllRoles); // Obtener todos los roles
router.post('/roles', roleController.createRole); // Crear un nuevo rol
router.put('/roles/:id', roleController.updateRole); // Actualizar un rol
router.delete('/roles/:id', roleController.deleteRole); // Eliminar un rol

// Rutas CRUD para Usuarios
router.get('/users', userController.getAllUsers); // Obtener todos los usuarios
router.post('/users', userController.createUser); // Crear un nuevo usuario
router.put('/users/:id', userController.updateUser); // Actualizar un usuario
router.delete('/users/:id', userController.deleteUser); // Eliminar un usuario

module.exports = router;
