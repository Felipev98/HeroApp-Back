const request = require('supertest');
const app = require('../index');

describe('Endpoints de Héroes', () => {

  describe('GET /api/heroes', () => {
    it('debe retornar 401 sin token de autenticación', async () => {
      const response = await request(app)
        .get('/api/heroes')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/heroes', () => {
    it('debe retornar 401 sin token de autenticación', async () => {
      const response = await request(app)
        .post('/api/heroes')
        .send({
          name: 'Test Hero',
          description: 'Test Description',
          power: 'Test Power'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/heroes/:id', () => {
    it('debe retornar 401 sin token de autenticación', async () => {
      const response = await request(app)
        .get('/api/heroes/123')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/heroes/:id', () => {
    it('debe retornar 401 sin token de autenticación', async () => {
      const response = await request(app)
        .put('/api/heroes/123')
        .send({
          name: 'Updated Hero'
        })
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/heroes/:id', () => {
    it('debe retornar 401 sin token de autenticación', async () => {
      const response = await request(app)
        .delete('/api/heroes/123')
        .expect(401);

      expect(response.body).toHaveProperty('error');
    });
  });
});

