import { useEffect, useRef, useState } from 'react';
import type { Task } from '../types';
import { queryTasks } from '../data/queryTasks';

interface TaskQuery {
  query: string;
  setQuery: (value: string) => void;
  results: Task[];
  isLoading: boolean;
}

/**
 * Manage asynchronous task filtering. Each query change issues a new request;
 * a monotonically increasing request id ensures that only the most recent
 * response updates state, so out-of-order responses are discarded.
 */
export function useTaskQuery(tasks: Task[]): TaskQuery {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Task[]>(tasks);
  const [isLoading, setIsLoading] = useState(false);
  const latestRequest = useRef(0);

  useEffect(() => {
    const requestId = ++latestRequest.current;
    const controller = new AbortController();
    setIsLoading(true);

    queryTasks(tasks, query, { signal: controller.signal })
      .then((next) => {
        if (requestId === latestRequest.current) {
          setResults(next);
          setIsLoading(false);
        }
      })
      .catch((error: unknown) => {
        const aborted =
          error instanceof DOMException && error.name === 'AbortError';
        if (!aborted && requestId === latestRequest.current) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [tasks, query]);

  return { query, setQuery, results, isLoading };
}
