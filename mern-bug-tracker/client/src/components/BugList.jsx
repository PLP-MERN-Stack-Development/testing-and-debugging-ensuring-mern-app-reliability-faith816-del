import { useBugContext } from '../context/BugContext';
import { BugItem } from './BugItem';
import { EmptyState } from './EmptyState';

export const BugList = () => {
  const { bugs, isLoading, isError, error, refetch } = useBugContext();

  if (isLoading) {
    return (
      <div className="skeleton-list">
        <div className="skeleton-card" aria-hidden="true" data-testid="skeleton-card" />
        <div className="skeleton-card" aria-hidden="true" data-testid="skeleton-card" />
        <div className="skeleton-card" aria-hidden="true" data-testid="skeleton-card" />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        title="Unable to load bugs"
        message={error?.message || 'Check the network tab or server logs for more detail.'}
        action={
          <button type="button" className="btn-secondary" onClick={() => refetch()}>
            Retry
          </button>
        }
      />
    );
  }

  if (!bugs.length) {
    return (
      <EmptyState
        title="No bugs yet"
        message="Track your first bug by filling out the form above."
        action={
          <span role="note" className="note">
            Tip: Try creating an intentional bug to practise debugging tools.
          </span>
        }
      />
    );
  }

  return (
    <div className="bug-grid" data-testid="bug-list">
      {bugs.map((bug) => (
        <BugItem key={bug._id} bug={bug} />
      ))}
    </div>
  );
};

