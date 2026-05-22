import { expect, test } from './fixtures/api.fixture';
import Data from './fixtures/auth/auth.json';
import { expectErrorResponse } from './helpers/auth.helper';

test.describe('Register', () => {
  const data = Data.Register;

  test.describe('campos obrigatórios', () => {
    test('deve falhar sem name', async ({ authApi }) => {
      const res = await authApi.register({
        email: data.email,
        password: data.password,
      });
      const body = await res.json();

      expectErrorResponse(res, body, {
        status: 400,
        message: ['name não pode ser vazio'],
        error: 'Bad Request',
      });
    });

    test('deve falhar sem email', async ({ authApi }) => {
      const res = await authApi.register({
        name: data.name,
        password: data.password,
      });
      const body = await res.json();

      expectErrorResponse(res, body, {
        status: 400,
        message: ['email deve ser um e-mail válido'],
        error: 'Bad Request',
      });
    });

    test('deve falhar sem password', async ({ authApi }) => {
      const res = await authApi.register({
        name: data.name,
        email: data.email,
      });
      const body = await res.json();

      expectErrorResponse(res, body, {
        status: 400,
        message: ['password deve ter no mínimo 6 caracteres'],
        error: 'Bad Request',
      });
    });

    test('deve falhar sem nenhum campo', async ({ authApi }) => {
      const res = await authApi.register({});
      const body = await res.json();

      expectErrorResponse(res, body, {
        status: 400,
        message: [
          'name não pode ser vazio',
          'email deve ser um e-mail válido',
          'password deve ter no mínimo 6 caracteres',
        ],
        error: 'Bad Request',
      });
    });
  });

  test.describe('validações de formato', () => {
    test('deve falhar com email inválido', async ({ authApi }) => {
      const res = await authApi.register({
        name: data.name,
        email: 'wrongemail.com',
        password: data.password,
      });
      const body = await res.json();

      expectErrorResponse(res, body, {
        status: 400,
        message: ['email deve ser um e-mail válido'],
        error: 'Bad Request',
      });
    });

    test('deve falhar com password menor que 6 caracteres', async ({
      authApi,
    }) => {
      const res = await authApi.register({
        name: data.name,
        email: data.email,
        password: '123',
      });
      const body = await res.json();

      expectErrorResponse(res, body, {
        status: 400,
        message: ['password deve ter no mínimo 6 caracteres'],
        error: 'Bad Request',
      });
    });
  });

  test.describe('campos vazios', () => {
    test('deve falhar com name vazio', async ({ authApi }) => {
      const res = await authApi.register({
        name: '',
        email: data.email,
        password: data.password,
      });
      const body = await res.json();

      expectErrorResponse(res, body, {
        status: 400,
        message: ['name não pode ser vazio'],
        error: 'Bad Request',
      });
    });

    test('deve falhar com email vazio', async ({ authApi }) => {
      const res = await authApi.register({
        name: data.name,
        email: '',
        password: data.password,
      });
      const body = await res.json();

      expectErrorResponse(res, body, {
        status: 400,
        message: ['email deve ser um e-mail válido'],
        error: 'Bad Request',
      });
    });

    test('deve falhar com password vazio', async ({ authApi }) => {
      const res = await authApi.register({
        name: data.name,
        email: data.email,
        password: '',
      });
      const body = await res.json();

      expectErrorResponse(res, body, {
        status: 400,
        message: ['password deve ter no mínimo 6 caracteres'],
        error: 'Bad Request',
      });
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
      const res = await authApi.login({ email: '', password: data.password });
      const body = await res.json();

      expectErrorResponse(res, body, {
        status: 400,
        message: ['email deve ser um e-mail válido'],
        error: 'Bad Request',
      });
    });

    test('deve falhar sem password', async ({ authApi }) => {
      const res = await authApi.login({ email: data.email, password: '' });
      const body = await res.json();

      expectErrorResponse(res, body, {
        status: 400,
        message: ['password deve ter no mínimo 6 caracteres'],
        error: 'Bad Request',
      });
    });
  });

  test.describe('validações de formato', () => {
    test('deve falhar com email inválido', async ({ authApi }) => {
      const res = await authApi.login({
        email: 'nao-é-email',
        password: data.password,
      });
      const body = await res.json();

      expectErrorResponse(res, body, {
        status: 400,
        message: ['email must be an email'],
        error: 'Bad Request',
      });
    });
  });

  test.describe('credenciais inválidas', () => {
    test('deve retornar 401 com password menor que 6 caracteres', async ({
      authApi,
    }) => {
      const res = await authApi.login({ email: data.email, password: '123' });
      const body = await res.json();

      expectErrorResponse(res, body, {
        status: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      });
    });

    test('deve retornar 401 com senha errada', async ({ authApi }) => {
      const res = await authApi.login({
        email: data.email,
        password: 'senha-errada',
      });
      const body = await res.json();

      expectErrorResponse(res, body, {
        status: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      });
    });

    test('deve retornar 401 com email inexistente', async ({ authApi }) => {
      const res = await authApi.login({
        email: 'naoexiste@test.com',
        password: data.password,
      });
      const body = await res.json();

      expectErrorResponse(res, body, {
        status: 401,
        message: 'Invalid credentials',
        error: 'Unauthorized',
      });
    });
  });

  test.describe('sucesso', () => {
    test.beforeEach(async ({ testingApi, authApi }) => {
      await testingApi.deleteUser(data.email);
      await authApi.register(data);
    });

    test('deve retornar tokens ao fazer login', async ({ authApi }) => {
      const res = await authApi.login({
        email: data.email,
        password: data.password,
      });
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

test.describe('Refresh', () => {
  test('deve retornar refresh e access token ao inserir token valido', async ({
    authApi,
    testingApi,
  }) => {
    const email = `refresh-${Date.now()}@test.com`;
    await testingApi.deleteUser(email);
    await authApi.register({ name: 'Refresh', email, password: '123456' });

    const loginRes = await authApi.login({ email, password: '123456' });
    const loginBody = await loginRes.json();

    const res = await authApi.refresh({ refreshToken: loginBody.refreshToken });
    const resBody = await res.json();

    expect(res.status()).toBe(200);
    expect(resBody.accessToken.split('.').length).toBe(3);
    expect(resBody.refreshToken.length).toBeGreaterThan(0);

    await testingApi.deleteUser(email);
  });

  test('deve retornar 401 com refresh token inválido', async ({ authApi }) => {
    const res = await authApi.refresh({ refreshToken: 'token-invalido' });
    const body = await res.json();

    expectErrorResponse(res, body, {
      status: 401,
      message: 'Invalid or expired refresh token',
      error: 'Unauthorized',
    });
  });
});