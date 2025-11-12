import '@testing-library/jest-dom';
import 'whatwg-fetch';

global.__APP_VERSION__ = 'test';

beforeEach(() => {
  jest.clearAllMocks();
});

