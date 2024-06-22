const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('../../routes/userRoutes'); 
const Usuario = require('../../models/usuarioModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


jest.mock('../../models/usuarioModel', () => ({
  findOne: jest.fn(),
  create: jest.fn(),
  update: jest.fn()
}));

jest.mock('jsonwebtoken', () => ({
  sign: jest.fn(),
  verify: jest.fn()
}));

jest.mock('bcryptjs', () => ({
  genSaltSync: jest.fn().mockReturnValue('salt'),
  hashSync: jest.fn().mockReturnValue('hashed_password'),
  compareSync: jest.fn().mockReturnValue(true)
}));

const app = express();
app.use(bodyParser.json());
app.use('/', authRoutes);

describe('Auth Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should register a new user successfully', async () => {
    Usuario.findOne.mockResolvedValue(null);
    Usuario.create.mockResolvedValue({
      id_usuario: 1,
      nombre_completo: 'Test User',
      nombre_usuario: 'testuser',
      correo_electronico: 'testuser@example.com',
      id_rol: 2
    });
    jwt.sign.mockReturnValue('testtoken');

    const res = await request(app)
      .post('/register')
      .send({
        nombre_completo: 'Test User',
        nombre_usuario: 'testuser',
        fecha_nacimiento: '1990-01-01',
        correo_electronico: 'testuser@example.com',
        contraseña: 'password123',
        id_rol: 2
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body.auth).toBe(true);
    expect(res.body.token).toBe('testtoken');
    expect(res.body.user.nombre_completo).toBe('Test User');
  });

  it('should not register a user with existing email', async () => {
    Usuario.findOne.mockResolvedValue({ id_usuario: 1 });

    const res = await request(app)
      .post('/register')
      .send({
        nombre_completo: 'Test User',
        nombre_usuario: 'testuser',
        fecha_nacimiento: '1990-01-01',
        correo_electronico: 'testuser@example.com',
        contraseña: 'password123',
        id_rol: 2
      });

    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Correo electrónico ya registrado.');
  });

  it('should login successfully with correct credentials', async () => {
    Usuario.findOne.mockResolvedValue({
      id_usuario: 1,
      nombre_completo: 'Test User',
      nombre_usuario: 'testuser',
      correo_electronico: 'testuser@example.com',
      contraseña: 'hashed_password',
      id_rol: 2
    });
    jwt.sign.mockReturnValue('testtoken');
    bcrypt.compareSync.mockReturnValue(true);

    const res = await request(app)
      .post('/login')
      .send({
        correo_electronico: 'testuser@example.com',
        contraseña: 'password123'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.auth).toBe(true);
    expect(res.body.token).toBe('testtoken');
    expect(res.body.user.nombre_completo).toBe('Test User');
  });

  it('should not login with incorrect credentials', async () => {
    Usuario.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/login')
      .send({
        correo_electronico: 'wrong@example.com',
        contraseña: 'wrongpassword'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Correo electrónico o contraseña incorrectos.');
  });

  
  it('should not update a user with incorrect current password', async () => {
    Usuario.findOne.mockResolvedValue({
      id_usuario: 1,
      nombre_completo: 'Old User',
      nombre_usuario: 'olduser',
      correo_electronico: 'olduser@example.com',
      contraseña: 'hashed_password',
      id_rol: 2
    });
    jwt.verify.mockReturnValue({ id: 1 });
    bcrypt.compareSync.mockReturnValue(false);

    const res = await request(app)
      .put('/update')
      .set('Authorization', 'Bearer oldtoken')
      .send({
        id: 1,
        nombre_completo: 'New User',
        nombre_usuario: 'newuser',
        correo_electronico: 'newuser@example.com',
        contraseña: 'newpassword',
        currentPassword: 'wrongpassword'
      });

    expect(res.statusCode).toEqual(401);
    expect(res.body.message).toBe('Incorrect current password.');
  });

  it('should not update a user if unauthorized', async () => {
    Usuario.findOne.mockResolvedValue({
      id_usuario: 2,
      nombre_completo: 'Other User',
      nombre_usuario: 'otheruser',
      correo_electronico: 'otheruser@example.com',
      contraseña: 'hashed_password',
      id_rol: 2
    });
    jwt.verify.mockReturnValue({ id: 2 });

    const res = await request(app)
      .put('/update')
      .set('Authorization', 'Bearer othertoken')
      .send({
        id: 1,
        nombre_completo: 'New User',
        nombre_usuario: 'newuser',
        correo_electronico: 'newuser@example.com',
        contraseña: 'newpassword',
        currentPassword: 'password123'
      });

    expect(res.statusCode).toEqual(403);
    expect(res.body.message).toBe('You are not authorized to update this user.');
  });
});
