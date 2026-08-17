import { useMemo, useState, type FormEvent } from 'react';
import Header from '../components/Header';
import Button from '../components/Button';
import Modal from '../components/Modal';
import ConfirmDialog from '../components/ConfirmDialog';
import EmptyState from '../components/EmptyState';
import { useStore } from '../store/StoreContext';
import { createId } from '../lib/id';
import type { Project } from '../types';
import './ProjectsPage.css';

const DEFAULT_COLOR = '#4f46e5';

export default function ProjectsPage() {
  const { state, dispatch } = useStore();
  const [isCreating, setIsCreating] = useState(false);
  const [deleting, setDeleting] = useState<Project | null>(null);
  const [name, setName] = useState('');
  const [color, setColor] = useState(DEFAULT_COLOR);

  const taskCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const task of state.tasks) {
      if (task.projectId) {
        counts.set(task.projectId, (counts.get(task.projectId) ?? 0) + 1);
      }
    }
    return counts;
  }, [state.tasks]);

  function resetForm() {
    setName('');
    setColor(DEFAULT_COLOR);
    setIsCreating(false);
  }

  function handleCreate(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) return;
    dispatch({
      type: 'ADD_PROJECT',
      project: { id: createId('proj'), name: name.trim(), color },
    });
    resetForm();
  }

  function confirmDelete() {
    if (!deleting) return;
    dispatch({ type: 'DELETE_PROJECT', id: deleting.id });
    setDeleting(null);
  }

  return (
    <>
      <Header
        title="Projects"
        description="Group tasks into projects."
        actions={
          <Button variant="primary" onClick={() => setIsCreating(true)}>
            New project
          </Button>
        }
      />

      {state.projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create a project to organize your tasks."
        />
      ) : (
        <ul className="projects__list">
          {state.projects.map((project) => (
            <li key={project.id} className="projects__card">
              <span
                className="projects__color"
                style={{ background: project.color }}
                aria-hidden="true"
              />
              <div className="projects__info">
                <span className="projects__name">{project.name}</span>
                <span className="projects__count">
                  {taskCounts.get(project.id) ?? 0} tasks
                </span>
              </div>
              <button
                type="button"
                className="projects__delete"
                onClick={() => setDeleting(project)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {isCreating && (
        <Modal title="New project" onClose={resetForm}>
          <form className="projects__form" onSubmit={handleCreate}>
            <div className="projects__field">
              <label htmlFor="project-name">Name</label>
              <input
                id="project-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>
            <div className="projects__field">
              <label htmlFor="project-color">Color</label>
              <input
                id="project-color"
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
            <div className="projects__actions">
              <Button type="button" variant="ghost" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Create project
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete project"
          message={`Delete "${deleting.name}"? Its tasks will be kept but unassigned.`}
          confirmLabel="Delete"
          onConfirm={confirmDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </>
  );
}
