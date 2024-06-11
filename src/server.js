const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const createTempDatabase = (userId) => {
  const tempDbName = `temp_db_${userId}_${Date.now()}`;
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root'
    });

    connection.query(`CREATE DATABASE ${tempDbName}`, (err) => {
      if (err) return reject(err);
      resolve(tempDbName);
    });
  });
};

const deleteTempDatabase = (dbName) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root'
    });

    connection.query(`DROP DATABASE ${dbName}`, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

// Ruta para iniciar el desafío y crear la base de datos temporal
app.post('/api/challenges/start-sql-injection', async (req, res) => {
  const { userId } = req.body;

  try {
    const tempDbName = await createTempDatabase(userId);

    const tempDbConnection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      database: tempDbName
    });

    tempDbConnection.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(50) NOT NULL
      )`, (err) => {
      if (err) throw err;

      tempDbConnection.query(`
        INSERT INTO users (username, password) VALUES ('admin', 'password')`, (err) => {
        if (err) throw err;

        res.json({ message: 'Base de datos temporal creada y usuario insertado. ¡Empieza el desafío de SQL Injection!', dbName: tempDbName });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ruta para manejar el desafío de SQL Injection
app.post('/api/challenges/sql-injection', (req, res) => {
  const { dbName, username, password } = req.body;

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: dbName
  });

  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  connection.query(query, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json({ message: '¡Felicidades, has completado el desafío!' });
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  });
});

app.post('/api/challenges/end-sql-injection', async (req, res) => {
  const { dbName } = req.body;

  try {
    await deleteTempDatabase(dbName);
    res.json({ message: 'Base de datos temporal eliminada con éxito.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(6000, () => {
  console.log('Servidor de desafíos corriendo en el puerto 6000');
});
