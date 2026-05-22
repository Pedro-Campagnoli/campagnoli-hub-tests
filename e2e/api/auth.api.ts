import { APIRequestContext } from '@playwright/test';
import { RegisterDto, LoginDto, RefreshTokenDto } from '../types/auth.types';

export class AuthApi {
  constructor(private request: APIRequestContext) {}

  async register(data: RegisterDto) {
    const response = await this.request.post('/api/auth/register', { data });

    return response;
  }

  async login(data: LoginDto) {
    const response = await this.request.post('/api/auth/login', { data });

    return response;
  }

  async refresh(data: RefreshTokenDto) {
    const response = await this.request.post('/api/auth/refresh', { data });
    return response;
  }
}
