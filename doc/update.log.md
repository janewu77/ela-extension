#### 0.4.4
- refactor: 完整的代码重构和测试覆盖
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
- update: 关闭调试模式 (debug = false)
- update: 更新支持的模型信息（gpt-4o, gpt-4o-mini）

#### 0.4.3
- refactor: upgrade Parcel bundler from v1 to v2
- refactor: move parcel-bundler to devDependencies
- add: automatic version synchronization script (sync-version.sh)
- fix: build script execution order (parcel build → copy assets)
- fix: remove non-existent main field from package.json
- update: improve project description in package.json
- update: documentation for Parcel v2 installation

#### 0.4.2

- update: models

#### 0.4.1

- add: llm model gpt-4o-mini
- remove: llm model gpt-3.5-turbo

#### 0.4.0

- add: Loop playback
- add: edit the original content

#### 0.3.2

- update: llm model gpt-4o

#### 0.3.1

- bugfix:
  api.js:108 解析错误 TypeError: Cannot read properties of undefined (reading 'delta')
  at api.js:102:45

#### 0.3.0

- add: i18
- archive/ela_0.3.0.zip

#### 0.2.0

- add: 翻译、查单词、其他自定义按钮
- archive/ela_0.2.0.zip

#### 0.1.2

- archive/ela_0.1.2.zip

#### 0.1.1（X）

- archive/ela_0.1.1_20240409203228.zip
