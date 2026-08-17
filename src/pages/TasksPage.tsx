import { useCallback, useState } from 'react';
import Header from '../components/Header';
import TaskTable from '../components/TaskTable';
import { useStore } from '../store/StoreContext';
import { useTaskQuery } from '../hooks/useTaskQuery';
import './TasksPage.css';

export default function TasksPage() {
  const { state } = useStore();
  const { query, setQuery, results, isLoading } = useTaskQuery(state.tasks);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback((ids: string[], select: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (select) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }, []);

  const countLabel = `${results.length} task${results.length === 1 ? '' : 's'}`;
  const statusText = isLoading ? 'Searching…' : countLabel;

  return (
    <>
      <Header title="Tasks" description="Track and manage your tasks." />

      <div className="tasks__toolbar">
        <label className="tasks__search">
          <span className="tasks__search-label">Search tasks</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter by title…"
          />
        </label>
        <p className="tasks__status" role="status" aria-live="polite">
          {statusText}
        </p>
      </div>

      <TaskTable
        tasks={results}
        projects={state.projects}
        selectedIds={selectedIds}
        onToggleSelect={toggleSelect}
        onToggleSelectAll={toggleSelectAll}
      />
    </>
  );
}
