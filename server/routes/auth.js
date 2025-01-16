const express = require('express');
const router = express.Router();

// Ruta básica para prueba
router.get('/', (req, res) => {
    res.send('Autenticación funcionando correctamente');
});

module.exports = router;
