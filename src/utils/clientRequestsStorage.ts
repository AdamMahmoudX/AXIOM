const STORAGE_KEY = 'axiomx_client_requests';
const LEGACY_STORAGE_KEY = 'hor_client_requests';

export const CLIENT_REQUESTS_STORAGE_KEY = STORAGE_KEY;

export const loadClientRequests = <T,>(): T[] => {
  if (typeof window === 'undefined') return [];

  let raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (raw) {
      localStorage.setItem(STORAGE_KEY, raw);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  }

  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw) as T[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveClientRequests = <T,>(requests: T[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
};
