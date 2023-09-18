export default {
  preset: "ts-jest",
  "roots": [
    "<rootDir>/src/testing/__tests__"
  ],
  "globalSetup": "<rootDir>/src/testing/globalSetup.ts",
  "globalTeardown": "<rootDir>/src/testing/globalTeardown.ts",
}
