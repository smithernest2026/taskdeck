import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import { StoreProvider } from '../store/StoreContext';
import TasksPage from './TasksPage';

function renderPage() {
  return render(
    <StoreProvider>
      <TasksPage />
    </StoreProvider>
  );
}

describe('TasksPage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the seeded tasks', async () => {
    renderPage();
    expect(
      await screen.findByText('Draft new landing page copy')
    ).toBeInTheDocument();
  });

  it('filters tasks by the search query', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Draft new landing page copy');

    await user.type(screen.getByRole('searchbox'), 'audit');

    await waitFor(() => {
      expect(
        screen.queryByText('Draft new landing page copy')
      ).not.toBeInTheDocument();
    });
    expect(screen.getByText('Design system audit')).toBeInTheDocument();
  });

  it('preserves selection when a selected task is filtered out and back in', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Design system audit');

    const checkbox = screen.getByRole('checkbox', {
      name: /select Design system audit/i,
    });
    await user.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(screen.getByText('1 selected')).toBeInTheDocument();

    // Filter so the selected task is no longer displayed.
    await user.type(screen.getByRole('searchbox'), 'landing');
    await waitFor(() => {
      expect(
        screen.queryByText('Design system audit')
      ).not.toBeInTheDocument();
    });
    // Selection count survives even though the row is hidden.
    expect(screen.getByText('1 selected')).toBeInTheDocument();

    // Clear the filter and confirm the row is still selected.
    await user.clear(screen.getByRole('searchbox'));
    const restored = await screen.findByRole('checkbox', {
      name: /select Design system audit/i,
    });
    expect(restored).toBeChecked();
  });
});
