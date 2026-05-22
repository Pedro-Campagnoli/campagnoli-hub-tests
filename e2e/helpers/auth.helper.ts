import { APIResponse } from '@playwright/test';
import { expect } from '../fixtures/api.fixture';

export function expectErrorResponse(
  res: APIResponse,
  body: any,
  { status, message, error }: { status: number; message: string | string[]; error: string }
) {
  expect(res.status()).toBe(status);
  expect(body).toEqual(
    expect.objectContaining({ message, error, statusCode: status }),
  );
}