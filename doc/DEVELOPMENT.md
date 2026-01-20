# Developer Guide

This document is for developers of ELA Chrome Extension, containing complete guides for development environment setup, development workflow, code standards, testing, and release.

[中文版 (Chinese Version)](./DEVELOPMENT.zh.md) | [Documentation Index](./INDEX.md)

## 📋 Table of Contents

- [Requirements](#requirements)
- [Quick Start](#quick-start)
- [Development Environment Setup](#development-environment-setup)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Testing](#testing)
- [Build and Package](#build-and-package)
- [Release Process](#release-process)
- [FAQ](#faq)

---

## Requirements

- **Node.js**: >= 18.17.1 (recommended: latest LTS version)
- **npm**: >= 9.6.7
- **Chrome**: Latest version (for testing the extension)
- **Operating System**: macOS / Linux / Windows

---

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/janewu77/ela-extension.git
cd ela-extension
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Development Mode

```bash
npm run watch
```

### 4. Load Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the `dist/` directory of the project

---

## Development Environment Setup

### Install Node.js and npm

If Node.js is not installed, visit [Node.js official website](https://nodejs.org/) to download and install.

Verify installation:

```bash
node --version
npm --version
```

### Install Project Dependencies

The project uses the following main tools:

- **Parcel v2**: Build tool
- **Tailwind CSS**: CSS framework
- **Jest**: Testing framework
- **ESLint**: Code quality checker
- **Prettier**: Code formatter

All dependencies are configured in `package.json`. Run `npm install` to install them.

### Configure Shell Script Permissions

```bash
cd sh
chmod +x copy-assets.sh
chmod +x zip.sh
chmod +x sync-version.sh
cd ..
```

### Mac OS X Language Settings (for i18n testing)

To test multilingual features, configure system language:

1. Open "System Preferences"
2. Select "Language & Region"
3. Add or adjust language order
4. Restart Chrome

For details: [Chrome Extension i18n Documentation](https://developer.chrome.com/docs/extensions/reference/api/i18n)

### Editor Configuration (Recommended)

#### VS Code

Install the following extensions:

- **ESLint** (`dbaeumer.vscode-eslint`)
- **Prettier - Code formatter** (`esbenp.prettier-vscode`)

Create `.vscode/settings.json` in the project root:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

---

## Development Workflow

### Daily Development

#### 1. Start Development Mode

```bash
npm run watch
```

This command will:
- Sync version number (`src/manifest.json` → `package.json`)
- Build CSS (development mode)
- Copy static assets
- Start Parcel watch mode (auto-rebuild)

#### 2. Modify Code

Modify code in the `src/` directory, and Parcel will automatically rebuild.

#### 3. Test Extension

Reload the extension in Chrome (`chrome://extensions/` → click refresh button).

### Before Committing Code

Before committing code, execute the following steps:

```bash
# 1. Code check and formatting
npm run lint:fix && npm run format

# 2. Run tests
npm test

# 3. Check formatting (optional)
npm run format:check
```

---

## Code Standards

The project uses ESLint and Prettier to ensure code quality and consistency.

### ESLint (Code Quality Check)

**Configuration file**: `eslint.config.mjs`

**Main rules**:
- Disallow `var`, prefer `const` or `let`
- Enforce `===` instead of `==`
- Warn about unused variables (variables starting with `_` are allowed)
- Allow `console` (for debugging)

**Commands**:

```bash
# Check for code issues
npm run lint

# Auto-fix fixable issues
npm run lint:fix
```

### Prettier (Code Formatting)

**Configuration file**: `.prettierrc`

**Main settings**:
- Use double quotes
- 2 spaces indentation
- Maximum 100 characters per line
- Use semicolons
- ES5-compatible trailing commas

**Commands**:

```bash
# Format all code
npm run format

# Check formatting (without modifying files)
npm run format:check
```

### Detailed Configuration

For more configuration details, see: [ESLint & Prettier Configuration](./eslint-prettier-setup.md)

---

## Testing

The project uses Jest as the testing framework. Test files are located in the `src/__tests__/` directory.

### Run Tests

```bash
# Run all tests
npm test

# Watch mode (auto-run tests on changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

Coverage reports are generated in the `coverage/` directory. Open `coverage/lcov-report/index.html` to view detailed reports.

### Writing Tests

Test file naming format: `*.test.js`

Example:

```javascript
describe("Feature Module Name", () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  it("should describe the test scenario", async () => {
    // Test code
    expect(result).toBe(expected);
  });
});
```

For more testing documentation, see: `src/__tests__/README.md`

---

## Build and Package

### Development Build

```bash
# Build CSS (development mode)
npm run build:css

# Copy static assets
npm run copy:assets
```

### Production Build

```bash
# Complete packaging process (recommended)
npm run pack
```

This command will:
1. Clean old files (`npm run clean`)
2. Sync version number
3. Build CSS (production mode)
4. Build JavaScript and HTML (Parcel)
5. Copy static assets
6. Generate zip file

### Step-by-Step Execution

```bash
# Clean
npm run clean

# Build
npm run build

# Package
npm run zip
```

After packaging, the zip file will be generated in the `archive/` directory with the format: `ela_<version>.zip`

---

## Release Process

### Pre-Release Checklist

Before releasing a new version, ensure the following checks are completed:

- [ ] **Code Quality**
  - [ ] Code passes ESLint check (`npm run lint`)
  - [ ] Code is formatted (`npm run format`)
  - [ ] All tests pass (`npm test`)

- [ ] **Version Management**
  - [ ] Version number updated (`src/manifest.json`)
  - [ ] Version number synced to `package.json` (run `npm run sync:version`)

- [ ] **Build and Test**
  - [ ] Build successful (`npm run build`)
  - [ ] Package successful (`npm run zip`)
  - [ ] Extension tested in Chrome and functions correctly
  - [ ] All main features tested (TTS, Chat, Translation, etc.)

- [ ] **Documentation Updates**
  - [ ] Update `doc/CHANGELOG.md` with changes
  - [ ] If major changes, update `doc/RELEASE_NOTES_*.md`

### Quick Release Command

One-command execution of code checks and formatting:

```bash
npm run check
```

One-command execution of complete pre-release checks (including packaging):

```bash
npm run check && npm run pack
```

Or use the original multi-line command:

```bash
npm run lint:fix && \
npm run format && \
npm test && \
npm run pack
```

### Release Steps

1. **Update Version Number**

   Edit `src/manifest.json`, update the `version` field:

   ```json
   {
     "version": "0.4.6"
   }
   ```

   Run the version sync script:

   ```bash
   npm run sync:version
   ```

2. **Run Pre-Release Checks**

   ```bash
   npm run lint:fix && npm run format && npm test
   ```

3. **Build and Package**

   ```bash
   npm run pack
   ```

4. **Test Package**

   - Extract `archive/ela_<version>.zip`
   - Load the extracted extension in Chrome
   - Test all features

5. **Commit Code**

   ```bash
   git add .
   git commit -m "chore: release v0.4.6"
   git tag v0.4.6
   git push origin dev
   git push origin v0.4.6
   ```

6. **Update Documentation**

   Update `doc/CHANGELOG.md`:

   ```markdown
   #### 0.4.6
   
   - feature: New feature description
   - fix: Fixed issues
   - update: Updated content
   ```

---

## FAQ

### Q: What should I do if `npm run watch` reports an error?

**A:** Check the following:
1. Ensure all dependencies are installed: `npm install`
2. Check Node.js version: `node --version` (requires >= 18.17.1)
3. Check shell script permissions: `chmod +x sh/*.sh`

### Q: Extension doesn't respond after loading?

**A:**
1. Check Chrome console for errors (`chrome://extensions/` → click "Inspect views")
2. Confirm `dist/` directory is built correctly
3. Check if `manifest.json` format is correct

### Q: ESLint reports errors but code runs fine?

**A:** ESLint checks code quality and potential issues, which doesn't affect runtime. It's recommended to fix these warnings to improve code quality.

### Q: How to debug the extension?

**A:**
1. **Background Script**: `chrome://extensions/` → click "service worker" link
2. **Content Script**: Open developer tools (F12) on the webpage
3. **Side Panel**: Right-click extension icon → "Inspect popup"

### Q: What should I do if tests fail?

**A:**
1. Check test output for specific error messages
2. Ensure Chrome API mocks are configured correctly (`jest.setup.js`)
3. Run a single test file: `npm test -- <test-file>`

### Q: How to add new dependencies?

**A:**
1. Install dependency: `npm install <package-name>`
2. If it's a dev dependency: `npm install <package-name> --save-dev`
3. Commit code after updating `package.json`

### Q: Version numbers are out of sync?

**A:**
1. Ensure version number in `src/manifest.json` is correct
2. Run: `npm run sync:version`
3. Check if version number in `package.json` is updated

---

## Project Structure

```
ela-extension/
├── src/                    # Source code
│   ├── __tests__/         # Test files
│   ├── _locales/          # i18n files
│   ├── background.js      # Background Script
│   ├── manifest.json      # Extension manifest
│   ├── scripts/           # Script files
│   │   ├── icons.js       # SVG icons module (centralized icon management)
│   │   ├── const.js       # Constants
│   │   ├── util.js         # Utility functions
│   │   └── ...
│   ├── sidepanels/        # Side panel files
│   ├── options/           # Options page
│   └── css/               # Style files
├── dist/                  # Build output directory
├── archive/               # Package files directory
├── cfg/                   # Configuration files
├── sh/                    # Shell scripts
├── doc/                   # Documentation directory
├── eslint.config.mjs      # ESLint configuration
├── .prettierrc           # Prettier configuration
├── jest.config.js        # Jest configuration
└── package.json           # Project configuration
```

---

## Related Resources

- [Chrome Extension Official Documentation](https://developer.chrome.com/docs/extensions/)
- [Parcel Documentation](https://parceljs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Jest Documentation](https://jestjs.io/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)

---

## Contributing

Contributions are welcome! Before submitting a PR, please ensure:

1. Code passes ESLint checks
2. Code is formatted
3. All tests pass
4. Necessary test cases are added
5. Relevant documentation is updated

---

## Roadmap / TODO

Future features and improvements planned:

- Import/Export functionality
- Support for other TTS and LLM providers
- Export content to Notion
- Download audio files

---

**Last Updated**: 2026-01-20
