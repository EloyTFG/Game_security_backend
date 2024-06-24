const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuarioModel');
const Progreso = require('../models/progresoModel');

const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided.' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const requestingUser = await Usuario.findOne({ where: { id_usuario: decoded.id } });

    if (!requestingUser || requestingUser.id_rol !== 1) {
      return res.status(403).json({ message: 'You are not authorized.' });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateUser = [
  verifyAdmin,
  async (req, res) => {
    try {
      const { id_usuario, nombre_completo, nombre_usuario } = req.body;

      if (!id_usuario) {
        return res.status(400).json({ message: 'User ID is required.' });
      }


      const updatedData = {};
      if (nombre_completo) updatedData.nombre_completo = nombre_completo;
      if (nombre_usuario) updatedData.nombre_usuario = nombre_usuario;

      if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({ message: 'No fields to update.' });
      }

      await Usuario.update(updatedData, { where: { id_usuario: id_usuario } });
      const updatedUser = await Usuario.findOne({ where: { id_usuario: id_usuario } });

      res.status(200).json({
        message: 'User updated successfully.',
        user: {
          id_usuario: updatedUser.id_usuario,
          nombre_completo: updatedUser.nombre_completo,
          nombre_usuario: updatedUser.nombre_usuario,
          correo_electronico: updatedUser.correo_electronico, 
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message }); 
    }
  }
];

exports.deleteUser = [
  verifyAdmin,
  async (req, res) => {
    try {
      const { id_usuario } = req.params; 

      if (!id_usuario) {
        return res.status(400).json({ message: 'User ID is required.' });
      }

     
      if (id_usuario === '1') {
        return res.status(400).json({ message: 'Cannot delete the administrator user.' });
      }

      await Progreso.destroy({ where: { id_usuario: id_usuario } });

      await Usuario.destroy({ where: { id_usuario: id_usuario } });

      res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: error.message }); 
    }
  }
];


exports.getAllUsers = [
  verifyAdmin,
  async (req, res) => {
    try {
      const users = await Usuario.findAll({
        attributes: ['id_usuario', 'nombre_completo', 'nombre_usuario', 'correo_electronico', 'id_rol']
      });
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: error.message }); 
    }
  }
];


exports.getUserById = [
    verifyAdmin,
    async (req, res) => {
      try {
        const { id_usuario } = req.params; 
  
        if (!id_usuario) {
          return res.status(400).json({ message: 'User ID is required.' });
        }
  
        const user = await Usuario.findOne({
          where: { id_usuario: id_usuario },
          attributes: ['id_usuario', 'nombre_completo', 'nombre_usuario', 'correo_electronico', 'id_rol'],
        });
  
        if (!user) {
          return res.status(404).json({ message: 'User not found.' });
        }
  
        res.status(200).json(user);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }
  ];
