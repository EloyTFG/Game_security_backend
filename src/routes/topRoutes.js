const express = require('express');
const router = express.Router();
const authController = require('../controllers/topController');

router.get('/top', authController.getAllUsersProgress);


module.exports = router;
