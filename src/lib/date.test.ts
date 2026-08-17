import { formatDate, isOverdue } from './date';

describe('formatDate', () => {
  it('returns a dash for null or invalid input', () => {
    expect(formatDate(null)).toBe('—');
    expect(formatDate('not-a-date')).toBe('—');
  });

  it('formats a valid ISO date', () => {
    expect(formatDate('2026-01-15T00:00:00.000Z')).toMatch(/2026/);
  });
});

describe('isOverdue', () => {
  const now = new Date('2026-06-01T00:00:00.000Z');

  it('is false when there is no due date', () => {
    expect(isOverdue(null, now)).toBe(false);
  });

  it('is true for a past date and false for a future date', () => {
    expect(isOverdue('2026-05-01T00:00:00.000Z', now)).toBe(true);
    expect(isOverdue('2026-07-01T00:00:00.000Z', now)).toBe(false);
  });
});
