const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarioModel');

exports.register = async (req, res) => {
  try {
    const { nombre_completo, nombre_usuario, fecha_nacimiento, correo_electronico, contraseña, id_rol } = req.body;

    const existingUser = await Usuario.findOne({ where: { correo_electronico } });
    if (existingUser) {
      return res.status(400).json({ message: 'Correo electrónico ya registrado.' });
    }

    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(contraseña, salt);

    const user = await Usuario.create({
      nombre_completo,
      nombre_usuario,
      fecha_nacimiento,
      correo_electronico,
      contraseña: hashedPassword,
      id_rol: "2",
    });

    const token = jwt.sign({ id: user.id_usuario }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ 
      auth: true, 
      token, 
      user: { 
        id: user.id_usuario, 
        nombre_completo: user.nombre_completo, 
        correo_electronico: user.correo_electronico,
        nombre_usuario: user.nombre_usuario,
        id_rol: user.id_rol
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id, nombre_completo, nombre_usuario, correo_electronico, contraseña, currentPassword } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.id !== id) {
      return res.status(403).json({ message: 'You are not authorized to update this user.' });
    }

    const user = await Usuario.findOne({ where: { id_usuario: id } });

    if (!bcrypt.compareSync(currentPassword, user.contraseña)) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    const updatedData = {};
    if (nombre_completo) updatedData.nombre_completo = nombre_completo;
    if (nombre_usuario) updatedData.nombre_usuario = nombre_usuario;
    if (correo_electronico) updatedData.correo_electronico = correo_electronico;
    if (contraseña) {
      const salt = bcrypt.genSaltSync(12);
      updatedData.contraseña = bcrypt.hashSync(contraseña, salt);
    }

    await Usuario.update(updatedData, { where: { id_usuario: id } });

    const updatedUser = await Usuario.findOne({ where: { id_usuario: id } });

    const newToken = jwt.sign({ id: updatedUser.id_usuario }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({
      auth: true,
      token: newToken,
      user: {
        id: updatedUser.id_usuario,
        nombre_completo: updatedUser.nombre_completo,
        nombre_usuario: updatedUser.nombre_usuario,
        correo_electronico: updatedUser.correo_electronico,
        id_rol: updatedUser.id_rol
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo_electronico, contraseña } = req.body;

    const user = await Usuario.findOne({ where: { correo_electronico } });

    if (!user || !bcrypt.compareSync(contraseña, user.contraseña)) {
      return res.status(401).json({ auth: false, token: null, message: 'Correo electrónico o contraseña incorrectos.' });
    }

    const token = jwt.sign({ id: user.id_usuario }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ 
      auth: true, 
      token, 
      user: { 
        id: user.id_usuario, 
        nombre_completo: user.nombre_completo, 
        correo_electronico: user.correo_electronico,
        nombre_usuario: user.nombre_usuario,
        id_rol: user.id_rol
      } 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
