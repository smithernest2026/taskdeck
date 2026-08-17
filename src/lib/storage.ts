/**
 * Small typed wrapper around localStorage that fails safely when storage is
 * unavailable (private mode, SSR, quota errors) or the stored value is corrupt.
 */
export function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveState<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore write failures (e.g. quota exceeded, storage disabled).
  }
}
