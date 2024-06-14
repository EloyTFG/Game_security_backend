const Progreso = require('../models/progresoModel');
const Usuario = require('../models/usuarioModel');
const { Sequelize } = require('sequelize');

exports.getAllUsersProgress = [
  async (req, res) => {
    try {
      const progressData = await Progreso.findAll({
        attributes: [
          'id_usuario',
          [Sequelize.fn('SUM', Sequelize.col('puntuacion')), 'total_puntuacion']
        ],
        include: [
          {
            model: Usuario,
            attributes: ['nombre_usuario']
          }
        ],
        group: ['Progreso.id_usuario', 'Usuario.id_usuario']
      });

      // Formatear la respuesta para devolver el nombre del usuario y la suma de su puntuación
      const formattedData = progressData.map(item => ({
        nombre_usuario: item.Usuario.nombre_usuario,
        progreso: item.dataValues.total_puntuacion
      }));

      res.status(200).json(formattedData);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];
