const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Rol = require('./rolModel');

const Usuario = sequelize.define('Usuario', {
  id_usuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nombre_completo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  nombre_usuario: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  fecha_nacimiento: {
    type: DataTypes.DATE,
  },
  correo_electronico: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  contraseña: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  id_rol: {
    type: DataTypes.INTEGER,
    references: {
      model: Rol,
      key: 'id_rol'
    }
  }
}, {
  timestamps: false,
  tableName: 'Usuario'
});

Usuario.belongsTo(Rol, { foreignKey: 'id_rol' });

module.exports = Usuario;