import { screen } from '@testing-library/react';
import { BugList } from '../../components/BugList';
import { TestBugProvider } from '../utils/TestBugProvider';
import { renderWithProviders } from '../utils/renderWithProviders';

const renderList = (overrides = {}) => {
  const value = {
    bugs: [],
    isLoading: false,
    isError: false,
    error: null,
    refetch: jest.fn(),
    createBug: jest.fn(),
    createBugStatus: 'idle',
    updateBug: jest.fn(),
    updateBugStatus: 'idle',
    deleteBug: jest.fn(),
    deleteBugStatus: 'idle',
    queryState: {
      createBugMutation: { status: 'idle', isPending: false },
      updateBugMutation: { status: 'idle', isPending: false },
      deleteBugMutation: { status: 'idle', isPending: false },
    },
    ...overrides,
  };

  renderWithProviders(
    <TestBugProvider value={value}>
      <BugList />
    </TestBugProvider>
  );

  return value;
};

describe('BugList', () => {
  it('renders loading skeleton', () => {
    renderList({ isLoading: true });
    expect(screen.getAllByTestId('skeleton-card')).toHaveLength(3);
  });

  it('renders empty state when no bugs', () => {
    renderList();
    expect(screen.getByText(/No bugs yet/)).toBeInTheDocument();
  });

  it('renders bugs when present', () => {
    renderList({
      bugs: [
        { _id: '1', title: 'Bug 1', reporter: 'Sam', status: 'open', priority: 'medium', description: '', tags: [] },
        { _id: '2', title: 'Bug 2', reporter: 'Jo', status: 'open', priority: 'high', description: '', tags: [] },
      ],
    });
    expect(screen.getByTestId('bug-list').children).toHaveLength(2);
  });

  it('shows error state with retry button', () => {
    renderList({
      isError: true,
      error: new Error('Network down'),
    });
    expect(screen.getByText(/Unable to load bugs/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retry/ })).toBeInTheDocument();
  });
});

