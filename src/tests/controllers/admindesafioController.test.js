// src/tests/controllers/desafioController.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app'); // Ajusta la ruta según tu estructura
const Desafio = require('../../models/desafioModel');
const Pista = require('../../models/pistaModel');
const Usuario = require('../../models/usuarioModel');
const DocumentoAyuda = require('../../models/documentoAyudaModel');
const DocumentoPrevencion = require('../../models/documentoPrevencionModel');
const Fase = require('../../models/faseModel');

jest.mock('jsonwebtoken');
jest.mock('../../models/desafioModel');
jest.mock('../../models/pistaModel');
jest.mock('../../models/usuarioModel');
jest.mock('../../models/documentoAyudaModel');
jest.mock('../../models/documentoPrevencionModel');
jest.mock('../../models/faseModel');

describe('Desafio Controller Tests', () => {
    beforeEach(() => {
        jwt.verify.mockReset();
        Pista.create.mockReset();
        Pista.destroy.mockReset();
        DocumentoAyuda.create.mockReset();
        DocumentoAyuda.destroy.mockReset();
        DocumentoPrevencion.create.mockReset();
        DocumentoPrevencion.destroy.mockReset();
        Fase.findAll.mockReset();
        Usuario.findOne.mockReset();
        Desafio.create.mockReset();
        Desafio.update.mockReset();
        Desafio.destroy.mockReset();
        Desafio.findAll.mockReset();
        Desafio.findOne.mockReset();
       
       
    });

    describe('verifyAdmin Middleware', () => {
        it('should return 401 if no token is provided', async () => {
            const res = await request(app)
                .get('/admin-api/desafios')
                .set('Authorization', '');
            
            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toBe('No token provided.');
        });

        it('should return 403 if the user is not an admin', async () => {
            jwt.verify.mockReturnValue({ id: 2 });
            Usuario.findOne.mockResolvedValue({ id_usuario: 2, id_rol: 2 });

            const res = await request(app)
                .get('/admin-api/desafios')
                .set('Authorization', 'Bearer testtoken');

            expect(res.statusCode).toEqual(403);
            expect(res.body.message).toBe('You are not authorized.');
        });
    });

    describe('createDesafio', () => {
        it('should create a new desafio successfully', async () => {
            jwt.verify.mockReturnValue({ id: 1 });
            Usuario.findOne.mockResolvedValue({ id_usuario: 1, id_rol: 1 });

            Desafio.create.mockResolvedValue({
                id_desafio: 1,
                descripcion_desafio: 'New Challenge',
                solucion_desafio: 'Solution',
                nivel_dificultad: 'High',
                id_fase: 1
            });

            const res = await request(app)
                .post('/admin-api/desafios')
                .send({
                    descripcion_desafio: 'New Challenge',
                    solucion_desafio: 'Solution',
                    nivel_dificultad: 'High',
                    id_fase: 1,
                    pistas: ['Hint 1', 'Hint 2'],
                    documentosAyuda: ['Help 1'],
                    documentosPrevencion: ['Prevention 1']
                })
                .set('Authorization', 'Bearer testtoken');

            expect(res.statusCode).toEqual(201);
            expect(res.body.message).toBe('Challenge created successfully.');
            expect(res.body.challenge.descripcion_desafio).toBe('New Challenge');
        });

        it('should return 400 if required fields are missing', async () => {
            jwt.verify.mockReturnValue({ id: 1 });
            Usuario.findOne.mockResolvedValue({ id_usuario: 1, id_rol: 1 });

            const res = await request(app)
                .post('/admin-api/desafios')
                .send({
                    solucion_desafio: 'Solution',
                    nivel_dificultad: 'High',
                    id_fase: 1
                })
                .set('Authorization', 'Bearer testtoken');

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('All fields are required.');
        });
    });

    describe('updateDesafio', () => {
        it('should update a desafio successfully', async () => {
            jwt.verify.mockReturnValue({ id: 1 });
            Usuario.findOne.mockResolvedValue({ id_usuario: 1, id_rol: 1 });
            Desafio.update.mockResolvedValue([1]);
            Desafio.findOne.mockResolvedValue({
                id_desafio: 1,
                descripcion_desafio: 'Updated Challenge',
                solucion_desafio: 'Updated Solution',
                nivel_dificultad: 'Medium',
                id_fase: 2
            });

            const res = await request(app)
                .put('/admin-api/desafios/1')
                .send({
                    id_desafio: 1,
                    descripcion_desafio: 'Updated Challenge',
                    solucion_desafio: 'Updated Solution',
                    nivel_dificultad: 'Medium',
                    id_fase: 2
                })
                .set('Authorization', 'Bearer testtoken');

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('Challenge updated successfully.');
            expect(res.body.challenge.descripcion_desafio).toBe('Updated Challenge');
        });

        it('should return 400 if no fields to update', async () => {
            jwt.verify.mockReturnValue({ id: 1 });
            Usuario.findOne.mockResolvedValue({ id_usuario: 1, id_rol: 1 });

            const res = await request(app)
                .put('/admin-api/desafios/1')
                .send({ id_desafio: 1 })
                .set('Authorization', 'Bearer testtoken');

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('No fields to update.');
        });
    });

    describe('deleteDesafio', () => {
        it('should delete a desafio successfully', async () => {
            jwt.verify.mockReturnValue({ id: 1 });
            Usuario.findOne.mockResolvedValue({ id_usuario: 1, id_rol: 1 });
            Desafio.destroy.mockResolvedValue(1);

            const res = await request(app)
                .delete('/admin-api/desafios/1')
                .set('Authorization', 'Bearer testtoken');

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('Challenge deleted successfully.');
        });

        it('should return 400 if no challenge ID is provided', async () => {
            jwt.verify.mockReturnValue({ id: 1 });
            Usuario.findOne.mockResolvedValue({ id_usuario: 1, id_rol: 1 });

            const res = await request(app)
                .delete('/admin-api/desafios')
                .set('Authorization', 'Bearer testtoken');

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Challenge ID is required.');
        });
    });

    describe('getAllDesafios', () => {
        it('should return a list of desafios', async () => {
            jwt.verify.mockReturnValue({ id: 1 });
            Usuario.findOne.mockResolvedValue({ id_usuario: 1, id_rol: 1 });
            Desafio.findAll.mockResolvedValue([
                { id_desafio: 1, descripcion_desafio: 'Challenge 1', solucion_desafio: 'Solution 1', nivel_dificultad: 'Low', id_fase: 1 },
                { id_desafio: 2, descripcion_desafio: 'Challenge 2', solucion_desafio: 'Solution 2', nivel_dificultad: 'Medium', id_fase: 2 }
            ]);

            const res = await request(app)
                .get('/admin-api/desafios')
                .set('Authorization', 'Bearer testtoken');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(2);
        });
    });

    describe('getDesafioById', () => {
        it('should return a desafio by ID', async () => {
            jwt.verify.mockReturnValue({ id: 1 });
            Usuario.findOne.mockResolvedValue({ id_usuario: 1, id_rol: 1 });
            Desafio.findOne.mockResolvedValue({
                id_desafio: 1,
                descripcion_desafio: 'Challenge 1',
                solucion_desafio: 'Solution 1',
                nivel_dificultad: 'Low',
                id_fase: 1
            });

            const res = await request(app)
                .get('/admin-api/desafios/1')
                .set('Authorization', 'Bearer testtoken');

            expect(res.statusCode).toEqual(200);
            expect(res.body.descripcion_desafio).toBe('Challenge 1');
        });

        it('should return 404 if desafio not found', async () => {
            jwt.verify.mockReturnValue({ id: 1 });
            Usuario.findOne.mockResolvedValue({ id_usuario: 1, id_rol: 1 });
            Desafio.findOne.mockResolvedValue(null);

            const res = await request(app)
                .get('/admin-api/desafios/999')
                .set('Authorization', 'Bearer testtoken');

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toBe('Challenge not found.');
        });
    });

    describe('getAllFases', () => {
        it('should return a list of fases', async () => {
            jwt.verify.mockReturnValue({ id: 1 });
            Usuario.findOne.mockResolvedValue({ id_usuario: 1, id_rol: 1 });
            Fase.findAll.mockResolvedValue([
                { id_fase: 1, nombre_fase: 'Phase 1', vulnerabilidad: 'Vulnerability 1' },
                { id_fase: 2, nombre_fase: 'Phase 2', vulnerabilidad: 'Vulnerability 2' }
            ]);

            const res = await request(app)
                .get('/admin-api/fases')
                .set('Authorization', 'Bearer testtoken');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(2);
        });
    });
});
