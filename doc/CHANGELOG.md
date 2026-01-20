# Changelog

[中文版 (Chinese Version)](./CHANGELOG.zh.md)

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.4.5] - 2024-12-XX

### Added
- Audio download functionality
  - Added download button in player panel
  - Support downloading generated audio as MP3 format
  - Integrated lamejs library for MP3 encoding
  - Added download icon (SVGDownload)
  - Updated internationalization (English and Chinese)
  - Smart button state management (enabled only when audio is available)

### Changed
- Updated player panel layout to accommodate download button (grid-cols-4 → grid-cols-5)
- Updated ESLint configuration to include new globals (Blob, URL, AudioContext, lamejs, SVGDownload)
- Updated test configuration to mock SVGDownload icon

### Technical Details
- Audio encoding: AudioBuffer → MP3 using lamejs (128 kbps)
- File naming: `ela_{message}_{uuid}_{timestamp}.mp3`
- Audio cache is preserved after stopping playback to allow download

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
