export const safeJSONParse = <T,>(str: string | null | undefined): T | null => {
  if (!str) return null;
  try {
    return JSON.parse(str) as T;
  } catch {
    return null;
  }
};

export const loadFromStorage = <T,>(key: string): T | null => {
  if (typeof window === 'undefined') return null;
  return safeJSONParse<T>(localStorage.getItem(key));
};

export const saveToStorage = <T,>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[storageHelpers] Failed to save "${key}":`, error);
  }
};
