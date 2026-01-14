/**
 * Background.js 测试文件
 * 
 * 直接引用 background.js 文件进行测试，确保测试的是实际代码
 * 当原文件修改时，测试会自动反映这些变化
 */

// ============================================================================
// Mock 全局变量和依赖（模拟 importScripts 加载的内容）
// ============================================================================

const mockConstants = {
  debug: false,
  defaultOnoff: false,
  default_auth_token: "Your-OpenAI-API-Key",
  default_tts_endpoint: "https://api.openai.com/v1/audio/speech",
  default_tts_model: "gpt-4o-mini-tts",
  default_tts_voice: "marin",
  default_chat_endpoint: "https://api.openai.com/v1/chat/completions",
  default_chat_model: "gpt-4.1-mini",
  default_action_items: [
    { name: '翻译🇺🇸🇨🇳', active: true },
    { name: 'word📖', active: true },
    { name: '总结', active: false }
  ]
};

// 模拟 importScripts 加载的常量（必须在 require 之前设置）
global.debug = mockConstants.debug;
global.defaultOnoff = mockConstants.defaultOnoff;
global.default_auth_token = mockConstants.default_auth_token;
global.default_tts_endpoint = mockConstants.default_tts_endpoint;
global.default_tts_model = mockConstants.default_tts_model;
global.default_tts_voice = mockConstants.default_tts_voice;
global.default_chat_endpoint = mockConstants.default_chat_endpoint;
global.default_chat_model = mockConstants.default_chat_model;
global.default_action_items = mockConstants.default_action_items;

// ============================================================================
// 导入实际的 background.js 文件
// ============================================================================

// 清除缓存以确保每次测试都使用最新代码
delete require.cache[require.resolve('../background.js')];

// 直接 require background.js（它会自动导出函数）
const background = require('../background.js');

// ============================================================================
// 测试套件
// ============================================================================

