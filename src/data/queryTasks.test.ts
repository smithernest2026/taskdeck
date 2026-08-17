import { queryTasks } from './queryTasks';
import type { Task } from '../types';

function makeTask(id: string, title: string): Task {
  return {
    id,
    title,
    status: 'todo',
    priority: 'medium',
    projectId: null,
    dueDate: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
  };
}

const tasks = [
  makeTask('1', 'Write docs'),
  makeTask('2', 'Fix login bug'),
  makeTask('3', 'Write tests'),
];

describe('queryTasks', () => {
  it('returns all tasks for an empty query', async () => {
    await expect(queryTasks(tasks, '', { delayMs: 0 })).resolves.toHaveLength(3);
  });

  it('filters by title case-insensitively', async () => {
    const result = await queryTasks(tasks, 'write', { delayMs: 0 });
    expect(result.map((t) => t.id)).toEqual(['1', '3']);
  });

  it('rejects when the signal is already aborted', async () => {
    const controller = new AbortController();
    controller.abort();
    await expect(
      queryTasks(tasks, 'write', { delayMs: 0, signal: controller.signal })
    ).rejects.toThrow(/abort/i);
  });
});
