const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Fase = require('./faseModel');

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
      key: 'id_fase'
    }
  }
}, {
  timestamps: false,
  tableName: 'Desafio'
});

Desafio.belongsTo(Fase, { foreignKey: 'id_fase' });

module.exports = Desafio;