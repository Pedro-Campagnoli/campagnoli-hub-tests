import { expect, test } from './fixtures/api.fixture';
import Data from "./fixtures/auth.json";
import { RegisterDto } from './types/auth.types';


test.describe('Auth Register', () => {
  test('Should register user successfully', async ({ authApi, testingApi  }) => {
    const data: RegisterDto = Data.RegisterSuccess;
    
    await testingApi.deleteUser(data.email);

    const response = await authApi.register(data)

    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
    expect(typeof body.accessToken).toBe('string');
    expect(typeof body.refreshToken).toBe('string');
    expect(body.accessToken.split('.')).toHaveLength(3);
    expect(body.refreshToken.length).toBeGreaterThan(30);
  });

  test('Should return 409 when email already exists', async ({ authApi, testingApi }) => {
    const data: RegisterDto = Data.RegisterDuplicated;

    await testingApi.deleteUser(data.email);
    await authApi.register(data)
    const response = await authApi.register(data);

    expect(response.status()).toBe(409);
    const body = await response.json();
    expect(body).toEqual({
      message: 'Email already in use',
      error: 'Conflict',
      statusCode: 409
    });
  });

});