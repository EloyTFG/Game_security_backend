const sequelize = require('../config/config'); // Asegúrate de que la ruta es correcta
const Usuario = require('./usuarioModel');
const Progreso = require('./progresoModel');
const Logro = require('./logroModel');
const Rol = require('./rolModel');
const Fase = require('./faseModel'); 
const Pista = require('./pistaModel'); 
const DocumentoAyuda = require('./documentoAyudaModel'); 
const DocumentoPrevencion = require('./documentoPrevencionModel');
const Desafio = require('./desafioModel'); 

// Definir relaciones
Usuario.belongsTo(Rol, { foreignKey: 'id_rol', as: 'rol' });
Usuario.hasMany(Progreso, { foreignKey: 'id_usuario', as: 'progresos' });
Usuario.hasMany(Logro, { foreignKey: 'id_usuario', as: 'logros' });



Fase.hasMany(Desafio, { foreignKey: 'id_fase' });
Desafio.belongsTo(Fase, { foreignKey: 'id_fase' });

Desafio.hasMany(Pista, { foreignKey: 'id_desafio' });
Pista.belongsTo(Desafio, { foreignKey: 'id_desafio' });

Desafio.hasMany(DocumentoAyuda, { foreignKey: 'id_desafio' });
DocumentoAyuda.belongsTo(Desafio, { foreignKey: 'id_desafio' });

Desafio.hasMany(DocumentoPrevencion, { foreignKey: 'id_desafio' });
DocumentoPrevencion.belongsTo(Desafio, { foreignKey: 'id_desafio' });



module.exports = {
  Usuario,
  Progreso,
  Logro,
  Rol,
  Fase,
  Pista,
  DocumentoAyuda,
  DocumentoPrevencion,
  Desafio,
  sequelize,
};
