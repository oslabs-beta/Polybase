module.exports = {
    testEnvironment: 'node',
    verbose: true,
    testMatch: ['**/__tests__/**/*.test.js'], // Look for test files in the __tests__ directory
    collectCoverage: true, // Enable coverage reporting
    coverageDirectory: 'coverage', // Output coverage reports to the coverage directory
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1', // Adjust based on your directory structure
    },
  };