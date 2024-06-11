const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuarioModel');

exports.register = async (req, res) => {
  try {
    const { nombre_completo, nombre_usuario, fecha_nacimiento, correo_electronico, contraseña, id_rol } = req.body;

    const hashedPassword = bcrypt.hashSync(contraseña, 8);

    const user = await Usuario.create({
      nombre_completo,
      nombre_usuario,
      fecha_nacimiento,
      correo_electronico,
      contraseña: hashedPassword,
      id_rol,
    });

    const token = jwt.sign({ id: user.id_usuario }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ auth: true, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { correo_electronico, contraseña } = req.body;

    const user = await Usuario.findOne({ where: { correo_electronico } });

    if (!user || !bcrypt.compareSync(contraseña, user.contraseña)) {
      return res.status(401).json({ auth: false, token: null });
    }

    const token = jwt.sign({ id: user.id_usuario }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(200).json({ auth: true, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
