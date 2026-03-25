/**
 * Shared test setup and utilities for Resumable tests
 */

const Resumable = require("../../resumable-uploads.js");

/**
 * Helper to create a mock File object
 * @param {string} content - File content
 * @param {string} filename - File name
 * @param {Object} options - File options (type, etc)
 * @returns {File} Mock file object
 */
function createMockFile(content, filename, options = {}) {
  return new File([content], filename, options);
}

/**
 * Helper to create an array of mock files
 * @param {number} count - Number of files to create
 * @param {string} prefix - Filename prefix
 * @returns {File[]} Array of mock files
 */
function createMockFiles(count, prefix = "file") {
  const files = [];
  for (let i = 0; i < count; i++) {
    files.push(createMockFile(`content${i}`, `${prefix}${i}.txt`));
  }
  return files;
}

/**
 * Helper to create a Resumable instance with default test config
 * @param {Object} options - Configuration options
 * @returns {Resumable} Resumable instance
 */
function createResumable(options = {}) {
  return new Resumable(options);
}

module.exports = {
  Resumable,
  createMockFile,
  createMockFiles,
  createResumable,
};
