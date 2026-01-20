# ELA Extension 系统架构文档

[English Version](./ARCHITECTURE.md)

## 目录

- [1. 系统概述](#1-系统概述)
- [2. 架构设计](#2-架构设计)
- [3. 核心模块](#3-核心模块)
- [4. 数据流](#4-数据流)
- [5. 技术栈](#5-技术栈)
- [6. 构建与部署](#6-构建与部署)
- [7. 安全考虑](#7-安全考虑)

---

## 1. 系统概述

### 1.1 项目简介

ELA (English Learner Assistant) 是一个基于 Chrome Extension 的英语学习助手，利用 OpenAI 的 TTS (Text-to-Speech) 和 LLM (Large Language Model) 技术，为用户提供：

- **文本朗读**：将选中的英文文本转换为语音播放
- **翻译功能**：将英文翻译成中文
- **词汇查询**：详细解释英文单词
- **自定义功能**：用户可配置自定义 AI 操作按钮

### 1.2 系统特性

- 基于 Chrome Extension Manifest V3
- 支持侧边栏 (Side Panel) 界面
- 实时文本选择和内容同步
- 流式 AI 响应处理
- 音频播放控制（播放、暂停、停止、循环）
- 多语言支持（中英文）
- 可配置的 AI 模型和参数

---

## 2. 架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                      Chrome 浏览器                            │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐      ┌──────────────┐      ┌────────────┐ │
│  │   网页页面    │      │  内容脚本     │      │  侧边栏     │ │
│  │              │◄────►│              │◄────►│            │ │
│  │  (用户浏览)   │      │              │      │  (主界面)   │ │
│  └──────────────┘      └──────┬───────┘      └──────┬─────┘ │
│                               │                      │       │
│                               └──────────┬───────────┘       │
│                                          │                   │
│                                  ┌───────▼────────┐          │
│                                  │  后台服务      │          │
│                                  │  Service Worker│          │
│                                  └───────┬────────┘          │
│                                          │                   │
│                                  ┌───────▼────────┐          │
│                                  │  Chrome 存储   │          │
│                                  │  (本地存储)     │          │
│                                  └─────────────────┘          │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   OpenAI API          │
                    │   - TTS API           │
                    │   - Chat API          │
                    └───────────────────────┘
```

### 2.2 模块层次结构

```
ELA Extension
│
├── Background Service Worker (background.js)
│   ├── 扩展生命周期管理
│   ├── 存储初始化
│   └── 消息路由
│
├── Content Script (content.js)
│   ├── 文本选择监听
│   ├── 消息发送
│   └── 状态同步
│
├── Side Panel (sidepanel.js)
│   ├── UI 管理
│   ├── 状态管理
│   └── 消息处理
│
├── Playback Module (playback.js)
│   ├── 内容块管理
│   ├── 音频播放控制
│   └── UI 创建
│
├── Chat Action Module (chataction.js)
│   ├── 自定义按钮管理
│   ├── AI 响应显示
│   └── 流式响应处理
│
├── API Module (api.js)
│   ├── TTS API 调用
│   ├── Chat API 调用
│   └── 流式响应处理
│
├── Storage Module (storage.js)
│   ├── 存储操作封装
│   ├── 批量操作
│   └── 监听器管理
│
├── Options Page (options.js)
│   ├── 配置管理
│   ├── TTS 设置
│   ├── Chat 设置
│   └── Action Items 配置
│
└── Constants (const.js)
    ├── 默认配置
    ├── 模型选项
    └── 调试配置
```

---

## 3. 核心模块

### 3.1 Background Service Worker

**文件**: `src/background.js`

**职责**:
- 扩展安装/更新时的初始化
- 管理扩展徽章状态
- 监听存储变化并更新 UI
- 处理扩展生命周期事件

**关键功能**:
```javascript
// 初始化扩展配置
initializeExtension()
  - 初始化存储默认值
  - 设置侧边栏行为
  - 更新徽章状态

// 存储监听
createStorageListener('onoff', callback)
  - 监听开关状态变化
  - 更新徽章显示
```

### 3.2 Content Script

**文件**: `src/scripts/content.js`

**职责**:
- 注入到所有网页中
- 监听用户文本选择
- 将选中的文本发送到扩展

**关键功能**:
```javascript
// 文本选择处理
handleTextSelection()
  - 获取选中文本
  - 检查扩展是否启用
  - 发送消息到 sidepanel

// 状态同步
initializeState()
  - 从存储读取 onoff 状态
  - 监听存储变化
  - 更新本地状态
```

**消息格式**:
```javascript
{
  type: "selectedText",
  msg: "选中的文本内容",
  isTopFrame: true/false
}
```

### 3.3 Side Panel

**文件**: `src/sidepanels/sidepanel.js`

**职责**:
- 管理侧边栏 UI
- 处理来自 content script 的消息
- 管理配置状态
- 初始化各个子模块

**关键功能**:
```javascript
// 初始化
init()
  - 初始化 UI 元素
  - 加载配置
  - 设置存储监听器
  - 初始化按钮和消息监听

// 消息处理
setupMessageListeners()
  - 接收 selectedText 消息
  - 创建内容块
  - 响应消息

// 配置管理
initConfig()
  - 加载 TTS 配置
  - 加载 Chat 配置
  - 加载 Action Items
```

### 3.4 Playback Module

**文件**: `src/sidepanels/playback.js`

**功能**:
- 管理内容块的创建和删除
- 控制音频播放（播放、暂停、停止）
- 管理音频资源（AudioContext、AudioBuffer）
- 提供音频下载功能（MP3 格式）

**关键功能**:
```javascript
// 内容块管理
add_content_block(msg)
  - 创建新的内容块
  - 插入到容器顶部
  - 初始化资源映射

// 音频播放
playAudioBuffer(uuid, onBefore, onEnded)
  - 创建 AudioContext
  - 解码音频数据
  - 播放音频
  - 处理循环播放

// 音频下载
downloadAudio(uuid)
  - 将 AudioBuffer 转换为 MP3 格式
  - 创建下载链接
  - 触发文件下载

audioBufferToMp3(audioBuffer)
  - 使用 lamejs 将 AudioBuffer 编码为 MP3
  - 支持单声道和立体声
  - 返回 MP3 ArrayBuffer

// 资源管理
btnStopClicked(uuid)
  - 停止音频播放
  - 清理 AudioContext
  - 清理缓存
```

**资源映射**:
- `mapAudioContext`: 存储每个内容块的 AudioContext
- `mapAudioBufferCache`: 缓存音频数据
- `mapSource`: 当前播放的音频源
- `mapMsg`: 文本内容
- `mapAudioLoop`: 循环播放设置

### 3.5 Chat Action Module

**文件**: `src/sidepanels/chataction.js`

**职责**:
- 创建自定义操作按钮
- 处理 AI 功能调用
- 显示 AI 响应（支持流式）
- 提供复制和清除功能

**关键功能**:
```javascript
// 自定义面板创建
createCustomPannel(uuid)
  - 创建响应显示区域
  - 创建操作按钮面板
  - 创建菜单按钮（复制/清除）

// AI 调用
fetchChat(msg, prompt, onSuccess, onError)
  - 调用 Chat API
  - 处理流式响应
  - 更新 UI 状态
```

### 3.6 API Module

**文件**: `src/sidepanels/api.js`

**职责**:
- 封装 TTS API 调用
- 封装 Chat API 调用
- 处理流式响应

**关键功能**:
```javascript
// TTS API
fetchAudio(msg, onSuccess, onError)
  - POST 请求到 TTS endpoint
  - 返回 ArrayBuffer
  - 错误处理

// Chat API
fetchChat(msg, prompt, onSuccess, onError, stream)
  - POST 请求到 Chat endpoint
  - 支持流式和非流式响应
  - 错误处理

// 流式响应处理
streamResponseRead(reader, afterGetContent, onDone)
  - 读取流数据
  - 解析 JSON
  - 实时更新内容
```

### 3.7 Storage Module

**文件**: `src/scripts/storage.js`

**职责**:
- 封装 Chrome Storage API
- 提供统一的存储操作接口
- 管理存储监听器

**关键功能**:
```javascript
// 基础操作
getStorageValue(key)
setStorageValue(key, value)
getStorageValues(keys)
setStorageValues(values)
removeStorageValue(key)
clearStorage()

// 初始化
initStorageValue(key, defaultValue)
initStorageValues(config)

// 监听器
createStorageListener(keys, callback)
  - 创建过滤的存储监听器
  - 返回移除函数
```

**存储键**:
- `onoff`: 开关状态
- `auth_token`: API Key
- `tts_endpoint`: TTS API 端点
- `tts_model`: TTS 模型
- `tts_voice`: TTS 声音
- `chat_endpoint`: Chat API 端点
- `chat_model`: Chat 模型
- `action_items`: 自定义操作按钮配置

### 3.8 Options Page

**文件**: `src/options/options.js`

**职责**:
- 管理扩展配置界面
- 配置 TTS 参数
- 配置 Chat 参数
- 管理 Action Items

**关键功能**:
```javascript
// TTS 配置
initTTSEndpoint(form)
initTTSModel(form)
initTTSVoice(form)
initAPIKey(form)

// Chat 配置
initChatEndpoint(form)
initChatModel(form)

// Action Items 配置
initActionItems(form)
  - 加载现有配置
  - 支持添加/删除/编辑
  - 保存配置
```

### 3.9 Constants

**文件**: `src/scripts/const.js`

**职责**:
- 定义所有常量
- 默认配置值
- 模型选项列表
- 调试配置

**关键常量**:
```javascript
// 调试
const debug = process.env.NODE_ENV !== "production"

// 默认值
const defaultOnoff = false
const default_auth_token = "Your-OpenAI-API-Key"
const default_tts_endpoint = "https://api.openai.com/v1/audio/speech"
const default_tts_model = "gpt-4o-mini-tts"
const default_tts_voice = "marin"
const default_chat_endpoint = "https://api.openai.com/v1/chat/completions"
const default_chat_model = "gpt-4.1-mini"

// 选项列表
const arrTTSModel = [...]
const arrTTSVoice = [...]
const arrChatModel = [...]
const default_action_items = [...]
```

---

## 4. 数据流

### 4.1 文本选择流程

```
用户选择文本
    │
    ▼
Content Script 监听 mouseup 事件
    │
    ▼
检查 onoff 状态
    │
    ▼
获取选中文本
    │
    ▼
发送消息到 Background
    │
    ▼
Background 路由到 Side Panel
    │
    ▼
Side Panel 接收消息
    │
    ▼
调用 add_content_block()
    │
    ▼
创建内容块 UI
    │
    ▼
显示在侧边栏
```

### 4.2 TTS 播放流程

```
用户点击播放按钮
    │
    ▼
Playback Module 检查缓存
    │
    ├─ 有缓存 ──► 直接播放
    │
    └─ 无缓存 ──► 调用 fetchAudio()
            │
            ▼
        API Module 发送请求
            │
            ▼
        OpenAI TTS API
            │
            ▼
        返回 ArrayBuffer
            │
            ▼
        解码音频数据
            │
            ▼
        缓存到 mapAudioBufferCache
            │
            ▼
        创建 AudioContext
            │
            ▼
        播放音频
            │
            ▼
        处理循环播放
            │
            ▼
        启用下载按钮
```

### 4.3 音频下载流程

```
用户点击下载按钮
    │
    ▼
检查音频缓存是否存在
    │
    ├─ 无缓存 ──► 显示错误消息
    │
    └─ 有缓存 ──► 调用 audioBufferToMp3()
            │
            ▼
        将 AudioBuffer 编码为 MP3
            │
            ▼
        创建包含 MP3 数据的 Blob
            │
            ▼
        创建下载链接
            │
            ▼
        触发文件下载
            │
            ▼
        清理 URL 对象
```

### 4.3 Chat 功能流程

```
用户点击自定义按钮
    │
    ▼
Chat Action Module 获取消息和 prompt
    │
    ▼
调用 fetchChat()
    │
    ▼
API Module 发送请求
    │
    ▼
OpenAI Chat API (流式响应)
    │
    ▼
streamResponseRead() 读取流
    │
    ▼
实时更新 textarea 内容
    │
    ▼
显示完成，启用复制/清除按钮
```

### 4.4 配置更新流程

```
用户在 Options Page 修改配置
    │
    ▼
Options Module 保存到 Storage
    │
    ▼
Chrome Storage 触发 onChanged 事件
    │
    ▼
Background 和 Side Panel 监听器触发
    │
    ▼
更新本地状态变量
    │
    ▼
更新 UI 显示
```

---

## 5. 技术栈

### 5.1 核心技术

- **Chrome Extension Manifest V3**: 扩展框架
- **JavaScript (ES6+)**: 主要编程语言
- **Chrome Storage API**: 数据持久化
- **Chrome Side Panel API**: 侧边栏界面
- **Web Audio API**: 音频播放
- **Fetch API**: HTTP 请求
- **Streams API**: 流式数据处理

### 5.2 构建工具

- **Parcel**: 打包工具
- **Tailwind CSS**: CSS 框架
- **ESLint**: 代码检查
- **Prettier**: 代码格式化
- **Jest**: 单元测试

### 5.3 外部依赖

- **OpenAI API**: 
  - TTS API (Text-to-Speech)
  - Chat API (GPT models)
- **Marked**: Markdown 解析（可选）
- **lamejs**: MP3 音频编码库（用于音频下载功能）

### 5.4 开发工具

- **Chrome DevTools**: 调试工具
- **Git**: 版本控制
- **npm**: 包管理

---

## 6. 构建与部署

### 6.1 项目结构

```
ela-extension/
├── src/                    # 源代码
│   ├── background.js       # Service Worker
│   ├── manifest.json       # 扩展清单
│   ├── scripts/            # 共享脚本
│   │   ├── const.js        # 常量定义
│   │   ├── content.js      # Content Script
│   │   ├── storage.js      # 存储工具
│   │   └── ...
│   ├── sidepanels/         # 侧边栏相关
│   │   ├── sidepanel.js    # 主逻辑
│   │   ├── playback.js     # 播放模块
│   │   ├── api.js          # API 调用
│   │   └── chataction.js   # Chat 操作
│   ├── options/            # 选项页面
│   ├── css/                # 样式文件
│   └── images/             # 图片资源
├── dist/                   # 构建输出
├── cfg/                    # 配置文件
├── doc/                    # 文档
├── sh/                     # 脚本文件
└── package.json            # 项目配置
```

### 6.2 构建流程

```bash
# 开发模式
npm run watch
  - 同步版本号
  - 构建 CSS
  - 复制资源
  - 监听文件变化

# 生产构建
npm run build
  - 同步版本号
  - 生产环境 CSS
  - Parcel 打包
  - 复制资源

# 打包发布
npm run pack
  - 清理旧文件
  - 构建项目
  - 打包 ZIP
```

### 6.3 构建脚本说明

- `sync-version.sh`: 同步版本号到 manifest.json
- `copy-assets.sh`: 复制静态资源到 dist
- `zip.sh`: 打包扩展为 ZIP 文件

### 6.4 部署流程

1. **开发**: 使用 `npm run watch` 进行开发
2. **测试**: 在 Chrome 中加载 `dist` 目录进行测试
3. **构建**: 运行 `npm run build` 生成生产版本
4. **打包**: 运行 `npm run pack` 生成 ZIP 文件
5. **发布**: 上传 ZIP 到 Chrome Web Store

---

## 7. 安全考虑

### 7.1 数据安全

- **API Key 存储**: 存储在 Chrome Storage Local，仅传输到 OpenAI
- **敏感信息**: 在日志中掩码显示 API Key
- **输入验证**: 所有用户输入都经过验证

### 7.2 XSS 防护

- **文本内容**: 使用 `textContent` 而非 `innerHTML`
- **SVG 图标**: 仅使用预定义的常量 SVG
- **用户输入**: 所有用户输入都进行转义

### 7.3 权限管理

**manifest.json 权限**:
```json
{
  "permissions": ["storage", "sidePanel"]
}
```

- 最小权限原则
- 仅请求必要的权限
- 不使用 `*` 通配符

### 7.4 错误处理

- 统一的错误处理机制
- 用户友好的错误提示
- 详细的调试日志（仅开发模式）

---

## 8. 扩展点

### 8.1 可配置项

- TTS 模型和声音
- Chat 模型
- 自定义 Action Items（最多 6 个）
- API 端点（支持自定义）

### 8.2 国际化

- 支持中英文
- 使用 Chrome i18n API
- 消息文件: `_locales/en/messages.json`, `_locales/zh_CN/messages.json`

### 8.3 测试

- 单元测试: Jest
- 测试文件: `src/__tests__/`
- 覆盖率目标: > 80%

---

## 9. 性能优化

### 9.1 音频缓存

- 音频数据缓存到 `mapAudioBufferCache`
- 避免重复请求相同文本

### 9.2 流式响应

- Chat API 使用流式响应
- 实时更新 UI，提升用户体验

### 9.3 资源管理

- 及时清理 AudioContext
- 删除内容块时清理相关资源

---

## 10. 未来改进

### 10.1 计划功能

- [ ] 支持更多语言
- [ ] 历史记录功能
- [ ] 导出功能
- [ ] 快捷键自定义
- [ ] 主题切换

### 10.2 技术改进

- [ ] TypeScript 迁移
- [ ] 模块化重构（ES Modules）
- [ ] 状态管理优化
- [ ] 性能监控

---

## 附录

### A. 相关文档

- [开发指南](./DEVELOPMENT.zh.md)
- [更新日志](./CHANGELOG.zh.md)
- [优化建议](./OPTIMIZATION_SUMMARY.md)

### B. 外部资源

- [Chrome Extension 文档](https://developer.chrome.com/docs/extensions/)
- [OpenAI API 文档](https://platform.openai.com/docs)
- [Web Audio API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Audio_API)

---

**文档版本**: 1.0  
**最后更新**: 2026 
**维护者**: ELA Extension Team
