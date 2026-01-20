# ESLint 和 Prettier 配置说明

[English Version](./eslint-prettier-setup.md)

## 📋 概述

本项目已配置 ESLint（代码质量检查）和 Prettier（代码格式化），用于：
- 统一代码风格
- 发现潜在错误
- 提升代码质量
- 减少代码审查时间

## 🛠️ 安装的依赖

- `eslint`: 代码质量检查工具
- `prettier`: 代码格式化工具
- `eslint-config-prettier`: 禁用与 Prettier 冲突的 ESLint 规则
- `eslint-plugin-prettier`: 将 Prettier 作为 ESLint 规则运行

## 📝 配置文件

- `eslint.config.mjs`: ESLint 配置文件（使用 ESLint 9 的 flat config 格式）
- `.prettierrc`: Prettier 配置文件
- `.prettierignore`: Prettier 忽略文件列表

## 🚀 使用方法

### 检查代码问题

```bash
# 检查所有代码
npm run lint

# 检查并自动修复可修复的问题
npm run lint:fix
```

### 格式化代码

```bash
# 格式化所有代码
npm run format

# 检查格式（不修改文件）
npm run format:check
```

### 在提交前检查

建议在提交代码前运行：

```bash
npm run lint:fix && npm run format
```

## ⚙️ 配置说明

### ESLint 规则

- **代码质量检查**：
  - `no-unused-vars`: 警告未使用的变量（允许以 `_` 开头的变量）
  - `no-console`: 允许使用 console（调试用）
  - `prefer-const`: 建议使用 `const` 而不是 `let`
  - `no-var`: 禁止使用 `var`
  - `eqeqeq`: 强制使用 `===` 而不是 `==`

- **特殊文件处理**：
  - `const.js`: 禁用 `no-unused-vars`（全局常量会被其他文件使用）
  - 测试文件: 允许未使用的变量

### Prettier 配置

- `semi`: 使用分号
- `singleQuote`: 使用双引号（`false`）
- `tabWidth`: 2 个空格缩进
- `printWidth`: 每行最大 100 个字符
- `trailingComma`: ES5 兼容的尾随逗号

## 📁 忽略的文件

以下文件/目录会被忽略：
- `node_modules/`
- `dist/`
- `coverage/`
- `.parcel-cache/`
- `*.min.js`
- `archive/`

## 🔧 编辑器集成

### VS Code

安装以下扩展：
- ESLint
- Prettier - Code formatter

在 `.vscode/settings.json` 中添加：

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

### 其他编辑器

参考 [Prettier 编辑器集成文档](https://prettier.io/docs/en/editors.html) 和 [ESLint 编辑器集成文档](https://eslint.org/docs/latest/use/integrations#editors)

## 📊 常见问题

### Q: 如何禁用某个文件的 ESLint 检查？

在文件顶部添加：

```javascript
/* eslint-disable */
```

或针对特定规则：

```javascript
/* eslint-disable no-console */
```

### Q: 如何禁用某个行的 ESLint 检查？

在行尾添加：

```javascript
const unused = 'test'; // eslint-disable-line no-unused-vars
```

### Q: Prettier 和 ESLint 冲突怎么办？

已安装 `eslint-config-prettier` 自动处理冲突，无需手动配置。

### Q: 如何修改代码风格规则？

编辑 `.prettierrc` 文件修改 Prettier 配置，编辑 `eslint.config.mjs` 修改 ESLint 规则。

## 📚 相关资源

- [ESLint 官方文档](https://eslint.org/)
- [Prettier 官方文档](https://prettier.io/)
- [ESLint + Prettier 集成指南](https://prettier.io/docs/en/integrating-with-linters.html)

---

**最后更新**: 2026-01-20
