const { pathsToModuleNameMapper } = require("ts-jest");
const { compilerOptions } = require("./jsconfig.json");

module.exports = {
  testEnvironment: "node",
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: "<rootDir>/",
  }),
};
