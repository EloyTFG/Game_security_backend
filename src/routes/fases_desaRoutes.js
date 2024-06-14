// routes/faseRoutes.js
const express = require('express');
const { getFasesWithDesafios,getDesafiosByFaseId } = require('../controllers/faseController');
const router = express.Router();

router.get('/fases', getFasesWithDesafios);
router.get('/fases/:id_fase', getDesafiosByFaseId);


const {getDesafioById} = require('../controllers/desafioControler');

// Ruta para obtener un desafío específico con sus pistas
router.get('/challenge/:id_desafio', getDesafioById);


const progresoController = require('../controllers/progresoController');

router.post('/progreso', progresoController.createProgreso);



module.exports = router;