module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>../../src/tests'],
    testMatch: ['**/?(*.)+(spec|test).[jt]s?(x)'],
    collectCoverage: true,
    coverageDirectory: 'coverage'
   
  };
  