# Resumable Uploads Examples

This directory contains working examples demonstrating various features of the resumable-uploads library.

## Running the Examples

### Prerequisites

You'll need a server to handle the upload requests. These examples expect a server endpoint at `/api/upload` that can handle chunked uploads.

### Using a Simple Test Server

For testing purposes, you can use the included `test.html` in the root directory or set up a simple server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (install http-server first)
npx http-server -p 8000

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000/examples/basic-upload.html` in your browser.

### Server Implementation

For the examples to work fully, you'll need a server that:

1. **Accepts POST requests** to `/api/upload` with multipart form data
2. **Accepts GET requests** to `/api/upload` to check if chunks exist (optional, for resume functionality)
3. **Handles the following parameters**:
   - `resumableChunkNumber`: Current chunk number (1-indexed)
   - `resumableTotalChunks`: Total number of chunks
   - `resumableChunkSize`: Size of each chunk in bytes
   - `resumableTotalSize`: Total file size in bytes
   - `resumableIdentifier`: Unique file identifier
   - `resumableFilename`: Original filename
   - `resumableRelativePath`: Relative path of the file
   - `file`: The actual chunk data

### Example Server Responses

**GET request (check if chunk exists):**

- `200`: Chunk exists, no need to upload
- `204` or `404`: Chunk doesn't exist, needs to be uploaded

**POST request (upload chunk):**

- `200`: Chunk uploaded successfully
- `500`, `501`, `404`, `415`: Permanent error, cancel upload
- Any other status: Temporary error, retry

## Examples Overview

### 1. basic-upload.html

A minimal example showing:

- Single file selection with browse button
- Progress tracking
- Success/error handling
- File upload to server

**Key Features Demonstrated:**

- `assignBrowse()` for file selection
- `fileAdded`, `fileSuccess`, `fileError` events
- Progress tracking with `progress()` method

### 2. multiple-uploads.html

Demonstrates uploading multiple files:

- Multiple file selection
- Queue management
- Individual file progress
- Pause/resume functionality

**Key Features Demonstrated:**

- Multiple simultaneous uploads
- `simultaneousUploads` option
- Per-file progress tracking
- Upload control (pause, resume, cancel)

### 3. drag-and-drop.html

Shows drag-and-drop functionality:

- Drag and drop file selection
- Visual feedback during drag
- File list display
- Upload queue management

**Key Features Demonstrated:**

- `assignDrop()` for drop zones
- Drag event styling
- File validation (type, size)
- Visual upload progress

### 4. with-retry.html

Demonstrates error handling and retry logic:

- Automatic retry on failure
- Custom retry intervals
- Maximum retry limits
- Error reporting

**Key Features Demonstrated:**

- `maxChunkRetries` option
- `chunkRetryInterval` option
- `fileRetry` event
- Error handling strategies

## Modifying the Examples

Feel free to modify these examples to experiment with different options:

```javascript
const resumable = new Resumable({
  target: "/your-upload-endpoint",
  chunkSize: 1 * 1024 * 1024, // 1MB chunks
  simultaneousUploads: 3, // 3 concurrent uploads
  testChunks: true, // Test if chunks exist
  maxChunkRetries: 3, // Retry failed chunks 3 times
  chunkRetryInterval: 500, // Wait 500ms between retries
  maxFileSize: 100 * 1024 * 1024, // Max 100MB per file
  fileType: ["image/jpeg", "image/png"], // Only allow images
});
```

## Additional Resources

- [Full Documentation](../DOCUMENTATION.md)
- [API Reference](../DOCUMENTATION.md#resumable)
- [Server Implementation Guide](../DOCUMENTATION.md#how-do-i-set-it-up-with-my-server)

## Contributing

Found an issue with an example or want to add a new one? See our [Contributing Guide](../CONTRIBUTING.md).
