// controllers/faseController.js
const Fase = require('../models/faseModel');
const Desafio = require('../models/desafioModel');

// Función para obtener todas las fases con sus desafíos
exports.getFasesWithDesafios = async (req, res) => {
  try {
    const fases = await Fase.findAll({
      include: [{
        model: Desafio,
        attributes: ['id_desafio', 'descripcion_desafio', 'solucion_desafio', 'nivel_dificultad'],
      }],
    });

    res.json(fases);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving data', error: error.message });
  }
};

// Función para obtener los desafíos de una fase específica por ID
exports.getDesafiosByFaseId = async (req, res) => {
    try {
      const id_fase = req.params.id_fase;
      const fase = await Fase.findByPk(id_fase, {
        include: [{
          model: Desafio,
          attributes: ['id_desafio', 'descripcion_desafio', 'solucion_desafio', 'nivel_dificultad'],
        }],
      });
  
      if (!fase) {
        return res.status(404).json({ message: 'Fase not found' });
      }
  
      const response = {
        id_fase: fase.id_fase,
        nombre_fase: fase.nombre_fase,
        vulnerabilidad: fase.vulnerabilidad,
        Desafios: fase.Desafios
      };
  
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving data', error: error.message });
    }
  };
