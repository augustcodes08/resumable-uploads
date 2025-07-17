/**
 * Basic tests for Resumable uploads library
 * These tests verify the core functionality of the Resumable class
 */

const Resumable = require("../resumable-uploads.js");

describe("Resumable", () => {
  describe("Constructor and Basic Properties", () => {
    test("should create a new Resumable instance with default options", () => {
      const resumable = new Resumable({});

      expect(resumable).toBeDefined();
      expect(resumable.support).toBeDefined();
      expect(resumable.files).toEqual([]);
      expect(resumable.opts).toBeDefined();
    });

    test("should create a new Resumable instance with custom options", () => {
      const options = {
        chunkSize: 512 * 1024, // 512KB
        simultaneousUploads: 5,
        target: "https://example.com/upload",
      };

      const resumable = new Resumable(options);

      expect(resumable.opts.chunkSize).toBe(512 * 1024);
      expect(resumable.opts.simultaneousUploads).toBe(5);
      expect(resumable.opts.target).toBe("https://example.com/upload");
    });

    // Not Needed for the test suite, but useful for understanding
    test("should have support property as boolean", () => {
      const resumable = new Resumable({});
      expect(typeof resumable.support).toBe("boolean");
    });

    // Not Needed for the test suite, but useful for understanding
    test("should initialize with empty files array", () => {
      const resumable = new Resumable({});
      expect(Array.isArray(resumable.files)).toBe(true);
      expect(resumable.files.length).toBe(0);
    });
  });

  describe("File Management", () => {
    let resumable;

    beforeEach(() => {
      resumable = new Resumable({
        target: "/upload",
      });
    });

    test("should add a file to the files array", () => {
      const mockFile = new File(["test content"], "test.txt", {
        type: "text/plain",
        size: 12,
      });

      resumable.addFile(mockFile);

      expect(resumable.files.length).toBe(1);
      expect(resumable.files[0].file).toBe(mockFile);
      expect(resumable.files[0].fileName).toBe("test.txt");
    });

    test("should add multiple files at once", () => {
      const mockFiles = [
        new File(["content 1"], "test1.txt", { type: "text/plain" }),
        new File(["content 2"], "test2.txt", { type: "text/plain" }),
      ];

      resumable.addFiles(mockFiles);

      expect(resumable.files.length).toBe(2);
      expect(resumable.files[0].fileName).toBe("test1.txt");
      expect(resumable.files[1].fileName).toBe("test2.txt");
    });

    test("should remove a file from the files array", () => {
      const mockFile = new File(["test content"], "test.txt", {
        type: "text/plain",
      });

      resumable.addFile(mockFile);
      expect(resumable.files.length).toBe(1);

      const resumableFile = resumable.files[0];
      resumable.removeFile(resumableFile);

      expect(resumable.files.length).toBe(0);
    });

    test("should get total size of all files", () => {
      const mockFiles = [
        new File(["a".repeat(100)], "test1.txt", { size: 100 }),
        new File(["b".repeat(200)], "test2.txt", { size: 200 }),
      ];

      resumable.addFiles(mockFiles);

      const totalSize = resumable.getSize();
      expect(totalSize).toBe(300);
    });
  });

  describe("Upload State Management", () => {
    let resumable;

    beforeEach(() => {
      resumable = new Resumable({
        target: "/upload",
      });
    });

    test("should return progress as 0 when no files are added", () => {
      const progress = resumable.progress();
      expect(progress).toBe(0);
    });

    test("should return false for isUploading when no upload is active", () => {
      const isUploading = resumable.isUploading();
      expect(isUploading).toBe(false);
    });

    // This could be more robust and check that the progress is not increasing when the upload is paused
    test("should handle pause functionality", () => {
      expect(() => resumable.pause()).not.toThrow();
    });

    test("should handle cancel functionality", () => {
      const mockFile = new File(["test"], "test.txt");
      resumable.addFile(mockFile);

      expect(() => resumable.cancel()).not.toThrow();
      expect(resumable.files.length).toBe(0);
    });
  });

  describe("Event Handling", () => {
    let resumable;

    beforeEach(() => {
      resumable = new Resumable({
        target: "/upload",
      });
    });

    test("should handle file added event", () => {
      const callback = jest.fn();
      resumable.on("fileAdded", callback);

      const mockFile = new File(["test"], "test.txt");
      resumable.addFile(mockFile);

      // The callback should be called when a file is added
      // Note: Implementation depends on the actual library behavior
    });
  });

  describe("DOM Assignment", () => {
    let resumable;
    let mockElement;

    beforeEach(() => {
      resumable = new Resumable({
        target: "/upload",
      });

      mockElement = {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        appendChild: jest.fn(),
        tagName: "DIV",
      };

      // Mock document.createElement for assignBrowse
      global.document.createElement = jest.fn(() => ({
        setAttribute: jest.fn(),
        removeAttribute: jest.fn(),
        addEventListener: jest.fn(),
        style: {},
        focus: jest.fn(),
        click: jest.fn(),
      }));
    });

    test("should assign browse functionality to DOM element", () => {
      expect(() => {
        resumable.assignBrowse(mockElement, false);
      }).not.toThrow();
    });

    test("should assign drop functionality to DOM element", () => {
      expect(() => {
        resumable.assignDrop(mockElement);
      }).not.toThrow();
    });

    test("should unassign drop functionality from DOM element", () => {
      expect(() => {
        resumable.unAssignDrop(mockElement);
      }).not.toThrow();
    });
  });

  describe("Configuration Options", () => {
    test("should handle target as string", () => {
      const resumable = new Resumable({
        target: "/upload",
      });

      expect(resumable.opts.target).toBe("/upload");
    });

    test("should handle target as function", () => {
      const targetFunction = (params) => `/upload/${params[0]}`;
      const resumable = new Resumable({
        target: targetFunction,
      });

      expect(typeof resumable.opts.target).toBe("function");
      expect(resumable.opts.target(["test"])).toBe("/upload/test");
    });

    test("should set default chunk size", () => {
      const resumable = new Resumable({});

      // Default chunk size should be 1MB (1*1024*1024)
      expect(resumable.getOpt("chunkSize")).toBe(1024 * 1024);
    });

    test("should respect custom chunk size", () => {
      const customChunkSize = 512 * 1024; // 512KB
      const resumable = new Resumable({
        chunkSize: customChunkSize,
      });

      expect(resumable.opts.chunkSize).toBe(customChunkSize);
    });

    test("should set default simultaneous uploads", () => {
      const resumable = new Resumable({});

      expect(resumable.getOpt("simultaneousUploads")).toBe(3);
    });

    test("should handle file size limits", () => {
      const resumable = new Resumable({
        maxFileSize: 10 * 1024 * 1024, // 10MB
        minFileSize: 1024, // 1KB
      });

      expect(resumable.opts.maxFileSize).toBe(10 * 1024 * 1024);
      expect(resumable.opts.minFileSize).toBe(1024);
    });

    test("should handle custom generateUniqueIdentifier function", () => {
      let counter = 0;
      const resumable = new Resumable({
        target: "/upload",
        generateUniqueIdentifier: (file) => `custom-${++counter}-${file.name}`,
      });

      const mockFile = new File(["test"], "test.txt", { size: 1000 });
      resumable.addFile(mockFile);

      const resumableFile = resumable.files[0];
      expect(resumableFile.uniqueIdentifier).toBe("custom-1-test.txt");
    });

    test("should handle custom headers function", () => {
      const resumable = new Resumable({
        target: "/upload",
        headers: (file) => ({
          "X-File-Name": file.fileName,
          "X-Custom-Header": "test-value",
        }),
      });

      const headers = resumable.getOpt("headers");

      expect(typeof resumable.getOpt("headers")).toBe("function");
      expect(headers({ fileName: "test.txt" })).toEqual({
        "X-File-Name": "test.txt",
        "X-Custom-Header": "test-value",
      });
    });

    test("should handle custom query parameters", () => {
      const resumable = new Resumable({
        target: "/upload",
        query: {
          userId: "123",
          sessionId: "abc",
        },
      });

      const query = resumable.getOpt("query");
      expect(query.userId).toBe("123");
      expect(query.sessionId).toBe("abc");
    });

    test("should handle prioritizeFirstAndLastChunk option", () => {
      const resumable = new Resumable({
        target: "/upload",
        prioritizeFirstAndLastChunk: true,
      });

      expect(resumable.getOpt("prioritizeFirstAndLastChunk")).toBe(true);
    });
  });

  describe("File Validation", () => {
    let resumable;

    beforeEach(() => {
      resumable = new Resumable({
        target: "/upload",
        maxFileSize: 5 * 1024 * 1024, // 5MB
        minFileSize: 1024, // 1KB
        fileType: ["image/jpeg", "image/png"],
        maxFiles: 2,
      });
    });

    test("should reject files that are too large", () => {
      const mockCallback = jest.fn();
      resumable.on("fileError", mockCallback);

      const largeFile = new File(["x".repeat(10 * 1024 * 1024)], "large.jpg", {
        type: "image/jpeg",
        size: 10 * 1024 * 1024, // 10MB - exceeds maxFileSize
      });

      resumable.addFile(largeFile);

      // Should not add the file due to size limit
      expect(resumable.files.length).toBe(0);
    });

    test("should reject files that are too small", () => {
      const mockCallback = jest.fn();
      resumable.on("fileError", mockCallback);

      const smallFile = new File(["x"], "small.jpg", {
        type: "image/jpeg",
        size: 100, // 100 bytes - below minFileSize
      });

      resumable.addFile(smallFile);

      // Should not add the file due to size limit
      expect(resumable.files.length).toBe(0);
    });

    test("should reject files with wrong type", () => {
      const mockCallback = jest.fn();
      resumable.on("fileError", mockCallback);

      const wrongTypeFile = new File(["content"], "document.pdf", {
        type: "application/pdf",
        size: 5000,
      });

      resumable.addFile(wrongTypeFile);

      // Should not add the file due to type restriction
      expect(resumable.files.length).toBe(0);
    });

    test("should accept valid files", () => {
      const validFile = new File(["valid content"], "image.jpg", {
        type: "image/jpeg",
        size: 2 * 1024 * 1024, // 2MB - within limits
      });

      resumable.addFile(validFile);

      expect(resumable.files.length).toBe(1);
      expect(resumable.files[0].fileName).toBe("image.jpg");
    });

    test("should enforce maxFiles limit", () => {
      const file1 = new File(["content1"], "image1.jpg", {
        type: "image/jpeg",
        size: 2000,
      });
      const file2 = new File(["content2"], "image2.jpg", {
        type: "image/jpeg",
        size: 2000,
      });
      const file3 = new File(["content3"], "image3.jpg", {
        type: "image/jpeg",
        size: 2000,
      });

      resumable.addFile(file1);
      resumable.addFile(file2);
      resumable.addFile(file3); // This should be rejected

      expect(resumable.files.length).toBe(2);
    });
  });

  describe("Event System", () => {
    let resumable;
    let eventCallbacks;

    beforeEach(() => {
      resumable = new Resumable({
        target: "/upload",
      });

      eventCallbacks = {
        fileAdded: jest.fn(),
        filesAdded: jest.fn(),
        fileSuccess: jest.fn(),
        fileError: jest.fn(),
        fileProgress: jest.fn(),
        uploadStart: jest.fn(),
        progress: jest.fn(),
        complete: jest.fn(),
        pause: jest.fn(),
        cancel: jest.fn(),
      };

      // Register all event listeners
      Object.keys(eventCallbacks).forEach((event) => {
        resumable.on(event, eventCallbacks[event]);
      });
    });

    test("should fire fileAdded event when adding a file", (done) => {
      const mockFile = new File(["test"], "test.txt", {
        type: "text/plain",
        size: 1000,
      });

      // Set up the event listener to complete the test when called
      eventCallbacks.fileAdded.mockImplementation((file, event) => {
        try {
          expect(file).toEqual(
            expect.objectContaining({
              fileName: "test.txt",
              file: mockFile,
            }),
          );
          done();
        } catch (error) {
          done(error);
        }
      });

      resumable.addFile(mockFile);
    });

    test("should fire filesAdded event when adding multiple files", (done) => {
      const mockFiles = [
        new File(["content1"], "file1.txt", { type: "text/plain", size: 1000 }),
        new File(["content2"], "file2.txt", { type: "text/plain", size: 1000 }),
      ];

      // Set up the event listener to complete the test when called
      eventCallbacks.filesAdded.mockImplementation((files, filesSkipped) => {
        try {
          expect(files).toEqual(
            expect.arrayContaining([
              expect.objectContaining({ fileName: "file1.txt" }),
              expect.objectContaining({ fileName: "file2.txt" }),
            ]),
          );
          expect(files.length).toBe(2);
          done();
        } catch (error) {
          done(error);
        }
      });

      resumable.addFiles(mockFiles);
    });

    test("should fire cancel event when canceling uploads", () => {
      const mockFile = new File(["test"], "test.txt", { size: 1000 });
      resumable.addFile(mockFile);

      resumable.cancel();

      expect(eventCallbacks.cancel).toHaveBeenCalled();
    });

    test("should fire pause event when pausing uploads", () => {
      resumable.pause();
      expect(eventCallbacks.pause).toHaveBeenCalled();
    });
  });

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

    // test('should report isUploading status', () => {
    //   resumable.upload();
    //   const isUploading = resumableFile.isUploading();
    //   expect(typeof isUploading).toBe('boolean');
    //   expect(isUploading).toBe(true);
    // });

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

  describe("Upload Progress and State", () => {
    let resumable;

    beforeEach(() => {
      resumable = new Resumable({
        target: "/upload",
      });
    });

    test("should calculate total progress across multiple files", () => {
      const file1 = new File(["content1"], "file1.txt", { size: 1000 });
      const file2 = new File(["content2"], "file2.txt", { size: 2000 });

      resumable.addFiles([file1, file2]);

      const progress = resumable.progress();
      expect(typeof progress).toBe("number");
      expect(progress).toBeGreaterThanOrEqual(0);
      expect(progress).toBeLessThanOrEqual(1);
    });

    test("should find file by unique identifier", () => {
      const mockFile = new File(["test"], "test.txt", { size: 1000 });
      resumable.addFile(mockFile);

      const resumableFile = resumable.files[0];
      const foundFile = resumable.getFromUniqueIdentifier(
        resumableFile.uniqueIdentifier,
      );

      expect(foundFile).toBe(resumableFile);
    });

    test("should return null for non-existent identifier", () => {
      const foundFile = resumable.getFromUniqueIdentifier("non-existent-id");
      expect(foundFile).toBe(false);
    });
  });
});
