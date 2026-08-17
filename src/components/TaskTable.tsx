import { useMemo } from 'react';
import type { Project, Task } from '../types';
import { PriorityBadge, StatusBadge } from './Badge';
import { formatDate, isOverdue } from '../lib/date';
import './TaskTable.css';

interface TaskTableProps {
  tasks: Task[];
  projects: Project[];
}

export default function TaskTable({ tasks, projects }: TaskTableProps) {
  const projectsById = useMemo(() => {
    const map = new Map<string, Project>();
    for (const project of projects) map.set(project.id, project);
    return map;
  }, [projects]);

  return (
    <table className="task-table">
      <thead>
        <tr>
          <th scope="col">Task</th>
          <th scope="col">Project</th>
          <th scope="col">Status</th>
          <th scope="col">Priority</th>
          <th scope="col">Due</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => {
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
