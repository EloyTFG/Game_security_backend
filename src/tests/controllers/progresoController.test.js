const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const progresoController = require('../../controllers/progresoController');
const Progreso = require('../../models/progresoModel');
const Usuario = require('../../models/usuarioModel');
const Desafio = require('../../models/desafioModel');


jest.mock('../../models/progresoModel');
jest.mock('../../models/usuarioModel');
jest.mock('../../models/desafioModel');

const app = express();
app.use(bodyParser.json());


app.post('/progreso', progresoController.createProgreso);

describe('Progreso Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createProgreso', () => {
    it('should create a new progreso successfully', async () => {
      Usuario.findByPk.mockResolvedValue({ id_usuario: 1 });
      Desafio.findByPk.mockResolvedValue({ id_desafio: 1 });
      Progreso.create.mockResolvedValue({
        id_usuario: 1,
        id_desafio: 1,
        puntuacion: 100,
        tiempo_invertido: '1h'
      });

      const res = await request(app)
        .post('/progreso')
        .send({
          id_usuario: 1,
          id_desafio: 1,
          puntuacion: 100,
          tiempo_invertido: '1h'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual({
        id_usuario: 1,
        id_desafio: 1,
        puntuacion: 100,
        tiempo_invertido: '1h'
      });
    });

    it('should return 404 if user is not found', async () => {
      Usuario.findByPk.mockResolvedValue(null);
      Desafio.findByPk.mockResolvedValue({ id_desafio: 1 });

      const res = await request(app)
        .post('/progreso')
        .send({
          id_usuario: 2,
          id_desafio: 1,
          puntuacion: 100,
          tiempo_invertido: '1h'
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('Usuario o Desafío no encontrados');
    });

    it('should return 404 if desafio is not found', async () => {
      Usuario.findByPk.mockResolvedValue({ id_usuario: 1 });
      Desafio.findByPk.mockResolvedValue(null);

      const res = await request(app)
        .post('/progreso')
        .send({
          id_usuario: 1,
          id_desafio: 2,
          puntuacion: 100,
          tiempo_invertido: '1h'
        });

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('Usuario o Desafío no encontrados');
    });

    it('should handle server errors', async () => {
      Usuario.findByPk.mockRejectedValue(new Error('Database error'));
      Desafio.findByPk.mockResolvedValue({ id_desafio: 1 });

      const res = await request(app)
        .post('/progreso')
        .send({
          id_usuario: 1,
          id_desafio: 1,
          puntuacion: 100,
          tiempo_invertido: '1h'
        });

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toBe('Error creating Progreso');
    });
  });
});
