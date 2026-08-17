import Header from '../components/Header';
import TaskTable from '../components/TaskTable';
import { useStore } from '../store/StoreContext';

export default function TasksPage() {
  const { state } = useStore();

  return (
    <>
      <Header title="Tasks" description="Track and manage your tasks." />
      <TaskTable tasks={state.tasks} projects={state.projects} />
    </>
  );
}
