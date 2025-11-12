import { useCallback, useMemo, useState } from 'react';
import { useBugContext } from '../context/BugContext';

const STATUS_OPTIONS = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In progress' },
  { value: 'resolved', label: 'Resolved' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const initialState = {
  title: '',
  description: '',
  reporter: '',
  assignee: '',
  status: 'open',
  priority: 'medium',
  tags: '',
  dueDate: '',
};

export const BugForm = () => {
  const { createBug, createBugStatus } = useBugContext();
  const [formState, setFormState] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [shouldCrash, setShouldCrash] = useState(false);

  if (shouldCrash) {
    throw new Error('Intentional error for practising the React error boundary.');
  }

  const tagsArray = useMemo(
    () =>
      formState.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    [formState.tags]
  );

  const validate = useCallback(() => {
    const validationErrors = {};
    if (formState.title.trim().length < 3) {
      validationErrors.title = 'Title must be at least 3 characters long';
    }
    if (formState.reporter.trim().length === 0) {
      validationErrors.reporter = 'Reporter is required';
    }
    if (!STATUS_OPTIONS.some((status) => status.value === formState.status)) {
      validationErrors.status = 'Select a valid status';
    }
    if (!PRIORITY_OPTIONS.some((priority) => priority.value === formState.priority)) {
      validationErrors.priority = 'Select a valid priority';
    }
    if (tagsArray.length > 5) {
      validationErrors.tags = 'Limit tags to five';
    }
    return validationErrors;
  }, [formState, tagsArray.length]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    const payload = {
      title: formState.title.trim(),
      description: formState.description.trim(),
      reporter: formState.reporter.trim(),
      assignee: formState.assignee.trim(),
      status: formState.status,
      priority: formState.priority,
      tags: tagsArray,
      dueDate: formState.dueDate || undefined,
    };

    // eslint-disable-next-line no-console
    console.debug('[BugForm] submitting payload', payload);

    try {
      await createBug(payload);
      setFormState(initialState);
    } catch (error) {
      setErrors({
        global: error?.response?.data?.message || 'Failed to create bug. Please try again.',
      });
    }
  };

  const isSubmitting = createBugStatus === 'pending';

  return (
    <form className="bug-form" onSubmit={handleSubmit} noValidate>
      {errors.global && (
        <div role="alert" className="alert">
          {errors.global}
        </div>
      )}
      <div className="form-grid">
        <label htmlFor="title">
          Title<span aria-hidden="true">*</span>
          <input id="title" name="title" value={formState.title} onChange={handleChange} required />
          {errors.title && (
            <span role="alert" className="field-error">
              {errors.title}
            </span>
          )}
        </label>

        <label htmlFor="reporter">
          Reporter<span aria-hidden="true">*</span>
          <input id="reporter" name="reporter" value={formState.reporter} onChange={handleChange} required />
          {errors.reporter && (
            <span role="alert" className="field-error">
              {errors.reporter}
            </span>
          )}
        </label>

        <label htmlFor="assignee">
          Assignee
          <input id="assignee" name="assignee" value={formState.assignee} onChange={handleChange} />
        </label>

        <label htmlFor="status">
          Status
          <select id="status" name="status" value={formState.status} onChange={handleChange}>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <span role="alert" className="field-error">
              {errors.status}
            </span>
          )}
        </label>

        <label htmlFor="priority">
          Priority
          <select id="priority" name="priority" value={formState.priority} onChange={handleChange}>
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.priority && (
            <span role="alert" className="field-error">
              {errors.priority}
            </span>
          )}
        </label>

        <label htmlFor="dueDate">
          Due date
          <input id="dueDate" name="dueDate" type="date" value={formState.dueDate} onChange={handleChange} />
        </label>
      </div>

      <label htmlFor="description">
        Description
        <textarea
          id="description"
          name="description"
          value={formState.description}
          onChange={handleChange}
          rows={4}
          placeholder="Describe reproduction steps, expected behaviour, and screenshots"
        />
      </label>

      <label htmlFor="tags">
        Tags (comma separated)
        <input
          id="tags"
          name="tags"
          value={formState.tags}
          onChange={handleChange}
          placeholder="frontend, api, regression"
        />
        {errors.tags && (
          <span role="alert" className="field-error">
            {errors.tags}
          </span>
        )}
      </label>

      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Creating…' : 'Create bug'}
      </button>
      <button
        type="button"
        className="btn-secondary"
        onClick={() => setShouldCrash(true)}
        aria-label="Trigger intentional bug for debugging"
      >
        Simulate crash (debug)
      </button>
    </form>
  );
};

