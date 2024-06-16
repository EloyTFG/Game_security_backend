// src/routes/desafioRoutes.js
const express = require('express');
const router = express.Router();
const desafioController = require('../controllers/admindesafioController');

// Ruta para crear un nuevo desafío
// Ruta protegida, solo administradores
router.post('/create', desafioController.createDesafio);

// Ruta para actualizar un desafío existente
// Ruta protegida, solo administradores
router.put('/update-challenge/:id_desafio', desafioController.updateDesafio);

// Ruta para eliminar un desafío
// Ruta protegida, solo administradores
router.delete('/delete-challenge/:id_desafio', desafioController.deleteDesafio);

// Ruta para obtener todos los desafíos
// Ruta protegida, solo administradores
router.get('/challenges', desafioController.getAllDesafios);

// Ruta para obtener un desafío específico por ID
// Ruta protegida, solo administradores
router.get('/challenges/:id_desafio', desafioController.getDesafioById);

// Ruta para obtener todas las fases
// Ruta protegida, solo administradores
router.get('/fases', desafioController.getAllFases);


module.exports = router;
