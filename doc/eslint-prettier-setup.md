# ESLint and Prettier Configuration

[中文版 (Chinese Version)](./eslint-prettier-setup.zh.md)

## 📋 Overview

This project is configured with ESLint (code quality checker) and Prettier (code formatter) for:
- Unified code style
- Detecting potential errors
- Improving code quality
- Reducing code review time

## 🛠️ Installed Dependencies

- `eslint`: Code quality checker
- `prettier`: Code formatter
- `eslint-config-prettier`: Disables ESLint rules that conflict with Prettier
- `eslint-plugin-prettier`: Runs Prettier as an ESLint rule

## 📝 Configuration Files

- `eslint.config.mjs`: ESLint configuration file (using ESLint 9 flat config format)
- `.prettierrc`: Prettier configuration file
- `.prettierignore`: Prettier ignore file list

## 🚀 Usage

### Check Code Issues

```bash
# Check all code
npm run lint

# Check and auto-fix fixable issues
npm run lint:fix
```

### Format Code

```bash
# Format all code
npm run format

# Check formatting (without modifying files)
npm run format:check
```

### Pre-Commit Check

It's recommended to run before committing code:

```bash
npm run lint:fix && npm run format
```

## ⚙️ Configuration Details

### ESLint Rules

- **Code Quality Checks**:
  - `no-unused-vars`: Warn about unused variables (variables starting with `_` are allowed)
  - `no-console`: Allow `console` (for debugging)
  - `prefer-const`: Prefer `const` over `let`
  - `no-var`: Disallow `var`
  - `eqeqeq`: Enforce `===` instead of `==`

- **Special File Handling**:
  - `const.js`: Disable `no-unused-vars` (global constants are used by other files)
  - Test files: Allow unused variables

### Prettier Configuration

- `semi`: Use semicolons
- `singleQuote`: Use double quotes (`false`)
- `tabWidth`: 2 spaces indentation
- `printWidth`: Maximum 100 characters per line
- `trailingComma`: ES5-compatible trailing commas

## 📁 Ignored Files

The following files/directories are ignored:
- `node_modules/`
- `dist/`
- `coverage/`
- `.parcel-cache/`
- `*.min.js`
- `archive/`

## 🔧 Editor Integration

### VS Code

Install the following extensions:
- ESLint
- Prettier - Code formatter

Add to `.vscode/settings.json`:

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

### Other Editors

Refer to [Prettier Editor Integration](https://prettier.io/docs/en/editors.html) and [ESLint Editor Integration](https://eslint.org/docs/latest/use/integrations#editors)

## 📊 FAQ

### Q: How to disable ESLint checking for a specific file?

Add at the top of the file:

```javascript
/* eslint-disable */
```

Or for specific rules:

```javascript
/* eslint-disable no-console */
```

### Q: How to disable ESLint checking for a specific line?

Add at the end of the line:

```javascript
const unused = "test"; // eslint-disable-line no-unused-vars
```

### Q: What if Prettier and ESLint conflict?

`eslint-config-prettier` is installed to automatically handle conflicts, no manual configuration needed.

### Q: How to modify code style rules?

Edit `.prettierrc` to modify Prettier configuration, edit `eslint.config.mjs` to modify ESLint rules.

## 📚 Related Resources

- [ESLint Official Documentation](https://eslint.org/)
- [Prettier Official Documentation](https://prettier.io/)
- [ESLint + Prettier Integration Guide](https://prettier.io/docs/en/integrating-with-linters.html)

---

**Last Updated**: 2026-01-20
