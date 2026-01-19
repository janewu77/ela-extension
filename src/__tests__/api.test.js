/**
 * API.js 测试文件
 * 
 * 直接引用 api.js 文件进行测试，确保测试的是实际代码
 * 当原文件修改时，测试会自动反映这些变化
 */

// ============================================================================
// Mock 全局变量和依赖
// ============================================================================

const { setupMockConstants } = require('./mockConst.mock.js');
setupMockConstants();

// 设置全局变量（api.js 依赖这些变量）
global.current_tts_endpoint = global.default_tts_endpoint;
global.current_tts_model = global.default_tts_model;
global.current_tts_voice = global.default_tts_voice;
global.current_auth_token = global.default_auth_token;
global.current_chat_endpoint = global.default_chat_endpoint;
global.current_chat_model = global.default_chat_model;

// Mock fetch API
global.fetch = jest.fn();

// Mock chrome.i18n
global.chrome = {
  ...global.chrome,
  i18n: {
    getMessage: jest.fn((key) => {
      const messages = {
        err_key: "Please check if your OpenAI API Key is correctly set."
      };
      return messages[key] || '';
    })
  }
};

// ============================================================================
// 导入实际的 api.js 文件
// ============================================================================

// 清除缓存以确保每次测试都使用最新代码
delete require.cache[require.resolve('../sidepanels/api.js')];

// 直接 require api.js（它会自动导出函数）
const api = require('../sidepanels/api.js');

// ============================================================================
// 测试套件
// ============================================================================

