// src/models/desafioModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Fase = require('./faseModel'); // Importa Fase después de haber sido definido
const Pista = require('./pistaModel'); // Importa Fase después de haber sido definido
const DocumentoAyuda = require('./documentoAyudaModel'); // Importa Fase después de haber sido definido
const DocumentoPrevencion = require('./documentoPrevencionModel'); // Importa Fase después de haber sido definido

const Desafio = sequelize.define('Desafio', {
  id_desafio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  descripcion_desafio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  solucion_desafio: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  nivel_dificultad: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_fase: {
    type: DataTypes.INTEGER,
    references: {
      model: Fase,
      key: 'id_fase',
    },
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'Desafio',
});

Desafio.belongsTo(Fase, { foreignKey: 'id_fase' });
Fase.hasMany(Desafio, { foreignKey: 'id_fase' });
Desafio.hasMany(Pista, { foreignKey: 'id_desafio' });
Desafio.hasMany(DocumentoAyuda, { foreignKey: 'id_desafio' });
Desafio.hasMany(DocumentoPrevencion, { foreignKey: 'id_desafio' });

module.exports = Desafio;
