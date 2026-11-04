import { API_BASE_URL, isApiConfigured as isApiEnabled } from '../config/env';

export { isApiEnabled as isApiConfigured };

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export interface ApiRequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
  token?: string;
}

const buildUrl = (path: string): string => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL.replace(/\/$/, '')}${normalizedPath}`;
};

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T | undefined> {
  if (!isApiEnabled()) {
    throw new ApiError(503, 'Backend API is not configured. Set VITE_API_BASE_URL in .env');
  }

  const { body, token, headers, ...rest } = options;

  const response = await fetch(buildUrl(path), {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    let message = text || response.statusText;
    try {
      const body = JSON.parse(text) as { error?: string };
      if (body.error) message = body.error;
    } catch {
      // keep raw text
    }
    throw new ApiError(response.status, message);
  }

  if (response.status === 204) {
    return undefined;
  }

  return (await response.json()) as T;
}

export const apiGet = <T,>(path: string, options?: ApiRequestOptions) =>
  apiRequest<T>(path, { ...options, method: 'GET' });

export const apiPost = <T,>(path: string, body?: unknown, options?: ApiRequestOptions) =>
  apiRequest<T>(path, { ...options, method: 'POST', body });

export const apiPut = <T,>(path: string, body?: unknown, options?: ApiRequestOptions) =>
  apiRequest<T>(path, { ...options, method: 'PUT', body });

export const apiDelete = <T,>(path: string, options?: ApiRequestOptions) =>
  apiRequest<T>(path, { ...options, method: 'DELETE' });
