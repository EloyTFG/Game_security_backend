const express = require('express');
const sequelize = require('./config/config');
const Usuario = require('./models/usuarioModel');
const Rol = require('./models/rolModel');
const Fase = require('./models/faseModel');
const Desafio = require('./models/desafioModel');
const Pista = require('./models/pistaModel');
const DocumentoAyuda = require('./models/documentoAyudaModel');
const DocumentoPrevencion = require('./models/documentoPrevencionModel');
const Logro = require('./models/logroModel');
const Progreso = require('./models/progresoModel');
const Usuario_Logro = require('./models/usuarioLogroModel');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const deleteTempDatabases = require('./controllers/cleanupController');

console.log(PORT)
app.use(cors());
app.use(express.json());

// Importar rutas
const userRoutes = require('./routes/userRoutes');
const challengeRoutes = require('./routes/challengeRoutes');

deleteTempDatabases()
  .then(() => console.log('Limpieza de bases de datos temporales completada'))
  .catch(err => console.error('Error durante la limpieza de bases de datos temporales:', err));

  
// Usar rutas
app.use('/api/challenges', challengeRoutes);
app.use('/api/users', userRoutes);

// Conectar a MySQL y sincronizar modelos
sequelize.sync()
  .then(() => console.log('MySQL conectado y modelos sincronizados'))
  .catch(err => console.log(err));

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
