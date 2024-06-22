// src/tests/routes/topRoutes.test.js
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const topRoutes = require('../../routes/topRoutes');

const app = express();
app.use(bodyParser.json());
app.use('/api', topRoutes);


jest.mock('../../controllers/topController', () => ({
    getAllUsersProgress: (req, res) => res.status(200).json([
        { id: 1, name: 'User1', progress: 90 },
        { id: 2, name: 'User2', progress: 80 }
    ])
}));

describe('Top Routes', () => {
    it('should get all users progress', async () => {
        const res = await request(app)
            .get('/api/top')
            .send();

        expect(res.status).toBe(200);
        expect(res.body).toEqual([
            { id: 1, name: 'User1', progress: 90 },
            { id: 2, name: 'User2', progress: 80 }
        ]);
    });

    it('should return a 404 for non-existent route', async () => {
        const res = await request(app)
            .get('/api/non-existent-route')
            .send();

        expect(res.status).toBe(404);
    });
});
