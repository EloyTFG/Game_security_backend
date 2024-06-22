const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const desafioRoutes = require('../../routes/desafioRoutes');

// Mock de las dependencias y controladores
jest.mock('../../controllers/admindesafioController', () => ({
  createDesafio: jest.fn((req, res) => res.status(201).json({ message: 'Challenge created successfully.', challenge: req.body })),
  updateDesafio: jest.fn((req, res) => res.status(200).json({ message: 'Challenge updated successfully.', challenge: req.body })),
  deleteDesafio: jest.fn((req, res) => res.status(200).json({ message: 'Challenge deleted successfully.' })),
  getAllDesafios: jest.fn((req, res) => res.status(200).json([{ id_desafio: 1, descripcion_desafio: 'Challenge 1' }])),
  getDesafioById: jest.fn((req, res) => {
    const { id_desafio } = req.params;
    if (id_desafio === '1') {
      res.status(200).json({ id_desafio: 1, descripcion_desafio: 'Challenge 1' });
    } else {
      res.status(404).json({ message: 'Challenge not found.' });
    }
  }),
  getAllFases: jest.fn((req, res) => res.status(200).json([{ id_fase: 1, nombre_fase: 'Fase 1' }])),
}));

const app = express();
app.use(bodyParser.json());
app.use('/', desafioRoutes);

describe('Desafio Controller Tests', () => {
  it('should create a new desafio successfully', async () => {
    const res = await request(app)
      .post('/create')
      .send({ descripcion_desafio: 'New Challenge', solucion_desafio: 'Solution', nivel_dificultad: 'High', id_fase: 1 });

    expect(res.statusCode).toEqual(201);
    expect(res.body.message).toBe('Challenge created successfully.');
    expect(res.body.challenge.descripcion_desafio).toBe('New Challenge');
  });

  it('should update a desafio successfully', async () => {
    const res = await request(app)
      .put('/update-challenge/1')
      .send({ descripcion_desafio: 'Updated Challenge', solucion_desafio: 'Updated Solution', nivel_dificultad: 'Medium', id_fase: 2 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Challenge updated successfully.');
    expect(res.body.challenge.descripcion_desafio).toBe('Updated Challenge');
  });

  it('should delete a desafio successfully', async () => {
    const res = await request(app)
      .delete('/delete-challenge/1')
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Challenge deleted successfully.');
  });

  it('should get all desafios', async () => {
    const res = await request(app)
      .get('/challenges')
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([{ id_desafio: 1, descripcion_desafio: 'Challenge 1' }]);
  });

  it('should get desafio by ID', async () => {
    const res = await request(app)
      .get('/challenges/1')
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body.descripcion_desafio).toBe('Challenge 1');
  });

  it('should return 404 if desafio not found', async () => {
    const res = await request(app)
      .get('/challenges/999')
      .send();

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Challenge not found.');
  });

  it('should get all fases', async () => {
    const res = await request(app)
      .get('/fases')
      .send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual([{ id_fase: 1, nombre_fase: 'Fase 1' }]);
  });
});
