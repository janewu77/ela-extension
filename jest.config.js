module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '\\.mock\\.js$' // 忽略 .mock.js 文件
  ],
  moduleNameMapper: {
    '^scripts/(.*)$': '<rootDir>/src/scripts/$1'
  },
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.min.js',
    '!src/scripts/marked.min.js'
  ],
  coverageDirectory: 'coverage',
  verbose: true
};
