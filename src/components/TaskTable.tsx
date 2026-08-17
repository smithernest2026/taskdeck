import { useMemo, useState } from 'react';
import type { Project, Task, TaskPriority, TaskStatus } from '../types';
import { PriorityBadge, StatusBadge } from './Badge';
import { formatDate, isOverdue } from '../lib/date';
import './TaskTable.css';

interface TaskTableProps {
  tasks: Task[];
  projects: Project[];
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

export default function TaskTable({ tasks, projects }: TaskTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('dueDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const projectsById = useMemo(() => {
    const map = new Map<string, Project>();
    for (const project of projects) map.set(project.id, project);
    return map;
  }, [projects]);

  const sortedTasks = useMemo(() => {
    const factor = sortDirection === 'asc' ? 1 : -1;
    return [...tasks].sort((a, b) => compare(a, b, sortColumn) * factor);
  }, [tasks, sortColumn, sortDirection]);

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

  const columns: { key: SortColumn; label: string; sortable: boolean }[] = [
    { key: 'title', label: 'Task', sortable: true },
    { key: 'status', label: 'Status', sortable: true },
    { key: 'priority', label: 'Priority', sortable: true },
    { key: 'dueDate', label: 'Due', sortable: true },
  ];

  return (
    <table className="task-table">
      <thead>
        <tr>
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
          {columns.slice(1).map(({ key, label }) => (
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
        </tr>
      </thead>
      <tbody>
        {sortedTasks.map((task) => {
          const project = task.projectId
            ? projectsById.get(task.projectId)
            : null;
          const overdue = task.status !== 'done' && isOverdue(task.dueDate);
          return (
            <tr key={task.id}>
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
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
