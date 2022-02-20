/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  maxWorkers: 1,
  testSequencer: "./__tests__/testSequencer.js",
  testPathIgnorePatterns: [
    "testSequencer.js",
    ],
  coveragePathIgnorePatterns: [
    "handlers.ts",
  ],
  reporters: [
    "default",
    ["jest-html-reporters", {
      "publicPath": "./public/status",
      "filename": "test.html",
      "openReport": true
    }]
  ]
};
