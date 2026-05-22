import { expect, test } from './fixtures/api.fixture';
import Data from './fixtures/auth.json';

test.describe('Register', () => {
  const data = Data.Register;

  test.describe('campos obrigatórios', () => {
    test('deve falhar sem name', async ({ authApi }) => {
      const res = await authApi.register({
        email: data.email,
        password: data.password,
      });
      expect(res.status()).toBe(400);
    });

    test('deve falhar sem email', async ({ authApi }) => {
      const res = await authApi.register({
        name: data.name,
        password: data.password,
      });
      expect(res.status()).toBe(400);
    });

    test('deve falhar sem password', async ({ authApi }) => {
      const res = await authApi.register({
        name: data.name,
        email: data.email,
      });
      expect(res.status()).toBe(400);
    });

    test('deve falhar sem nenhum campo', async ({ authApi }) => {
      const res = await authApi.register({});
      expect(res.status()).toBe(400);
    });
  });

  test.describe('validações de formato', () => {
    test('deve falhar com email inválido', async ({ authApi }) => {
      const res = await authApi.register({
        name: data.name,
        email: 'wrongemail.com',
        password: data.password,
      });
      expect(res.status()).toBe(400);
    });

    test('deve falhar com password menor que 6 caracteres', async ({
      authApi,
    }) => {
      const res = await authApi.register({
        name: data.name,
        email: data.email,
        password: '123',
      });
      expect(res.status()).toBe(400);
    });
  });

  test.describe('campos vazios', () => {
    test('deve falhar com name vazio', async ({ authApi }) => {
      const res = await authApi.register({
        name: '',
        email: data.email,
        password: data.password,
      });
      expect(res.status()).toBe(400);
    });

    test('deve falhar com email vazio', async ({ authApi }) => {
      const res = await authApi.register({
        name: data.name,
        email: '',
        password: data.password,
      });
      expect(res.status()).toBe(400);
    });

    test('deve falhar com password vazio', async ({ authApi }) => {
      const res = await authApi.register({
        name: data.name,
        email: data.email,
        password: '',
      });
      expect(res.status()).toBe(400);
    });
  });

  test.describe('sucesso', () => {
    test.beforeEach(async ({ testingApi }) => {
      await testingApi.deleteUser(data.email);
    });

    test('deve registrar com dados válidos', async ({ authApi }) => {
      const res = await authApi.register(data);
      expect(res.status()).toBe(201);
    });
  });
});

test.describe('Login', () => {
  const data = Data.Login;

  test.describe('campos obrigatórios', () => {
    test('deve falhar sem email', async ({ authApi }) => {
      const res = await authApi.login('', data.password);
      expect(res.status()).toBe(400);
    });

    test('deve falhar sem password', async ({ authApi }) => {
      const res = await authApi.login(data.email, '');
      expect(res.status()).toBe(400);
    });
  });

  test.describe('validações de formato', () => {
    test('deve falhar com email inválido', async ({ authApi }) => {
      const res = await authApi.login('nao-é-email', data.password);
      const body = await res.json();

      expect(res.status()).toBe(400);
      expect(body).toEqual(
        expect.objectContaining({
          message: expect.arrayContaining(['email must be an email']),
          error: 'Bad Request',
          statusCode: 400,
        }),
      );
    });
  });

  test.describe('credenciais inválidas', () => {
    test('deve retornar 401 com password menor que 6 caracteres', async ({
      authApi,
    }) => {
      const res = await authApi.login(data.email, '123');
      const body = await res.json();

      expect(res.status()).toBe(401);
      expect(body).toEqual(
        expect.objectContaining({
          message: 'Invalid credentials',
          error: 'Unauthorized',
          statusCode: 401,
        }),
      );
    });

    test('deve retornar 401 com senha errada', async ({ authApi }) => {
      const res = await authApi.login(data.email, 'senha-errada');
      const body = await res.json();

      expect(res.status()).toBe(401);
      expect(body).toEqual(
        expect.objectContaining({
          message: 'Invalid credentials',
          error: 'Unauthorized',
          statusCode: 401,
        }),
      );
    });

    test('deve retornar 401 com email inexistente', async ({ authApi }) => {
      const res = await authApi.login('naoexiste@test.com', data.password);
      const body = await res.json();

      expect(res.status()).toBe(401);
      expect(body).toEqual(
        expect.objectContaining({
          message: 'Invalid credentials',
          error: 'Unauthorized',
          statusCode: 401,
        }),
      );
    });
  });

  test.describe('sucesso', () => {
    test.beforeEach(async ({ testingApi, authApi }) => {
      await testingApi.deleteUser(data.email);
      await authApi.register(data);
    });

    test('deve retornar tokens ao fazer login', async ({ authApi }) => {
      const res = await authApi.login(data.email, data.password);
      const body = await res.json();

      expect(res.status()).toBe(200);
      expect(body).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        }),
      );
      expect(body.accessToken.split('.').length).toBe(3);
      expect(body.refreshToken.length).toBeGreaterThan(0);
    });
  });
});
