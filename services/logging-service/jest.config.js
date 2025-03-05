module.exports = {
  displayName: 'logging-service',
  preset: '../../jest.preset.js',
  globals: {
    'ts-jest': {
      tsconfig: '<rootDir>/tsconfig.spec.json',
    },
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../coverage/services/logging-service',
  moduleNameMapper: {
    '^@optifit/shared(.*)$': '<rootDir>/../../shared/dist$1',
  },
};
