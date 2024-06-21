
const jwt = require('jsonwebtoken');
const Desafio = require('../models/desafioModel');
const Fase = require('../models/faseModel');
const Pista = require('../models/pistaModel');
const Usuario = require('../models/usuarioModel');
const DocumentoAyuda = require('../models/documentoAyudaModel');
const DocumentoPrevencion = require('../models/documentoPrevencionModel');


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


exports.createDesafio = [
  verifyAdmin,
  async (req, res) => {
    try {
      const { descripcion_desafio, solucion_desafio, nivel_dificultad, id_fase, pistas, documentosAyuda, documentosPrevencion } = req.body;

      if (!descripcion_desafio || !solucion_desafio || !nivel_dificultad || !id_fase) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      const newDesafio = await Desafio.create({
        descripcion_desafio,
        solucion_desafio,
        nivel_dificultad,
        id_fase
      });

      if (pistas && Array.isArray(pistas)) {
        await Promise.all(pistas.map(async (pista) => {
          await Pista.create({
            informacion_pista: pista,
            id_desafio: newDesafio.id_desafio
          });
        }));
      }

      if (documentosAyuda && Array.isArray(documentosAyuda)) {
        await Promise.all(documentosAyuda.map(async (doc) => {
          await DocumentoAyuda.create({
            informacion_vulnerabilidad: doc,
            id_desafio: newDesafio.id_desafio
          });
        }));
      }

      if (documentosPrevencion && Array.isArray(documentosPrevencion)) {
        await Promise.all(documentosPrevencion.map(async (doc) => {
          await DocumentoPrevencion.create({
            informacion_prevencion: doc,
            id_desafio: newDesafio.id_desafio
          });
        }));
      }

      res.status(201).json({
        message: 'Challenge created successfully.',
        challenge: {
          id_desafio: newDesafio.id_desafio,
          descripcion_desafio: newDesafio.descripcion_desafio,
          solucion_desafio: newDesafio.solucion_desafio,
          nivel_dificultad: newDesafio.nivel_dificultad,
          id_fase: newDesafio.id_fase,
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

exports.updateDesafio = [
  verifyAdmin,
  async (req, res) => {
    try {
      const { id_desafio, descripcion_desafio, solucion_desafio, nivel_dificultad, id_fase, pistas, documentosAyuda, documentosPrevencion } = req.body;

      if (!id_desafio) {
        return res.status(400).json({ message: 'Challenge ID is required.' });
      }

      const updatedData = {};
      if (descripcion_desafio) updatedData.descripcion_desafio = descripcion_desafio;
      if (solucion_desafio) updatedData.solucion_desafio = solucion_desafio;
      if (nivel_dificultad) updatedData.nivel_dificultad = nivel_dificultad;
      if (id_fase) updatedData.id_fase = id_fase;

      if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({ message: 'No fields to update.' });
      }

      await Desafio.update(updatedData, { where: { id_desafio: id_desafio } });

      if (pistas && Array.isArray(pistas)) {
        
        await Pista.destroy({ where: { id_desafio: id_desafio } });
        
        await Promise.all(pistas.map(async (pista) => {
          await Pista.create({
            informacion_pista: pista,
            id_desafio: id_desafio
          });
        }));
      }

      if (documentosAyuda && Array.isArray(documentosAyuda)) {
        
        await DocumentoAyuda.destroy({ where: { id_desafio: id_desafio } });
        
        await Promise.all(documentosAyuda.map(async (doc) => {
          await DocumentoAyuda.create({
            informacion_vulnerabilidad: doc,
            id_desafio: id_desafio
          });
        }));
      }

      if (documentosPrevencion && Array.isArray(documentosPrevencion)) {
        
        await DocumentoPrevencion.destroy({ where: { id_desafio: id_desafio } });
        
        await Promise.all(documentosPrevencion.map(async (doc) => {
          await DocumentoPrevencion.create({
            informacion_prevencion: doc,
            id_desafio: id_desafio
          });
        }));
      }

      const updatedDesafio = await Desafio.findOne({
        where: { id_desafio: id_desafio },
        include: [
          { model: Pista, attributes: ['id_pista', 'informacion_pista'] },
          { model: DocumentoAyuda, attributes: ['id_documento', 'informacion_vulnerabilidad'] },
          { model: DocumentoPrevencion, attributes: ['id_prevencion', 'informacion_prevencion'] }
        ]
      });

      res.status(200).json({
        message: 'Challenge updated successfully.',
        challenge: {
          id_desafio: updatedDesafio.id_desafio,
          descripcion_desafio: updatedDesafio.descripcion_desafio,
          solucion_desafio: updatedDesafio.solucion_desafio,
          nivel_dificultad: updatedDesafio.nivel_dificultad,
          id_fase: updatedDesafio.id_fase,
        }
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];

exports.deleteDesafio = [
  verifyAdmin,
  async (req, res) => {
    try {
      const { id_desafio } = req.params;

      if (!id_desafio) {
        return res.status(400).json({ message: 'Challenge ID is required.' });
      }

      await DocumentoAyuda.destroy({ where: { id_desafio: id_desafio } });
      await DocumentoPrevencion.destroy({ where: { id_desafio: id_desafio } });
      await Pista.destroy({ where: { id_desafio: id_desafio } }); 
      await Desafio.destroy({ where: { id_desafio: id_desafio } });

      res.status(200).json({ message: 'Challenge deleted successfully.' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];


exports.getAllDesafios = [
  verifyAdmin,
  async (req, res) => {
    try {
      const desafios = await Desafio.findAll({
        attributes: ['id_desafio', 'descripcion_desafio', 'solucion_desafio', 'nivel_dificultad', 'id_fase'],
        include: [
          {
            model: Pista,
            attributes: ['id_pista', 'informacion_pista']
          },
          {
            model: DocumentoAyuda,
            attributes: ['id_documento', 'informacion_vulnerabilidad']
          },
          {
            model: DocumentoPrevencion,
            attributes: ['id_prevencion', 'informacion_prevencion']
          }
        ]
      });
      res.status(200).json(desafios);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];


exports.getDesafioById = [
  verifyAdmin,
  async (req, res) => {
    try {
      const { id_desafio } = req.params;

      if (!id_desafio) {
        return res.status(400).json({ message: 'Challenge ID is required.' });
      }

      const desafio = await Desafio.findOne({
        where: { id_desafio: id_desafio },
        attributes: ['id_desafio', 'descripcion_desafio', 'solucion_desafio', 'nivel_dificultad', 'id_fase'],
        include: [
          { model: Pista, attributes: ['id_pista', 'informacion_pista'] },
          { model: DocumentoAyuda, attributes: ['id_documento', 'informacion_vulnerabilidad'] },
          { model: DocumentoPrevencion, attributes: ['id_prevencion', 'informacion_prevencion'] }
        ]
      });

      if (!desafio) {
        return res.status(404).json({ message: 'Challenge not found.' });
      }

      res.status(200).json(desafio);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];


exports.getAllFases = [
  verifyAdmin,
  async (req, res) => {
    try {
      const fases = await Fase.findAll({
        attributes: ['id_fase', 'nombre_fase', 'vulnerabilidad']
      });
      res.status(200).json(fases);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
];
