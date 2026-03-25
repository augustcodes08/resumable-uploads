# resumable-uploads

[![npm version](https://badge.fury.io/js/resumable-uploads.svg)](https://www.npmjs.com/package/resumable-uploads)
[![CI](https://github.com/augustcodes08/resumable-uploads/workflows/CI/badge.svg)](https://github.com/augustcodes08/resumable-uploads/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/augustcodes08/resumable-uploads/branch/main/graph/badge.svg)](https://codecov.io/gh/augustcodes08/resumable-uploads)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://img.shields.io/npm/dm/resumable-uploads.svg)](https://www.npmjs.com/package/resumable-uploads)

A modern, TypeScript-supported JavaScript library for providing multiple simultaneous, stable, fault-tolerant, and resumable/restartable file uploads via the HTML5 File API.

This project is a maintained fork of the original [resumable.js](https://github.com/23/resumable.js), which hasn't been updated since 2018. We've modernized the codebase, fixed long-standing bugs, added TypeScript support, and continue to maintain it for the community.

## Features

- ✅ **Resumable Uploads**: Automatically resume uploads after network interruptions
- ✅ **Chunked Uploads**: Split large files into small chunks for reliable transfer
- ✅ **Fault Tolerance**: Retry failed chunks automatically with configurable retry logic
- ✅ **Multiple Simultaneous Uploads**: Upload multiple files at once
- ✅ **TypeScript Support**: Full TypeScript definitions included
- ✅ **Drag & Drop**: Built-in support for drag-and-drop file selection
- ✅ **Progress Tracking**: Monitor upload progress for individual files and overall
- ✅ **File Validation**: Validate file types, sizes, and more before uploading
- ✅ **Browser Compatibility**: Works in Firefox 4+, Chrome 11+, Safari 6+, and IE 10+
- ✅ **No Dependencies**: Pure JavaScript with no external dependencies

## Installation

### npm

```bash
npm install resumable-uploads
```

### yarn

```bash
yarn add resumable-uploads
```

## Quick Start

### Basic Usage

```javascript
// Create a new Resumable instance
const resumable = new Resumable({
  target: "/api/upload",
  chunkSize: 1 * 1024 * 1024, // 1MB chunks
  simultaneousUploads: 3,
  testChunks: true,
  throttleProgressCallbacks: 1,
});

// Check if browser is supported. If the browser does not support html 5 uploads then I don't know what to tell ya
if (!resumable.support) {
  alert("Your browser does not support HTML5 file uploads!");
}

// Assign browse button
resumable.assignBrowse(document.getElementById("browseButton"));

// Assign drop target
resumable.assignDrop(document.getElementById("dropArea"));

// Listen to events
resumable.on("fileAdded", function (file, event) {
  console.log("File added:", file.fileName);
  resumable.upload(); // Start upload
});

resumable.on("fileSuccess", function (file, message) {
  console.log("File uploaded successfully:", file.fileName);
});

resumable.on("fileError", function (file, message) {
  console.error("Upload error:", message);
});

resumable.on("progress", function () {
  console.log("Upload progress:", Math.floor(resumable.progress() * 100) + "%");
});
```

### HTML Setup

```html
<!doctype html>
<html>
  <head>
    <title>Resumable Upload Example</title>
  </head>
  <body>
    <div id="dropArea" style="border: 2px dashed #ccc; padding: 50px; text-align: center;">
      Drop files here or <button id="browseButton">Browse</button>
    </div>

    <div id="progress" style="margin-top: 20px;">
      <div id="progressBar" style="width: 0%; height: 20px; background: #4CAF50;"></div>
    </div>

    <script src="resumable-uploads.js"></script>
    <script src="app.js"></script>
  </body>
</html>
```

### TypeScript

```typescript
import Resumable from "resumable-uploads";

const resumable = new Resumable({
  target: "/api/upload",
  chunkSize: 1 * 1024 * 1024,
  simultaneousUploads: 3,
});

resumable.on("fileAdded", (file: any, event: Event) => {
  console.log("File added:", file.fileName);
  resumable.upload();
});
```

## Server-Side Implementation

Files are uploaded in "chunks". This allows us to retry individual chunks if an issue occurs instead of reuploading the entire file.
This is also beneficial when an auth token needs to be refreshed after a certain amount of time and a file can not be reliably streamed.
Your server needs to handle chunked uploads. Here's a basic example:

### Node.js/Express Example

```javascript
app.post("/api/upload", (req, res) => {
  const chunkNumber = req.body.resumableChunkNumber;
  const totalChunks = req.body.resumableTotalChunks;
  const identifier = req.body.resumableIdentifier;

  // Save chunk to temporary location
  // When all chunks received, reassemble the file

  res.status(200).send("Chunk uploaded");
});

app.get("/api/upload", (req, res) => {
  const chunkNumber = req.query.resumableChunkNumber;
  const identifier = req.query.resumableIdentifier;

  // Check if chunk exists
  if (chunkExists(identifier, chunkNumber)) {
    res.status(200).send("Chunk exists");
  } else {
    res.status(204).send("Chunk not found");
  }
});
```

## Documentation

For comprehensive documentation including all configuration options, events, methods, and advanced usage, see [DOCUMENTATION.md](./DOCUMENTATION.md).

## Browser Compatibility

| Browser | Minimum Version |
| ------- | --------------- |
| Chrome  | 11+             |
| Firefox | 4+              |
| Safari  | 6+              |
| Edge    | All versions    |
| IE      | 10+             |
| Opera   | 12+             |

## Examples

Check out the [examples](./examples) directory for complete working examples including:

- Basic single file upload
- Multiple file uploads with queue management
- Drag and drop interface
- Retry logic and error handling

## Contributing

We welcome contributions! Please see our [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines and requirements on how to contribute to this project. All contributors are expected to follow our [Code of Conduct](CODE_OF_CONDUCT.md).

## Support

- 📖 [Documentation](./DOCUMENTATION.md)
- 🐛 [Report a Bug](https://github.com/augustcodes08/resumable-uploads/issues/new?template=bug_report.yml)
- 💡 [Request a Feature](https://github.com/augustcodes08/resumable-uploads/issues/new?template=feature_request.yml)
- 💬 [Discussions](https://github.com/augustcodes08/resumable-uploads/discussions)
- 🔒 [Security Policy](./SECURITY.md)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md) for a list of changes in each version.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

This project is a fork of [resumable.js](https://github.com/23/resumable.js) by Bjørn Åge Tungesvik. We're grateful for the original work and continue to maintain and improve it for the community.

## Contributors

Thanks to all the [contributors](https://github.com/augustcodes08/resumable-uploads/graphs/contributors) who have helped make this project better!
