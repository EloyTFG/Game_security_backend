const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Desafio = require('./desafioModel');

const DocumentoPrevencion = sequelize.define('DocumentoPrevencion', {
  id_prevencion: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  informacion_prevencion: {
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
  tableName: 'DocumentoPrevencion'
});

DocumentoPrevencion.belongsTo(Desafio, { foreignKey: 'id_desafio' });

module.exports = DocumentoPrevencion;