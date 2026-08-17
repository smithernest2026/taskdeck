import type { TaskPriority, TaskStatus } from '../types';
import { PRIORITY_LABELS, STATUS_LABELS } from '../types';
import './Badge.css';

export function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span className={`badge badge--status-${status}`}>
      {STATUS_LABELS[status]}
    </span>
  );
}

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span className={`badge badge--priority-${priority}`}>
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
