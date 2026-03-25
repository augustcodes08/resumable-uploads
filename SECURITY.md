# Security Policy

## Supported Versions

The following versions of Resumable Uploads are currently being supported with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

As the project is in early development (pre-1.0), we recommend always using the latest version available.

## Security Best Practices for Users

When using Resumable Uploads in your application:

1. **Validate File Types**: Always validate file types on the server-side, not just client-side
2. **Set File Size Limits**: Use `maxFileSize` option to prevent abuse
3. **Implement Authentication**: Secure your upload endpoints with proper authentication
4. **Sanitize Filenames**: Never trust user-provided filenames; sanitize them on the server
5. **Scan Uploaded Files**: Consider implementing virus/malware scanning for uploaded files
6. **Use HTTPS**: Always use HTTPS in production to protect data in transit
7. **CORS Configuration**: Configure CORS properly if using `withCredentials: true`
8. **Rate Limiting**: Implement rate limiting on your server endpoints
9. **Validate Chunk Integrity**: Verify chunk ordering and completeness on the server

If you are only implementing this on the frontend and another party is responsible for the backend portion please talk to them about this and make sure that you are covering all of your bases

## Known Security Considerations

### Client-Side Validation Only

This library performs validation on the client-side (file type, size, etc.). **Never rely solely on client-side validation for security.** Always validate and sanitize uploads on your server.

### XSS Prevention

When displaying filenames or upload status to users, ensure proper escaping to prevent XSS attacks. The library provides filenames as-is and does not perform HTML escaping.

## Questions?

If you have questions about security that are not sensitive in nature, feel free to open a regular GitHub issue with the "security" label.
