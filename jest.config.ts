// jest.config.js
const {defaults} = require('jest-config');
module.exports = {
  // ...
  testEnvironment: "node",
  testRegex: "(/__test__/.*|(\\.|/)(test|spec|pact))\\.tsx?$",
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'ts', 'tsx'],
  // ...
};

