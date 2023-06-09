import app, { init } from '@/app';
import httpStatus from 'http-status';
import supertest from 'supertest';

beforeAll(async () => {
  await init();
});

const server = supertest(app);

describe('GET /health', () => {
  it('should respond with status 200 with OK! text', async () => {
    const response = await server.get('/health');

    expect(response.status).toBe(httpStatus.OK);
    expect(response.text).toBe('OK!');
  });
  it('should respond with status 404 if route dont exists', async () => {
    const response = await server.get('/fake');

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
});
