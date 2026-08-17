import { useCallback, useState } from 'react';
import Header from '../components/Header';
import TaskTable from '../components/TaskTable';
import BulkActionsBar from '../components/BulkActionsBar';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import Modal from '../components/Modal';
import TaskForm, { type TaskFormValues } from '../components/TaskForm';
import { useStore } from '../store/StoreContext';
import { useTaskQuery } from '../hooks/useTaskQuery';
import { createId } from '../lib/id';
import type { Task } from '../types';
import './TasksPage.css';

export default function TasksPage() {
  const { state, dispatch } = useStore();
  const { query, setQuery, results, isLoading } = useTaskQuery(state.tasks);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isCreating, setIsCreating] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const markSelectedDone = useCallback(() => {
    for (const id of selectedIds) {
      dispatch({ type: 'UPDATE_TASK', id, changes: { status: 'done' } });
    }
    clearSelection();
  }, [selectedIds, dispatch, clearSelection]);

  const deleteSelected = useCallback(() => {
    dispatch({ type: 'DELETE_TASKS', ids: [...selectedIds] });
    clearSelection();
  }, [selectedIds, dispatch, clearSelection]);

  const createTask = useCallback(
    (values: TaskFormValues) => {
      const now = new Date().toISOString();
      dispatch({
        type: 'ADD_TASK',
        task: {
          id: createId('task'),
          ...values,
          createdAt: now,
          updatedAt: now,
        },
      });
      setIsCreating(false);
    },
    [dispatch]
  );

  const saveEdit = useCallback(
    (values: TaskFormValues) => {
      if (!editingTask) return;
      dispatch({ type: 'UPDATE_TASK', id: editingTask.id, changes: values });
      setEditingTask(null);
    },
    [editingTask, dispatch]
  );

  const countLabel = `${results.length} task${results.length === 1 ? '' : 's'}`;
  const statusText = isLoading ? 'Searching…' : countLabel;

  return (
    <>
      <Header
        title="Tasks"
        description="Track and manage your tasks."
        actions={
          <Button variant="primary" onClick={() => setIsCreating(true)}>
            New task
          </Button>
        }
      />

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

      {selectedIds.size > 0 && (
        <BulkActionsBar
          count={selectedIds.size}
          onMarkDone={markSelectedDone}
          onDelete={deleteSelected}
          onClear={clearSelection}
        />
      )}

      {results.length === 0 && !isLoading ? (
        <EmptyState
          title={query ? 'No matching tasks' : 'No tasks yet'}
          description={
            query
              ? 'Try a different search term.'
              : 'Create your first task to get started.'
          }
        />
      ) : (
        <TaskTable
          tasks={results}
          projects={state.projects}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelect}
          onToggleSelectAll={toggleSelectAll}
          onEditTask={setEditingTask}
        />
      )}

      {editingTask && (
        <Modal title="Edit task" onClose={() => setEditingTask(null)}>
          <TaskForm
            projects={state.projects}
            initialValues={{
              title: editingTask.title,
              status: editingTask.status,
              priority: editingTask.priority,
              projectId: editingTask.projectId,
              dueDate: editingTask.dueDate,
            }}
            submitLabel="Save changes"
            onSubmit={saveEdit}
            onCancel={() => setEditingTask(null)}
          />
        </Modal>
      )}

      {isCreating && (
        <Modal title="New task" onClose={() => setIsCreating(false)}>
          <TaskForm
            projects={state.projects}
            submitLabel="Create task"
            onSubmit={createTask}
            onCancel={() => setIsCreating(false)}
          />
        </Modal>
      )}
    </>
  );
}
