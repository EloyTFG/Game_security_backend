const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Usuario = require('./usuarioModel');
const Desafio = require('./desafioModel');

const Progreso = sequelize.define('Progreso', {
  id_progreso: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  id_usuario: {
    type: DataTypes.INTEGER,
    references: {
      model: Usuario,
      key: 'id_usuario'
    }
  },
  id_desafio: {
    type: DataTypes.INTEGER,
    references: {
      model: Desafio,
      key: 'id_desafio'
    }
  },
  puntuacion: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  tiempo_invertido: {
    type: DataTypes.TIME,
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'Progreso'
});

Progreso.belongsTo(Usuario, { foreignKey: 'id_usuario' });
Progreso.belongsTo(Desafio, { foreignKey: 'id_desafio' });

module.exports = Progreso;