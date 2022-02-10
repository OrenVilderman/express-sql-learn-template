/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  reporters: [
    "default",
    ["jest-html-reporters", {
      "publicPath": "./public/status",
      "filename": "test.html",
      "openReport": true
    }]
  ]
};