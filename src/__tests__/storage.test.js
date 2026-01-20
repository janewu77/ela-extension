/**
 * Storage.js 测试文件
 *
 * 直接引用 storage.js 文件进行测试，确保测试的是实际代码
 * 当原文件修改时，测试会自动反映这些变化
 */

// ============================================================================
// Mock 全局变量和依赖
// ============================================================================

// Mock debug 变量（storage.js 需要，来自 const.js）
global.debug = false;

// ============================================================================
// 导入实际的 storage.js 文件
// ============================================================================

// 清除缓存以确保每次测试都使用最新代码
delete require.cache[require.resolve("../scripts/storage.js")];

// 直接 require storage.js（它会自动导出函数）
const storageUtils = require("../scripts/storage.js");

// ============================================================================
// 测试套件
// ============================================================================

describe("Storage.js 测试", () => {
  beforeEach(() => {
    // 重置所有 mock
    jest.clearAllMocks();
    chrome.storage.local.get.mockClear();
    chrome.storage.local.set.mockClear();
    chrome.storage.local.remove.mockClear();
    chrome.storage.local.clear.mockClear();
    chrome.storage.local.onChanged.addListener.mockClear();
    chrome.storage.local.onChanged.removeListener.mockClear();

    // Mock console methods
    global.console.error = jest.fn();
    global.console.log = jest.fn();
    global.console.warn = jest.fn();

    // 重置存储状态（模拟空存储）
    chrome.storage.local.get.mockResolvedValue({});
  });

  // ========================================================================
  // 基础存储操作测试
  // ========================================================================

  describe("基础存储操作", () => {
    describe("getStorageValue", () => {
      it("应该从存储中获取值", async () => {
        chrome.storage.local.get.mockResolvedValue({ testKey: "testValue" });

        const result = await storageUtils.getStorageValue("testKey");

        expect(chrome.storage.local.get).toHaveBeenCalledWith("testKey");
        expect(result).toBe("testValue");
      });

      it("应该返回 null 当键不存在", async () => {
        chrome.storage.local.get.mockResolvedValue({});

        const result = await storageUtils.getStorageValue("nonExistentKey");

        expect(result).toBeNull();
      });

      it("应该返回 null 当键值为 undefined", async () => {
        chrome.storage.local.get.mockResolvedValue({ testKey: undefined });

        const result = await storageUtils.getStorageValue("testKey");

        expect(result).toBeNull();
      });

      it("应该处理无效键名", async () => {
        const result1 = await storageUtils.getStorageValue("");
        const result2 = await storageUtils.getStorageValue(null);
        const result3 = await storageUtils.getStorageValue(undefined);
        const result4 = await storageUtils.getStorageValue(123);

        expect(result1).toBeNull();
        expect(result2).toBeNull();
        expect(result3).toBeNull();
        expect(result4).toBeNull();
        expect(console.error).toHaveBeenCalled();
      });

      it("应该处理存储读取错误", async () => {
        chrome.storage.local.get.mockRejectedValue(new Error("Storage error"));

        const result = await storageUtils.getStorageValue("testKey");

        expect(result).toBeNull();
        expect(console.error).toHaveBeenCalled();
      });

      it("应该处理各种数据类型", async () => {
        const testCases = [
          { key: "string", value: "test" },
          { key: "number", value: 123 },
          { key: "boolean", value: true },
          { key: "object", value: { a: 1, b: 2 } },
          { key: "array", value: [1, 2, 3] },
          { key: "null", value: null },
        ];

        for (const testCase of testCases) {
          chrome.storage.local.get.mockResolvedValue({ [testCase.key]: testCase.value });
          const result = await storageUtils.getStorageValue(testCase.key);
          expect(result).toEqual(testCase.value);
        }
      });
    });

    describe("setStorageValue", () => {
      it("应该设置存储值", async () => {
        chrome.storage.local.set.mockResolvedValue();

        const result = await storageUtils.setStorageValue("testKey", "testValue");

        expect(chrome.storage.local.set).toHaveBeenCalledWith({ testKey: "testValue" });
        expect(result).toBe(true);
      });

      it("应该处理无效键名", async () => {
        const result1 = await storageUtils.setStorageValue("", "value");
        const result2 = await storageUtils.setStorageValue(null, "value");
        const result3 = await storageUtils.setStorageValue(undefined, "value");
        const result4 = await storageUtils.setStorageValue(123, "value");

        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
        expect(result4).toBe(false);
        expect(console.error).toHaveBeenCalled();
      });

      it("应该处理存储设置错误", async () => {
        chrome.storage.local.set.mockRejectedValue(new Error("Storage error"));

        const result = await storageUtils.setStorageValue("testKey", "testValue");

        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalled();
      });

      it("应该设置各种数据类型", async () => {
        const testCases = [
          { key: "string", value: "test" },
          { key: "number", value: 123 },
          { key: "boolean", value: true },
          { key: "object", value: { a: 1 } },
          { key: "array", value: [1, 2, 3] },
          { key: "null", value: null },
        ];

        chrome.storage.local.set.mockResolvedValue();

        for (const testCase of testCases) {
          const result = await storageUtils.setStorageValue(testCase.key, testCase.value);
          expect(result).toBe(true);
          expect(chrome.storage.local.set).toHaveBeenCalledWith({ [testCase.key]: testCase.value });
        }
      });
    });

    describe("getStorageValues", () => {
      it("应该批量获取存储值", async () => {
        chrome.storage.local.get.mockResolvedValue({
          key1: "value1",
          key2: "value2",
          key3: "value3",
        });

        const result = await storageUtils.getStorageValues(["key1", "key2", "key3"]);

        expect(chrome.storage.local.get).toHaveBeenCalledWith(["key1", "key2", "key3"]);
        expect(result).toEqual({
          key1: "value1",
          key2: "value2",
          key3: "value3",
        });
      });

      it("应该过滤无效键名", async () => {
        chrome.storage.local.get.mockResolvedValue({ key1: "value1" });

        const result = await storageUtils.getStorageValues(["key1", "", null, "key2"]);

        expect(chrome.storage.local.get).toHaveBeenCalledWith(["key1", "key2"]);
        expect(console.warn).toHaveBeenCalled();
      });

      it("应该处理空数组", async () => {
        const result = await storageUtils.getStorageValues([]);

        expect(result).toEqual({});
        expect(console.error).toHaveBeenCalled();
        expect(chrome.storage.local.get).not.toHaveBeenCalled();
      });

      it("应该处理无效参数", async () => {
        const result1 = await storageUtils.getStorageValues(null);
        const result2 = await storageUtils.getStorageValues(undefined);
        const result3 = await storageUtils.getStorageValues("not an array");

        expect(result1).toEqual({});
        expect(result2).toEqual({});
        expect(result3).toEqual({});
        expect(console.error).toHaveBeenCalled();
      });

      it("应该处理存储读取错误", async () => {
        chrome.storage.local.get.mockRejectedValue(new Error("Storage error"));

        const result = await storageUtils.getStorageValues(["key1", "key2"]);

        expect(result).toEqual({});
        expect(console.error).toHaveBeenCalled();
      });
    });

    describe("setStorageValues", () => {
      it("应该批量设置存储值", async () => {
        chrome.storage.local.set.mockResolvedValue();

        const result = await storageUtils.setStorageValues({
          key1: "value1",
          key2: "value2",
          key3: "value3",
        });

        expect(chrome.storage.local.set).toHaveBeenCalledWith({
          key1: "value1",
          key2: "value2",
          key3: "value3",
        });
        expect(result).toBe(true);
      });

      it("应该过滤无效键名", async () => {
        chrome.storage.local.set.mockResolvedValue();

        const result = await storageUtils.setStorageValues({
          key1: "value1",
          "": "value2",
          key2: "value3",
        });

        expect(chrome.storage.local.set).toHaveBeenCalledWith({
          key1: "value1",
          key2: "value3",
        });
        expect(console.warn).toHaveBeenCalled();
      });

      it("应该处理无效参数", async () => {
        const result1 = await storageUtils.setStorageValues(null);
        const result2 = await storageUtils.setStorageValues(undefined);
        const result3 = await storageUtils.setStorageValues([]);
        const result4 = await storageUtils.setStorageValues("not an object");

        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
        expect(result4).toBe(false);
        expect(console.error).toHaveBeenCalled();
      });

      it("应该处理空对象", async () => {
        const result = await storageUtils.setStorageValues({});

        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalled();
        expect(chrome.storage.local.set).not.toHaveBeenCalled();
      });

      it("应该处理存储设置错误", async () => {
        chrome.storage.local.set.mockRejectedValue(new Error("Storage error"));

        const result = await storageUtils.setStorageValues({ key1: "value1" });

        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalled();
      });
    });

    describe("removeStorageValue", () => {
      it("应该删除存储值", async () => {
        chrome.storage.local.remove.mockResolvedValue();

        const result = await storageUtils.removeStorageValue("testKey");

        expect(chrome.storage.local.remove).toHaveBeenCalledWith("testKey");
        expect(result).toBe(true);
      });

      it("应该处理无效键名", async () => {
        const result1 = await storageUtils.removeStorageValue("");
        const result2 = await storageUtils.removeStorageValue(null);
        const result3 = await storageUtils.removeStorageValue(undefined);

        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
        expect(console.error).toHaveBeenCalled();
      });

      it("应该处理存储删除错误", async () => {
        chrome.storage.local.remove.mockRejectedValue(new Error("Storage error"));

        const result = await storageUtils.removeStorageValue("testKey");

        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalled();
      });
    });

    describe("removeStorageValues", () => {
      it("应该批量删除存储值", async () => {
        chrome.storage.local.remove.mockResolvedValue();

        const result = await storageUtils.removeStorageValues(["key1", "key2", "key3"]);

        expect(chrome.storage.local.remove).toHaveBeenCalledWith(["key1", "key2", "key3"]);
        expect(result).toBe(true);
      });

      it("应该过滤无效键名", async () => {
        chrome.storage.local.remove.mockResolvedValue();

        const result = await storageUtils.removeStorageValues(["key1", "", null, "key2"]);

        expect(chrome.storage.local.remove).toHaveBeenCalledWith(["key1", "key2"]);
        expect(console.warn).toHaveBeenCalled();
      });

      it("应该处理空数组", async () => {
        const result = await storageUtils.removeStorageValues([]);

        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalled();
        expect(chrome.storage.local.remove).not.toHaveBeenCalled();
      });

      it("应该处理无效参数", async () => {
        const result1 = await storageUtils.removeStorageValues(null);
        const result2 = await storageUtils.removeStorageValues(undefined);
        const result3 = await storageUtils.removeStorageValues("not an array");

        expect(result1).toBe(false);
        expect(result2).toBe(false);
        expect(result3).toBe(false);
        expect(console.error).toHaveBeenCalled();
      });

      it("应该处理存储删除错误", async () => {
        chrome.storage.local.remove.mockRejectedValue(new Error("Storage error"));

        const result = await storageUtils.removeStorageValues(["key1", "key2"]);

        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalled();
      });
    });

    describe("clearStorage", () => {
      it("应该清空所有存储", async () => {
        chrome.storage.local.clear.mockResolvedValue();

        const result = await storageUtils.clearStorage();

        expect(chrome.storage.local.clear).toHaveBeenCalled();
        expect(result).toBe(true);
      });

      it("应该处理存储清空错误", async () => {
        chrome.storage.local.clear.mockRejectedValue(new Error("Storage error"));

        const result = await storageUtils.clearStorage();

        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

  // ========================================================================
  // 存储初始化操作测试
  // ========================================================================

  describe("存储初始化操作", () => {
    describe("initStorageValue", () => {
      it("应该使用默认值当键不存在", async () => {
        chrome.storage.local.get.mockResolvedValue({});
        chrome.storage.local.set.mockResolvedValue();

        const result = await storageUtils.initStorageValue("testKey", "defaultValue");

        expect(chrome.storage.local.get).toHaveBeenCalled();
        expect(chrome.storage.local.set).toHaveBeenCalledWith({ testKey: "defaultValue" });
        expect(result).toBe("defaultValue");
      });

      it("应该保留现有值当键已存在", async () => {
        chrome.storage.local.get.mockResolvedValue({ testKey: "existingValue" });
        chrome.storage.local.set.mockResolvedValue();

        const result = await storageUtils.initStorageValue("testKey", "defaultValue");

        expect(chrome.storage.local.set).toHaveBeenCalledWith({ testKey: "existingValue" });
        expect(result).toBe("existingValue");
      });

      it("应该使用默认值当值为 null", async () => {
        chrome.storage.local.get.mockResolvedValue({ testKey: null });
        chrome.storage.local.set.mockResolvedValue();

        const result = await storageUtils.initStorageValue("testKey", "defaultValue");

        expect(chrome.storage.local.set).toHaveBeenCalledWith({ testKey: "defaultValue" });
        expect(result).toBe("defaultValue");
      });

      it("应该使用默认值当值为 undefined", async () => {
        chrome.storage.local.get.mockResolvedValue({ testKey: undefined });
        chrome.storage.local.set.mockResolvedValue();

        const result = await storageUtils.initStorageValue("testKey", "defaultValue");

        expect(chrome.storage.local.set).toHaveBeenCalledWith({ testKey: "defaultValue" });
        expect(result).toBe("defaultValue");
      });

      it("应该处理无效键名", async () => {
        const result = await storageUtils.initStorageValue("", "defaultValue");

        expect(result).toBe("defaultValue");
        expect(console.error).toHaveBeenCalled();
        expect(chrome.storage.local.get).not.toHaveBeenCalled();
      });

      it("应该处理获取值时的错误", async () => {
        chrome.storage.local.get.mockRejectedValue(new Error("Get error"));
        chrome.storage.local.set.mockResolvedValue();

        const result = await storageUtils.initStorageValue("testKey", "defaultValue");

        expect(chrome.storage.local.set).toHaveBeenCalledWith({ testKey: "defaultValue" });
        expect(result).toBe("defaultValue");
        expect(console.error).toHaveBeenCalled();
      });

      it("应该处理设置值时的错误", async () => {
        chrome.storage.local.get.mockResolvedValue({});
        chrome.storage.local.set.mockRejectedValue(new Error("Set error"));

        const result = await storageUtils.initStorageValue("testKey", "defaultValue");

        expect(result).toBe("defaultValue");
        expect(console.warn).toHaveBeenCalled();
      });
    });

    describe("initStorageValues", () => {
      it("应该批量初始化存储值", async () => {
        chrome.storage.local.get.mockResolvedValue({});
        chrome.storage.local.set.mockResolvedValue();

        const config = {
          key1: "value1",
          key2: "value2",
          key3: "value3",
        };

        const result = await storageUtils.initStorageValues(config);

        expect(result).toEqual(config);
        expect(chrome.storage.local.set).toHaveBeenCalledTimes(3);
      });

      it("应该处理部分键已存在的情况", async () => {
        chrome.storage.local.get
          .mockResolvedValueOnce({ key1: "existing1" })
          .mockResolvedValueOnce({})
          .mockResolvedValueOnce({ key3: "existing3" });
        chrome.storage.local.set.mockResolvedValue();

        const config = {
          key1: "default1",
          key2: "default2",
          key3: "default3",
        };

        const result = await storageUtils.initStorageValues(config);

        expect(result.key1).toBe("existing1");
        expect(result.key2).toBe("default2");
        expect(result.key3).toBe("existing3");
      });

      it("应该处理无效参数", async () => {
        const result1 = await storageUtils.initStorageValues(null);
        const result2 = await storageUtils.initStorageValues(undefined);
        const result3 = await storageUtils.initStorageValues([]);
        const result4 = await storageUtils.initStorageValues("not an object");

        expect(result1).toEqual({});
        expect(result2).toEqual({});
        expect(result3).toEqual({});
        expect(result4).toEqual({});
        expect(console.error).toHaveBeenCalled();
      });

      it("应该处理初始化错误", async () => {
        // 模拟第一个键初始化失败，第二个成功
        chrome.storage.local.get
          .mockRejectedValueOnce(new Error("Init error"))
          .mockResolvedValueOnce({});
        chrome.storage.local.set.mockResolvedValueOnce().mockResolvedValueOnce();

        const result = await storageUtils.initStorageValues({
          key1: "value1",
          key2: "value2",
        });

        // 即使部分失败，成功的部分仍会返回
        // 因为 Promise.all 会等待所有 Promise 完成
        expect(result).toHaveProperty("key2");
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

  // ========================================================================
  // 存储监听器测试
  // ========================================================================

  describe("存储监听器", () => {
    describe("createStorageListener", () => {
      let mockCallback;
      let removeListener;

      beforeEach(() => {
        mockCallback = jest.fn();
      });

      afterEach(() => {
        if (removeListener) {
          removeListener();
        }
      });

      it("应该创建监听器并返回移除函数", () => {
        removeListener = storageUtils.createStorageListener("testKey", mockCallback);

        expect(chrome.storage.local.onChanged.addListener).toHaveBeenCalled();
        expect(typeof removeListener).toBe("function");
      });

      it("应该监听单个键的变化", () => {
        removeListener = storageUtils.createStorageListener("testKey", mockCallback);

        const listener = chrome.storage.local.onChanged.addListener.mock.calls[0][0];
        const changes = {
          testKey: { oldValue: "old", newValue: "new" },
        };

        listener(changes);

        expect(mockCallback).toHaveBeenCalledWith(
          { testKey: { oldValue: "old", newValue: "new" } },
          changes
        );
      });

      it("应该监听多个键的变化", () => {
        removeListener = storageUtils.createStorageListener(["key1", "key2", "key3"], mockCallback);

        const listener = chrome.storage.local.onChanged.addListener.mock.calls[0][0];
        const changes = {
          key1: { oldValue: "old1", newValue: "new1" },
          key2: { oldValue: "old2", newValue: "new2" },
          otherKey: { oldValue: "old", newValue: "new" },
        };

        listener(changes);

        expect(mockCallback).toHaveBeenCalledWith(
          {
            key1: { oldValue: "old1", newValue: "new1" },
            key2: { oldValue: "old2", newValue: "new2" },
          },
          changes
        );
      });

      it("应该忽略不相关的键变化", () => {
        removeListener = storageUtils.createStorageListener("testKey", mockCallback);

        const listener = chrome.storage.local.onChanged.addListener.mock.calls[0][0];
        const changes = {
          otherKey: { oldValue: "old", newValue: "new" },
        };

        listener(changes);

        expect(mockCallback).not.toHaveBeenCalled();
      });

      it("应该移除监听器", () => {
        removeListener = storageUtils.createStorageListener("testKey", mockCallback);

        removeListener();

        expect(chrome.storage.local.onChanged.removeListener).toHaveBeenCalled();
      });

      it("应该处理无效回调", () => {
        const result1 = storageUtils.createStorageListener("testKey", null);
        const result2 = storageUtils.createStorageListener("testKey", undefined);
        const result3 = storageUtils.createStorageListener("testKey", "not a function");

        expect(result1).toBeDefined();
        expect(result2).toBeDefined();
        expect(result3).toBeDefined();
        expect(typeof result1).toBe("function");
        expect(console.error).toHaveBeenCalled();
        expect(chrome.storage.local.onChanged.addListener).not.toHaveBeenCalled();
      });

      it("应该处理无效键名", () => {
        const result1 = storageUtils.createStorageListener("", mockCallback);
        const result2 = storageUtils.createStorageListener(null, mockCallback);
        const result3 = storageUtils.createStorageListener([], mockCallback);
        const result4 = storageUtils.createStorageListener(["", "key1"], mockCallback);

        expect(result1).toBeDefined();
        expect(result2).toBeDefined();
        expect(result3).toBeDefined();
        expect(result4).toBeDefined();
        expect(typeof result1).toBe("function");
        expect(console.error).toHaveBeenCalled();
      });

      it("应该过滤无效键名但保留有效键名", () => {
        removeListener = storageUtils.createStorageListener(
          ["key1", "", null, "key2"],
          mockCallback
        );

        const listener = chrome.storage.local.onChanged.addListener.mock.calls[0][0];
        const changes = {
          key1: { oldValue: "old1", newValue: "new1" },
          key2: { oldValue: "old2", newValue: "new2" },
        };

        listener(changes);

        expect(mockCallback).toHaveBeenCalledWith(changes, changes);
      });
    });
  });

  // ========================================================================
  // 集成测试
  // ========================================================================

  describe("集成测试", () => {
    it("应该完整流程：设置 -> 获取 -> 删除", async () => {
      chrome.storage.local.set.mockResolvedValue();
      chrome.storage.local.get.mockResolvedValue({ testKey: "testValue" });
      chrome.storage.local.remove.mockResolvedValue();

      // 设置值
      const setResult = await storageUtils.setStorageValue("testKey", "testValue");
      expect(setResult).toBe(true);

      // 获取值
      const getResult = await storageUtils.getStorageValue("testKey");
      expect(getResult).toBe("testValue");

      // 删除值
      const removeResult = await storageUtils.removeStorageValue("testKey");
      expect(removeResult).toBe(true);
    });

    it("应该完整流程：初始化 -> 监听 -> 更新", async () => {
      chrome.storage.local.get.mockResolvedValue({});
      chrome.storage.local.set.mockResolvedValue();

      // 初始化值
      const initResult = await storageUtils.initStorageValue("testKey", "defaultValue");
      expect(initResult).toBe("defaultValue");

      // 创建监听器
      const mockCallback = jest.fn();
      const removeListener = storageUtils.createStorageListener("testKey", mockCallback);

      // 模拟存储变化
      const listener = chrome.storage.local.onChanged.addListener.mock.calls[0][0];
      listener({
        testKey: { oldValue: "defaultValue", newValue: "newValue" },
      });

      expect(mockCallback).toHaveBeenCalled();

      // 清理
      removeListener();
    });
  });
});
