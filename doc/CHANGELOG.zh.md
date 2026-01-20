# 更新日志

[English Version](./CHANGELOG.md)

本项目的所有重要变更都会记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

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
