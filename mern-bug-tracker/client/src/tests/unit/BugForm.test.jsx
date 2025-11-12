import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BugForm } from '../../components/BugForm';
import { TestBugProvider } from '../utils/TestBugProvider';
import { renderWithProviders } from '../utils/renderWithProviders';

const renderForm = (overrides = {}) => {
  const createBug = jest.fn().mockResolvedValue({});
  const value = {
    createBug,
    createBugStatus: 'idle',
    bugs: [],
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    updateBug: jest.fn(),
    updateBugStatus: 'idle',
    deleteBug: jest.fn(),
    deleteBugStatus: 'idle',
    queryState: overrides.queryState || {},
    ...overrides,
  };

  renderWithProviders(
    <TestBugProvider value={value}>
      <BugForm />
    </TestBugProvider>
  );

  return { createBug };
};

describe('BugForm', () => {
  it('shows validation messages when required fields missing', async () => {
    renderForm();

    await userEvent.click(screen.getByRole('button', { name: /create bug/i }));

    expect(await screen.findByText(/Title must be at least 3 characters/)).toBeInTheDocument();
    expect(await screen.findByText(/Reporter is required/)).toBeInTheDocument();
  });

  it('submits cleaned payload and resets form', async () => {
    const { createBug } = renderForm();

    await userEvent.type(screen.getByLabelText(/Title/), '  Login fails  ');
    await userEvent.type(screen.getByLabelText(/Reporter/), ' QA ');
    await userEvent.type(screen.getByLabelText(/Assignee/), ' Dev ');
    await userEvent.type(screen.getByLabelText(/Tags/), 'frontend, api');

    await userEvent.click(screen.getByRole('button', { name: /create bug/i }));

    await waitFor(() =>
      expect(createBug).toHaveBeenCalledWith({
        title: 'Login fails',
        description: '',
        reporter: 'QA',
        assignee: 'Dev',
        status: 'open',
        priority: 'medium',
        tags: ['frontend', 'api'],
        dueDate: undefined,
      })
    );

    expect(screen.getByLabelText(/Title/)).toHaveValue('');
    expect(screen.getByLabelText(/Reporter/)).toHaveValue('');
  });
});

