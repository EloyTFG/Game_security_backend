const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Desafio = require('./desafioModel');

const DocumentoAyuda = sequelize.define('DocumentoAyuda', {
  id_documento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  informacion_vulnerabilidad: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  id_desafio: {
    type: DataTypes.INTEGER,
    references: {
      model: Desafio,
      key: 'id_desafio'
    }
  }
}, {
  timestamps: false,
  tableName: 'DocumentoAyuda'
});


module.exports = DocumentoAyuda;