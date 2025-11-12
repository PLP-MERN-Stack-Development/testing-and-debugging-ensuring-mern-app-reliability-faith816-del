// jest.config.js - Root Jest configuration file

module.exports = {
  // Base configuration for all tests
  projects: [
    // Server-side tests configuration
    {
      displayName: 'server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/mern-bug-tracker/server/tests/**/*.test.js'],
      moduleFileExtensions: ['js', 'json', 'node'],
      setupFilesAfterEnv: ['<rootDir>/mern-bug-tracker/server/tests/setup.js'],
      coverageDirectory: '<rootDir>/coverage/server',
      collectCoverageFrom: [
        'mern-bug-tracker/server/src/**/*.js',
        '!mern-bug-tracker/server/src/config/**',
        '!**/node_modules/**',
      ],
    },
    
    // Client-side tests configuration
    {
      displayName: 'client',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/mern-bug-tracker/client/src/**/*.test.{js,jsx}'],
      moduleFileExtensions: ['js', 'jsx', 'json'],
      moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/mern-bug-tracker/client/src/tests/__mocks__/fileMock.js',
      },
      setupFilesAfterEnv: ['<rootDir>/mern-bug-tracker/client/src/tests/setup.js'],
      transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
      },
      coverageDirectory: '<rootDir>/coverage/client',
      collectCoverageFrom: [
        'mern-bug-tracker/client/src/**/*.{js,jsx}',
        '!mern-bug-tracker/client/src/main.jsx',
        '!**/node_modules/**',
      ],
    },
  ],
  
  // Global configuration
  verbose: true,
  collectCoverage: true,
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70,
    },
  },
  testTimeout: 10000,
}; 