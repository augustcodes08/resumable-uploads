# Contributing to Resumable Uploads

Thank you for your interest in contributing to Resumable Uploads! We welcome contributions from the community and are grateful for your support. In it's current form this repo sees very few changes. Any speed improvements are always welcome and much appreciated

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Testing](#testing)
- [Code Style](#code-style)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager (pnpm is also recommended)
- Git

### Setting Up Your Development Environment

1. Fork the repository on GitHub
2. Clone your fork locally:

   ```bash
   git clone https://github.com/YOUR_USERNAME/resumable-uploads.git
   cd resumable-uploads
   ```

3. Add the upstream repository:

   ```bash
   git remote add upstream https://github.com/augustcodes08/resumable-uploads.git
   ```

4. Install dependencies:

   ```bash
   npm install
   ```

5. Create a new branch for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode during development
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### Code Quality Checks

The project uses automated code quality tools that run on pre-commit:

- **ESLint**: Linting for JavaScript/TypeScript
- **Prettier**: Code formatting
- **Commitlint**: Commit message validation

Eslint and Prettier are used to ensure that some sort of standard is followed across all files. If you have feedback on either one and possible improvements please raise an issue with that feedback!

These checks run automatically via Husky pre-commit hooks, but you can run them manually:

```bash
# Run linter
npx eslint .

# Format code
npx prettier --write "**/*.{js,ts,json,md}"
```

## Commit Guidelines

This project follows [Conventional Commits](https://www.conventionalcommits.org/) specification. Your commit messages must follow this format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that don't affect code meaning (formatting, whitespace)
- `refactor`: Code change that neither fixes a bug nor adds a feature
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Changes to build process or auxiliary tools

### Examples

```
feat: add support for custom retry intervals

fix: resolve memory leak in chunk cleanup

docs: update README with installation instructions

test: add unit tests for file validation
```

**Note**: Commitlint is configured and will validate your commit messages automatically. Commits that don't follow the format will be rejected by the pre-commit hook.

## Pull Request Process

1. **Update Documentation**: Ensure any public API changes are documented in [DOCUMENTATION.md](DOCUMENTATION.md)

2. **Add Tests**: All new features and bug fixes must include tests

   - Maintain or improve code coverage (80% threshold)
   - Tests should be in `__tests__/` directory

3. **Update CHANGELOG**: Add an entry to [CHANGELOG.md](CHANGELOG.md) under the `[Unreleased]` section

4. **Run All Tests**: Ensure all tests pass before submitting

   ```bash
   npm test
   ```

5. **Create Pull Request**:

   - Use the provided PR template
   - Provide clear description of changes
   - Reference any related issues with `Fixes #issue-number`
   - Ensure CI checks pass

6. **Code Review**:

   - Address review comments promptly
   - Keep discussions focused and professional
   - Be open to feedback and suggestions

7. **Merge**: Once approved, maintainers will merge your PR

## Testing

### Writing Tests

- Use Jest testing framework
- Place tests in `__tests__/` directory
- Follow existing test patterns in `__tests__/resumable.test.js`
- Test file naming: `*.test.js` or `*.spec.js`

### Test Coverage

- Minimum 80% coverage required for all metrics (branches, functions, lines, statements)
- Check coverage locally: `npm run test:coverage`
- View detailed coverage report: Open `coverage/lcov-report/index.html`

### What to Test

- New features must have comprehensive test coverage
- Bug fixes should include regression tests
- Edge cases and error handling
- Browser compatibility (when applicable)

## Code Style

### JavaScript/TypeScript

- Follow ESLint configuration in [eslint.config.mjs](eslint.config.mjs)
- Use modern ES6+ syntax where appropriate
- Maintain TypeScript definitions in [resumable-uploads.d.ts](resumable-uploads.d.ts)

### Formatting

- Prettier handles all code formatting automatically
- Configuration enforced via lint-staged on commit
- Don't fight the formatter - let it handle style

### Best Practices

- Write clear, self-documenting code
- Add comments only for complex logic or non-obvious decisions
- Keep functions focused and single-purpose
- Avoid breaking changes when possible
- Maintain backward compatibility

## Questions or Need Help?

- Open an issue with the question label
- Check existing [documentation](DOCUMENTATION.md)
- Review closed issues for similar questions

## Recognition

Contributors are automatically recognized in the repository. Thank you for helping make Resumable Uploads better! I dislike open source projects that take commits from people, open a new PR and merge it under their user. If you feel that your contributions are not appropriately recognized feel free to start a conversation about it!
