const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Rol = sequelize.define('Rol', {
  id_rol: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_rol: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descripcion_rol: {
    type: DataTypes.STRING,
  },
}, {
  timestamps: false,
  tableName: 'Rol'
});

module.exports = Rol;