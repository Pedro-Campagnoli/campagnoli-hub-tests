import { expect, test } from './fixtures/api.fixture';

test.describe('Register', () => {
  test.describe('campos obrigatórios', () => {
    test('deve falhar sem name', async ({ authApi }) => {
      const res = await authApi.register({
        email: 'test@test.com',
        password: '123456',
      });
      expect(res.status()).toBe(400);
    });

    test('deve falhar sem email', async ({ authApi }) => {
      const res = await authApi.register({ name: 'João', password: '123456' });
      expect(res.status()).toBe(400);
    });

    test('deve falhar sem password', async ({ authApi }) => {
      const res = await authApi.register({
        name: 'João',
        email: 'test@test.com',
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
        name: 'João',
        email: 'nao-é-email',
        password: '123456',
      });
      expect(res.status()).toBe(400);
    });

    test('deve falhar com password menor que 6 caracteres', async ({
      authApi,
    }) => {
      const res = await authApi.register({
        name: 'João',
        email: 'test@test.com',
        password: '123',
      });
      expect(res.status()).toBe(400);
    });
  });

  test.describe('campos vazios', () => {
    test('deve falhar com name vazio', async ({ authApi }) => {
      const res = await authApi.register({
        name: '',
        email: 'test@test.com',
        password: '123456',
      });
      expect(res.status()).toBe(400);
    });

    test('deve falhar com email vazio', async ({ authApi }) => {
      const res = await authApi.register({
        name: 'João',
        email: '',
        password: '123456',
      });
      expect(res.status()).toBe(400);
    });

    test('deve falhar com password vazio', async ({ authApi }) => {
      const res = await authApi.register({
        name: 'João',
        email: 'test@test.com',
        password: '',
      });
      expect(res.status()).toBe(400);
    });
  });

  test.describe('sucesso', () => {
    const data = {
      name: 'João',
      email: 'test@test.com',
      password: '123456',
    };

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
  const data = {
    name: 'LoginTest',
    email: 'LoginTest@test.com',
    password: '123456',
  };

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
  });

  test.describe('credenciais inválidas', () => {
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
      expect(body.accessToken.length).toBeGreaterThan(0);
      expect(body.refreshToken.length).toBeGreaterThan(0);
    });
  });
});
