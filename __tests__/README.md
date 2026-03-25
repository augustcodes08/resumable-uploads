# Test Organization

This directory contains the test suite for the Resumable uploads library. Tests have been organized into modular files based on functionality for better maintainability and readability.

## Test Structure

### Core Test Files

- **`constructor-and-configuration.test.js`** (48 tests)

  - Constructor initialization and options
  - Configuration option handling (string/function variants)
  - Branch coverage for configuration variations
  - Custom callbacks and function-based parameters

- **`file-management.test.js`** (9 tests)

  - Adding files (single and multiple)
  - Removing files
  - File size calculations
  - Duplicate file handling
  - Edge cases for file operations

- **`file-validation.test.js`** (18 tests)

  - File size validation (min/max)
  - File type validation
  - Max files limit enforcement
  - Multiple validation error scenarios
  - Edge cases and boundary conditions

- **`event-system.test.js`** (15 tests)

  - Event subscription and firing
  - Event handlers (fileAdded, filesAdded, etc.)
  - Case-insensitive event names
  - CatchAll event handling
  - Multiple handlers per event

- **`upload-and-progress.test.js`** (38 tests)

  - Upload state management
  - Progress calculation
  - Upload control methods (upload, pause, cancel)
  - getOpt method with various parameters
  - Unique identifier lookup
  - Event firing during upload operations

- **`resumable-file.test.js`** (13 tests)

  - ResumableFile instance methods
  - Progress calculation for individual files
  - File control methods (abort, cancel, retry, bootstrap)
  - Upload status checking (isUploading, isComplete)
  - Chunks array access

- **`dom-integration.test.js`** (3 tests)
  - DOM element assignment for file browsing
  - Drag-and-drop functionality
  - Element unassignment

### Helper Files

- **`helpers/test-setup.js`**
  - Shared test utilities and helper functions
  - Mock file creation helpers
  - Resumable instance factory
  - Common test setup functions

## Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test File

```bash
npm test constructor-and-configuration.test.js
npm test file-validation.test.js
# etc.
```

### Run Tests in Watch Mode

```bash
npm run test:watch
```

### Run Tests with Coverage

```bash
npm run test:coverage
```

## Test Coverage Goals

The test suite maintains the following coverage thresholds:

- **Statements**: 40%
- **Branches**: 40%
- **Functions**: 40%
- **Lines**: 40%

These thresholds are configured in `jest.config.js` and are enforced during CI runs.

## Writing New Tests

When adding new tests:

1. **Choose the appropriate file** based on the functionality being tested
2. **Use the helper utilities** from `helpers/test-setup.js` when possible
3. **Follow existing patterns** for consistency
4. **Add descriptive test names** that clearly explain what is being tested
5. **Include edge cases** and boundary conditions
6. **Mock external dependencies** appropriately (File API, XHR, etc.)

## Test Environment

- **Test Runner**: Jest
- **Environment**: JSDOM (simulates browser environment)
- **Setup**: `jest.setup.js` provides global mocks for browser APIs
- **Mocked APIs**: File, FileReader, XMLHttpRequest

## Common Test Patterns

### Creating Mock Files

```javascript
const mockFile = new File(["content"], "filename.txt", {
  type: "text/plain",
  size: 1000,
});
```

### Testing Events

```javascript
const callback = jest.fn();
resumable.on("fileAdded", callback);
resumable.addFile(mockFile);
expect(callback).toHaveBeenCalled();
```

### Testing Configuration Options

```javascript
const resumable = new Resumable({
  chunkSize: 1024,
  target: "/upload",
});
expect(resumable.opts.chunkSize).toBe(1024);
```

## Maintenance Notes

- Tests are automatically run on every push via CI/CD
- Coverage reports are uploaded to Codecov
- All tests must pass before merging pull requests
- When refactoring, ensure all tests continue to pass
- Update test documentation when adding new test files
