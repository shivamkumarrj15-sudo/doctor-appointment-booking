/**
 * Safe Storage Helpers
 * Prevents SecurityError or crashes when localStorage/sessionStorage are disabled,
 * blocked by browser privacy settings, or running in restricted sandboxes.
 */

const memoryStore: Record<string, string> = {};

export function safeGetStorage(key: string, type: 'session' | 'local' = 'session'): string | null {
  try {
    const storage = type === 'local' ? window.localStorage : window.sessionStorage;
    if (storage) {
      return storage.getItem(key);
    }
  } catch {
    // Storage access restricted or disabled
  }
  return memoryStore[`${type}_${key}`] ?? null;
}

export function safeSetStorage(key: string, value: string, type: 'session' | 'local' = 'session'): void {
  try {
    const storage = type === 'local' ? window.localStorage : window.sessionStorage;
    if (storage) {
      storage.setItem(key, value);
      return;
    }
  } catch {
    // Storage access restricted or disabled
  }
  memoryStore[`${type}_${key}`] = value;
}

export function safeRemoveStorage(key: string, type: 'session' | 'local' = 'session'): void {
  try {
    const storage = type === 'local' ? window.localStorage : window.sessionStorage;
    if (storage) {
      storage.removeItem(key);
      return;
    }
  } catch {
    // Storage access restricted or disabled
  }
  delete memoryStore[`${type}_${key}`];
}
