// src/controllers/desafioController.js
const Desafio = require('../models/desafioModel');


const Pista = require('../models/pistaModel');

exports.getDesafioById = async (req, res) => {
  try {
    const id_desafio = req.params.id_desafio;
    const desafio = await Desafio.findByPk(id_desafio, {
      include: [{
        model: Pista,
        attributes: ['id_pista', 'informacion_pista'],
      }],
    });

    if (!desafio) {
      return res.status(404).json({ message: 'Desafio not found' });
    }

    res.json(desafio);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving data', error: error.message });
  }
};
