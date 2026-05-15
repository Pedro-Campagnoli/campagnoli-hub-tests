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
