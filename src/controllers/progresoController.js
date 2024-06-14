const Progreso = require('../models/progresoModel');
const Usuario = require('../models/usuarioModel');
const Desafio = require('../models/desafioModel');

exports.createProgreso = async (req, res) => {
  try {
    const { id_usuario, id_desafio, puntuacion, tiempo_invertido } = req.body;

    // Verifica si el usuario y el desafío existen
    const usuario = await Usuario.findByPk(id_usuario);
    const desafio = await Desafio.findByPk(id_desafio);

    if (!usuario || !desafio) {
      return res.status(404).json({ message: 'Usuario o Desafío no encontrados' });
    }

    const newProgreso = await Progreso.create({
      id_usuario,
      id_desafio,
      puntuacion,
      tiempo_invertido
    });

    res.status(201).json(newProgreso);
  } catch (error) {
    console.error('Error creating Progreso:', error);
    res.status(500).json({ message: 'Error creating Progreso', error: error.message });
  }
};
