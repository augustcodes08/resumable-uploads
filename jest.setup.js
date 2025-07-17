// Jest setup file for DOM testing
require("@testing-library/jest-dom");

// Mock console methods for cleaner test output (optional)
// global.console = {
//   ...console,
//   // Uncomment to suppress specific console methods during tests
//   // log: jest.fn(),
//   // debug: jest.fn(),
//   // info: jest.fn(),
//   // warn: jest.fn(),
//   // error: jest.fn(),
// };

// Mock window.alert for testing
global.alert = jest.fn();

// Mock File API for testing file uploads
global.File = class MockFile {
  constructor(parts, filename, properties) {
    this.parts = parts || [];
    this.name = filename || "test-file.txt";
    this.size = properties?.size || 1024;
    this.type = properties?.type || "text/plain";
    this.lastModified = properties?.lastModified || Date.now();
    this.lastModifiedDate = new Date(this.lastModified);
  }

  slice(start, end) {
    return new MockFile(this.parts.slice(start, end), this.name, {
      size: (end || this.size) - (start || 0),
      type: this.type,
    });
  }
};

// Mock FileReader for upload testing
global.FileReader = class MockFileReader {
  constructor() {
    this.readyState = 0;
    this.result = null;
    this.error = null;
    this.onload = null;
    this.onerror = null;
    this.onabort = null;
    this.onloadstart = null;
    this.onloadend = null;
    this.onprogress = null;
  }

  readAsArrayBuffer() {
    setTimeout(() => {
      this.readyState = 2;
      this.result = new ArrayBuffer(8);
      if (this.onload) this.onload({ target: this });
      if (this.onloadend) this.onloadend({ target: this });
    }, 0);
  }

  abort() {
    this.readyState = 2;
    if (this.onabort) this.onabort({ target: this });
  }
};

// Mock XMLHttpRequest for testing HTTP requests
global.XMLHttpRequest = class MockXMLHttpRequest {
  constructor() {
    this.readyState = 0;
    this.status = 200;
    this.statusText = "OK";
    this.responseText = "";
    this.response = "";
    this.upload = {
      onprogress: null,
      onload: null,
      onerror: null,
    };
    this.onreadystatechange = null;
    this.onload = null;
    this.onerror = null;
  }

  open(method, url, async) {
    this.method = method;
    this.url = url;
    this.async = async;
    this.readyState = 1;
  }

  setRequestHeader(name, value) {
    // Mock implementation
  }

  send(data) {
    this.readyState = 4;
    setTimeout(() => {
      if (this.onreadystatechange) this.onreadystatechange();
      if (this.onload) this.onload();
    }, 0);
  }

  abort() {
    this.readyState = 4;
    this.status = 0;
    if (this.onerror) this.onerror();
  }
};

// Mock FormData for multipart uploads
global.FormData = class MockFormData {
  constructor() {
    this.data = new Map();
  }

  append(name, value, filename) {
    if (!this.data.has(name)) {
      this.data.set(name, []);
    }
    this.data.get(name).push({ value, filename });
  }

  get(name) {
    const values = this.data.get(name);
    return values ? values[0].value : null;
  }

  getAll(name) {
    const values = this.data.get(name);
    return values ? values.map((item) => item.value) : [];
  }

  has(name) {
    return this.data.has(name);
  }

  delete(name) {
    this.data.delete(name);
  }
};
