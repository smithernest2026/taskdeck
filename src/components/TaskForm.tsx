import { useState, type FormEvent } from 'react';
import type { Project, TaskPriority, TaskStatus } from '../types';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  STATUS_LABELS,
  PRIORITY_LABELS,
} from '../types';
import Button from './Button';
import './TaskForm.css';

export interface TaskFormValues {
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: string | null;
  dueDate: string | null;
}

interface TaskFormProps {
  projects: Project[];
  initialValues?: TaskFormValues;
  submitLabel?: string;
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
}

const EMPTY: TaskFormValues = {
  title: '',
  status: 'todo',
  priority: 'medium',
  projectId: null,
  dueDate: null,
};

function toDateInput(iso: string | null): string {
  return iso ? iso.slice(0, 10) : '';
}

export default function TaskForm({
  projects,
  initialValues = EMPTY,
  submitLabel = 'Save',
  onSubmit,
  onCancel,
}: TaskFormProps) {
  const [values, setValues] = useState<TaskFormValues>(initialValues);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!values.title.trim()) {
      setError('Title is required.');
      return;
    }
    onSubmit({ ...values, title: values.title.trim() });
  }

  return (
    <form className="task-form" onSubmit={handleSubmit} noValidate>
      <div className="task-form__field">
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          type="text"
          value={values.title}
          onChange={(e) => {
            setValues((v) => ({ ...v, title: e.target.value }));
            if (error) setError(null);
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? 'task-title-error' : undefined}
          autoFocus
        />
        {error && (
          <p id="task-title-error" className="task-form__error" role="alert">
            {error}
          </p>
        )}
      </div>

      <div className="task-form__row">
        <div className="task-form__field">
          <label htmlFor="task-status">Status</label>
          <select
            id="task-status"
            value={values.status}
            onChange={(e) =>
              setValues((v) => ({ ...v, status: e.target.value as TaskStatus }))
            }
          >
            {TASK_STATUSES.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <div className="task-form__field">
          <label htmlFor="task-priority">Priority</label>
          <select
            id="task-priority"
            value={values.priority}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                priority: e.target.value as TaskPriority,
              }))
            }
          >
            {TASK_PRIORITIES.map((priority) => (
              <option key={priority} value={priority}>
                {PRIORITY_LABELS[priority]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="task-form__row">
        <div className="task-form__field">
          <label htmlFor="task-project">Project</label>
          <select
            id="task-project"
            value={values.projectId ?? ''}
            onChange={(e) =>
              setValues((v) => ({ ...v, projectId: e.target.value || null }))
            }
          >
            <option value="">No project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="task-form__field">
          <label htmlFor="task-due">Due date</label>
          <input
            id="task-due"
            type="date"
            value={toDateInput(values.dueDate)}
            onChange={(e) =>
              setValues((v) => ({
                ...v,
                dueDate: e.target.value
                  ? `${e.target.value}T00:00:00.000Z`
                  : null,
              }))
            }
          />
        </div>
      </div>

      <div className="task-form__actions">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
