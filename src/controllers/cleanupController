// cleanup.js
const mysql = require('mysql2');

const deleteTempDatabases = async () => {
  const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    multipleStatements: true,
  });

  connection.connect(err => {
    if (err) {
      console.error('Error al conectar a la base de datos:', err.message);
      return;
    }

    connection.query("SHOW DATABASES LIKE 'temp_db_%'", (err, results) => {
      if (err) {
        console.error('Error al obtener bases de datos:', err.message);
        connection.end();
        return;
      }

      const databases = results.map(row => Object.values(row)[0]);
      if (databases.length === 0) {
        console.log('No se encontraron bases de datos temporales para eliminar.');
        connection.end();
        return;
      }

      const deleteQueries = databases.map(db => `DROP DATABASE ${db}`).join('; ');
      connection.query(deleteQueries, (err) => {
        if (err) {
          console.error('Error al eliminar bases de datos:', err.message);
        } else {
          console.log('Bases de datos temporales eliminadas con éxito.');
        }
        connection.end();
      });
    });
  });
};

module.exports = deleteTempDatabases;
