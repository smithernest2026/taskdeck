import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders the primary navigation and default dashboard route', () => {
    render(<App />);
    expect(
      screen.getByRole('navigation', { name: /primary/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: /dashboard/i })
    ).toBeInTheDocument();
  });
});
