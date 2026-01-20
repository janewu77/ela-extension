/**
 * Options.js 测试文件
 *
 * 直接引用 options.js 文件进行测试，确保测试的是实际代码
 * 当原文件修改时，测试会自动反映这些变化
 */

// ============================================================================
// Mock 全局变量和依赖
// ============================================================================

// 引入 mock 常量（从 mockConst.js）
const { mockConstants, setupMockConstants } = require("./mockConst.mock.js");

// 设置全局 mock 常量（必须在 require 之前设置）
setupMockConstants();

// 确保 chrome.storage.local.get 返回正确的格式
// jest.setup.js 已经设置了 chrome.storage，但需要确保返回格式正确
if (global.chrome && global.chrome.storage && global.chrome.storage.local) {
  // 确保 get 方法返回正确的格式 { key: value }
  const originalGet = global.chrome.storage.local.get;
  global.chrome.storage.local.get = jest.fn((keys, callback) => {
    if (typeof keys === "function") {
      // 单个回调的情况
      callback({});
    } else if (Array.isArray(keys)) {
      // 数组键的情况
      const result = {};
      keys.forEach((key) => {
        result[key] = undefined; // 默认返回 undefined
      });
      if (callback) {
        callback(result);
      }
      return Promise.resolve(result);
    } else if (typeof keys === "string") {
      // 单个键的情况
      const result = { [keys]: undefined };
      if (callback) {
        callback(result);
      }
      return Promise.resolve(result);
    } else {
      // 对象的情况
      const result = {};
      Object.keys(keys).forEach((key) => {
        result[key] = undefined;
      });
      if (callback) {
        callback(result);
      }
      return Promise.resolve(result);
    }
  });
}

// 直接引入 storage.js 来获取真实的 storageUtils
const storageUtils = require("../scripts/storage.js");

// 将 storageUtils 挂载到 window 对象上（模拟浏览器环境）
if (!global.window) {
  global.window = {};
}
global.window.storageUtils = storageUtils;

// 直接引入 util.js，不进行 mock（options.js 会直接使用）
const util = require("../scripts/util.js");
// 将 util 函数设置为全局变量，供 options.js 使用
global.maskMsg = util.maskMsg;
global.calculateLines = util.calculateLines;

// Mock chrome.i18n.getMessage（jest.setup.js 已经设置了 chrome.storage，这里只需要添加 i18n）
if (!global.chrome) {
  global.chrome = {};
}
if (!global.chrome.i18n) {
  global.chrome.i18n = {
    getMessage: jest.fn((key) => {
      const messages = {
        tts_model_container_name: "TTS Model",
        tts_voice_container_name: "TTS Voice",
        chat_model_container_name: "Chat Model",
        container_action_items_name: "Action Items",
        button: "Button",
        prompt: "Prompt",
        btn_name_active: "Active",
        btn_name_reset: "Reset",
      };
      return messages[key] || key;
    }),
  };
}

// Mock DOM
global.document = {
  getElementById: jest.fn(),
  body: {
    querySelector: jest.fn(),
  },
  createElement: jest.fn((tagName) => {
    const element = {
      tagName: tagName.toUpperCase(),
      innerHTML: "",
      textContent: "",
      value: "",
      checked: false,
      disabled: false,
      className: "",
      id: "",
      name: "",
      type: "",
      htmlFor: "",
      href: "",
      target: "",
      appendChild: jest.fn(),
      querySelector: jest.fn((selector) => {
        // 当 innerHTML 被设置后，querySelector 应该能够找到元素
        // 这里返回一个基本的 mock 元素
        if (
          selector.includes("action_name_") ||
          selector.includes("action_prompt_") ||
          selector.includes("action_status_")
        ) {
          return {
            value: "",
            checked: false,
            addEventListener: jest.fn(),
          };
        }
        return null;
      }),
      addEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      removeChild: jest.fn(),
      firstChild: null,
    };
    return element;
  }),
};

// ============================================================================
// 导入实际的 options.js 文件
// ============================================================================

// 清除缓存以确保每次测试都使用最新代码
delete require.cache[require.resolve("../options/options.js")];

