// routes/challengeRoutes.js
const express = require('express');
const router = express.Router();
const challengeController = require('../controllers/challengeController');

router.post('/start-sql-injection', challengeController.startSqlInjectionChallenge);
router.post('/sql-injection', challengeController.sqlInjectionChallenge);
router.post('/end-sql-injection', challengeController.endSqlInjectionChallenge);
router.get('/users/:dbName', challengeController.getUsers); // Nueva ruta para obtener usuarios


const challengeController2 = require('../controllers/challengeController2');

router.post('/start-sql-injection2', challengeController2.startSqlInjectionChallenge);
router.post('/sql-injection2', challengeController2.sqlInjectionChallenge);
router.post('/end-sql-injection2', challengeController2.endSqlInjectionChallenge);
router.get('/users2/:dbName', challengeController2.getUsers); // Nueva ruta para obtener usuarios

module.exports = router;


const challengebrokenController = require('../controllers/challengebrokenController');

router.post('/start-broken-access-control', challengebrokenController.startBrokenAccessControlChallenge);
router.post('/check-access', challengebrokenController.checkAccess);
router.post('/end-broken-access-control', challengebrokenController.endBrokenAccessControlChallenge);

module.exports = router;