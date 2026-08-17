import { reducer, type AppState } from './reducer';
import type { Task } from '../types';

function makeTask(id: string, overrides: Partial<Task> = {}): Task {
  return {
    id,
    title: `Task ${id}`,
    status: 'todo',
    priority: 'medium',
    projectId: 'proj_a',
    dueDate: null,
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}

const baseState: AppState = {
  tasks: [makeTask('1'), makeTask('2'), makeTask('3')],
  projects: [{ id: 'proj_a', name: 'A', color: '#000' }],
};

describe('reducer', () => {
  it('adds a task to the front of the list', () => {
    const next = reducer(baseState, { type: 'ADD_TASK', task: makeTask('4') });
    expect(next.tasks[0].id).toBe('4');
    expect(next.tasks).toHaveLength(4);
  });

  it('updates a task by id', () => {
    const next = reducer(baseState, {
      type: 'UPDATE_TASK',
      id: '2',
      changes: { status: 'done' },
    });
    expect(next.tasks.find((t) => t.id === '2')?.status).toBe('done');
  });

  it('deletes multiple tasks by id', () => {
    const next = reducer(baseState, { type: 'DELETE_TASKS', ids: ['1', '3'] });
    expect(next.tasks.map((t) => t.id)).toEqual(['2']);
  });

  it('detaches tasks when their project is deleted', () => {
    const next = reducer(baseState, { type: 'DELETE_PROJECT', id: 'proj_a' });
    expect(next.projects).toHaveLength(0);
    expect(next.tasks.every((t) => t.projectId === null)).toBe(true);
  });
});
