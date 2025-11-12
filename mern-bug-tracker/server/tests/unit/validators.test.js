const { validateBugPayload, sanitizeTags } = require('../../src/utils/validators');

describe('validateBugPayload', () => {
  it('returns valid for minimum required fields', () => {
    const payload = { title: 'Login bug', reporter: 'Sam' };
    const result = validateBugPayload(payload);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual({});
    expect(result.sanitizedPayload.title).toBe('Login bug');
  });

  it('returns errors for invalid status and priority', () => {
    const payload = {
      title: 'Cache issue',
      reporter: 'Jo',
      status: 'blocked',
      priority: 'urgent',
    };
    const result = validateBugPayload(payload);
    expect(result.isValid).toBe(false);
    expect(result.errors.status).toMatch(/Status must be one of/);
    expect(result.errors.priority).toMatch(/Priority must be one of/);
  });

  it('rejects invalid due date', () => {
    const result = validateBugPayload({
      title: 'API bug',
      reporter: 'Kai',
      dueDate: 'invalid-date',
    });
    expect(result.isValid).toBe(false);
    expect(result.errors.dueDate).toBeDefined();
  });
});

describe('sanitizeTags', () => {
  it('normalizes casing and removes blanks', () => {
    const tags = [' Frontend ', '', null, 'API', 'api'];
    expect(sanitizeTags(tags)).toEqual(['frontend', 'api', 'api']);
  });
});

