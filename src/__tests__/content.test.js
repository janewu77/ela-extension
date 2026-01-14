/**
 * Content.js 测试文件
 * 
 * 直接引用 content.js 文件进行测试，确保测试的是实际代码
 * 当原文件修改时，测试会自动反映这些变化
 */

// ============================================================================
// Mock 全局变量和依赖
// ============================================================================

// Mock debug 变量（content.js 需要，来自 const.js）
global.debug = false;

// ============================================================================
// 导入实际的 content.js 文件
// ============================================================================

// 清除缓存以确保每次测试都使用最新代码
delete require.cache[require.resolve('../scripts/content.js')];

// 直接 require content.js（它会自动导出函数）
const content = require('../scripts/content.js');

// ============================================================================
// 测试套件
// ============================================================================

describe('Content.js 测试', () => {
  let mockSelection;

  beforeEach(() => {
    // 重置所有 mock
    jest.clearAllMocks();
    chrome.storage.local.get.mockClear();
    chrome.storage.local.onChanged.addListener.mockClear();
    chrome.runtime.sendMessage.mockClear();
    document.addEventListener.mockClear();
    window.getSelection.mockClear();

    // Mock console methods
    global.console.error = jest.fn();
    global.console.log = jest.fn();

    // 重置状态
    content.setCurrentOnoff(false);

    // Mock window.getSelection
    mockSelection = {
      toString: jest.fn()
    };
    window.getSelection.mockReturnValue(mockSelection);

    // Mock window.self and window.top
    window.self = {};
    window.top = window.self; // 默认是 top frame
  });

  // ========================================================================
  // 状态管理测试
  // ========================================================================

  describe('状态管理', () => {
    describe('initializeState', () => {
      it('应该从存储中加载 onoff 状态', async () => {
        chrome.storage.local.get.mockResolvedValue({ onoff: true });

        await content.initializeState();

        expect(chrome.storage.local.get).toHaveBeenCalledWith('onoff');
        expect(content.getCurrentOnoff()).toBe(true);
      });

      it('应该使用默认值 false 当存储中没有 onoff', async () => {
        chrome.storage.local.get.mockResolvedValue({});

        await content.initializeState();

        expect(content.getCurrentOnoff()).toBe(false);
      });

      it('应该使用默认值 false 当 onoff 为 null', async () => {
        chrome.storage.local.get.mockResolvedValue({ onoff: null });

        await content.initializeState();

        expect(content.getCurrentOnoff()).toBe(false);
      });

      it('应该处理存储读取错误', async () => {
        const error = new Error('Storage error');
        chrome.storage.local.get.mockRejectedValue(error);

        await content.initializeState();

        expect(console.error).toHaveBeenCalledWith(
          '[Content] Error loading initial state:',
          error
        );
        expect(content.getCurrentOnoff()).toBe(false);
      });
    });

    describe('updateState', () => {
      it('应该更新当前状态', () => {
        content.updateState(true);
        expect(content.getCurrentOnoff()).toBe(true);

        content.updateState(false);
        expect(content.getCurrentOnoff()).toBe(false);
      });
    });
  });

  // ========================================================================
  // 文本选择处理测试
  // ========================================================================

  describe('文本选择处理', () => {
    describe('getSelectedText', () => {
      it('应该返回选中的文本（已修剪）', () => {
        mockSelection.toString.mockReturnValue('  selected text  ');

        const result = content.getSelectedText();

        expect(window.getSelection).toHaveBeenCalled();
        expect(result).toBe('selected text');
      });

      it('应该返回空字符串当没有选中文本', () => {
        mockSelection.toString.mockReturnValue('');

        const result = content.getSelectedText();

        expect(result).toBe('');
      });

      it('应该返回空字符串当 selection 为 null', () => {
        window.getSelection.mockReturnValue(null);

        const result = content.getSelectedText();

        expect(result).toBe('');
      });

      it('应该处理获取选中文本时的错误', () => {
        const error = new Error('Selection error');
        window.getSelection.mockImplementation(() => {
          throw error;
        });

        const result = content.getSelectedText();

        expect(console.error).toHaveBeenCalledWith(
          '[Content] Error getting selected text:',
          error
        );
        expect(result).toBe('');
      });

      it('应该处理只有空格的文本', () => {
        mockSelection.toString.mockReturnValue('   \n\t  ');

        const result = content.getSelectedText();

        expect(result).toBe('');
      });
    });

    describe('sendSelectedText', () => {
      it('应该发送选中的文本消息', async () => {
        chrome.runtime.sendMessage.mockResolvedValue({});

        await content.sendSelectedText('test text');

        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
          type: 'selectedText',
          msg: 'test text',
          isTopFrame: true
        });
      });

      it('应该不发送空文本', async () => {
        await content.sendSelectedText('');
        await content.sendSelectedText(null);
        await content.sendSelectedText(undefined);

        expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
      });

      it('应该正确设置 isTopFrame 为 false 当不是顶层框架', async () => {
        window.self = {};
        window.top = {}; // 不同的对象表示不是顶层框架
        chrome.runtime.sendMessage.mockResolvedValue({});

        await content.sendSelectedText('test');

        expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
          type: 'selectedText',
          msg: 'test',
          isTopFrame: false
        });
      });

      it('应该处理发送消息时的错误', async () => {
        const error = new Error('Send message error');
        chrome.runtime.sendMessage.mockRejectedValue(error);

        await content.sendSelectedText('test text');

        expect(console.error).toHaveBeenCalledWith(
          '[Content] Error sending message:',
          error
        );
      });
    });

    describe('handleTextSelection', () => {
      it('应该发送文本当扩展启用时', async () => {
        content.setCurrentOnoff(true);
        mockSelection.toString.mockReturnValue('selected text');
        chrome.runtime.sendMessage.mockResolvedValue({});

        content.handleTextSelection();

        // 等待异步操作完成
        await new Promise(resolve => setTimeout(resolve, 10));

        expect(chrome.runtime.sendMessage).toHaveBeenCalled();
      });

      it('应该忽略选择当扩展禁用时', async () => {
        content.setCurrentOnoff(false);
        mockSelection.toString.mockReturnValue('selected text');

        content.handleTextSelection();

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
      });

      it('应该忽略空文本选择', async () => {
        content.setCurrentOnoff(true);
        mockSelection.toString.mockReturnValue('');

        content.handleTextSelection();

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
      });
    });
  });

  // ========================================================================
  // 事件监听器测试
  // ========================================================================

  describe('事件监听器', () => {
    describe('handleMouseUp', () => {
      it('应该处理鼠标释放事件', async () => {
        content.setCurrentOnoff(true);
        mockSelection.toString.mockReturnValue('selected text');
        chrome.runtime.sendMessage.mockResolvedValue({});

        const event = {
          target: document.body,
          timeStamp: Date.now()
        };

        content.handleMouseUp(event);

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(chrome.runtime.sendMessage).toHaveBeenCalled();
      });

      it('应该忽略事件当扩展禁用时', async () => {
        content.setCurrentOnoff(false);
        mockSelection.toString.mockReturnValue('selected text');

        const event = {
          target: document.body,
          timeStamp: Date.now()
        };

        content.handleMouseUp(event);

        await new Promise(resolve => setTimeout(resolve, 10));

        expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
      });
    });
  });

  // ========================================================================
  // 初始化测试
  // ========================================================================

  describe('初始化', () => {
    describe('initialize', () => {
      it('应该初始化状态并注册监听器', async () => {
        chrome.storage.local.get.mockResolvedValue({ onoff: true });

        await content.initialize();

        expect(chrome.storage.local.get).toHaveBeenCalledWith('onoff');
        expect(chrome.storage.local.onChanged.addListener).toHaveBeenCalled();
        expect(document.addEventListener).toHaveBeenCalledWith('mouseup', content.handleMouseUp);
      });

      it('应该处理初始化错误', async () => {
        const error = new Error('Init error');
        chrome.storage.local.get.mockRejectedValue(error);

        await content.initialize();

        expect(console.error).toHaveBeenCalled();
      });

      it('应该在存储变化时更新状态', async () => {
        chrome.storage.local.get.mockResolvedValue({ onoff: false });

        await content.initialize();

        // 获取存储变化监听器
        const listener = chrome.storage.local.onChanged.addListener.mock.calls[0][0];
        
        // 模拟存储变化
        listener({
          'onoff': {
            oldValue: false,
            newValue: true
          }
        });

        expect(content.getCurrentOnoff()).toBe(true);
      });

      it('应该忽略非 onoff 的存储变化', async () => {
        chrome.storage.local.get.mockResolvedValue({ onoff: false });

        await content.initialize();

        const listener = chrome.storage.local.onChanged.addListener.mock.calls[0][0];
        const oldValue = content.getCurrentOnoff();
        
        // 模拟其他存储变化
        listener({
          'other_key': {
            oldValue: 'old',
            newValue: 'new'
          }
        });

        expect(content.getCurrentOnoff()).toBe(oldValue);
      });
    });
  });

  // ========================================================================
  // 集成测试
  // ========================================================================

  describe('集成测试', () => {
    it('应该完整流程：初始化 -> 选择文本 -> 发送消息', async () => {
      // 1. 初始化
      chrome.storage.local.get.mockResolvedValue({ onoff: true });
      await content.initialize();

      // 2. 模拟文本选择
      content.setCurrentOnoff(true);
      mockSelection.toString.mockReturnValue('test selection');
      chrome.runtime.sendMessage.mockResolvedValue({});

      // 3. 触发鼠标事件
      const event = {
        target: document.body,
        timeStamp: Date.now()
      };
      content.handleMouseUp(event);

      // 4. 等待异步操作
      await new Promise(resolve => setTimeout(resolve, 10));

      // 5. 验证
      expect(chrome.runtime.sendMessage).toHaveBeenCalledWith({
        type: 'selectedText',
        msg: 'test selection',
        isTopFrame: true
      });
    });

    it('应该在扩展禁用时不发送消息', async () => {
      chrome.storage.local.get.mockResolvedValue({ onoff: false });
      await content.initialize();

      mockSelection.toString.mockReturnValue('test selection');

      const event = {
        target: document.body,
        timeStamp: Date.now()
      };
      content.handleMouseUp(event);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(chrome.runtime.sendMessage).not.toHaveBeenCalled();
    });
  });
});
