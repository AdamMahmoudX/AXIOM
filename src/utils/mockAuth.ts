/**
 * Mock authentication helpers for frontend development only.
 * Replace with server-side bcrypt/Argon2 + JWT when a real backend exists.
 */

const MOCK_HASH_PREFIX = 'mock:v1:';

const fnv1aHash = (input: string): string => {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
};

/** Deterministic mock hash — not suitable for production. */
export const mockHashPassword = (password: string): string =>
  `${MOCK_HASH_PREFIX}${fnv1aHash(password)}`;

/** Legacy btoa hashes still accepted for existing localStorage data. */
const legacyHashPassword = (password: string): string => {
  try {
    return btoa(password);
  } catch {
    return password;
  }
};

export const verifyMockPassword = (password: string, storedHash: string): boolean =>
  storedHash === mockHashPassword(password) || storedHash === legacyHashPassword(password);
