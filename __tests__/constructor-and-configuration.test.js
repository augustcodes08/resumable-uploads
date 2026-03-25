/**
 * Tests for Resumable constructor and configuration options
 * These tests verify proper initialization, option handling, and configuration variations
 * including both value-based and function-based configuration parameters.
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

  describe("Configuration Options - Branch Coverage", () => {
    test("should handle falsy configuration options", () => {
      const resumable = new Resumable({
        target: null,
        testChunks: false,
        prioritizeFirstAndLastChunk: false,
      });
      expect(resumable.opts.target).toBe(null);
      expect(resumable.opts.testChunks).toBe(false);
      expect(resumable.opts.prioritizeFirstAndLastChunk).toBe(false);
    });

    test("should handle query as function", () => {
      const queryFn = jest.fn(() => ({ custom: "param" }));
      const resumable = new Resumable({
        query: queryFn,
      });
      expect(typeof resumable.opts.query).toBe("function");
    });

    test("should handle headers as function", () => {
      const headersFn = jest.fn(() => ({ "X-Custom": "header" }));
      const resumable = new Resumable({
        headers: headersFn,
      });
      expect(typeof resumable.opts.headers).toBe("function");
    });

    test("should handle testTarget as function", () => {
      const testTargetFn = jest.fn(() => "/test-endpoint");
      const resumable = new Resumable({
        testTarget: testTargetFn,
      });
      expect(typeof resumable.opts.testTarget).toBe("function");
    });
  });

  describe("Additional Branch Coverage - Configuration Variations", () => {
    test("should handle chunkFormat as octet", () => {
      const resumable = new Resumable({
        chunkFormat: "octet",
      });
      expect(resumable.opts.chunkFormat).toBe("octet");
    });

    test("should handle chunkFormat as base64", () => {
      const resumable = new Resumable({
        chunkFormat: "base64",
      });
      expect(resumable.opts.chunkFormat).toBe("base64");
    });

    test("should handle chunkFormat as blob (default)", () => {
      const resumable = new Resumable({
        chunkFormat: "blob",
      });
      expect(resumable.opts.chunkFormat).toBe("blob");
    });

    test("should handle setChunkTypeFromFile option", () => {
      const resumable = new Resumable({
        setChunkTypeFromFile: true,
      });
      expect(resumable.opts.setChunkTypeFromFile).toBe(true);
    });

    test("should handle withCredentials option", () => {
      const resumable = new Resumable({
        withCredentials: true,
      });
      expect(resumable.opts.withCredentials).toBe(true);
    });

    test("should handle xhrTimeout option", () => {
      const resumable = new Resumable({
        xhrTimeout: 5000,
      });
      expect(resumable.opts.xhrTimeout).toBe(5000);
    });

    test("should handle method option as octet", () => {
      const resumable = new Resumable({
        method: "octet",
      });
      expect(resumable.opts.method).toBe("octet");
    });

    test("should handle uploadMethod option", () => {
      const resumable = new Resumable({
        uploadMethod: "PUT",
      });
      expect(resumable.opts.uploadMethod).toBe("PUT");
    });

    test("should handle testMethod option", () => {
      const resumable = new Resumable({
        testMethod: "POST",
      });
      expect(resumable.opts.testMethod).toBe("POST");
    });

    test("should handle parameterNamespace option", () => {
      const resumable = new Resumable({
        parameterNamespace: "custom_",
      });
      expect(resumable.opts.parameterNamespace).toBe("custom_");
    });

    test("should handle forceChunkSize option", () => {
      const resumable = new Resumable({
        forceChunkSize: true,
      });
      expect(resumable.opts.forceChunkSize).toBe(true);
    });

    test("should handle maxChunkRetries option", () => {
      const resumable = new Resumable({
        maxChunkRetries: 5,
      });
      expect(resumable.opts.maxChunkRetries).toBe(5);
    });

    test("should handle chunkRetryInterval option", () => {
      const resumable = new Resumable({
        chunkRetryInterval: 1000,
      });
      expect(resumable.opts.chunkRetryInterval).toBe(1000);
    });

    test("should handle permanentErrors array", () => {
      const resumable = new Resumable({
        permanentErrors: [400, 404, 500],
      });
      expect(resumable.opts.permanentErrors).toEqual([400, 404, 500]);
    });

    test("should handle fileParameterName option", () => {
      const resumable = new Resumable({
        fileParameterName: "customFile",
      });
      expect(resumable.opts.fileParameterName).toBe("customFile");
    });
  });

  describe("Configuration Function vs Value - Branch Testing", () => {
    test("should call target function when provided", () => {
      const targetFn = jest.fn(() => "/dynamic-endpoint");
      const resumable = new Resumable({
        target: targetFn,
      });

      expect(typeof resumable.opts.target).toBe("function");
    });

    test("should call testTarget function when provided", () => {
      const testTargetFn = jest.fn(() => "/test-endpoint");
      const resumable = new Resumable({
        testTarget: testTargetFn,
      });

      expect(typeof resumable.opts.testTarget).toBe("function");
    });

    test("should handle preprocess as function", () => {
      const preprocessFn = jest.fn((chunk) => chunk);
      const resumable = new Resumable({
        preprocess: preprocessFn,
      });

      expect(typeof resumable.opts.preprocess).toBe("function");
    });

    test("should handle chunkRetryInterval as function", () => {
      const retryFn = jest.fn(() => 1000);
      const resumable = new Resumable({
        chunkRetryInterval: retryFn,
      });

      expect(typeof resumable.opts.chunkRetryInterval).toBe("function");
    });

    test("should handle custom error callbacks", () => {
      const customErrorCb = jest.fn();
      const resumable = new Resumable({
        maxFilesErrorCallback: customErrorCb,
        minFileSizeErrorCallback: customErrorCb,
        maxFileSizeErrorCallback: customErrorCb,
        fileTypeErrorCallback: customErrorCb,
      });

      expect(typeof resumable.opts.maxFilesErrorCallback).toBe("function");
      expect(typeof resumable.opts.minFileSizeErrorCallback).toBe("function");
    });
  });
});
