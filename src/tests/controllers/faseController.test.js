const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const faseController = require('../../controllers/faseController');
const Fase = require('../../models/faseModel');
const Desafio = require('../../models/desafioModel');


jest.mock('../../models/faseModel', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
}));

const app = express();
app.use(bodyParser.json());


app.get('/fases', faseController.getFasesWithDesafios);
app.get('/fases/:id_fase', faseController.getDesafiosByFaseId);

describe('Fase Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFasesWithDesafios', () => {
    it('should get all fases with desafios successfully', async () => {
      const fasesData = [
        { 
          id_fase: 1, 
          nombre_fase: 'Fase 1', 
          vulnerabilidad: 'XSS', 
          Desafios: [
            { id_desafio: 1, descripcion_desafio: 'Desafio 1', solucion_desafio: 'Solution 1', nivel_dificultad: 'Medio' }
          ] 
        }
      ];
      Fase.findAll.mockResolvedValue(fasesData);

      const res = await request(app).get('/fases').send();

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(fasesData);
    });

    it('should handle server errors', async () => {
      Fase.findAll.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/fases').send();

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toBe('Error retrieving data');
    });
  });

  describe('getDesafiosByFaseId', () => {
    it('should get desafios by fase ID successfully', async () => {
      const faseData = { 
        id_fase: 1, 
        nombre_fase: 'Fase 1', 
        vulnerabilidad: 'XSS', 
        Desafios: [
          { id_desafio: 1, descripcion_desafio: 'Desafio 1', solucion_desafio: 'Solution 1', nivel_dificultad: 'Medio' }
        ] 
      };
      Fase.findByPk.mockResolvedValue(faseData);

      const res = await request(app).get('/fases/1').send();

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({
        id_fase: 1,
        nombre_fase: 'Fase 1',
        vulnerabilidad: 'XSS',
        Desafios: [
          { id_desafio: 1, descripcion_desafio: 'Desafio 1', solucion_desafio: 'Solution 1', nivel_dificultad: 'Medio' }
        ]
      });
    });

    it('should return 404 if fase is not found', async () => {
      Fase.findByPk.mockResolvedValue(null);

      const res = await request(app).get('/fases/2').send();

      expect(res.statusCode).toEqual(404);
      expect(res.body.message).toBe('Fase not found');
    });

    it('should handle server errors', async () => {
      Fase.findByPk.mockRejectedValue(new Error('Database error'));

      const res = await request(app).get('/fases/3').send();

      expect(res.statusCode).toEqual(500);
      expect(res.body.message).toBe('Error retrieving data');
    });
  });
});
