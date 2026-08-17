import type { Task, TaskStatus } from '../types';

export interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  done: number;
  overdue: number;
  completionRate: number;
}

/** Compute summary statistics for a list of tasks. */
export function getTaskStats(tasks: Task[], now = new Date()): TaskStats {
  const counts: Record<TaskStatus, number> = {
    todo: 0,
    'in-progress': 0,
    done: 0,
  };
  let overdue = 0;

  for (const task of tasks) {
    counts[task.status] += 1;
    if (
      task.status !== 'done' &&
      task.dueDate &&
      new Date(task.dueDate).getTime() < now.getTime()
    ) {
      overdue += 1;
    }
  }

  const total = tasks.length;
  const completionRate = total === 0 ? 0 : Math.round((counts.done / total) * 100);

  return {
    total,
    todo: counts.todo,
    inProgress: counts['in-progress'],
    done: counts.done,
    overdue,
    completionRate,
  };
}
