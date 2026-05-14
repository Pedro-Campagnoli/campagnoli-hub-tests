import { test as base } from '@playwright/test';
import { AuthApi } from '../api/auth.api';
import { TestingApi } from '../api/testing.api';

export const test = base.extend<{
  authApi: AuthApi;
  testingApi: TestingApi;
}>({
  authApi: async ({ request }, use) => {
    await use(new AuthApi(request));
  },

  testingApi: async ({ request }, use) => {
    await use(new TestingApi(request));
  },
});

export { expect } from '@playwright/test';
