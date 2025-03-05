module.exports = {
  projects: [
    '<rootDir>/shared/jest.config.js',
    '<rootDir>/services/*/jest.config.js'
  ],
  moduleNameMapper: {
    '@optifit/shared': '<rootDir>/shared/dist'
  },
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'clover'],
  collectCoverageFrom: [
    '<rootDir>/services/*/src/**/*.ts',
    '<rootDir>/shared/**/*.ts',
    '!<rootDir>/**/*.spec.ts',
    '!<rootDir>/**/*.e2e-spec.ts',
    '!<rootDir>/**/*.module.ts',
    '!<rootDir>/**/main.ts',
    '!<rootDir>/**/index.ts'
  ],
  coverageThreshold: {
    global: {
      statements: 70,
      branches: 60,
      functions: 70,
      lines: 70
    }
  }
};
