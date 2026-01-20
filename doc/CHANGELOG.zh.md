# 更新日志

[English Version](./CHANGELOG.md)

本项目的所有重要变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

---

## [0.4.5] - 2026-01-20

### 新增
- **音频下载功能**
  - 在播放器面板添加下载按钮，支持将生成的音频下载为 MP3 文件
  - 集成 lamejs 库进行高质量 MP3 编码（128 kbps）
  - 添加下载图标 SVGDownload
  - 智能按钮状态管理（仅在音频可用时启用）
  - 自动文件命名：`ela_{消息}_{uuid}_{时间戳}.mp3`
  - 停止播放后保留音频缓存，以便下载

- **代码质量与工具**
  - 添加全面的 ESLint 配置和推荐规则
  - 添加 Prettier 实现一致的代码格式化
  - 添加 `npm run check` 命令，一键执行 lint、format 和 test
  - 对整个代码库应用 Prettier 格式化

- **安全改进**
  - 修复 XSS 漏洞：在多个模块中将 `innerHTML` 替换为 `textContent`
    - 修复 `chataction.js` 中的 XSS 风险（actionItem.name）
    - 修复 `playback.js` 中的 XSS 风险（uuid 显示）
    - 修复 `sidepanel.js` 中的 XSS 风险（按钮内容）
  - 在 `content.js` 中添加 `isTrusted` 检查，防止脚本生成的事件
  - 在 `util.js` 中添加安全的 HTML 设置工具函数

- **代码组织与重构**
  - 创建统一图标模块（`icons.js`）集中管理所有 SVG 图标
  - 改进错误消息国际化（api.js, chataction.js）
  - 重构 `const.js`，改进组织结构和清晰注释
  - 实现基于 `NODE_ENV` 的调试模式控制
  - 修复 Service Worker 注册问题

- **文档**
  - 添加全面的系统架构文档（ARCHITECTURE.md/zh.md，每个 750+ 行）
  - 创建详细的开发者指南（DEVELOPMENT.md/zh.md，每个 500+ 行）
  - 创建 INDEX.md 作为文档索引
  - 重组 doc 目录结构
  - 添加双语更新日志支持
  - 添加 ESLint & Prettier 设置文档（双语）
  - 更新 README 文件，添加下载功能描述

### 变更
- 更新播放器面板布局以容纳下载按钮（grid-cols-4 → grid-cols-5）
- 更新 ESLint 配置，添加新的全局变量（Blob, URL, AudioContext, lamejs, SVGDownload 等）
- 更新测试配置，添加 SVGDownload 图标 mock
- 增强 package.json，添加 keywords、author、repository、bugs 和 homepage 元数据
- 修复许可证从 ISC 到 MIT，与 LICENSE 文件匹配
- 修复所有 `==` 和 `!=` 为 `===` 和 `!==`，提升代码质量
- 修复未使用变量警告和 prefer-const 警告

### 修复
- 修复 Service Worker 注册失败（`process is not defined`）
- 修复所有模块中的 ESLint 错误
- 修复 XSS 安全漏洞
- 修复 API headers 编码问题（使用 Headers 对象）
- 修复测试环境 mocks 和配置

---

## [0.4.4]

### 重构
- 完整的代码重构和测试覆盖
  - 创建共用存储模块 (storage.js)
  - 重构所有核心模块，提升代码质量和可维护性
  - 添加完整的测试套件（265个测试用例）
    - background.js (26个测试)
    - content.js (23个测试)
    - util.js (26个测试)
    - storage.js (51个测试)
    - options.js (48个测试)
    - api.js (20个测试)
    - sidepanel.js (35个测试)
    - chataction.js (22个测试)
    - playback.js (34个测试)
  - 优化错误处理和日志输出
  - 修复 sidepanel 参数更新问题
  - 改进代码组织和可读性

### 更新
- 关闭调试模式 (debug = false)
- 更新支持的模型信息（gpt-4o, gpt-4o-mini）

---

## [0.4.3]

### 重构
- 升级 Parcel 打包工具从 v1 到 v2
- 将 parcel-bundler 移至 devDependencies

### 新增
- 自动版本同步脚本 (sync-version.sh)

### 修复
- 构建脚本执行顺序（parcel build → copy assets）
- 移除 package.json 中不存在的 main 字段

### 更新
- 改进 package.json 中的项目描述
- Parcel v2 安装文档

---

## [0.4.2]

### 更新
- 模型

---

## [0.4.1]

### 新增
- LLM 模型 gpt-4o-mini

### 移除
- LLM 模型 gpt-3.5-turbo

---

## [0.4.0]

### 新增
- 循环播放
- 编辑原始内容

---

## [0.3.2]

### 更新
- LLM 模型 gpt-4o

---

## [0.3.1]

### 修复
- Bugfix: api.js:108 解析错误 TypeError: Cannot read properties of undefined (reading 'delta')
  at api.js:102:45

---

## [0.3.0]

### 新增
- 国际化 (i18n)

---

## [0.2.0]

### 新增
- 翻译、查单词、其他自定义按钮

---

## [0.1.2]

- 初始发布

---

## [0.1.1]

- 初始发布（已废弃）

---

**最后更新**: 2026-01-20
