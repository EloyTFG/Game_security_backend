const { connection, executeQuery } = require('./database');

// Example: Insert a new user
const addUser = async () => {
  const query = `
    INSERT INTO Usuario (nombre_completo, nombre_usuario, fecha_nacimiento, correo_electronico, contraseña, id_rol)
    VALUES (?, ?, ?, ?, ?, ?)
  `;
  const params = [
    'Juan Pérez', 
    'juanp', 
    '1990-01-01', 
    'juan.perez@example.com', 
    '1234password', 
    1 // Assuming role id 1 exists
  ];

  try {
    const result = await executeQuery(query, params);
    console.log('User added with ID:', result.insertId);
  } catch (error) {
    console.error('Error adding user:', error);
  }
};

// Example: Fetch all users
const fetchUsers = async () => {
  const query = 'SELECT * FROM Usuario';
  try {
    const users = await executeQuery(query);
    console.log('Users:', users);
  } catch (error) {
    console.error('Error fetching users:', error);
  }
};

// Use the functions
addUser();
fetchUsers();
process.on('exit', () => {
    connection.end(error => {
      if (error) {
        console.error('Error closing the database connection:', error.stack);
      } else {
        console.log('Database connection closed.');
      }
    });
  });
  