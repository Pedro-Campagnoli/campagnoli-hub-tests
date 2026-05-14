import { APIRequestContext } from '@playwright/test';

export class TestingApi {
  constructor(private request: APIRequestContext) {}

  async deleteUser(email: string) {
    return this.request.delete(`api/testing/users/${email}`);
  }
}