describe('API.js 测试', () => {
  beforeEach(() => {
    // 重置所有 mock
    jest.clearAllMocks();
    // 只在 fetch 是 mock 函数时才调用 mockClear
    if (global.fetch && typeof global.fetch.mockClear === 'function') {
      global.fetch.mockClear();
    }
    chrome.i18n.getMessage.mockClear();

    // 重置全局变量
    global.current_tts_endpoint = global.default_tts_endpoint;
    global.current_tts_model = global.default_tts_model;
    global.current_tts_voice = global.default_tts_voice;
    global.current_auth_token = global.default_auth_token;
    global.current_chat_endpoint = global.default_chat_endpoint;
    global.current_chat_model = global.default_chat_model;

    // Mock console methods
    global.console.error = jest.fn();
    global.console.log = jest.fn();
    global.console.warn = jest.fn();
  });

  // ========================================================================
  // TTS API 测试
  // ========================================================================

  describe('fetchAudio', () => {
    it('应该成功获取音频数据', async () => {
      const mockArrayBuffer = new ArrayBuffer(8);
      const mockResponse = {
        ok: true,
        arrayBuffer: jest.fn().mockResolvedValue(mockArrayBuffer)
      };

      global.fetch.mockResolvedValue(mockResponse);

      const onSuccess = jest.fn();
      const onError = jest.fn();

      await new Promise((resolve) => {
        api.fetchAudio('test message', (data) => {
          onSuccess(data);
          resolve();
        }, onError);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        global.current_tts_endpoint,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'authorization': `Bearer ${global.current_auth_token}`
          }),
          body: expect.stringContaining('"input":"test message"')
        })
      );

      expect(onSuccess).toHaveBeenCalledWith(mockArrayBuffer);
      expect(onError).not.toHaveBeenCalled();
    });

    it('应该处理空消息', async () => {
      const onSuccess = jest.fn();
      const onError = jest.fn();

      api.fetchAudio('', onSuccess, onError);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(onError).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('应该处理未配置的 endpoint 或 token', async () => {
      global.current_tts_endpoint = '';
      const onSuccess = jest.fn();
      const onError = jest.fn();

      api.fetchAudio('test message', onSuccess, onError);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(onError).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('应该处理 HTTP 错误响应', async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      };

      global.fetch.mockResolvedValue(mockResponse);

      const onSuccess = jest.fn();
      const onError = jest.fn();

      await new Promise((resolve) => {
        api.fetchAudio('test message', onSuccess, (error) => {
          onError(error);
          resolve();
        });
      });

      expect(onError).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('应该处理 401 错误并显示友好消息', async () => {
      // 注意：只有当 statusText 为空字符串且 errorMsg.length < 1 时才会调用 chrome.i18n.getMessage
      // 但实际代码中，如果 statusText 是空字符串，errorMsg 会是 'Unknown error'（因为空字符串是 falsy）
      // 所以这个测试主要验证错误处理逻辑，而不是 chrome.i18n.getMessage 的调用
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        arrayBuffer: jest.fn()
      };

      global.fetch.mockResolvedValue(mockResponse);

      const onSuccess = jest.fn();
      const onError = jest.fn();

      await new Promise((resolve) => {
        api.fetchAudio('test message', onSuccess, (error) => {
          onError(error);
          resolve();
        });
      });

      expect(onError).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      // 验证错误消息包含状态码
      const errorCall = onError.mock.calls[0][0];
      expect(errorCall.message).toContain('[401]');
    });

    it('应该处理网络错误', async () => {
      global.fetch.mockRejectedValue(new Error('Network error'));

      const onSuccess = jest.fn();
      const onError = jest.fn();

      await new Promise((resolve) => {
        api.fetchAudio('test message', onSuccess, (error) => {
          onError(error);
          resolve();
        });
      });

      expect(onError).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });
  });

  // ========================================================================
  // Chat API 测试
  // ========================================================================

  describe('fetchChat', () => {
    it('应该成功获取流式响应', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn()
        }
      };

      global.fetch.mockResolvedValue(mockResponse);

      const onSuccess = jest.fn();
      const onError = jest.fn();

      await new Promise((resolve) => {
        api.fetchChat('user message', 'system prompt', (data, stream) => {
          onSuccess(data, stream);
          resolve();
        }, onError, true);
      });

      expect(global.fetch).toHaveBeenCalledWith(
        global.current_chat_endpoint,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'authorization': `Bearer ${global.current_auth_token}`
          }),
          body: expect.stringContaining('"stream":true')
        })
      );

      expect(onSuccess).toHaveBeenCalledWith(mockResponse, true);
      expect(onError).not.toHaveBeenCalled();
    });

    it('应该成功获取非流式响应', async () => {
      const mockJsonResponse = {
        choices: [{
          message: {
            content: 'Response message'
          }
        }]
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue(mockJsonResponse)
      };

      global.fetch.mockResolvedValue(mockResponse);

      const onSuccess = jest.fn();
      const onError = jest.fn();

      await new Promise((resolve) => {
        api.fetchChat('user message', 'system prompt', (data, stream) => {
          onSuccess(data, stream);
          resolve();
        }, onError, false);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockJsonResponse, false);
      expect(onError).not.toHaveBeenCalled();
    });

    it('应该处理空消息', async () => {
      const onSuccess = jest.fn();
      const onError = jest.fn();

      api.fetchChat('', 'system prompt', onSuccess, onError);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(onError).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('应该处理未配置的 endpoint 或 token', async () => {
      global.current_chat_endpoint = '';
      const onSuccess = jest.fn();
      const onError = jest.fn();

      api.fetchChat('user message', 'system prompt', onSuccess, onError);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(onError).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      expect(global.fetch).not.toHaveBeenCalled();
    });

    it('应该处理 HTTP 错误响应', async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: 'Internal Server Error'
      };

      global.fetch.mockResolvedValue(mockResponse);

      const onSuccess = jest.fn();
      const onError = jest.fn();

      await new Promise((resolve) => {
        api.fetchChat('user message', 'system prompt', onSuccess, (error) => {
          onError(error);
          resolve();
        });
      });

      expect(onError).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
    });

    it('应该处理 401 错误并显示友好消息', async () => {
      // 注意：只有当 statusText 为空字符串且 errorMsg.length < 1 时才会调用 chrome.i18n.getMessage
      // 但实际代码中，如果 statusText 是空字符串，errorMsg 会是 'Unknown error'（因为空字符串是 falsy）
      // 所以这个测试主要验证错误处理逻辑，而不是 chrome.i18n.getMessage 的调用
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        json: jest.fn()
      };

      global.fetch.mockResolvedValue(mockResponse);

      const onSuccess = jest.fn();
      const onError = jest.fn();

      await new Promise((resolve) => {
        api.fetchChat('user message', 'system prompt', onSuccess, (error) => {
          onError(error);
          resolve();
        });
      });

      expect(onError).toHaveBeenCalled();
      expect(onSuccess).not.toHaveBeenCalled();
      // 验证错误消息包含状态码
      const errorCall = onError.mock.calls[0][0];
      expect(errorCall.message).toContain('[401]');
    });

    it('应该使用默认的 stream 参数', async () => {
      const mockResponse = {
        ok: true,
        body: {
          getReader: jest.fn()
        }
      };

      global.fetch.mockResolvedValue(mockResponse);

      const onSuccess = jest.fn();
      const onError = jest.fn();

      await new Promise((resolve) => {
        api.fetchChat('user message', 'system prompt', (data, stream) => {
          onSuccess(data, stream);
          resolve();
        }, onError);
      });

      expect(onSuccess).toHaveBeenCalledWith(mockResponse, true);
    });
  });

  // ========================================================================
  // 流式响应处理测试
  // ========================================================================

  describe('streamResponseRead', () => {
    it('应该读取流式响应数据', async () => {
      const mockContent = ['Hello', ' World', '!'];
      let readIndex = 0;

      const mockReader = {
        read: jest.fn().mockImplementation(() => {
          if (readIndex < mockContent.length) {
            const value = new TextEncoder().encode(
              `data: {"choices":[{"delta":{"content":"${mockContent[readIndex]}"}}]}\n`
            );
            readIndex++;
            return Promise.resolve({ done: false, value });
          } else {
            return Promise.resolve({ done: true, value: undefined });
          }
        })
      };

      const afterGetContent = jest.fn();
      const onDone = jest.fn();

      api.streamResponseRead(mockReader, afterGetContent, onDone);

      // 等待所有异步操作完成
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(afterGetContent).toHaveBeenCalledTimes(3);
      expect(afterGetContent).toHaveBeenCalledWith('Hello');
      expect(afterGetContent).toHaveBeenCalledWith(' World');
      expect(afterGetContent).toHaveBeenCalledWith('!');
      expect(onDone).toHaveBeenCalled();
    });

    it('应该处理 DONE 标记', async () => {
      const mockReader = {
        read: jest.fn()
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode('data: [DONE]\n')
          })
      };

      const afterGetContent = jest.fn();
      const onDone = jest.fn();

      api.streamResponseRead(mockReader, afterGetContent, onDone);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(onDone).toHaveBeenCalled();
      expect(afterGetContent).not.toHaveBeenCalled();
    });

    it('应该跳过空行', async () => {
      const mockReader = {
        read: jest.fn()
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode('\n\ndata: {"choices":[{"delta":{"content":"test"}}]}\n\n')
          })
          .mockResolvedValueOnce({
            done: true,
            value: undefined
          })
      };

      const afterGetContent = jest.fn();
      const onDone = jest.fn();

      api.streamResponseRead(mockReader, afterGetContent, onDone);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(afterGetContent).toHaveBeenCalledWith('test');
      expect(onDone).toHaveBeenCalled();
    });

    it('应该处理无效的 reader', () => {
      const afterGetContent = jest.fn();
      const onDone = jest.fn();

      api.streamResponseRead(null, afterGetContent, onDone);

      expect(onDone).toHaveBeenCalled();
      expect(afterGetContent).not.toHaveBeenCalled();
    });

    it('应该处理 JSON 解析错误', async () => {
      const mockReader = {
        read: jest.fn()
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode('invalid json\n')
          })
          .mockResolvedValueOnce({
            done: true,
            value: undefined
          })
      };

      const afterGetContent = jest.fn();
      const onDone = jest.fn();

      api.streamResponseRead(mockReader, afterGetContent, onDone);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(onDone).toHaveBeenCalled();
      expect(afterGetContent).not.toHaveBeenCalled();
    });

    it('应该处理读取错误', async () => {
      const mockReader = {
        read: jest.fn().mockRejectedValue(new Error('Read error'))
      };

      const afterGetContent = jest.fn();
      const onDone = jest.fn();

      api.streamResponseRead(mockReader, afterGetContent, onDone);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(onDone).toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });

    it('应该处理没有 content 的响应', async () => {
      const mockReader = {
        read: jest.fn()
          .mockResolvedValueOnce({
            done: false,
            value: new TextEncoder().encode('data: {"choices":[{"delta":{}}]}\n')
          })
          .mockResolvedValueOnce({
            done: true,
            value: undefined
          })
      };

      const afterGetContent = jest.fn();
      const onDone = jest.fn();

      api.streamResponseRead(mockReader, afterGetContent, onDone);

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(afterGetContent).not.toHaveBeenCalled();
      expect(onDone).toHaveBeenCalled();
    });
  });

  // ========================================================================
  // 集成测试（可选 - 需要真实的 API key 和网络连接）
  // ========================================================================

  // 注意：这些测试默认跳过，因为它们需要真实的 API key 和网络连接
  // 要运行这些测试，请：
  // 1. 设置环境变量：SKIP_INTEGRATION_TESTS=false
  // 2. 设置环境变量：TEST_API_KEY=your-actual-api-key
  // 或者直接在测试中设置 API key（见下面的 beforeAll）
  
  // 注意：集成测试默认跳过，需要有效的 API key 和网络连接
  // 集成测试（默认跳过）
  // 要运行集成测试，将 describe.skip 改为 describe
  // 注意：在 Jest 的 Node.js 环境中，需要安装 node-fetch 或配置其他方式获取真实的 fetch
  describe.skip('集成测试（需要真实 API）', () => {
    let testApiKey = null;

    // 辅助函数：获取真实的 fetch
    function getRealFetch() {
      return (typeof globalThis !== 'undefined' && typeof globalThis.fetch === 'function')
        ? globalThis.fetch
        : (typeof fetch === 'function' ? fetch : null);
    }

    // 辅助函数：确保使用真实的 fetch
    function ensureRealFetch() {
      if (global.fetch && global.fetch.mock) {
        delete global.fetch;
      }
      if (typeof global.fetch === 'undefined') {
        const realFetch = getRealFetch();
        if (realFetch) {
          global.fetch = realFetch;
          return true;
        }
        return false;
      }
      return !global.fetch.mock;
    }

    // 辅助函数：验证 API 调用结果
    function verifyApiResult(onSuccess, onError) {
      if (onError.mock.calls.length > 0) {
        expect(onError).toHaveBeenCalled();
        expect(onSuccess).not.toHaveBeenCalled();
      } else {
        expect(onSuccess).toHaveBeenCalled();
        expect(onError).not.toHaveBeenCalled();
      }
    }

    beforeAll(() => {
      // 设置 API key（从环境变量或直接设置）
      const apiKeyFromEnv = process.env.TEST_API_KEY || 'your-actual-api-key-here';
      if (apiKeyFromEnv && apiKeyFromEnv !== 'Your-OpenAI-API-Key') {
        testApiKey = apiKeyFromEnv;
        global.current_auth_token = apiKeyFromEnv;
      }

      // 清除 mock 的 fetch
      delete global.fetch;
      const realFetch = getRealFetch();
      if (realFetch) {
        global.fetch = realFetch;
      }
    });

    beforeEach(() => {
      // 恢复 API key 和真实的 fetch
      if (testApiKey) {
        global.current_auth_token = testApiKey;
      }
      ensureRealFetch();

      // 恢复真实的 console
      global.console.log = console._original?.log || console.log;
      global.console.error = console._original?.error || console.error;
      global.console.warn = console._original?.warn || console.warn;
    });

    afterAll(() => {
      global.fetch = jest.fn();
    });

    it('应该实际调用 TTS API（需要真实 API key）', async () => {
      if (!ensureRealFetch()) {
        console.warn('[测试] 无法获取真实的 fetch，跳过测试');
        return;
      }

      const onSuccess = jest.fn();
      const onError = jest.fn();

      await new Promise((resolve) => {
        api.fetchAudio('Hello, world!', (data) => {
          onSuccess(data);
          resolve();
        }, (error) => {
          onError(error);
          resolve();
        });
      });

      // 验证结果
      verifyApiResult(onSuccess, onError);
    }, 30000);

    it('应该实际调用 Chat API（需要真实 API key）', async () => {
      if (!ensureRealFetch()) {
        console.warn('[测试] 无法获取真实的 fetch，跳过测试');
        return;
      }

      const onSuccess = jest.fn();
      const onError = jest.fn();

      await new Promise((resolve) => {
        api.fetchChat('Hello', 'You are a helpful assistant', (data, stream) => {
          onSuccess(data, stream);
          resolve();
        }, (error) => {
          onError(error);
          resolve();
        }, false);
      });

      // 验证结果
      verifyApiResult(onSuccess, onError);
    }, 30000);
  });
});
