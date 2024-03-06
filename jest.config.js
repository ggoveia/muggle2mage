module.exports = {
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./test/setup.js'],
  moduleNameMapper: {
    '^node-fetch$': "<rootDir>/mocks/node-fetch.js"
  }
}