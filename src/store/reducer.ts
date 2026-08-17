import type { Project, Task } from '../types';

export interface AppState {
  tasks: Task[];
  projects: Project[];
}

export type Action =
  | { type: 'ADD_TASK'; task: Task }
  | { type: 'UPDATE_TASK'; id: string; changes: Partial<Task> }
  | { type: 'DELETE_TASKS'; ids: string[] }
  | { type: 'ADD_PROJECT'; project: Project }
  | { type: 'DELETE_PROJECT'; id: string };

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TASK':
      return { ...state, tasks: [action.task, ...state.tasks] };

    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.id
            ? { ...task, ...action.changes, updatedAt: new Date().toISOString() }
            : task
        ),
      };

    case 'DELETE_TASKS': {
      const removing = new Set(action.ids);
      return {
        ...state,
        tasks: state.tasks.filter((task) => !removing.has(task.id)),
      };
    }

    case 'ADD_PROJECT':
      return { ...state, projects: [...state.projects, action.project] };

    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter((p) => p.id !== action.id),
        // Detach tasks from the removed project rather than deleting them.
        tasks: state.tasks.map((task) =>
          task.projectId === action.id ? { ...task, projectId: null } : task
        ),
      };

    default:
      return state;
  }
}
