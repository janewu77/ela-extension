# Background.js 测试说明

## 📋 目录

- [快速开始](#快速开始)
- [运行测试](#运行测试)
- [测试结构](#测试结构)
- [测试覆盖](#测试覆盖)
- [编写新测试](#编写新测试)
- [常见问题](#常见问题)

## 🚀 快速开始

### 安装依赖

如果还没有安装测试依赖，请先运行：

```bash
npm install
```

### 运行所有测试

```bash
npm test
```

## 🧪 运行测试

### 基本命令

```bash
# 运行所有测试
npm test

# 监听模式（文件变化时自动运行测试）
npm run test:watch

# 生成覆盖率报告
npm run test:coverage
```

### 运行特定测试文件

```bash
# 只运行 background.js 的测试
npm test -- background.test.js

# 或者使用 Jest 的路径匹配
npm test -- src/__tests__/background.test.js
```

### 运行特定测试用例

```bash
# 使用测试名称匹配
npm test -- -t "initStorageValue"

# 运行特定 describe 块
npm test -- -t "存储管理函数"
```

### 调试测试

```bash
# 详细输出模式
npm test -- --verbose

# 只显示失败的测试
npm test -- --onlyFailures

# 更新快照（如果有）
npm test -- -u
```

## 📁 测试结构

测试文件位于 `src/__tests__/background.test.js`，结构如下：

```
Background.js 测试
├── 存储管理函数
│   ├── initStorageValue (6个测试用例)
│   └── initStorageValues (4个测试用例)
├── UI 更新函数
│   └── updateBadge (4个测试用例)
├── 扩展初始化
│   └── initializeExtension (3个测试用例)
└── 事件监听器
    ├── chrome.runtime.onInstalled (2个测试)
    ├── chrome.action.onClicked (1个测试)
    ├── chrome.commands.onCommand (1个测试)
    ├── chrome.storage.local.onChanged (2个测试)
    └── chrome.runtime.onMessage (3个测试)
```

## 📊 测试覆盖

### 当前测试覆盖

- ✅ **存储管理函数**：100% 覆盖
  - `initStorageValue`：正常流程、错误处理、边界情况
  - `initStorageValues`：批量操作、并行处理、空配置

- ✅ **UI 更新函数**：100% 覆盖
  - `updateBadge`：ON/OFF 状态、错误处理、多次调用

- ✅ **扩展初始化**：100% 覆盖
  - `initializeExtension`：完整初始化流程、错误处理、配置验证

- ✅ **事件监听器**：注册和基本功能测试

### 查看覆盖率报告

```bash
npm run test:coverage
```

报告会生成在 `coverage/` 目录下，打开 `coverage/lcov-report/index.html` 查看详细报告。

## ✍️ 编写新测试

### 测试文件模板

```javascript
describe('功能模块名称', () => {
  beforeEach(() => {
    // 重置所有 mock
    jest.clearAllMocks();
    chrome.storage.local.get.mockClear();
    // ... 其他 mock 重置
  });

  describe('函数名称', () => {
    it('应该描述测试场景', async () => {
      // 1. 准备 (Arrange)
      const input = 'test';
      chrome.storage.local.get.mockResolvedValue({});

      // 2. 执行 (Act)
      const result = await functionToTest(input);

      // 3. 断言 (Assert)
      expect(result).toBe(expected);
    });
  });
});
```

### 常用 Mock 模式

#### Mock Chrome Storage

```javascript
// Mock 成功获取
chrome.storage.local.get.mockResolvedValue({ key: 'value' });

// Mock 获取失败
chrome.storage.local.get.mockRejectedValue(new Error('Storage error'));

// Mock 设置成功
chrome.storage.local.set.mockResolvedValue({});
```

#### Mock Chrome Action

```javascript
// Mock 设置徽章成功
chrome.action.setBadgeText.mockResolvedValue({});

// Mock 设置徽章失败
chrome.action.setBadgeText.mockRejectedValue(new Error('Badge error'));
```

#### Mock Console

```javascript
// 在 beforeEach 中设置
global.console.error = jest.fn();
global.console.log = jest.fn();

// 在测试中验证
expect(console.error).toHaveBeenCalledWith('Error message');
```

### 测试最佳实践

1. **AAA 模式**：Arrange（准备）→ Act（执行）→ Assert（断言）
2. **描述清晰**：使用中文描述测试场景，让测试即文档
3. **独立测试**：每个测试应该独立，不依赖其他测试
4. **清理 Mock**：在 `beforeEach` 中重置所有 mock
5. **测试边界**：测试正常流程、错误情况、边界值

## 🔧 常见问题

### Q: 测试失败，提示 Chrome API 未定义？

**A:** 确保 `jest.setup.js` 中正确配置了 Chrome API mock。检查 `jest.config.js` 中的 `setupFilesAfterEnv` 配置。

### Q: 如何测试异步函数？

**A:** 使用 `async/await`：

```javascript
it('应该处理异步操作', async () => {
  chrome.storage.local.get.mockResolvedValue({});
  const result = await asyncFunction();
  expect(result).toBe(expected);
});
```

### Q: 如何测试事件监听器？

**A:** 由于事件监听器在 `background.js` 中注册，我们主要测试：
1. 监听器是否注册
2. 监听器回调函数的逻辑（提取出来单独测试）

### Q: 测试运行很慢？

**A:** 
- 使用 `--maxWorkers=2` 限制并行数
- 使用 `--runInBand` 串行运行
- 使用 `--watch` 模式只运行变化的测试

### Q: 如何调试单个测试？

**A:** 使用 `--testNamePattern` 或 `-t`：

```bash
npm test -- -t "应该使用默认值"
```

或者在测试中添加 `debugger;` 语句，然后使用 Node.js 调试器。

## 📝 测试命令速查

```bash
# 基本运行
npm test                          # 运行所有测试
npm run test:watch               # 监听模式
npm run test:coverage            # 生成覆盖率

# 过滤测试
npm test -- background.test.js   # 运行特定文件
npm test -- -t "initStorageValue" # 运行匹配的测试

# 调试选项
npm test -- --verbose            # 详细输出
npm test -- --onlyFailures       # 只显示失败
npm test -- --bail               # 遇到失败立即停止
```

## 🎯 下一步

- [ ] 添加集成测试
- [ ] 添加 E2E 测试（使用 Puppeteer）
- [ ] 提高代码覆盖率到 90%+
- [ ] 添加性能测试
- [ ] 设置 CI/CD 自动运行测试

## 📚 相关资源

- [Jest 官方文档](https://jestjs.io/docs/getting-started)
- [Chrome Extension API 文档](https://developer.chrome.com/docs/extensions/reference/)
- [测试最佳实践](https://github.com/goldbergyoni/javascript-testing-best-practices)

---

**最后更新**: 2025-01-13  
**测试框架**: Jest 29.7.0  
**测试环境**: Node.js
