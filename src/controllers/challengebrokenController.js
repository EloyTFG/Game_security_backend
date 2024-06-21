
const mysql = require('mysql2');

const createTempDatabase = (userId, challengeType) => {
  const tempDbName = `temp_db_${userId}_${challengeType}_${Date.now()}`;
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

exports.startBrokenAccessControlChallenge = async (req, res) => {
  const { userId } = req.body;

  try {
    const tempDbName = await createTempDatabase(userId, 'broken_access_control');

    const tempDbConnection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'root',
      multipleStatements: true,
      database: tempDbName
    });

    tempDbConnection.query(`
      CREATE TABLE permissions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_role VARCHAR(50) NOT NULL,
        resource VARCHAR(50) NOT NULL
      )`, (err) => {
      if (err) throw err;

      tempDbConnection.query(`
        INSERT INTO permissions (user_role, resource) VALUES ('admin', 'admin_section'), ('user', 'user_data')`, (err) => {
        if (err) throw err;

        res.json({ message: 'Base de datos temporal creada con roles y permisos. ¡Empieza el desafío de Broken Access Control!', dbName: tempDbName });
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkAccess = (req, res) => {
  const { dbName, resource } = req.body;
  const userRole = 'user'; 

  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    multipleStatements: true,
    database: dbName
  });

  const query = `SELECT * FROM permissions WHERE user_role = '${userRole}' AND resource = '${resource}'`;

  connection.query(query, (err, results) => {
    if (err) throw err;
    if (results.length > 0) {
      res.json({ message: `¡Acceso permitido a ${resource}!` });
    } else {
      res.status(403).json({ message: 'Acceso denegado' });
    }
  });
};

exports.endBrokenAccessControlChallenge = async (req, res) => {
  const { dbName } = req.body;

  try {
    await deleteTempDatabase(dbName);
    res.json({ message: 'Base de datos temporal eliminada con éxito.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
