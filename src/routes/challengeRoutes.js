// routes/challengeRoutes.js
const express = require('express');
const path = require('path');
const router = express.Router();
const challengeController = require('../controllers/challengeController');
//injeccion 1
router.post('/start-sql-injection', challengeController.startSqlInjectionChallenge);
router.post('/sql-injection', challengeController.sqlInjectionChallenge);
router.post('/end-sql-injection', challengeController.endSqlInjectionChallenge);
router.get('/users/:dbName', challengeController.getUsers); // Nueva ruta para obtener usuarios

//injeccion 2
const challengeController2 = require('../controllers/challengeController2');

router.post('/start-sql-injection2', challengeController2.startSqlInjectionChallenge);
router.post('/sql-injection2', challengeController2.sqlInjectionChallenge);
router.post('/end-sql-injection2', challengeController2.endSqlInjectionChallenge);
router.get('/users2/:dbName', challengeController2.getUsers); // Nueva ruta para obtener usuarios


//broken access control
const challengebrokenController = require('../controllers/challengebrokenController');

router.post('/start-broken-access-control', challengebrokenController.startBrokenAccessControlChallenge);
router.post('/check-access', challengebrokenController.checkAccess);
router.post('/end-broken-access-control', challengebrokenController.endBrokenAccessControlChallenge);
  
//XXE
const xxecontroller = require('../controllers/XXEController');

router.post('/submit-comment', xxecontroller.submitComment);
router.post('/xml-upload',  xxecontroller.getComments);



router.post('/submit', (req, res) => {
    const { comment } = req.body;
    // Devuelve el comentario como respuesta
    res.setHeader('Content-Type', 'text/html');
    res.send(`
        <h1>Comentarios:</h1>
        ${comment}  <!-- Vulnerabilidad XSS intencional -->
        <a href="/">Volver</a>
    `);
});
router.get('/prueba.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'prueba.html'));
  });

module.exports = router;


module.exports = router;