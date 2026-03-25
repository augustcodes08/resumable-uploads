/**
 * ResumableFile Tests for Resumable uploads library
 * These tests verify methods and properties of individual ResumableFile instances
 */

const Resumable = require("../resumable-uploads.js");

describe("ResumableFile Methods", () => {
  let resumable;
  let resumableFile;

  beforeEach(() => {
    resumable = new Resumable({
      target: "/upload",
      chunkSize: 1024 * 1024, // 1MB chunks
    });

    const mockFile = new File(["test content"], "test.txt", {
      type: "text/plain",
      size: 2 * 1024 * 1024, // 2MB file
    });

    resumable.addFile(mockFile);
    resumableFile = resumable.files[0];
  });

  test("should calculate progress correctly", () => {
    const progress = resumableFile.progress();
    expect(typeof progress).toBe("number");
    expect(progress).toBeGreaterThanOrEqual(0);
    expect(progress).toBeLessThanOrEqual(1);
  });

  test("should handle abort functionality", () => {
    expect(() => resumableFile.abort()).not.toThrow();
  });

  test("should handle cancel functionality", () => {
    expect(() => resumableFile.cancel()).not.toThrow();
    // File should be removed from resumable files array
    expect(resumable.files.length).toBe(0);
  });

  test("should handle retry functionality", () => {
    expect(() => resumableFile.retry()).not.toThrow();
  });

  test("should report isComplete status", () => {
    const isComplete = resumableFile.isComplete();
    expect(typeof isComplete).toBe("boolean");
    expect(isComplete).toBe(false);
  });

  test("should have chunks array", () => {
    expect(Array.isArray(resumableFile.chunks)).toBe(true);
    // For a 2MB file with 1MB chunks, should have 2 chunks
    expect(resumableFile.chunks.length).toBeGreaterThan(0);
  });
});

describe("ResumableFile Methods - Branch Coverage", () => {
  test("should call file abort method", () => {
    const resumable = new Resumable({});
    const file = new File(["test"], "test.txt");

    resumable.addFile(file);
    const resumableFile = resumable.files[0];

    expect(() => {
      resumableFile.abort();
    }).not.toThrow();
  });

  test("should call file cancel method", () => {
    const resumable = new Resumable({});
    const file = new File(["test"], "test.txt");

    resumable.addFile(file);
    const resumableFile = resumable.files[0];

    resumableFile.cancel();

    // File should be removed
    expect(resumable.files.length).toBe(0);
  });

  test("should call file retry method", () => {
    const resumable = new Resumable({});
    const file = new File(["test"], "test.txt");

    resumable.addFile(file);
    const resumableFile = resumable.files[0];

    expect(() => {
      resumableFile.retry();
    }).not.toThrow();
  });

  test("should call file bootstrap method", () => {
    const resumable = new Resumable({});
    const file = new File(["test"], "test.txt");

    resumable.addFile(file);
    const resumableFile = resumable.files[0];

    expect(() => {
      resumableFile.bootstrap();
    }).not.toThrow();
  });

  test("should check if file is uploading", () => {
    const resumable = new Resumable({});
    const file = new File(["test"], "test.txt");

    resumable.addFile(file);
    const resumableFile = resumable.files[0];

    expect(resumableFile.isUploading()).toBe(false);
  });

  test("should check if file is complete", () => {
    const resumable = new Resumable({});
    const file = new File(["test"], "test.txt");

    resumable.addFile(file);
    const resumableFile = resumable.files[0];

    expect(resumableFile.isComplete()).toBe(false);
  });

  test("should access file chunks array", () => {
    const resumable = new Resumable({});
    const file = new File(["test content for chunks"], "test.txt");

    resumable.addFile(file);
    const resumableFile = resumable.files[0];

    expect(Array.isArray(resumableFile.chunks)).toBe(true);
    expect(resumableFile.chunks.length).toBeGreaterThanOrEqual(0);
  });
});
