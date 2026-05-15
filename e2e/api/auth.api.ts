import { APIRequestContext } from '@playwright/test';
import { RegisterDto } from '../types/auth.types';

export class AuthApi {
  constructor(private request: APIRequestContext) {}

  async register(data: RegisterDto) {
    const response = await this.request.post('/api/auth/register', { data });

    return response;
  }

  async login(email: string, password: string) {
    return this.request.post('/api/auth/login', {
      data: { email, password },
    });
  }
}