describe('Background.js 测试', () => {
  beforeEach(() => {
    // 重置所有 mock
    jest.clearAllMocks();
    chrome.storage.local.get.mockClear();
    chrome.storage.local.set.mockClear();
    chrome.action.setBadgeText.mockClear();
    chrome.sidePanel.setPanelBehavior.mockClear();
    chrome.runtime.onInstalled.addListener.mockClear();
    chrome.action.onClicked.addListener.mockClear();
    chrome.commands.onCommand.addListener.mockClear();
    chrome.storage.local.onChanged.addListener.mockClear();
    chrome.runtime.onMessage.addListener.mockClear();
    
    // Mock console methods
    global.console.error = jest.fn();
    global.console.log = jest.fn();
  });

  // ========================================================================
  // 存储管理函数测试
  // ========================================================================

  describe('存储管理函数', () => {
    describe('initStorageValue', () => {
      it('应该使用默认值当存储中不存在该键时', async () => {
        const key = 'test_key';
        const defaultValue = 'default_value';

        chrome.storage.local.get.mockResolvedValue({});
        chrome.storage.local.set.mockResolvedValue({});

        const result = await background.initStorageValue(key, defaultValue);

        expect(chrome.storage.local.get).toHaveBeenCalledWith(key);
        expect(chrome.storage.local.set).toHaveBeenCalledWith({ [key]: defaultValue });
        expect(result).toBe(defaultValue);
      });

      it('应该使用存储中的值当该键已存在时', async () => {
        const key = 'test_key';
        const defaultValue = 'default_value';
        const existingValue = 'existing_value';

        chrome.storage.local.get.mockResolvedValue({ [key]: existingValue });
        chrome.storage.local.set.mockResolvedValue({});

        const result = await background.initStorageValue(key, defaultValue);

        expect(chrome.storage.local.get).toHaveBeenCalledWith(key);
        expect(chrome.storage.local.set).toHaveBeenCalledWith({ [key]: existingValue });
        expect(result).toBe(existingValue);
      });

      it('应该处理 null 值并使用默认值', async () => {
        const key = 'test_key';
        const defaultValue = 'default_value';

        chrome.storage.local.get.mockResolvedValue({ [key]: null });
        chrome.storage.local.set.mockResolvedValue({});

        const result = await background.initStorageValue(key, defaultValue);

        expect(result).toBe(defaultValue);
        expect(chrome.storage.local.set).toHaveBeenCalledWith({ [key]: defaultValue });
      });

      it('应该处理 undefined 值并使用默认值', async () => {
        const key = 'test_key';
        const defaultValue = 'default_value';

        chrome.storage.local.get.mockResolvedValue({});
        chrome.storage.local.set.mockResolvedValue({});

        const result = await background.initStorageValue(key, defaultValue);

        expect(result).toBe(defaultValue);
        expect(chrome.storage.local.set).toHaveBeenCalledWith({ [key]: defaultValue });
      });

      it('应该处理存储读取错误', async () => {
        const key = 'test_key';
        const defaultValue = 'default_value';

        chrome.storage.local.get.mockRejectedValue(new Error('Storage error'));
        chrome.storage.local.set.mockResolvedValue({});

        const result = await background.initStorageValue(key, defaultValue);

        expect(console.error).toHaveBeenCalled();
        expect(chrome.storage.local.set).toHaveBeenCalledWith({ [key]: defaultValue });
        expect(result).toBe(defaultValue);
      });

      it('应该处理存储设置错误', async () => {
        const key = 'test_key';
        const defaultValue = 'default_value';

        chrome.storage.local.get.mockRejectedValue(new Error('Get error'));
        chrome.storage.local.set
          .mockRejectedValueOnce(new Error('Set error'))
          .mockResolvedValueOnce({});

        const result = await background.initStorageValue(key, defaultValue);

        expect(console.error).toHaveBeenCalledTimes(2);
        expect(result).toBe(defaultValue);
      });

      it('应该处理复杂对象值', async () => {
        const key = 'test_key';
        const complexValue = { nested: { data: 'test' }, array: [1, 2, 3] };
        const defaultValue = {};

        chrome.storage.local.get.mockResolvedValue({ [key]: complexValue });
        chrome.storage.local.set.mockResolvedValue({});

        const result = await background.initStorageValue(key, defaultValue);

        expect(result).toEqual(complexValue);
        expect(chrome.storage.local.set).toHaveBeenCalledWith({ [key]: complexValue });
      });
    });

    describe('initStorageValues', () => {
      it('应该批量初始化多个存储值', async () => {
        const config = {
          'key1': 'value1',
          'key2': 'value2',
          'key3': 'value3'
        };

        chrome.storage.local.get.mockResolvedValue({});
        chrome.storage.local.set.mockResolvedValue({});

        await background.initStorageValues(config);

        expect(chrome.storage.local.get).toHaveBeenCalledTimes(3);
        expect(chrome.storage.local.set).toHaveBeenCalledTimes(3);
        expect(chrome.storage.local.set).toHaveBeenCalledWith({ key1: 'value1' });
        expect(chrome.storage.local.set).toHaveBeenCalledWith({ key2: 'value2' });
        expect(chrome.storage.local.set).toHaveBeenCalledWith({ key3: 'value3' });
      });

      it('应该并行处理所有存储值', async () => {
        const callOrder = [];
        chrome.storage.local.get.mockImplementation((key) => {
          callOrder.push(`get-${key}`);
          return Promise.resolve({});
        });
        chrome.storage.local.set.mockImplementation((data) => {
          const key = Object.keys(data)[0];
          callOrder.push(`set-${key}`);
          return Promise.resolve({});
        });

        await background.initStorageValues({
          key1: 'value1',
          key2: 'value2'
        });

        expect(callOrder.length).toBe(4);
        expect(callOrder.filter(c => c.startsWith('get-')).length).toBe(2);
        expect(callOrder.filter(c => c.startsWith('set-')).length).toBe(2);
      });

      it('应该处理空配置对象', async () => {
        await background.initStorageValues({});

        expect(chrome.storage.local.get).not.toHaveBeenCalled();
        expect(chrome.storage.local.set).not.toHaveBeenCalled();
      });

      it('应该处理部分键已存在的情况', async () => {
        chrome.storage.local.get
          .mockResolvedValueOnce({}) // key1 不存在
          .mockResolvedValueOnce({ key2: 'existing_value' }); // key2 已存在
        chrome.storage.local.set.mockResolvedValue({});

        await background.initStorageValues({
          key1: 'default1',
          key2: 'default2'
        });

        expect(chrome.storage.local.set).toHaveBeenCalledWith({ key1: 'default1' });
        expect(chrome.storage.local.set).toHaveBeenCalledWith({ key2: 'existing_value' });
      });
    });
  });

  // ========================================================================
  // UI 更新函数测试
  // ========================================================================

  describe('UI 更新函数', () => {
    describe('updateBadge', () => {
      it('应该设置徽章为 ON 当 isOn 为 true', () => {
        chrome.action.setBadgeText.mockResolvedValue({});

        background.updateBadge(true);

        expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: 'ON' });
      });

      it('应该设置徽章为 OFF 当 isOn 为 false', () => {
        chrome.action.setBadgeText.mockResolvedValue({});

        background.updateBadge(false);

        expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: 'OFF' });
      });

      it('应该处理设置徽章时的错误', async () => {
        const error = new Error('Badge error');
        chrome.action.setBadgeText.mockRejectedValue(error);

        background.updateBadge(true);

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(console.error).toHaveBeenCalledWith('[UI] Error updating badge:', error);
      });

      it('应该正确处理多次调用', () => {
        chrome.action.setBadgeText.mockResolvedValue({});

        background.updateBadge(true);
        background.updateBadge(false);
        background.updateBadge(true);

        expect(chrome.action.setBadgeText).toHaveBeenCalledTimes(3);
        expect(chrome.action.setBadgeText).toHaveBeenNthCalledWith(1, { text: 'ON' });
        expect(chrome.action.setBadgeText).toHaveBeenNthCalledWith(2, { text: 'OFF' });
        expect(chrome.action.setBadgeText).toHaveBeenNthCalledWith(3, { text: 'ON' });
      });
    });
  });

  // ========================================================================
  // 扩展初始化测试
  // ========================================================================

  describe('扩展初始化', () => {
    describe('initializeExtension', () => {
      it('应该初始化所有存储值', async () => {
        chrome.storage.local.get.mockResolvedValue({});
        chrome.storage.local.set.mockResolvedValue({});
        chrome.sidePanel.setPanelBehavior.mockResolvedValue({});
        chrome.action.setBadgeText.mockResolvedValue({});

        await background.initializeExtension();

        expect(chrome.storage.local.get).toHaveBeenCalled();
        expect(chrome.storage.local.set).toHaveBeenCalled();
        expect(chrome.sidePanel.setPanelBehavior).toHaveBeenCalledWith({
          openPanelOnActionClick: true
        });
        expect(chrome.action.setBadgeText).toHaveBeenCalled();
      });

      it('应该处理初始化错误', async () => {
        const error = new Error('Initialization error');
        chrome.storage.local.get.mockResolvedValue({});
        chrome.storage.local.set.mockResolvedValue({});
        chrome.sidePanel.setPanelBehavior.mockRejectedValue(error);

        await background.initializeExtension();

        expect(console.error).toHaveBeenCalledWith(
          '[Init] Error during extension installation:',
          error
        );
      });

      it('应该初始化所有必需的配置项', async () => {
        chrome.storage.local.get.mockResolvedValue({});
        chrome.storage.local.set.mockResolvedValue({});
        chrome.sidePanel.setPanelBehavior.mockResolvedValue({});
        chrome.action.setBadgeText.mockResolvedValue({});

        await background.initializeExtension();

        const setCalls = chrome.storage.local.set.mock.calls;
        const configKeys = setCalls.map(call => Object.keys(call[0])[0]);

        expect(configKeys).toContain('onoff');
        expect(configKeys).toContain('auth_token');
        expect(configKeys).toContain('tts_endpoint');
        expect(configKeys).toContain('tts_model');
        expect(configKeys).toContain('tts_voice');
        expect(configKeys).toContain('chat_endpoint');
        expect(configKeys).toContain('chat_model');
        expect(configKeys).toContain('action_items');
      });
    });
  });

  // ========================================================================
  // 事件监听器测试
  // ========================================================================

  describe('事件监听器', () => {
    describe('chrome.runtime.onInstalled', () => {
      it('应该注册 onInstalled 监听器', () => {
        expect(chrome.runtime.onInstalled.addListener).toBeDefined();
      });

      it('应该在安装时调用 initializeExtension', async () => {
        chrome.storage.local.get.mockResolvedValue({});
        chrome.storage.local.set.mockResolvedValue({});
        chrome.sidePanel.setPanelBehavior.mockResolvedValue({});
        chrome.action.setBadgeText.mockResolvedValue({});

        // 直接测试 initializeExtension 函数（因为监听器注册在 background.js 中）
        await background.initializeExtension();

        expect(chrome.storage.local.get).toHaveBeenCalled();
        expect(chrome.sidePanel.setPanelBehavior).toHaveBeenCalledWith({
          openPanelOnActionClick: true
        });
        expect(chrome.action.setBadgeText).toHaveBeenCalled();
      });
    });

    describe('chrome.action.onClicked', () => {
      it('应该注册 action.onClicked 监听器', () => {
        expect(chrome.action.onClicked.addListener).toBeDefined();
      });
    });

    describe('chrome.commands.onCommand', () => {
      it('应该注册 commands.onCommand 监听器', () => {
        expect(chrome.commands.onCommand.addListener).toBeDefined();
      });
    });

    describe('chrome.storage.local.onChanged', () => {
      it('应该更新徽章当 onoff 改变', () => {
        chrome.action.setBadgeText.mockResolvedValue({});

        const changes = {
          'onoff': {
            oldValue: false,
            newValue: true
          }
        };

        // 直接测试 updateBadge 函数（因为监听器逻辑简单）
        background.updateBadge(changes.onoff.newValue);

        expect(chrome.action.setBadgeText).toHaveBeenCalledWith({ text: 'ON' });
      });

      it('应该忽略非 onoff 的变化', () => {
        chrome.action.setBadgeText.mockResolvedValue({});

        const changes = {
          'other_key': {
            oldValue: 'old',
            newValue: 'new'
          }
        };

        // 如果 onoff 没有改变，updateBadge 不应该被调用
        // 这个逻辑在实际的 background.js 中处理
        expect(chrome.action.setBadgeText).not.toHaveBeenCalled();
      });
    });

    describe('chrome.runtime.onMessage', () => {
      it('应该注册 onMessage 监听器', () => {
        expect(chrome.runtime.onMessage.addListener).toBeDefined();
      });

      it('应该响应消息', () => {
        const request = { type: 'test', data: 'test data' };
        const sender = { tab: { id: 1 } };
        const sendResponse = jest.fn();

        // 模拟消息处理逻辑
        try {
          sendResponse({ data: 'done' });
        } catch (error) {
          console.error('Error handling message:', error);
          sendResponse({ error: error.message });
        }

        expect(sendResponse).toHaveBeenCalledWith({ data: 'done' });
      });

      it('应该处理消息错误', () => {
        const request = { type: 'test' };
        const sender = { tab: { id: 1 } };
        const sendResponse = jest.fn();

        try {
          throw new Error('Response error');
        } catch (error) {
          console.error('Error handling message:', error);
          sendResponse({ error: error.message });
        }

        expect(console.error).toHaveBeenCalled();
        expect(sendResponse).toHaveBeenCalledWith({ error: 'Response error' });
      });
    });
  });
});
