import { useState } from 'react';
import { BugProvider } from './context/BugContext';
import { BugForm } from './components/BugForm';
import { BugList } from './components/BugList';
import { ErrorBoundary } from './components/ErrorBoundary';
import { DebugPanel } from './components/DebugPanel';

export default function App() {
  const [showDebugPanel, setShowDebugPanel] = useState(false);

  return (
    <BugProvider>
      <div className="app-shell">
        <header className="app-header">
          <div>
            <h1>MERN Bug Tracker</h1>
            <p className="app-subtitle">Track, triage, and resolve bugs with confidence.</p>
          </div>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowDebugPanel((prev) => !prev)}
            aria-pressed={showDebugPanel}
          >
            {showDebugPanel ? 'Hide Debug Panel' : 'Show Debug Panel'}
          </button>
        </header>

        <main className="app-content">
          <ErrorBoundary>
            <section aria-labelledby="report-bug-heading" className="card">
              <h2 id="report-bug-heading">Report a Bug</h2>
              <BugForm />
            </section>
            <section aria-labelledby="bugs-list-heading" className="card">
              <h2 id="bugs-list-heading">Bug Backlog</h2>
              <BugList />
            </section>
          </ErrorBoundary>
        </main>

        {showDebugPanel && <DebugPanel />}

        <footer className="app-footer">
          <span>Application version {__APP_VERSION__}</span>
        </footer>
      </div>
    </BugProvider>
  );
}

