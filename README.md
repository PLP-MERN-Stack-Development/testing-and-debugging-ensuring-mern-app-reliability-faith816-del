# MERN Bug Tracker – Testing & Debugging Playbook

This repository contains a fully tested MERN application that demonstrates how to build, test, and debug a production-ready bug tracker. It implements unit, integration, and end-to-end style workflows across the stack while surfacing practical debugging techniques on both the server and client.

## Project Layout

```
mern-bug-tracker/
├── client/                   # React + Vite frontend
│   ├── package.json
│   └── src/
│       ├── components/       # UI, error boundary, debugging aids
│       ├── context/          # React Query powered data provider
│       ├── hooks/            # API/query hooks (unit tested)
│       ├── services/         # Axios client with logging interceptors
│       └── tests/            # Jest + RTL unit & integration suites
├── server/                   # Express + Mongoose backend
│   ├── package.json
│   └── src/
│       ├── controllers/      # REST handlers with validation
│       ├── middleware/       # Error handling + AppError class
│       ├── models/           # Bug schema with indexes & validation
│       ├── routes/           # API routing
│       ├── config/           # Mongoose connection helpers
│       └── utils/            # Business logic helpers (unit tested)
└── jest.config.js            # Combined client/server Jest projects
```

Root `package.json` exposes npm workspaces so you can install, run, and test the whole stack with a single command.

## 1. Installation & Environment

1. Install all dependencies (client + server):
   ```bash
   npm install
   ```
2. Copy the environment example and provide a MongoDB connection string:
   ```bash
   cd mern-bug-tracker/server
   copy env.example .env    # Windows PowerShell: Copy-Item env.example .env
   ```
   `.env` must define `MONGO_URI`. For local development you can use MongoDB Atlas or a Docker container.

3. Start both apps in parallel:
   ```bash
   npm run dev
   ```
   - Client runs on `http://localhost:5173`
   - Server runs on `http://localhost:5000`

4. To seed some bugs quickly, submit a few entries via the UI or POST to `/api/bugs` with your tool of choice.

## 2. Testing Strategy

The testing approach layers fast unit tests, expressive integration tests, and coverage goals that exceed the 70% brief.

### Server (Jest + Supertest + Mongo Memory Server)

- **Unit**: `server/tests/unit/validators.test.js` ensures the validation helper sanitises data and guards required fields.
- **Integration**: `server/tests/integration/bugs.routes.test.js` spins up an in-memory MongoDB and exercises the REST API (create, list, update, delete) end-to-end.
- **Commands**:
  ```bash
  npm run test:server         # run once
  npm run test:server -- --watch
  npm run test:coverage --workspace server
  ```

### Client (Jest + React Testing Library)

- **Unit**: Component-level tests (`BugForm`, `BugList`) verify validation, conditional rendering, and error states.
- **Integration**: `App.integration.test.jsx` mocks the API service to cover the user workflow—loading bugs, submitting a new bug, and confirming the list refreshes.
- **Commands**:
  ```bash
  npm run test:client
  npm run test:coverage --workspace client
  ```

### Full Coverage Report

Aggregate both suites with:
```bash
npm run test:coverage
```
Coverage data is emitted to `coverage/client` and `coverage/server` plus a combined summary in the terminal. Capture screenshots of the HTML reports for submission.

## 3. Debugging Toolkit

| Layer     | Technique & Implementation |
|-----------|----------------------------|
| **Client** | - Axios interceptors in `client/src/services/bugService.js` log every request/response.<br>- A dedicated `DebugPanel` exposes React Query state to correlate with DevTools network traces.<br>- `BugForm` ships a “Simulate crash (debug)” button that intentionally throws, allowing you to observe the React error boundary workflow. |
| **Server** | - Express `AppError` class standardises error metadata and feeds the error-handling middleware.<br>- Toggle `DEBUG_FORCE_CREATE_FAILURE=true` to intentionally fail bug creation and practise using Node.js inspector (`node --inspect src/index.js`). |
| **DevTools** | - Chrome DevTools: monitor `/api/bugs` requests and React component renders.<br>- Node Inspector: `npm run dev` (server) + `node --inspect src/index.js` for breakpoints inside controllers.<br>- Console breadcrumbs (prefixed logs) highlight status transitions and make stack traces searchable. |

## 4. End-to-End & Manual Explorations

Formal Cypress tests are optional for this assignment, but the architecture supports dropping a `client/cypress` suite in place—API routes already expose predictable responses and the UI supplies data-testid hooks (`bug-list`, `debug-panel`, etc.).

For manual smoke runs:
1. Submit a bug.
2. Update its status from the backlog.
3. Delete it and confirm the list refreshes.
4. Toggle the debug panel and watch query/mutation state updates.

## 5. Useful Scripts

```bash
npm run dev                 # concurrently run client and server
npm run test                # execute both Jest projects
npm run test:server         # server-only suite
npm run test:client         # client-only suite
npm run test:coverage       # combined coverage (>= 70% target)
npm run start               # production server (expects `MONGO_URI`)
npm run clean               # remove coverage artifacts
```

## 6. Additional Notes

- The Express app only boots when `NODE_ENV !== 'test'`, allowing Jest to import the app without launching a listener.
- React Query invalidates cache on every mutation, guaranteeing fresh data after creates/updates/deletes.
- The UI is built with accessibility in mind—forms use semantic labels, `role="alert"` for validation messaging, and error boundaries reset gracefully.

## 7. Submission Checklist

- [x] All server + client unit/integration tests green.
- [x] Combined coverage ≥ 70% (include screenshots in your submission).
- [x] README documents setup, testing, and debugging strategy (this file).
- [x] Debugging hooks (intentional failures, console instrumentation, error boundary) are implemented and discoverable.
- [x] Push the repository to GitHub Classroom once satisfied.

Happy testing and debugging! 🎯