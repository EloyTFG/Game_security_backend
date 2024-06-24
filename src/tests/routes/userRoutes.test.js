
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('../../routes/userRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/api', authRoutes);


jest.mock('../../controllers/authController', () => ({
    register: (req, res) => res.status(201).json({ message: 'User registered successfully' }),
    login: (req, res) => res.status(200).json({ token: 'fake-token' }),
    update: (req, res) => res.status(200).json({ message: 'User updated successfully' }),
}));

describe('Auth Routes', () => {
    it('should register a user successfully', async () => {
        const res = await request(app)
            .post('/api/register')
            .send({
                nombre_completo: 'Test User',
                nombre_usuario: 'testuser',
                fecha_nacimiento: '1990-01-01',
                correo_electronico: 'test@example.com',
                contraseña: 'password123',
                id_rol: 2
            });

        expect(res.status).toBe(201);
        expect(res.body).toEqual({ message: 'User registered successfully' });
    });

    it('should login a user successfully', async () => {
        const res = await request(app)
            .post('/api/login')
            .send({
                correo_electronico: 'test@example.com',
                contraseña: 'password123'
            });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ token: 'fake-token' });
    });

    it('should update a user successfully', async () => {
        const res = await request(app)
            .put('/api/update')
            .send({
                nombre_completo: 'Updated User',
                nombre_usuario: 'updateduser',
                fecha_nacimiento: '1990-01-01',
                correo_electronico: 'updated@example.com',
                contraseña: 'newpassword123'
            });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({ message: 'User updated successfully' });
    });
});
