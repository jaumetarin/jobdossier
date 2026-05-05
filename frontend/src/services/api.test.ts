import type { InternalAxiosRequestConfig } from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { attachAuthHeader, handleAuthError, navigation } from './api';
import { clearToken, getToken } from './auth';

vi.mock('./auth', () => ({
  clearToken: vi.fn(),
  getToken: vi.fn(),
}));

describe('api interceptors', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('adds the bearer token to the request config', () => {
    vi.mocked(getToken).mockReturnValue('jwt-token');

    const config = {
      headers: {},
    } as InternalAxiosRequestConfig;

    const result = attachAuthHeader(config);

    expect(result.headers.Authorization).toBe('Bearer jwt-token');
  });

  it('clears auth and redirects to login on 401', async () => {
    const goToLoginSpy = vi
      .spyOn(navigation, 'goToLogin')
      .mockImplementation(() => {});

    const error = {
      response: {
        status: 401,
      },
    };

    await expect(handleAuthError(error)).rejects.toBe(error);

    expect(clearToken).toHaveBeenCalled();
    expect(goToLoginSpy).toHaveBeenCalled();
  });

  it('does not redirect on non-401 errors', async () => {
    const goToLoginSpy = vi
      .spyOn(navigation, 'goToLogin')
      .mockImplementation(() => {});

    const error = {
      response: {
        status: 500,
      },
    };

    await expect(handleAuthError(error)).rejects.toBe(error);

    expect(clearToken).not.toHaveBeenCalled();
    expect(goToLoginSpy).not.toHaveBeenCalled();
  });
});
