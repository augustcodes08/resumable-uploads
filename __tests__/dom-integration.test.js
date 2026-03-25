/**
 * DOM Integration Tests for Resumable uploads library
 * These tests verify DOM element assignment for file browsing and drag-drop functionality
 */

const Resumable = require("../resumable-uploads.js");

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
