/** @type {import('jest').Config} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",

  // Test file patterns
  testMatch: ["**/__tests__/**/*.(ts|tsx|js)", "**/*.(test|spec).(ts|tsx|js)"],

  // Setup files
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Coverage configuration
  collectCoverage: false, // Enable with --coverage flag
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  collectCoverageFrom: ["resumable-uploads.js", "!node_modules/**", "!coverage/**", "!**/*.d.ts"],

  // Coverage thresholds
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 40,
      lines: 40,
      statements: 40,
    },
  },

  // Module resolution
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],

  // Transform configuration
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },

  // Add transformIgnorePatterns to include our main file
  transformIgnorePatterns: ["/node_modules/(?!(resumable-uploads\\.js))"],

  // Ignore patterns
  testPathIgnorePatterns: ["/node_modules/", "/coverage/", "__tests__/helpers/"],

  // Verbose output
  verbose: true,

  // Clear mocks between tests
  clearMocks: true,

  // Restore mocks after each test
  restoreMocks: true,
};
