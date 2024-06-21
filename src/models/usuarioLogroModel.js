const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Usuario = require('./usuarioModel');
const Logro = require('./logroModel');

const Usuario_Logro = sequelize.define('Usuario_Logro', {
  id_usuario: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  },
  id_logro: {
    type: DataTypes.INTEGER,
    references: {
      model: Logro,
      key: 'id_logro'
    }
  }
}, {
  timestamps: false,
  tableName: 'Usuario_Logro'
});

Usuario.belongsToMany(Logro, { through: Usuario_Logro, foreignKey: 'id_usuario' });

module.exports = Usuario_Logro;