// src/app.js
const express = require('express');

const sequelize = require('./config/config');
const cors = require('cors');
const bodyParser = require('body-parser');
const deleteTempDatabases = require('./controllers/cleanupController');

// Importar modelos
const Usuario = require('./models/usuarioModel');
const Rol = require('./models/rolModel');
const Fase = require('./models/faseModel');

const DocumentoAyuda = require('./models/documentoAyudaModel');
const DocumentoPrevencion = require('./models/documentoPrevencionModel');
const Pista = require('./models/pistaModel');
const Logro = require('./models/logroModel');
const Progreso = require('./models/progresoModel');
const Desafio = require('./models/desafioModel');
const Usuario_Logro = require('./models/usuarioLogroModel');

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const challengeRoutes = require('./routes/challengeRoutes');
const faseRoutes = require('./routes/fases_desaRoutes');
const adminRoutes = require('./routes/adminRoutes');
const desafioRoutes = require('./routes/desafioRoutes');
const topRoutes = require('./routes/topRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Usar rutas
app.use('/api/challenges', challengeRoutes);
app.use('/api/users', userRoutes);
app.use('/api', faseRoutes);
app.use('/api', topRoutes);
app.use('/admin-api', adminRoutes);
app.use('/admin-api', desafioRoutes);

// Conectar a MySQL 
sequelize.sync()
  .then(() => {
    console.log('MySQL conectado y modelos sincronizados');
  })
  .catch(err => {
    console.error('Error al sincronizar modelos:', err);
  });

// Limpieza de bases de datos temporales
deleteTempDatabases()
  .then(() => console.log('Limpieza de bases de datos temporales completada'))
  .catch(err => console.error('Error durante la limpieza de bases de datos temporales:', err));

module.exports = app;
