module.exports = {
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest',
  },
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./test/setup.js'],
}