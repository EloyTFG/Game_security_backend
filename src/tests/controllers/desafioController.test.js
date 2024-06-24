const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const desafioController = require('../../controllers/desafioController');
const Desafio = require('../../models/desafioModel');
const Pista = require('../../models/pistaModel');


jest.mock('../../models/desafioModel', () => ({
  findByPk: jest.fn(),
}));

jest.mock('../../models/pistaModel', () => ({
  findAll: jest.fn(),
}));

const app = express();
app.use(bodyParser.json());


app.get('/challenge/:id_desafio', desafioController.getDesafioById);

describe('Desafio Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get desafio by ID successfully', async () => {
    const desafioData = {
      id_desafio: 1,
      descripcion_desafio: 'Test Challenge',
      pistas: [
        { id_pista: 1, informacion_pista: 'Hint 1' },
        { id_pista: 2, informacion_pista: 'Hint 2' }
      ]
    };
    Desafio.findByPk.mockResolvedValue({
      ...desafioData,
      toJSON: () => desafioData,
      include: [Pista]
    });

    const res = await request(app).get('/challenge/1').send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(desafioData);
  });

  it('should return 404 if desafio is not found', async () => {
    Desafio.findByPk.mockResolvedValue(null);

    const res = await request(app).get('/challenge/2').send();

    expect(res.statusCode).toEqual(404);
    expect(res.body.message).toBe('Desafio not found');
  });

  it('should handle server errors', async () => {
    Desafio.findByPk.mockRejectedValue(new Error('Database error'));

    const res = await request(app).get('/challenge/3').send();

    expect(res.statusCode).toEqual(500);
    expect(res.body.message).toBe('Error retrieving data');
    expect(res.body.error).toBe('Database error');
  });
});
