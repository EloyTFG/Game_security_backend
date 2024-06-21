
const app = require('./app');
const PORT = process.env.PORT || 5000;
const sequelize = require('./config/config');

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
