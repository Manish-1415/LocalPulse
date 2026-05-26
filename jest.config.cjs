module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  moduleNameMapper: {
    // This strips the .js extension off your imports so Jest can find the raw .ts files
    '^(\\.{1,2}/.*)\\.js$': '$1', 
  }
};
