const express = require('express');
const router = express.Router();
const { updateUser, deleteUser, getAllUsers ,getUserById} = require('../controllers/adminController');

// Ruta para actualizar un usuario
router.put('/update/:id_usuario', updateUser);
router.delete('/delete/:id_usuario', deleteUser);
router.get('/users', getAllUsers);
router.get('/users/:id_usuario',getUserById); // Ruta para obtener usuario por ID

module.exports = router;
