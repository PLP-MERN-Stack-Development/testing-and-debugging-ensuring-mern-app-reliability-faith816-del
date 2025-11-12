const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const Bug = require('../../src/models/Bug');

const buildBugPayload = (overrides = {}) => ({
  title: 'Crash on submit',
  description: 'Form submission crashes in production',
  reporter: 'QA Tester',
  assignee: 'Engineer',
  priority: 'high',
  status: 'open',
  tags: ['ui', 'regression'],
  ...overrides,
});

describe('Bug routes', () => {
  describe('POST /api/bugs', () => {
    it('creates a bug with valid data', async () => {
      const payload = buildBugPayload();

      const response = await request(app).post('/api/bugs').send(payload).expect(201);

      expect(response.body).toMatchObject({
        title: payload.title,
        reporter: payload.reporter,
        priority: payload.priority,
        status: payload.status,
      });

      const bugsInDb = await Bug.find();
      expect(bugsInDb).toHaveLength(1);
    });

    it('rejects invalid payload', async () => {
      const response = await request(app).post('/api/bugs').send({ title: 'a' }).expect(422);
      expect(response.body.details.title).toBeDefined();
      expect(response.body.details.reporter).toBeDefined();
    });
  });

  describe('GET /api/bugs', () => {
    it('returns all bugs', async () => {
      await Bug.create([buildBugPayload(), buildBugPayload({ title: 'Another bug', reporter: 'Sam' })]);

      const response = await request(app).get('/api/bugs').expect(200);
      expect(response.body).toHaveLength(2);
    });
  });

  describe('PATCH /api/bugs/:id', () => {
    it('updates an existing bug', async () => {
      const bug = await Bug.create(buildBugPayload());
      const response = await request(app)
        .patch(`/api/bugs/${bug._id}`)
        .send({ status: 'in-progress' })
        .expect(200);

      expect(response.body.status).toBe('in-progress');
    });

    it('returns 404 for unknown bug', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app).patch(`/api/bugs/${fakeId}`).send({ status: 'resolved' }).expect(404);
      expect(response.body.message).toMatch(/not found/);
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    it('deletes a bug', async () => {
      const bug = await Bug.create(buildBugPayload());

      await request(app).delete(`/api/bugs/${bug._id}`).expect(204);

      const bugs = await Bug.find();
      expect(bugs).toHaveLength(0);
    });
  });
});

