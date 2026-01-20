# Changelog

[中文版 (Chinese Version)](./CHANGELOG.zh.md)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.4.5] - 2026-01-20

### Added
- **Audio Download Functionality**
  - Added download button in player panel to download generated audio as MP3 files
  - Integrated lamejs library for high-quality MP3 encoding (128 kbps)
  - Added download icon (SVGDownload)
  - Smart button state management (enabled only when audio is available)
  - Automatic file naming: `ela_{message}_{uuid}_{timestamp}.mp3`
  - Audio cache is preserved after stopping playback to allow download

- **Code Quality & Tooling**
  - Added comprehensive ESLint configuration with recommended rules
  - Added Prettier for consistent code formatting
  - Added `npm run check` command for lint, format, and test in one go
  - Applied Prettier formatting across entire codebase

- **Security Improvements**
  - Fixed XSS vulnerabilities by replacing `innerHTML` with `textContent` in multiple modules
    - Fixed XSS risks in `chataction.js` (actionItem.name)
    - Fixed XSS risks in `playback.js` (uuid display)
    - Fixed XSS risks in `sidepanel.js` (button content)
  - Added `isTrusted` check in `content.js` to prevent script-generated events
  - Added secure HTML setting utility functions in `util.js`

- **Code Organization & Refactoring**
  - Created unified icon module (`icons.js`) to centrally manage all SVG icons
  - Improved error message internationalization (api.js, chataction.js)
  - Refactored `const.js` with better organization and clear comments
  - Implemented `NODE_ENV`-based debug mode control
  - Fixed Service Worker registration issues

- **Documentation**
  - Added comprehensive system architecture documentation (ARCHITECTURE.md/zh.md, 750+ lines each)
  - Created detailed developer guides (DEVELOPMENT.md/zh.md, 500+ lines each)
  - Created INDEX.md as documentation index
  - Reorganized doc directory structure
  - Added bilingual CHANGELOG support
  - Added ESLint & Prettier setup documentation (bilingual)
  - Updated README files with download functionality description

### Changed
- Updated player panel layout to accommodate download button (grid-cols-4 → grid-cols-5)
- Updated ESLint configuration to include new globals (Blob, URL, AudioContext, lamejs, SVGDownload, etc.)
- Updated test configuration to mock SVGDownload icon
- Enhanced package.json with keywords, author, repository, bugs, and homepage metadata
- Fixed license from ISC to MIT to match LICENSE file
- Fixed all `==` and `!=` to `===` and `!==` for better code quality
- Fixed unused variable warnings and prefer-const warnings

### Fixed
- Fixed Service Worker registration failure (`process is not defined`)
- Fixed ESLint errors across all modules
- Fixed XSS security vulnerabilities
- Fixed API headers encoding issues (using Headers object)
- Fixed test environment mocks and configurations

---

## [0.4.4]

### Refactored
- Complete code refactoring and comprehensive test coverage
  - Created shared storage module (storage.js)
  - Refactored all core modules to improve code quality and maintainability
  - Added comprehensive test suite (265 test cases)
    - background.js (26 tests)
    - content.js (23 tests)
    - util.js (26 tests)
    - storage.js (51 tests)
    - options.js (48 tests)
    - api.js (20 tests)
    - sidepanel.js (35 tests)
    - chataction.js (22 tests)
    - playback.js (34 tests)
  - Improved error handling and log output
  - Fixed sidepanel parameter update issues
  - Improved code organization and readability

### Updated
- Disabled debug mode (debug = false)
- Updated supported model information (gpt-4o, gpt-4o-mini)

---

## [0.4.3]

### Refactored
- Upgraded Parcel bundler from v1 to v2
- Moved parcel-bundler to devDependencies

### Added
- Automatic version synchronization script (sync-version.sh)

### Fixed
- Build script execution order (parcel build → copy assets)
- Removed non-existent main field from package.json

### Updated
- Improved project description in package.json
- Documentation for Parcel v2 installation

---

## [0.4.2]

### Updated
- Models

---

## [0.4.1]

### Added
- LLM model gpt-4o-mini

### Removed
- LLM model gpt-3.5-turbo

---

## [0.4.0]

### Added
- Loop playback
- Edit the original content

---

## [0.3.2]

### Updated
- LLM model gpt-4o

---

## [0.3.1]

### Fixed
- Bugfix: api.js:108 parsing error TypeError: Cannot read properties of undefined (reading 'delta')
  at api.js:102:45

---

## [0.3.0]

### Added
- Internationalization (i18n)

---

## [0.2.0]

### Added
- Translation, word lookup, and other custom buttons

---

## [0.1.2]

- Initial release

---

## [0.1.1]

- Initial release (deprecated)

---

**Last Updated**: 2026-01-20
