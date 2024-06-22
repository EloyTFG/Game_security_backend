// src/tests/routes/desafioRoutes.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const desafioRoutes = require('../../routes/desafioRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/api', desafioRoutes);

// Mock de los controladores
jest.mock('../../controllers/admindesafioController', () => ({
    createDesafio: (req, res) => res.status(201).json({ message: 'Desafio created successfully' }),
    updateDesafio: (req, res) => res.status(200).json({ message: 'Desafio updated successfully' }),
    deleteDesafio: (req, res) => res.status(200).json({ message: 'Desafio deleted successfully' }),
    getAllDesafios: (req, res) => res.status(200).json([{ id: 1, name: 'Desafio 1' }]),
    getDesafioById: (req, res) => res.status(200).json({ id: req.params.id_desafio, name: 'Desafio 1' }),
    getAllFases: (req, res) => res.status(200).json([{ id: 1, name: 'Fase 1' }])
}));

describe('Desafio Routes', () => {
    it('should create a new desafio', async () => {
        const res = await request(app)
            .post('/api/create')
            .send({ name: 'New Desafio' });

        expect(res.status).toBe(201);
        expect(res.body.message).toBe('Desafio created successfully');
    });

    it('should update an existing desafio', async () => {
        const res = await request(app)
            .put('/api/update-challenge/1')
            .send({ name: 'Updated Desafio' });

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Desafio updated successfully');
    });

    it('should delete an existing desafio', async () => {
        const res = await request(app)
            .delete('/api/delete-challenge/1')
            .send();

        expect(res.status).toBe(200);
        expect(res.body.message).toBe('Desafio deleted successfully');
    });

    it('should get all desafios', async () => {
        const res = await request(app)
            .get('/api/challenges')
            .send();

        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ id: 1, name: 'Desafio 1' }]);
    });

    it('should get a desafio by ID', async () => {
        const res = await request(app)
            .get('/api/challenges/1')
            .send();

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ id: '1', name: 'Desafio 1' });
    });

    it('should get all fases', async () => {
        const res = await request(app)
            .get('/api/fases')
            .send();

        expect(res.status).toBe(200);
        expect(res.body).toEqual([{ id: 1, name: 'Fase 1' }]);
    });
});
