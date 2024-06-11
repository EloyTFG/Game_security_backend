const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Logro = sequelize.define('Logro', {
  id_logro: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_logro: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  condicion_obtencion: {
    type: DataTypes.TEXT,
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'Logro'
});

module.exports = Logro;