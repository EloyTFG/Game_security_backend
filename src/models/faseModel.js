
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/config');

class Fase extends Model {}

Fase.init({
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
  sequelize,
  modelName: 'Fase',
  tableName: 'Fase',
  timestamps: false,
});

module.exports = Fase;
