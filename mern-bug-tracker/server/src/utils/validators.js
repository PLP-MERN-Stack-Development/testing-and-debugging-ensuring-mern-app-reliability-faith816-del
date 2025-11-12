const { PRIORITIES, STATUSES } = require('../models/Bug');

const sanitizeTags = (tags) => {
  if (!Array.isArray(tags)) {
    return undefined;
  }

  return tags
    .filter(Boolean)
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0);
};

const defaultOptions = {
  requireTitle: true,
  requireReporter: true,
};

const validateBugPayload = (payload = {}, options = defaultOptions) => {
  const config = { ...defaultOptions, ...options };
  const errors = {};

  if (typeof payload.title === 'string') {
    if (payload.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters long';
    }
  } else if (config.requireTitle) {
    errors.title = 'Title must be at least 3 characters long';
  }

  if (typeof payload.reporter === 'string') {
    if (payload.reporter.trim().length === 0) {
      errors.reporter = 'Reporter is required';
    }
  } else if (config.requireReporter) {
    errors.reporter = 'Reporter is required';
  }

  if (payload.priority && !PRIORITIES.includes(payload.priority)) {
    errors.priority = `Priority must be one of: ${PRIORITIES.join(', ')}`;
  }

  if (payload.status && !STATUSES.includes(payload.status)) {
    errors.status = `Status must be one of: ${STATUSES.join(', ')}`;
  }

  if (payload.dueDate) {
    const due = new Date(payload.dueDate);
    if (Number.isNaN(due.getTime())) {
      errors.dueDate = 'Due date must be a valid date string';
    }
  }

  const tags = sanitizeTags(payload.tags);
  if (Array.isArray(tags) && tags.length > 5) {
    errors.tags = 'A maximum of five tags is allowed';
  }

  const sanitizedPayload = {
    ...payload,
  };

  if (typeof payload.title === 'string') {
    sanitizedPayload.title = payload.title.trim();
  }

  if (typeof payload.reporter === 'string') {
    sanitizedPayload.reporter = payload.reporter.trim();
  }

  if (typeof payload.description === 'string') {
    sanitizedPayload.description = payload.description.trim();
  }

  if (typeof payload.assignee === 'string') {
    sanitizedPayload.assignee = payload.assignee.trim();
  }

  if (Array.isArray(tags)) {
    sanitizedPayload.tags = tags;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    sanitizedPayload,
  };
};

module.exports = {
  sanitizeTags,
  validateBugPayload,
};

