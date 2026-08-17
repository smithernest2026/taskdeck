/**
 * Generate a short unique id. Uses the crypto API when available and falls
 * back to a timestamp-based value for older environments.
 */
export function createId(prefix = ''): string {
  const raw =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  return prefix ? `${prefix}_${raw}` : raw;
}
