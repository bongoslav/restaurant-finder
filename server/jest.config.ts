module.exports = {
  preset: "ts-jest",
  "roots": [
    "<rootDir>/src"
  ],
  "globalSetup": "<rootDir>/src/testing/globalSetup.ts",
  "globalTeardown": "<rootDir>/src/testing/globalTeardown.ts",
}