// 在导入前，mock 表单元素以避免 initializeOptions 执行时报错
// 注意：initializeOptions 会在 require 时执行，所以需要提前 mock
const mockFormForInit = {
  TTSEndpoint: { value: "", addEventListener: jest.fn() },
  TTSOpenAIAPIKey: { value: "", disabled: false, addEventListener: jest.fn() },
  onoffTTSOpenAIAPIKey: { innerHTML: "", disabled: false, addEventListener: jest.fn() },
  ChatEndpoint: { value: "", addEventListener: jest.fn() },
};

// Mock 所有需要的 DOM 元素
// 注意：initializeOptions 会在 require 时执行，需要 mock 所有可能用到的元素
const mockTemplate = {
  innerHTML: '<div id="template_action_setting"><div>{button}({1})</div></div>',
};

const mockContainer = {
  innerHTML: "",
  firstChild: null,
  removeChild: jest.fn(),
  appendChild: jest.fn(),
};

global.document.getElementById.mockImplementation((id) => {
  if (id === "optionsForm") {
    return mockFormForInit;
  }
  if (id === "template_action_setting") {
    return mockTemplate;
  }
  if (id === "container_action_items") {
    return mockContainer;
  }
  if (id === "container_action_items_name") {
    return { innerHTML: "" };
  }
  // 返回其他元素的 mock
  return {
    innerHTML: "",
    appendChild: jest.fn(),
    querySelector: jest.fn(),
    addEventListener: jest.fn(),
    firstChild: null,
    removeChild: jest.fn(),
  };
});

// 设置全局 templateActionItem（options.js 中会使用）
global.templateActionItem = mockTemplate;

// 直接 require options.js（它会自动导出函数）
const options = require("../options/options.js");

// ============================================================================
// 测试套件
// ============================================================================

