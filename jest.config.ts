module.exports = {
    clearMocks: true,
    collectCoverage: true,
    coverageDirectory: "coverage",
    coveragePathIgnorePatterns: [
      "/knexfile.ts",
      "/node_modules/",
      "/src/shared",
      "/src/migrations/",
      "/tests/",
      "/src/utils",
    ],
    coverageReporters: ["lcov", "text"],
    coverageThreshold: {
      global: {
        branches: 60,
        functions: 60,
        lines: 60,
        statements: 60,
      },
    },
    globals: {
      "ts-jest": {
        diagnostics: false,
        isolatedModules: true,
      },
    },
    modulePaths: ["<rootDir>/src/"],
    preset: "ts-jest",
    setupFilesAfterEnv: ["<rootDir>/tests/setup.ts"],
    testEnvironment: "node",
    testMatch: ["**/tests/**/*.test.ts?(x)"],
  };