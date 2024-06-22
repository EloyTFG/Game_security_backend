const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const documentoAyudaController = require('../../controllers/documentoayudaController');
const DocumentoAyuda = require('../../models/documentoAyudaModel');

// Mock de los modelos
jest.mock('../../models/documentoAyudaModel', () => ({
  findAll: jest.fn(),
}));

const app = express();
app.use(bodyParser.json());

// Definimos una ruta de prueba que usa el controlador
app.get('/desafio/:id_desafio/documentosayuda', documentoAyudaController.getDocumentosByDesafioId);

describe('Documento Ayuda Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get documents by desafio ID successfully', async () => {
    const documentosData = [
      { id_documento: 1, informacion_vulnerabilidad: 'Documento 1', id_desafio: 1 },
      { id_documento: 2, informacion_vulnerabilidad: 'Documento 2', id_desafio: 1 }
    ];
    DocumentoAyuda.findAll.mockResolvedValue(documentosData);

    const res = await request(app).get('/desafio/1/documentosayuda').send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(documentosData);
  });

  it('should return 404 if no documents are found', async () => {
    DocumentoAyuda.findAll.mockResolvedValue([]);

    const res = await request(app).get('/desafio/2/documentosayuda').send();

    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toBe('No se encontraron documentos para este desafío.');
  });

  it('should handle server errors', async () => {
    DocumentoAyuda.findAll.mockRejectedValue(new Error('Database error'));

    const res = await request(app).get('/desafio/3/documentosayuda').send();

    expect(res.statusCode).toEqual(500);
    expect(res.body.error).toBe('Error al obtener los documentos.');
  });
});