describe("Options.js 测试", () => {
  beforeEach(() => {
    // 重置所有 mock
    jest.clearAllMocks();
    global.chrome.i18n.getMessage.mockClear();
    global.document.getElementById.mockClear();
    global.document.body.querySelector.mockClear();

    // Mock console methods
    global.console.error = jest.fn();
    global.console.log = jest.fn();

    // 使用 jest.spyOn 来 mock storageUtils 的方法
    jest.spyOn(storageUtils, "getStorageValue").mockResolvedValue(null);
    jest.spyOn(storageUtils, "setStorageValue").mockResolvedValue(true);
  });

  afterEach(() => {
    // 恢复所有 spy
    jest.restoreAllMocks();
  });

  // ========================================================================
  // TTS 配置管理测试
  // ========================================================================

  describe("TTS 配置管理", () => {
    describe("initTTSEndpoint", () => {
      it("应该从存储中读取并设置 TTS endpoint 值", async () => {
        const mockForm = {
          TTSEndpoint: {
            value: "",
            addEventListener: jest.fn(),
          },
        };

        storageUtils.getStorageValue.mockResolvedValue("https://custom-endpoint.com");

        await options.initTTSEndpoint(mockForm);

        expect(storageUtils.getStorageValue).toHaveBeenCalledWith("tts_endpoint");
        expect(mockForm.TTSEndpoint.value).toBe("https://custom-endpoint.com");
        expect(mockForm.TTSEndpoint.addEventListener).toHaveBeenCalledWith(
          "change",
          expect.any(Function)
        );
      });

      it("应该为空值时不清空输入框", async () => {
        const mockForm = {
          TTSEndpoint: {
            value: "existing-value",
            addEventListener: jest.fn(),
          },
        };

        storageUtils.getStorageValue.mockResolvedValue(null);

        await options.initTTSEndpoint(mockForm);

        expect(mockForm.TTSEndpoint.value).toBe("existing-value");
      });

      it("应该在值改变时保存到存储", async () => {
        const mockForm = {
          TTSEndpoint: {
            value: "",
            addEventListener: jest.fn((event, callback) => {
              if (event === "change") {
                // 模拟 change 事件
                setTimeout(() => {
                  callback({ target: { value: "new-endpoint" } });
                }, 0);
              }
            }),
          },
        };

        storageUtils.getStorageValue.mockResolvedValue(null);
        storageUtils.setStorageValue.mockResolvedValue(true);

        await options.initTTSEndpoint(mockForm);

        // 等待异步事件处理
        await new Promise((resolve) => setTimeout(resolve, 10));

        expect(storageUtils.setStorageValue).toHaveBeenCalledWith("tts_endpoint", "new-endpoint");
      });

      it("应该处理错误", async () => {
        const mockForm = {
          TTSEndpoint: {
            value: "",
            addEventListener: jest.fn(),
          },
        };

        storageUtils.getStorageValue.mockRejectedValue(new Error("Storage error"));

        await options.initTTSEndpoint(mockForm);

        expect(global.console.error).toHaveBeenCalled();
      });
    });

    describe("initAPIKey", () => {
      it("应该为默认值或空值时允许编辑", async () => {
        const mockForm = {
          TTSOpenAIAPIKey: {
            value: "",
            disabled: false,
          },
          onoffTTSOpenAIAPIKey: {
            innerHTML: "",
            disabled: false,
            addEventListener: jest.fn(),
          },
        };

        storageUtils.getStorageValue.mockResolvedValue(mockConstants.default_auth_token);

        await options.initAPIKey(mockForm);

        expect(mockForm.TTSOpenAIAPIKey.disabled).toBe(false);
        expect(mockForm.onoffTTSOpenAIAPIKey.disabled).toBe(true);
      });

      it("应该为已设置的值时显示掩码", async () => {
        const mockForm = {
          TTSOpenAIAPIKey: {
            value: "",
            disabled: false,
          },
          onoffTTSOpenAIAPIKey: {
            innerHTML: "",
            disabled: false,
            addEventListener: jest.fn(),
          },
        };

        const testKey = "sk-test1234567890";
        storageUtils.getStorageValue.mockResolvedValue(testKey);

        await options.initAPIKey(mockForm);

        // maskMsg 实际行为：前5个字符 + 8个星号 + 后2个字符
        // "sk-test1234567890" -> "sk-te********90"
        expect(mockForm.TTSOpenAIAPIKey.value).toBe("sk-te********90");
        expect(mockForm.TTSOpenAIAPIKey.disabled).toBe(true);
        expect(mockForm.onoffTTSOpenAIAPIKey.disabled).toBe(false);
      });

      it("应该在保存时更新存储", async () => {
        const mockForm = {
          TTSOpenAIAPIKey: {
            value: "",
            disabled: false,
            addEventListener: jest.fn(),
          },
          onoffTTSOpenAIAPIKey: {
            innerHTML: "",
            disabled: false,
            addEventListener: jest.fn(),
          },
        };

        storageUtils.getStorageValue.mockResolvedValue(null);
        storageUtils.setStorageValue.mockResolvedValue(true);

        await options.initAPIKey(mockForm);

        // 获取点击事件处理器
        const clickHandler = mockForm.onoffTTSOpenAIAPIKey.addEventListener.mock.calls.find(
          (call) => call[0] === "click"
        )?.[1];

        expect(clickHandler).toBeDefined();

        // 模拟编辑状态：输入框已启用，有输入值
        mockForm.TTSOpenAIAPIKey.disabled = false;
        mockForm.TTSOpenAIAPIKey.value = "new-key";

        // 触发点击事件（此时是保存操作，因为 disabled = false）
        await clickHandler({});

        // 等待异步操作完成
        await new Promise((resolve) => setTimeout(resolve, 10));

        expect(storageUtils.setStorageValue).toHaveBeenCalledWith("auth_token", "new-key");
      });
    });

    describe("initTTSModel", () => {
      it("应该创建单选按钮并设置当前值", async () => {
        const mockContainer = {
          innerHTML: "",
          appendChild: jest.fn(),
        };
        const mockContainerName = {
          innerHTML: "",
        };

        global.document.getElementById
          .mockReturnValueOnce(mockContainerName) // container_name
          .mockReturnValueOnce(mockContainer); // container

        storageUtils.getStorageValue.mockResolvedValue("gpt-4o-mini-tts");

        await options.initTTSModel();

        expect(global.chrome.i18n.getMessage).toHaveBeenCalledWith("tts_model_container_name");
        expect(mockContainerName.innerHTML).toBe("TTS Model");
        expect(storageUtils.getStorageValue).toHaveBeenCalledWith("tts_model");
        expect(mockContainer.appendChild).toHaveBeenCalledTimes(mockConstants.arrTTSModel.length);
      });

      it("应该处理错误", async () => {
        global.document.getElementById.mockReturnValue(null);

        storageUtils.getStorageValue.mockRejectedValue(new Error("Storage error"));

        await options.initTTSModel();

        expect(global.console.error).toHaveBeenCalled();
      });
    });

    describe("initTTSVoice", () => {
      it("应该创建单选按钮并设置当前值", async () => {
        const mockContainer = {
          innerHTML: "",
          appendChild: jest.fn(),
        };
        const mockContainerName = {
          innerHTML: "",
        };

        global.document.getElementById
          .mockReturnValueOnce(mockContainerName) // container_name
          .mockReturnValueOnce(mockContainer); // container

        storageUtils.getStorageValue.mockResolvedValue("marin");

        await options.initTTSVoice();

        expect(global.chrome.i18n.getMessage).toHaveBeenCalledWith("tts_voice_container_name");
        expect(mockContainerName.innerHTML).toBe("TTS Voice");
        expect(storageUtils.getStorageValue).toHaveBeenCalledWith("tts_voice");
        expect(mockContainer.appendChild).toHaveBeenCalledTimes(mockConstants.arrTTSVoice.length);
      });
    });
  });

  // ========================================================================
  // Chat 配置管理测试
  // ========================================================================

  describe("Chat 配置管理", () => {
    describe("initChatEndpoint", () => {
      it("应该从存储中读取并设置 Chat endpoint 值", async () => {
        const mockForm = {
          ChatEndpoint: {
            value: "",
            addEventListener: jest.fn(),
          },
        };

        storageUtils.getStorageValue.mockResolvedValue("https://custom-chat-endpoint.com");

        await options.initChatEndpoint(mockForm);

        expect(storageUtils.getStorageValue).toHaveBeenCalledWith("chat_endpoint");
        expect(mockForm.ChatEndpoint.value).toBe("https://custom-chat-endpoint.com");
        expect(mockForm.ChatEndpoint.addEventListener).toHaveBeenCalledWith(
          "change",
          expect.any(Function)
        );
      });
    });

    describe("initChatModel", () => {
      it("应该创建单选按钮并设置当前值", async () => {
        const mockContainer = {
          innerHTML: "",
          appendChild: jest.fn(),
        };
        const mockContainerName = {
          innerHTML: "",
        };

        global.document.getElementById
          .mockReturnValueOnce(mockContainerName) // container_name
          .mockReturnValueOnce(mockContainer); // container

        storageUtils.getStorageValue.mockResolvedValue("gpt-4.1-mini");

        await options.initChatModel();

        expect(global.chrome.i18n.getMessage).toHaveBeenCalledWith("chat_model_container_name");
        expect(mockContainerName.innerHTML).toBe("Chat Model");
        expect(storageUtils.getStorageValue).toHaveBeenCalledWith("chat_model");
        expect(mockContainer.appendChild).toHaveBeenCalledTimes(mockConstants.arrChatModel.length);
      });
    });
  });

  // ========================================================================
  // Action Items 配置管理测试
  // ========================================================================

  describe("Action Items 配置管理", () => {
    describe("constructActionItemsHTML", () => {
      it("应该创建 Action Items HTML 元素", () => {
        const mockContainer = {
          innerHTML: "",
          firstChild: null,
          removeChild: jest.fn(),
          appendChild: jest.fn(),
        };
        const mockTemplate = {
          innerHTML: '<div id="template">{button}({1})</div>',
        };

        const actionItems = [
          { name: "翻译", active: true, prompt: "Translate" },
          { name: "总结", active: false, prompt: "Summarize" },
        ];

        // Mock DOM 方法
        const mockDiv = {
          innerHTML: "",
          appendChild: jest.fn(),
          querySelector: jest.fn(() => ({
            value: "",
            checked: false,
            addEventListener: jest.fn(),
          })),
        };

        global.document.createElement = jest.fn(() => mockDiv);

        options.constructActionItemsHTML(actionItems, mockContainer, mockTemplate);

        expect(mockContainer.appendChild).toHaveBeenCalled();
        expect(global.document.createElement).toHaveBeenCalled();
      });

      it("应该处理空数组", () => {
        const mockContainer = {
          innerHTML: "",
          firstChild: null,
        };
        const mockTemplate = {
          innerHTML: "<div></div>",
        };

        global.document.createElement = jest.fn(() => ({
          innerHTML: "",
          appendChild: jest.fn(),
        }));

        options.constructActionItemsHTML([], mockContainer, mockTemplate);

        expect(mockContainer.innerHTML).toBe("");
      });
    });

    describe("initActionItems", () => {
      it("应该从存储中读取并初始化 Action Items", async () => {
        const mockContainer = {
          innerHTML: "",
          firstChild: null,
        };
        const mockContainerName = {
          innerHTML: "",
        };
        const mockTemplate = {
          innerHTML: "<div></div>",
        };

        global.document.getElementById
          .mockReturnValueOnce(mockTemplate) // template
          .mockReturnValueOnce(mockContainerName) // container_name
          .mockReturnValueOnce(mockContainer); // container

        storageUtils.getStorageValue.mockResolvedValue(mockConstants.default_action_items);

        global.document.createElement = jest.fn(() => ({
          innerHTML: "",
          appendChild: jest.fn(),
          querySelector: jest.fn(() => ({
            value: "",
            checked: false,
            addEventListener: jest.fn(),
          })),
        }));

        await options.initActionItems();

        expect(global.chrome.i18n.getMessage).toHaveBeenCalledWith("container_action_items_name");
        expect(storageUtils.getStorageValue).toHaveBeenCalledWith("action_items");
      });
    });
  });

  // ========================================================================
  // UI 辅助函数测试
  // ========================================================================

  describe("UI 辅助函数", () => {
    describe("createRadioOption", () => {
      beforeEach(() => {
        // 重置 createElement mock
        global.document.createElement.mockImplementation((tagName) => {
          const element = {
            tagName: tagName.toUpperCase(),
            innerHTML: "",
            textContent: "",
            value: "",
            checked: false,
            disabled: false,
            className: "",
            id: "",
            name: "",
            type: "",
            htmlFor: "",
            href: "",
            target: "",
            appendChild: jest.fn(),
            querySelector: jest.fn(),
            addEventListener: jest.fn(),
            dispatchEvent: jest.fn(),
            removeChild: jest.fn(),
          };
          return element;
        });
      });

      it("应该创建选中的单选按钮", () => {
        const container = options.createRadioOption("test_radio", "value1", "value1");

        expect(container.tagName).toBe("DIV");
        expect(container.appendChild).toHaveBeenCalled();
        // 检查是否创建了 input 元素
        const createElementCalls = global.document.createElement.mock.calls;
        const inputCall = createElementCalls.find((call) => call[0] === "input");
        expect(inputCall).toBeDefined();
      });

      it("应该创建未选中的单选按钮", () => {
        const container = options.createRadioOption("test_radio", "value1", "value2");

        expect(container.tagName).toBe("DIV");
        // 检查是否创建了 input 元素
        const createElementCalls = global.document.createElement.mock.calls;
        const inputCall = createElementCalls.find((call) => call[0] === "input");
        expect(inputCall).toBeDefined();
      });

      it("应该添加事件监听器", () => {
        const mockInput = {
          id: "",
          type: "radio",
          checked: false,
          value: "",
          name: "",
          className: "",
          addEventListener: jest.fn(),
          appendChild: jest.fn(),
        };
        const mockLabel = {
          htmlFor: "",
          className: "",
          textContent: "",
          appendChild: jest.fn(),
        };
        const mockContainer = {
          className: "",
          appendChild: jest.fn(),
        };

        global.document.createElement
          .mockReturnValueOnce(mockContainer)
          .mockReturnValueOnce(mockInput)
          .mockReturnValueOnce(mockLabel);

        options.createRadioOption("test_radio", "value1", "value2");

        expect(mockInput.addEventListener).toHaveBeenCalledWith("change", expect.any(Function));
      });
    });

    describe("setHelpInfo", () => {
      it("应该设置帮助信息", () => {
        const mockContainer = {
          innerHTML: "",
          appendChild: jest.fn(),
        };
        const mockLink = {
          href: "",
          target: "",
          className: "",
          innerHTML: "",
          appendChild: jest.fn(),
        };

        // 重置 mock，确保每次测试都是干净的
        global.document.getElementById.mockReset();
        global.document.createElement.mockReset();

        global.document.getElementById.mockReturnValue(mockContainer);
        global.document.createElement.mockReturnValue(mockLink);

        options.setHelpInfo("test_container", "https://example.com", "preTitle", "title");

        // setHelpInfo 函数中直接使用 containerId，不是 containerId + "_help"
        expect(global.document.getElementById).toHaveBeenCalledWith("test_container");
        expect(global.document.createElement).toHaveBeenCalledWith("a");
        expect(mockContainer.appendChild).toHaveBeenCalled();
        // 注意：由于使用了 chrome.i18n.getMessage，实际内容可能不同
      });

      it("应该处理容器不存在的情况", () => {
        global.document.getElementById.mockReturnValue(null);
        global.console.warn = jest.fn();

        options.setHelpInfo("test_container", "https://example.com", "preTitle", "title");

        expect(global.console.warn).toHaveBeenCalled();
      });
    });
  });

  // ========================================================================
  // 重置和初始化测试
  // ========================================================================

  describe("重置和初始化", () => {
    describe("resetToDefaults", () => {
      it("应该重置所有配置为默认值", async () => {
        const mockForm = {
          TTSEndpoint: { value: "" },
          TTSOpenAIAPIKey: { value: "", disabled: false },
          onoffTTSOpenAIAPIKey: { innerHTML: "", disabled: false },
          ChatEndpoint: { value: "" },
        };

        const mockContainer = {
          innerHTML: "",
          firstChild: null,
          removeChild: jest.fn(),
          appendChild: jest.fn(),
        };
        const mockTemplate = {
          innerHTML: '<div id="template_action_setting"><div>{button}({1})</div></div>',
        };

        // 重置 mock
        global.document.getElementById.mockReset();
        // 需要 mock templateActionItem（全局变量）
        global.templateActionItem = mockTemplate;
        global.document.getElementById
          .mockReturnValueOnce(mockTemplate) // template_action_setting (for constructActionItemsHTML)
          .mockReturnValueOnce(mockContainer); // container_action_items

        storageUtils.setStorageValue.mockResolvedValue(true);

        // Mock createElement 返回的元素
        const mockActionItemDiv = {
          innerHTML: "",
          appendChild: jest.fn(),
          querySelector: jest.fn(() => ({
            value: "",
            checked: false,
            addEventListener: jest.fn(),
          })),
        };

        global.document.createElement.mockImplementation((tagName) => {
          if (tagName === "div") {
            return mockActionItemDiv;
          }
          return {
            innerHTML: "",
            appendChild: jest.fn(),
            querySelector: jest.fn(() => ({
              value: "",
              checked: false,
              addEventListener: jest.fn(),
            })),
          };
        });

        await options.resetToDefaults(mockForm);

        // 检查是否调用了 setStorageValue（可能调用顺序不同）
        expect(storageUtils.setStorageValue).toHaveBeenCalled();
        const setStorageCalls = storageUtils.setStorageValue.mock.calls;
        const keys = setStorageCalls.map((call) => call[0]);
        expect(keys).toContain("tts_endpoint");
        expect(keys).toContain("tts_model");
        expect(keys).toContain("tts_voice");
        expect(keys).toContain("auth_token");
        expect(keys).toContain("chat_endpoint");
        expect(keys).toContain("chat_model");
        expect(keys).toContain("action_items");
      });

      it("应该处理错误", async () => {
        const mockForm = {
          TTSEndpoint: { value: "" },
        };

        storageUtils.setStorageValue.mockRejectedValue(new Error("Storage error"));

        await options.resetToDefaults(mockForm);

        expect(global.console.error).toHaveBeenCalled();
      });
    });

    describe("initResetButton", () => {
      it("应该初始化重置按钮", () => {
        const mockButton = {
          innerHTML: "",
          addEventListener: jest.fn(),
        };

        global.document.getElementById.mockReturnValue(mockButton);

        options.initResetButton();

        expect(global.chrome.i18n.getMessage).toHaveBeenCalledWith("btn_name_reset");
        expect(mockButton.innerHTML).toBe("Reset");
        expect(mockButton.addEventListener).toHaveBeenCalledWith("click", expect.any(Function));
      });

      it("应该处理按钮不存在的情况", () => {
        global.document.getElementById.mockReturnValue(null);
        global.console.warn = jest.fn();

        options.initResetButton();

        expect(global.console.warn).toHaveBeenCalled();
      });
    });

    describe("initializeOptions", () => {
      it("应该初始化所有配置", async () => {
        // 注意：initializeOptions 在 require 时已经执行，所以这个测试主要验证函数存在
        // 如果需要测试实际执行，需要重新 require 文件
        expect(typeof options.initializeOptions).toBe("function");

        // 测试函数可以被调用（需要正确的 mock）
        const mockForm = {
          TTSEndpoint: { value: "", addEventListener: jest.fn() },
          TTSOpenAIAPIKey: { value: "", disabled: false, addEventListener: jest.fn() },
          onoffTTSOpenAIAPIKey: { innerHTML: "", disabled: false, addEventListener: jest.fn() },
          ChatEndpoint: { value: "", addEventListener: jest.fn() },
        };

        const mockContainers = {
          innerHTML: "",
          appendChild: jest.fn(),
          firstChild: null,
          removeChild: jest.fn(),
        };
        const mockContainerNames = {
          innerHTML: "",
        };
        const mockTemplate = {
          innerHTML: "<div></div>",
        };
        const mockButton = {
          innerHTML: "",
          addEventListener: jest.fn(),
        };

        // 重置 mock
        global.document.getElementById.mockReset();
        storageUtils.getStorageValue.mockReset();
        storageUtils.getStorageValue.mockResolvedValue(null);
        storageUtils.setStorageValue.mockResolvedValue(true);

        global.document.getElementById
          .mockReturnValueOnce(mockForm) // optionsForm
          .mockReturnValueOnce(mockContainerNames) // tts_model_container_name
          .mockReturnValueOnce(mockContainers) // tts_model_container
          .mockReturnValueOnce(mockContainerNames) // tts_voice_container_name
          .mockReturnValueOnce(mockContainers) // tts_voice_container
          .mockReturnValueOnce(mockContainerNames) // chat_model_container_name
          .mockReturnValueOnce(mockContainers) // chat_model_container
          .mockReturnValueOnce(mockTemplate) // template_action_setting
          .mockReturnValueOnce(mockContainerNames) // container_action_items_name
          .mockReturnValueOnce(mockContainers) // container_action_items
          .mockReturnValueOnce(mockButton); // btnReset

        global.document.createElement = jest.fn(() => ({
          innerHTML: "",
          appendChild: jest.fn(),
          querySelector: jest.fn(() => ({
            value: "",
            checked: false,
            addEventListener: jest.fn(),
          })),
        }));

        await options.initializeOptions();

        expect(global.document.getElementById).toHaveBeenCalledWith("optionsForm");
        // 验证至少调用了一些初始化函数
        expect(global.document.getElementById.mock.calls.length).toBeGreaterThan(0);
      });

      it("应该处理表单不存在的情况", async () => {
        global.document.getElementById.mockReturnValue(null);

        await options.initializeOptions();

        expect(global.console.error).toHaveBeenCalled();
      });
    });
  });
});
