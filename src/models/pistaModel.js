const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Desafio = require('./desafioModel');

const Pista = sequelize.define('Pista', {
  id_pista: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  informacion_pista: {
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
  tableName: 'Pista'
});


module.exports = Pista;