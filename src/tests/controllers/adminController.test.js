const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../../app'); // Ajusta la ruta según tu estructura
const Usuario = require('../../models/usuarioModel');

jest.mock('jsonwebtoken');
jest.mock('../../models/usuarioModel');

describe('Admin Controller Tests', () => {
    beforeEach(() => {
        jwt.verify.mockReset();
        Usuario.findOne.mockReset();
        Usuario.update.mockReset();
        Usuario.destroy.mockReset();
        Usuario.findAll.mockReset();
    });

    describe('verifyAdmin Middleware', () => {
        it('should return 401 if no token is provided', async () => {
            const res = await request(app)
                .get('/admin-api/users')
                .set('Authorization', '');

            expect(res.statusCode).toEqual(401);
            expect(res.body.message).toBe('No token provided.');
        });

        it('should return 403 if the user is not an admin', async () => {
            jwt.verify.mockReturnValue({ id: 2 });
            Usuario.findOne.mockResolvedValue({ id_usuario: 2, id_rol: 2 });

            const res = await request(app)
                .get('/admin-api/users')
                .set('Authorization', 'Bearer testtoken');

            expect(res.statusCode).toEqual(403);
            expect(res.body.message).toBe('You are not authorized.');
        });
    });

    describe('updateUser', () => {
        it('should update a user successfully', async () => {
            jwt.verify.mockReturnValue({ id: 1 });
            Usuario.findOne.mockResolvedValueOnce({ id_usuario: 1, id_rol: 1 }); // Usuario que realiza la solicitud

            Usuario.findOne.mockResolvedValueOnce({
                id_usuario: 2,
                nombre_completo: 'Existing User',
                nombre_usuario: 'existinguser',
                correo_electronico: 'email@example.com',
              
            });

            Usuario.update.mockResolvedValue([1]);
            Usuario.findOne.mockResolvedValueOnce({
                id_usuario: 2,
                nombre_completo: 'Updated Name',
                nombre_usuario: 'updatedusername',
                correo_electronico: 'email@example.com',
                
            });

            const res = await request(app)
                .put('/admin-api/update/2')
                .send({ id_usuario: 2, nombre_completo: 'Updated Name', nombre_usuario: 'updatedusername' })
                .set('Authorization', 'Bearer testtoken');

            console.log(res.body); // Depurar la respuesta para ver el contenido
            expect(res.statusCode).toEqual(200);
            
        });

        it('should return 400 if no fields to update', async () => {
            jwt.verify.mockReturnValue({ id: 1 });
            Usuario.findOne.mockResolvedValue({ id_usuario: 1, id_rol: 1 });

            const res = await request(app)
                .put('/admin-api/update/2')
                .send({ id_usuario: 2 })
                .set('Authorization', 'Bearer testtoken');

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('No fields to update.');
        });
    });

    describe('deleteUser', () => {
        it('should delete a user successfully', async () => {
            jwt.verify.mockReturnValue({ id: 1 });
            Usuario.findOne.mockResolvedValue({ id_usuario: 1, id_rol: 1 });
            Usuario.destroy.mockResolvedValue(1);

            const res = await request(app)
                .delete('/admin-api/delete/2')
                .set('Authorization', 'Bearer testtoken');

            expect(res.statusCode).toEqual(200);
            expect(res.body.message).toBe('User deleted successfully.');
        });

        it('should return 400 if trying to delete admin user', async () => {
            jwt.verify.mockReturnValue({ id: 1 });
            Usuario.findOne.mockResolvedValue({ id_usuario: 1, id_rol: 1 });

            const res = await request(app)
                .delete('/admin-api/delete/1')
                .set('Authorization', 'Bearer testtoken');

            expect(res.statusCode).toEqual(400);
            expect(res.body.message).toBe('Cannot delete the administrator user.');
        });
    });

    describe('getAllUsers', () => {
        it('should return a list of users', async () => {
            jwt.verify.mockReturnValue({ id: 1 });
            Usuario.findOne.mockResolvedValue({ id_usuario: 1, id_rol: 1 });
            Usuario.findAll.mockResolvedValue([
                { id_usuario: 1, nombre_completo: 'User One', nombre_usuario: 'userone', correo_electronico: 'userone@example.com', id_rol: 2 },
                { id_usuario: 2, nombre_completo: 'User Two', nombre_usuario: 'usertwo', correo_electronico: 'usertwo@example.com', id_rol: 2 }
            ]);

            const res = await request(app)
                .get('/admin-api/users')
                .set('Authorization', 'Bearer testtoken');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveLength(2);
        });
    });

    describe('getUserById', () => {
        it('should return a user by ID', async () => {
            // Simula la verificación del token JWT y devuelve un usuario con rol de administrador
            jwt.verify.mockReturnValue({ id: 1 });
            Usuario.findOne.mockResolvedValueOnce({ id_usuario: 1, id_rol: 1 }); // Usuario que realiza la solicitud

            // Simula la búsqueda del usuario por ID
            Usuario.findOne.mockResolvedValueOnce({
                id_usuario: 2,
                nombre_completo: 'User Two',
                nombre_usuario: 'usertwo',
                correo_electronico: 'usertwo@example.com',
                id_rol: 2
            });

            const res = await request(app)
                .get('/admin-api/users/2')
                .set('Authorization', 'Bearer testtoken');

            // Depuración para verificar los datos devueltos
            expect(res.statusCode).toEqual(200);
            expect(res.body.nombre_completo).toBe('User Two');
        });

        it('should return 404 if user not found', async () => {
            jwt.verify.mockReturnValue({ id: 1 });
            Usuario.findOne.mockResolvedValueOnce({ id_usuario: 1, id_rol: 1 }); // Usuario que realiza la solicitud

            Usuario.findOne.mockResolvedValue({ id_usuario: 1, id_rol: 1 });
            Usuario.findOne.mockResolvedValueOnce(null);

            const res = await request(app)
                .get('/admin-api/users/3')
                .set('Authorization', 'Bearer testtoken');

            expect(res.statusCode).toEqual(404);
            expect(res.body.message).toBe('User not found.');
        });
    });
});
