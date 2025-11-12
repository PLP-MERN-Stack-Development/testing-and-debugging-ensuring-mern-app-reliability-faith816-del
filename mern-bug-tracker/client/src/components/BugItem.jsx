import PropTypes from 'prop-types';
import { useBugContext } from '../context/BugContext';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
];

export const BugItem = ({ bug }) => {
  const { updateBug, deleteBug, updateBugStatus, deleteBugStatus } = useBugContext();
  const isUpdating = updateBugStatus === 'pending';
  const isDeleting = deleteBugStatus === 'pending';

  const handleStatusChange = async (event) => {
    const nextStatus = event.target.value;
    // eslint-disable-next-line no-console
    console.debug('[BugItem] status change requested', { id: bug._id, nextStatus });

    try {
      await updateBug({ id: bug._id, updates: { status: nextStatus } });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[BugItem] Failed to update status', error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBug(bug._id);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[BugItem] Failed to delete bug', error);
    }
  };

  return (
    <article className="bug-item">
      <header>
        <h3>{bug.title}</h3>
        <span className={`badge badge-${bug.priority}`}>{bug.priority}</span>
      </header>
      <p className="bug-description">{bug.description || 'No description provided'}</p>
      <dl className="bug-meta">
        <div>
          <dt>Reporter</dt>
          <dd>{bug.reporter}</dd>
        </div>
        <div>
          <dt>Assignee</dt>
          <dd>{bug.assignee || 'Unassigned'}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>
            <select value={bug.status} onChange={handleStatusChange} disabled={isUpdating}>
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </dd>
        </div>
        {bug.dueDate && (
          <div>
            <dt>Due</dt>
            <dd>{new Date(bug.dueDate).toLocaleDateString()}</dd>
          </div>
        )}
      </dl>
      {bug.tags?.length > 0 && (
        <ul className="tag-list">
          {bug.tags.map((tag) => (
            <li key={tag} className="tag">
              {tag}
            </li>
          ))}
        </ul>
      )}
      <footer className="bug-actions">
        <button type="button" className="btn-link" onClick={handleDelete} disabled={isDeleting}>
          {isDeleting ? 'Deleting…' : 'Delete'}
        </button>
      </footer>
    </article>
  );
};

BugItem.propTypes = {
  bug: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    reporter: PropTypes.string.isRequired,
    assignee: PropTypes.string,
    status: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string),
    dueDate: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
};

