
const mysql = require('mysql2');

const createTempDatabase = (userId) => {
  const tempDbName = `temp_db_${userId}_${Date.now()}`;
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      multipleStatements: true,
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
      password: 'root',
      multipleStatements: true,
    });

    connection.query(`DROP DATABASE ${dbName}`, (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};

const countUsers = (dbName) => {
  return new Promise((resolve, reject) => {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      multipleStatements: true,
      database: dbName,
    });

    connection.query('SELECT COUNT(*) as userCount FROM users', (err, results) => {
      if (err) return reject(err);
      resolve(results[0].userCount);
    });
  });
};

exports.startSqlInjectionChallenge = async (req, res) => {
  const { userId } = req.body;

  try {
    const tempDbName = await createTempDatabase(userId);

    const tempDbConnection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      multipleStatements: true,
      database: tempDbName,
    });

    tempDbConnection.query(`
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) NOT NULL,
        password VARCHAR(50) NOT NULL
      )`, (err) => {
      if (err) throw err;

      tempDbConnection.query(`
        INSERT INTO users (username, password) VALUES ('admin', 'password')`, async (err) => {
        if (err) throw err;

        const userCount = await countUsers(tempDbName);
        res.json({ message: 'Base de datos temporal creada y usuario insertado. ¡Empieza el desafío de SQL Injection!', dbName: tempDbName, userCount });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sqlInjectionChallenge = async (req, res) => {
  const { dbName, username, password } = req.body;

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    multipleStatements: true,
    database: dbName,
  });

  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  connection.query(query, async (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      const userCount = await countUsers(dbName);
      if (userCount >= 2) {
        await deleteTempDatabase(dbName);
        res.json({ message: '¡Felicidades, has completado el desafío! Se han encontrado 2 o más usuarios. El desafío ha terminado.' });
      } else {
        res.json({ message: '¡Felicidades, has completado el desafío! Pero aún no hay suficientes usuarios.' });
      }
    } else {
      res.status(401).json({ message: 'Credenciales inválidas' });
    }
  });
};

exports.endSqlInjectionChallenge = async (req, res) => {
  const { dbName } = req.body;

  try {
    await deleteTempDatabase(dbName);
    res.json({ message: 'Base de datos temporal eliminada con éxito.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUsers = (req, res) => {
  const { dbName } = req.params;

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    multipleStatements: true,
    database: dbName,
  });

  connection.connect((err) => {
    if (err) {
      return res.status(500).json({ message: 'Error de conexión a la base de datos', error: err.message });
    }

    connection.query('SELECT id, username FROM users', (err, results) => {
      if (err) {
        return res.status(500).json({ message: 'Error al obtener usuarios', error: err.message });
      }

      res.json({ users: results });
      connection.end(); 
    });
  });
};
