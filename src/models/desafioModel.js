
const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const Fase = require('./faseModel'); 
const Pista = require('./pistaModel'); 
const DocumentoAyuda = require('./documentoAyudaModel'); 
const DocumentoPrevencion = require('./documentoPrevencionModel');
const Progreso = require('./progresoModel');  

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
      key: 'id_fase',
    },
    allowNull: false,
  }
}, {
  timestamps: false,
  tableName: 'Desafio',
});

Fase.hasMany(Desafio, { foreignKey: 'id_fase' });

Desafio.hasMany(Pista, { foreignKey: 'id_desafio' });
Pista.belongsTo(Desafio, { foreignKey: 'id_desafio' });

Desafio.hasMany(DocumentoAyuda, { foreignKey: 'id_desafio' });
DocumentoAyuda.belongsTo(Desafio, { foreignKey: 'id_desafio' });

Desafio.hasMany(DocumentoPrevencion, { foreignKey: 'id_desafio' });
DocumentoPrevencion.belongsTo(Desafio, { foreignKey: 'id_desafio' });

module.exports = Desafio;
