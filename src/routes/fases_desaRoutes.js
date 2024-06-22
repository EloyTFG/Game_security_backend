
const express = require('express');
const { getFasesWithDesafios,getDesafiosByFaseId } = require('../controllers/faseController');
const router = express.Router();
const documentoAyudaController = require('../controllers/documentoayudaController');
const documentoPrevencionController = require('../controllers/documentoprevencionController');

router.get('/fases', getFasesWithDesafios);
router.get('/fases/:id_fase', getDesafiosByFaseId);


const {getDesafioById} = require('../controllers/desafioController');


router.get('/challenge/:id_desafio', getDesafioById);

router.get('/desafio/:id_desafio/documentosayuda', documentoAyudaController.getDocumentosByDesafioId);
router.get('/desafio/:id_desafio/documentosprevencion', documentoPrevencionController.getDocumentosByDesafioId);

const progresoController = require('../controllers/progresoController');

router.post('/progreso', progresoController.createProgreso);



module.exports = router;