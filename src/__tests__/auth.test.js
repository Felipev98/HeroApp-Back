const request = require('supertest');
const app = require('../index');

describe('Endpoints de Autenticación', () => {
  describe('POST /api/auth/register', () => {
    it('debe retornar 400 si falta el nombre de usuario', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Error de validación');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('debe retornar 400 si falta el email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Error de validación');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('debe retornar 400 si falta la contraseña', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Error de validación');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('debe retornar 400 si la contraseña tiene menos de 6 caracteres', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: '12345'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(
        response.body.message.includes('6 caracteres') || 
        response.body.message === 'Error de validación'
      ).toBe(true);
    });

    it('debe aceptar contraseñas con 6 o más caracteres', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: `testuser${Date.now()}`,
          email: `test${Date.now()}@example.com`,
          password: 'password123'
        });

      expect([200, 201, 400]).toContain(response.status);
      if (response.status === 400) {
        expect(response.body.message).not.toContain('6 caracteres');
      }
    });
  });

  describe('POST /api/auth/login', () => {
    it('debe retornar 400 si falta el email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: 'password123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Error de validación');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('debe retornar 400 si falta la contraseña', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Error de validación');
      expect(response.body.errors).toBeDefined();
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it('debe retornar 401 o 404 con credenciales inválidas', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'invalid@example.com',
          password: 'wrongpassword'
        });

      expect([401, 404]).toContain(response.status);
      expect(response.body.success).toBe(false);
    });
  });
});

