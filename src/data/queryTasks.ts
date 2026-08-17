import type { Task } from '../types';

export interface QueryOptions {
  /** Simulated latency in milliseconds. */
  delayMs?: number;
  signal?: AbortSignal;
}

/**
 * Simulate an asynchronous, server-side task search. Filtering matches the
 * query against the task title (case-insensitive). The returned promise
 * resolves after a short delay to mimic network latency, and rejects if the
 * provided AbortSignal fires first.
 */
export function queryTasks(
  tasks: Task[],
  query: string,
  { delayMs = 250, signal }: QueryOptions = {}
): Promise<Task[]> {
  const normalized = query.trim().toLowerCase();
  const results = normalized
    ? tasks.filter((task) => task.title.toLowerCase().includes(normalized))
    : tasks;

  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }

    const timer = setTimeout(() => {
      resolve(results);
    }, delayMs);

    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true }
    );
  });
}
