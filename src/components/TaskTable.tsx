import { useEffect, useMemo, useRef, useState } from 'react';
import type { Project, Task, TaskPriority, TaskStatus } from '../types';
import { PriorityBadge, StatusBadge } from './Badge';
import { formatDate, isOverdue } from '../lib/date';
import './TaskTable.css';

interface TaskTableProps {
  tasks: Task[];
  projects: Project[];
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: (ids: string[], select: boolean) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (task: Task) => void;
  pageSize?: number;
}

type SortColumn = 'title' | 'status' | 'priority' | 'dueDate';
type SortDirection = 'asc' | 'desc';

const STATUS_ORDER: Record<TaskStatus, number> = {
  todo: 0,
  'in-progress': 1,
  done: 2,
};
const PRIORITY_ORDER: Record<TaskPriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

function compare(a: Task, b: Task, column: SortColumn): number {
  switch (column) {
    case 'title':
      return a.title.localeCompare(b.title);
    case 'status':
      return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    case 'priority':
      return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
    case 'dueDate': {
      const av = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bv = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return av - bv;
    }
  }
}

export default function TaskTable({
  tasks,
  projects,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEditTask,
  onDeleteTask,
  pageSize = 6,
}: TaskTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(0);
  const selectAllRef = useRef<HTMLInputElement>(null);

  const projectsById = useMemo(() => {
    const map = new Map<string, Project>();
    for (const project of projects) map.set(project.id, project);
    return map;
  }, [projects]);

  const sortedTasks = useMemo(() => {
    const factor = sortDirection === 'asc' ? 1 : -1;
    return [...tasks].sort((a, b) => compare(a, b, sortColumn) * factor);
  }, [tasks, sortColumn, sortDirection]);

  const pageCount = Math.max(1, Math.ceil(sortedTasks.length / pageSize));
  // Clamp the page so filtering to fewer results never leaves us past the end.
  const currentPage = Math.min(page, pageCount - 1);
  const pageTasks = sortedTasks.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize
  );

  // Reset to the first page whenever the underlying result set changes.
  useEffect(() => {
    setPage(0);
  }, [tasks, sortColumn, sortDirection]);

  const selectedVisible = pageTasks.filter((task) =>
    selectedIds.has(task.id)
  ).length;
  const allSelected =
    pageTasks.length > 0 && selectedVisible === pageTasks.length;
  const someSelected = selectedVisible > 0 && !allSelected;

  // The indeterminate state cannot be set via JSX, only imperatively.
  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  function toggleSort(column: SortColumn) {
    if (column === sortColumn) {
      setSortDirection((dir) => (dir === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }

  function ariaSort(column: SortColumn): 'ascending' | 'descending' | 'none' {
    if (column !== sortColumn) return 'none';
    return sortDirection === 'asc' ? 'ascending' : 'descending';
  }

  function sortIcon(column: SortColumn): string {
    if (column !== sortColumn) return '↕';
    return sortDirection === 'asc' ? '▲' : '▼';
  }

  const sortableColumns: { key: SortColumn; label: string }[] = [
    { key: 'status', label: 'Status' },
    { key: 'priority', label: 'Priority' },
    { key: 'dueDate', label: 'Due' },
  ];

  return (
    <div className="task-table__wrap">
      <table className="task-table">
        <thead>
          <tr>
            <th scope="col" className="task-table__checkbox">
              <input
                ref={selectAllRef}
                type="checkbox"
                checked={allSelected}
                onChange={(event) =>
                  onToggleSelectAll(
                    pageTasks.map((task) => task.id),
                    event.target.checked
                  )
                }
                aria-label="Select all tasks on this page"
              />
            </th>
            <th scope="col" aria-sort={ariaSort('title')}>
              <button
                type="button"
                className="task-table__sort"
                onClick={() => toggleSort('title')}
              >
                Task
                <span className="task-table__sort-icon" aria-hidden="true">
                  {sortIcon('title')}
                </span>
              </button>
            </th>
            <th scope="col">Project</th>
            {sortableColumns.map(({ key, label }) => (
              <th key={key} scope="col" aria-sort={ariaSort(key)}>
                <button
                  type="button"
                  className="task-table__sort"
                  onClick={() => toggleSort(key)}
                >
                  {label}
                  <span className="task-table__sort-icon" aria-hidden="true">
                    {sortIcon(key)}
                  </span>
                </button>
              </th>
            ))}
            <th scope="col">
              <span className="task-table__sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {pageTasks.map((task) => {
            const project = task.projectId
              ? projectsById.get(task.projectId)
              : null;
            const overdue = task.status !== 'done' && isOverdue(task.dueDate);
            const selected = selectedIds.has(task.id);
            return (
              <tr
                key={task.id}
                className={selected ? 'task-table__row--selected' : undefined}
              >
                <td className="task-table__checkbox">
                  <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onToggleSelect(task.id)}
                    aria-label={`Select ${task.title}`}
                  />
                </td>
                <td className="task-table__title">{task.title}</td>
                <td>
                  {project ? (
                    <span className="task-table__project">
                      <span
                        className="task-table__dot"
                        style={{ background: project.color }}
                        aria-hidden="true"
                      />
                      {project.name}
                    </span>
                  ) : (
                    <span className="task-table__muted">No project</span>
                  )}
                </td>
                <td>
                  <StatusBadge status={task.status} />
                </td>
                <td>
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className={overdue ? 'task-table__overdue' : undefined}>
                  {formatDate(task.dueDate)}
                </td>
                <td className="task-table__actions">
                  <button
                    type="button"
                    className="task-table__action"
                    onClick={() => onEditTask(task)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="task-table__action task-table__action--danger"
                    onClick={() => onDeleteTask(task)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {pageCount > 1 && (
        <div className="task-table__pagination">
          <button
            type="button"
            className="task-table__page-btn"
            onClick={() => setPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </button>
          <span className="task-table__page-info" aria-live="polite">
            Page {currentPage + 1} of {pageCount}
          </span>
          <button
            type="button"
            className="task-table__page-btn"
            onClick={() => setPage(currentPage + 1)}
            disabled={currentPage >= pageCount - 1}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
