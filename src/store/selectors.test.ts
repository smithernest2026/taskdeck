import { getTaskStats } from './selectors';
import type { Task } from '../types';

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: Math.random().toString(),
    title: 'x',
    status: 'todo',
    priority: 'medium',
    projectId: null,
    dueDate: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('getTaskStats', () => {
  const now = new Date('2026-06-01T00:00:00.000Z');

  it('returns zeroed stats for an empty list', () => {
    const stats = getTaskStats([], now);
    expect(stats).toMatchObject({ total: 0, done: 0, completionRate: 0 });
  });

  it('counts statuses and completion rate', () => {
    const stats = getTaskStats(
      [
        makeTask({ status: 'done' }),
        makeTask({ status: 'done' }),
        makeTask({ status: 'todo' }),
        makeTask({ status: 'in-progress' }),
      ],
      now
    );
    expect(stats.done).toBe(2);
    expect(stats.todo).toBe(1);
    expect(stats.inProgress).toBe(1);
    expect(stats.completionRate).toBe(50);
  });

  it('counts overdue only for unfinished tasks', () => {
    const stats = getTaskStats(
      [
        makeTask({ status: 'todo', dueDate: '2026-05-01T00:00:00.000Z' }),
        makeTask({ status: 'done', dueDate: '2026-05-01T00:00:00.000Z' }),
      ],
      now
    );
    expect(stats.overdue).toBe(1);
  });
});
