const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Fase = sequelize.define('Fase', {
  id_fase: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_fase: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vulnerabilidad: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: false,
  tableName: 'Fase'
});

module.exports = Fase;