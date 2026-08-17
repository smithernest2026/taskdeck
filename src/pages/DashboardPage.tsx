import { useMemo } from 'react';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import { useStore } from '../store/StoreContext';
import { getTaskStats } from '../store/selectors';
import './DashboardPage.css';

export default function DashboardPage() {
  const { state } = useStore();
  const stats = useMemo(() => getTaskStats(state.tasks), [state.tasks]);

  return (
    <>
      <Header title="Dashboard" description="An overview of your work." />
      <section className="dashboard__grid" aria-label="Task statistics">
        <StatCard label="Total tasks" value={stats.total} />
        <StatCard label="In progress" value={stats.inProgress} />
        <StatCard
          label="Completed"
          value={stats.done}
          hint={`${stats.completionRate}% completion rate`}
          tone="success"
        />
        <StatCard
          label="Overdue"
          value={stats.overdue}
          tone={stats.overdue > 0 ? 'danger' : 'default'}
        />
      </section>
    </>
  );
}
