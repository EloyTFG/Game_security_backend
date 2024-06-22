// tests/adminRoutes.test.js
const request = require('supertest');
const express = require('express');
const adminRoutes = require('../../routes/adminRoutes'); // Actualiza la ruta si es diferente

// Mock de los controladores
jest.mock('../../controllers/adminController', () => ({
  updateUser: jest.fn((req, res) => res.status(200).send({ message: 'User updated successfully' })),
  deleteUser: jest.fn((req, res) => res.status(200).send({ message: 'User deleted successfully' })),
  getAllUsers: jest.fn((req, res) => res.status(200).send([{ id: 1, name: 'Test User' }])),
  getUserById: jest.fn((req, res) => res.status(200).send({ id: req.params.id_usuario, name: 'Test User' })),
}));

const app = express();
app.use(express.json()); // Middleware para parsear JSON
app.use('/admin-api', adminRoutes);

describe('Admin Routes', () => {
  it('should update user', async () => {
    const response = await request(app)
      .put('/admin-api/update/1')
      .send({ name: 'Updated User' });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User updated successfully');
  });

  it('should delete user', async () => {
    const response = await request(app)
      .delete('/admin-api/delete/1');

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('User deleted successfully');
  });

  it('should get all users', async () => {
    const response = await request(app)
      .get('/admin-api/users');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body.length).toBeGreaterThan(0);
  });

  it('should get user by id', async () => {
    const response = await request(app)
      .get('/admin-api/users/1');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.objectContaining({ id: '1' }));
  });
});
