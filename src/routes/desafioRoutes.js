
const express = require('express');
const router = express.Router();
const desafioController = require('../controllers/admindesafioController');



router.post('/create', desafioController.createDesafio);



router.put('/update-challenge/:id_desafio', desafioController.updateDesafio);



router.delete('/delete-challenge/:id_desafio', desafioController.deleteDesafio);



router.get('/challenges', desafioController.getAllDesafios);



router.get('/challenges/:id_desafio', desafioController.getDesafioById);



router.get('/fases', desafioController.getAllFases);


module.exports = router;
