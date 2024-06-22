const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const documentoPrevencionController = require('../../controllers/documentoprevencionController');
const DocumentoPrevencion = require('../../models/documentoPrevencionModel');

// Mock de los modelos
jest.mock('../../models/documentoPrevencionModel', () => ({
  findAll: jest.fn(),
}));

const app = express();
app.use(bodyParser.json());

// Definimos una ruta de prueba que usa el controlador
app.get('/desafio/:id_desafio/documentosprevencion', documentoPrevencionController.getDocumentosByDesafioId);

describe('Documento Prevencion Controller Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get documents by desafio ID successfully', async () => {
    const documentosData = [
      { id_documento: 1, informacion_prevencion: 'Documento Prevencion 1', id_desafio: 1 },
      { id_documento: 2, informacion_prevencion: 'Documento Prevencion 2', id_desafio: 1 }
    ];
    DocumentoPrevencion.findAll.mockResolvedValue(documentosData);

    const res = await request(app).get('/desafio/1/documentosprevencion').send();

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(documentosData);
  });

  it('should return 404 if no documents are found', async () => {
    DocumentoPrevencion.findAll.mockResolvedValue([]);

    const res = await request(app).get('/desafio/2/documentosprevencion').send();

    expect(res.statusCode).toEqual(404);
    expect(res.body.error).toBe('No se encontraron documentos para este desafío.');
  });

  it('should handle server errors', async () => {
    DocumentoPrevencion.findAll.mockRejectedValue(new Error('Database error'));

    const res = await request(app).get('/desafio/3/documentosprevencion').send();

    expect(res.statusCode).toEqual(500);
    expect(res.body.error).toBe('Error al obtener los documentos.');
  });
});
