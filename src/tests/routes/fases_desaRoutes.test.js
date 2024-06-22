const request = require('supertest');
const express = require('express');
const faseRoutes = require('../../routes/fases_desaRoutes');


jest.mock('../../controllers/faseController', () => ({
  getFasesWithDesafios: jest.fn((req, res) => res.status(200).json([{ id: 1, name: 'Fase 1' }])),
  getDesafiosByFaseId: jest.fn((req, res) => res.status(200).json([{ id: 1, name: 'Desafio 1', faseId: '1' }])),
}));

jest.mock('../../controllers/documentoayudaController', () => ({
  getDocumentosByDesafioId: jest.fn((req, res) => res.status(200).json([{ id: 1, title: 'Documento Ayuda' }])),
}));

jest.mock('../../controllers/documentoprevencionController', () => ({
  getDocumentosByDesafioId: jest.fn((req, res) => res.status(200).json([{ id: 1, title: 'Documento Prevención' }])),
}));

jest.mock('../../controllers/progresoController', () => ({
  createProgreso: jest.fn((req, res) => res.status(201).json({ message: 'Progreso created successfully' })),
}));

jest.mock('../../controllers/desafioController', () => ({
  getDesafioById: jest.fn((req, res) => res.status(200).json({ id: '1', name: 'Desafio 1' })),
}));


const app = express();
app.use(express.json());
app.use('/', faseRoutes);

describe('Fase Routes', () => {
  it('should get all fases with desafios', async () => {
    const res = await request(app)
      .get('/fases')
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: 'Fase 1' }]);
  });

  it('should get desafios by fase ID', async () => {
    const res = await request(app)
      .get('/fases/1')
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: 'Desafio 1', faseId: '1' }]);
  });

  it('should get desafio by ID', async () => {
    const res = await request(app)
      .get('/challenge/1')
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: '1', name: 'Desafio 1' });
  });

  it('should get documentos de ayuda by desafio ID', async () => {
    const res = await request(app)
      .get('/desafio/1/documentosayuda')
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, title: 'Documento Ayuda' }]);
  });

  it('should get documentos de prevención by desafio ID', async () => {
    const res = await request(app)
      .get('/desafio/1/documentosprevencion')
      .send();

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, title: 'Documento Prevención' }]);
  });

  it('should create a new progreso', async () => {
    const res = await request(app)
      .post('/progreso')
      .send({ progress: 'Test progress' });

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Progreso created successfully');
  });
});
