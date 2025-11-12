import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../../App';
import bugService from '../../services/bugService';
import { renderWithProviders } from '../utils/renderWithProviders';

jest.mock('../../services/bugService');

let counter = 0;
const buildBug = (overrides = {}) => ({
  _id: `bug-${counter++}`,
  title: 'Existing bug',
  description: 'Sample description',
  reporter: 'QA',
  assignee: 'Dev',
  status: 'open',
  priority: 'medium',
  tags: ['ui'],
  ...overrides,
});

describe('App integration', () => {
  beforeEach(() => {
    bugService.fetchBugs.mockResolvedValue([buildBug()]);
    bugService.createBug.mockResolvedValue(buildBug({ title: 'New bug', reporter: 'QA' }));
    bugService.updateBug.mockResolvedValue(buildBug({ status: 'resolved' }));
    bugService.deleteBug.mockResolvedValue();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders bugs fetched from the API', async () => {
    renderWithProviders(<App />);

    expect(await screen.findByText(/Existing bug/)).toBeInTheDocument();
    expect(bugService.fetchBugs).toHaveBeenCalled();
  });

  it('allows toggling the debug panel', async () => {
    renderWithProviders(<App />);

    const toggleButton = screen.getByRole('button', { name: /show debug panel/i });
    await userEvent.click(toggleButton);
    expect(screen.getByTestId('debug-panel')).toBeInTheDocument();
  });

  it('submits new bugs and refetches the list', async () => {
    const initialBug = buildBug({ _id: '1', title: 'First bug' });
    const createdBug = buildBug({ _id: '2', title: 'Login broken', tags: ['frontend'] });

    bugService.fetchBugs.mockResolvedValueOnce([]).mockResolvedValueOnce([initialBug]).mockResolvedValueOnce([initialBug, createdBug]);
    bugService.createBug.mockResolvedValue(createdBug);

    renderWithProviders(<App />);

    expect(await screen.findByText(/No bugs yet/)).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/Title/), 'Login broken');
    await userEvent.type(screen.getByLabelText(/Reporter/), 'QA');
    await userEvent.click(screen.getByRole('button', { name: /Create bug/i }));

    await waitFor(() => expect(bugService.createBug).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(bugService.fetchBugs).toHaveBeenCalledTimes(3));
    expect(await screen.findByText(/Login broken/)).toBeInTheDocument();
  });
});

