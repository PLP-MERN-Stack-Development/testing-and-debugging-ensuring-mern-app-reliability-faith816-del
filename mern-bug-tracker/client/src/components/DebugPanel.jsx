import { useMemo } from 'react';
import { useBugContext } from '../context/BugContext';

export const DebugPanel = () => {
  const { bugs, queryState } = useBugContext();

  const debugPayload = useMemo(
    () => ({
      bugsCount: bugs.length,
      isFetching: queryState.isFetching,
      fetchStatus: queryState.fetchStatus,
      lastUpdated: queryState.dataUpdatedAt,
      mutationStates: {
        create: {
          status: queryState.createBugMutation.status,
          isPending: queryState.createBugMutation.isPending,
        },
        update: {
          status: queryState.updateBugMutation.status,
          isPending: queryState.updateBugMutation.isPending,
        },
        delete: {
          status: queryState.deleteBugMutation.status,
          isPending: queryState.deleteBugMutation.isPending,
        },
      },
    }),
    [bugs.length, queryState]
  );

  return (
    <aside className="debug-panel" data-testid="debug-panel">
      <h2>Debug panel</h2>
      <p>
        Open your browser DevTools to observe network requests, React Query Devtools, and component renders while
        interacting with the app.
      </p>
      <pre>{JSON.stringify(debugPayload, null, 2)}</pre>
    </aside>
  );
};

export default DebugPanel;

