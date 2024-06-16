// controllers/documentoAyudaController.js

const DocumentoPrevencion= require('../models/documentoPrevencionModel');
const Desafio = require('../models/desafioModel');

const getDocumentosByDesafioId = async (req, res) => {
  const { id_desafio } = req.params;

  try {
    const documentos = await DocumentoPrevencion.findAll({
      where: { id_desafio },
    });

    if (!documentos || documentos.length === 0) {
      return res.status(404).json({ error: 'No se encontraron documentos para este desafío.' });
    }

    res.json(documentos);
  } catch (error) {
    console.error('Error fetching documents:', error);
    res.status(500).json({ error: 'Error al obtener los documentos.' });
  }
};

module.exports = {
  getDocumentosByDesafioId,
};
