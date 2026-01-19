/**
 * Chataction.js 测试文件
 * 
 * 直接引用 chataction.js 文件进行测试，确保测试的是实际代码
 */

// ============================================================================
// Mock 全局变量和依赖
// ============================================================================

// 引入 mock 常量
const { setupMockConstants } = require('./mockConst.mock.js');

// 设置全局 mock 常量（必须在 require 之前设置）
setupMockConstants();

// Mock 全局 Map（mapMsg 在 playback.js 中定义）
global.mapMsg = new Map();

// Mock 全局变量和函数
global.current_action_items_active = global.default_action_items.filter(item => item.active);

// Mock document 和 DOM（必须在 require 模块之前设置）
let mockElements = {};

function resetDOM() {
  mockElements = {};
  
  global.document = {
    ...global.document,
    createElement: jest.fn((tag) => {
      const element = {
        tagName: tag.toUpperCase(),
        id: '',
        className: '',
        innerHTML: '',
        textContent: '',
        readOnly: false,
        rows: 0,
        disabled: false,
        appendChild: jest.fn(),
        removeChild: jest.fn(),
        querySelector: jest.fn((selector) => {
          // 简单的 querySelector mock
          if (selector.startsWith('#')) {
            const id = selector.substring(1);
            return mockElements[id] || null;
          }
          return null;
        }),
        querySelectorAll: jest.fn(() => []),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        hidden: false,
        childNodes: []
      };
      return element;
    }),
    getElementById: jest.fn((id) => {
      if (id === 'container-content') {
        return {
          appendChild: jest.fn(),
          insertBefore: jest.fn(),
          removeChild: jest.fn()
        };
      }
      return mockElements[id] || null;
    }),
    addEventListener: jest.fn()
  };
}

// 在 require 之前先设置 document
resetDOM();

// 直接引用实际模块，而不是 mock
const sidepanel = require('../sidepanels/sidepanel.js');
const playback = require('../sidepanels/playback.js');
const api = require('../sidepanels/api.js');
const util = require('../scripts/util.js');

// 使用实际导出的常量和函数
global.ClassNameForTxtAreaButton = playback.ClassNameForTxtAreaButton;
global.SVGLoadingSpin = sidepanel.SVGLoadingSpin;
global.SVGDelete_light = sidepanel.SVGDelete_light;
global.SVGCopy_light = sidepanel.SVGCopy_light;

// 使用 jest.spyOn 包装实际函数，以便跟踪调用情况
global.createButton = jest.spyOn(sidepanel, 'createButton');
global.getBtnSetting = jest.spyOn(sidepanel, 'getBtnSetting');
global.fetchChat = jest.spyOn(api, 'fetchChat');
global.streamResponseRead = jest.spyOn(api, 'streamResponseRead');
global.calculateLines = jest.spyOn(util, 'calculateLines');

// Mock navigator.clipboard
global.navigator = {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined)
  }
};

// ============================================================================
// 测试套件
// ============================================================================

// 导入实际的 chataction.js 文件
delete require.cache[require.resolve('../sidepanels/chataction.js')];
const chataction = require('../sidepanels/chataction.js');

describe('Chataction.js 测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetDOM();
    
    // 重置全局变量
    global.mapMsg.clear();
    global.current_action_items_active = global.default_action_items.filter(item => item.active);
    
    // 重置 spy 函数
    global.createButton.mockClear();
    global.fetchChat.mockClear();
    global.streamResponseRead.mockClear();
    global.calculateLines.mockClear();
    global.getBtnSetting.mockClear();
    global.navigator.clipboard.writeText.mockClear();
  });

  describe('showBtn', () => {
    it('应该显示按钮（设置为 visible）', () => {
      const mockButton = {
        className: 'initial-class'
      };

      chataction.showBtn(mockButton, 'visible');

      expect(mockButton.className).toContain('visible');
      expect(mockButton.className).toContain(global.ClassNameForTxtAreaButton);
    });

    it('应该隐藏按钮（设置为 hidden）', () => {
      const mockButton = {
        className: 'initial-class'
      };

      chataction.showBtn(mockButton, 'hidden');

      expect(mockButton.className).toContain('hidden');
      expect(mockButton.className).toContain(global.ClassNameForTxtAreaButton);
    });

    it('应该处理无效的按钮元素', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      chataction.showBtn(null, 'visible');

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Invalid button element')
      );

      consoleWarnSpy.mockRestore();
    });

    it('应该处理错误情况', () => {
      const mockButton = {
        get className() {
          throw new Error('Property error');
        }
      };

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => chataction.showBtn(mockButton, 'visible')).not.toThrow();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('disableAllBtn', () => {
    it('应该禁用所有按钮', () => {
      const buttons = [
        { disabled: false },
        { disabled: false },
        { disabled: false }
      ];

      chataction.disableAllBtn(buttons, true);

      expect(buttons[0].disabled).toBe(true);
      expect(buttons[1].disabled).toBe(true);
      expect(buttons[2].disabled).toBe(true);
    });

    it('应该启用所有按钮', () => {
      const buttons = [
        { disabled: true },
        { disabled: true },
        { disabled: true }
      ];

      chataction.disableAllBtn(buttons, false);

      expect(buttons[0].disabled).toBe(false);
      expect(buttons[1].disabled).toBe(false);
      expect(buttons[2].disabled).toBe(false);
    });

    it('应该处理无效的按钮数组', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

      chataction.disableAllBtn(null, true);
      chataction.disableAllBtn('not-an-array', true);

      expect(consoleWarnSpy).toHaveBeenCalled();

      consoleWarnSpy.mockRestore();
    });

    it('应该处理没有 disabled 属性的按钮', () => {
      const buttons = [
        { disabled: false },
        { noDisabled: true }, // 没有 disabled 属性
        { disabled: false }
      ];

      expect(() => chataction.disableAllBtn(buttons, true)).not.toThrow();
      expect(buttons[0].disabled).toBe(true);
      expect(buttons[2].disabled).toBe(true);
    });

    it('应该处理错误情况', () => {
      const buttons = [
        {
          get disabled() {
            throw new Error('Property error');
          }
        }
      ];

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => chataction.disableAllBtn(buttons, true)).not.toThrow();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('_createResponseElement', () => {
    it('应该创建响应元素', () => {
      const uuid = 123;
      const element = chataction._createResponseElement(uuid);

      expect(element.tagName).toBe('DIV');
      expect(element.id).toBe(`CustomPannel_SysMsg_${uuid}`);
      expect(element.className).toContain('mt-2');
    });

    it('应该创建包含 textarea 的响应元素', () => {
      const uuid = 456;
      const element = chataction._createResponseElement(uuid);

      // 验证 document.createElement 被调用
      expect(global.document.createElement).toHaveBeenCalledWith('div');
      expect(global.document.createElement).toHaveBeenCalledWith('textarea');
    });
  });

  describe('_createMenuButtons', () => {
    it('应该创建菜单按钮容器', () => {
      const uuid = 789;
      const mockDivMsg = {
        querySelector: jest.fn(),
        appendChild: jest.fn()
      };
      const arrActionButton = [];

      const menuButtons = chataction._createMenuButtons(uuid, mockDivMsg, arrActionButton);

      expect(menuButtons.tagName).toBe('DIV');
      expect(menuButtons.className).toContain('absolute');
    });

    it('应该创建清除和复制按钮', () => {
      const uuid = 101;
      const mockDivMsg = {
        querySelector: jest.fn(() => null),
        appendChild: jest.fn()
      };
      const arrActionButton = [];

      chataction._createMenuButtons(uuid, mockDivMsg, arrActionButton);

      expect(global.createButton).toHaveBeenCalledWith(
        `btnClear_${uuid}`,
        expect.stringContaining(global.ClassNameForTxtAreaButton),
        global.SVGDelete_light,
        false
      );
      expect(global.createButton).toHaveBeenCalledWith(
        `btnCopy_${uuid}`,
        expect.stringContaining(global.ClassNameForTxtAreaButton),
        global.SVGCopy_light,
        false
      );
    });

    it('应该在清除按钮点击时清空文本', () => {
      const uuid = 202;
      const mockTextArea = {
        textContent: 'test content',
        id: `CustomPannel_Response_${uuid}`
      };
      const mockDivMsg = {
        querySelector: jest.fn((selector) => {
          if (selector === `#CustomPannel_Response_${uuid}`) {
            return mockTextArea;
          }
          return null;
        }),
        appendChild: jest.fn()
      };
      const arrActionButton = [];

      const menuButtons = chataction._createMenuButtons(uuid, mockDivMsg, arrActionButton);

      // 找到清除按钮的点击处理器
      const clearButton = global.createButton.mock.results.find(
        result => result.value.id === `btnClear_${uuid}`
      )?.value;

      expect(clearButton).toBeDefined();
      
      // 模拟点击
      const clickHandler = clearButton.addEventListener.mock.calls.find(
        call => call[0] === 'click'
      )?.[1];

      if (clickHandler) {
        clickHandler();
        expect(mockTextArea.textContent).toBe('');
      }
    });

    it('应该在复制按钮点击时复制文本到剪贴板', async () => {
      const uuid = 303;
      const mockTextArea = {
        textContent: 'text to copy',
        id: `CustomPannel_Response_${uuid}`
      };
      const mockDivMsg = {
        querySelector: jest.fn((selector) => {
          if (selector === `#CustomPannel_Response_${uuid}`) {
            return mockTextArea;
          }
          return null;
        }),
        appendChild: jest.fn()
      };
      const arrActionButton = [];

      const menuButtons = chataction._createMenuButtons(uuid, mockDivMsg, arrActionButton);

      // 找到复制按钮的点击处理器
      const copyButton = global.createButton.mock.results.find(
        result => result.value.id === `btnCopy_${uuid}`
      )?.value;

      expect(copyButton).toBeDefined();
      
      // 模拟点击
      const clickHandler = copyButton.addEventListener.mock.calls.find(
        call => call[0] === 'click'
      )?.[1];

      if (clickHandler) {
        await clickHandler();
        expect(global.navigator.clipboard.writeText).toHaveBeenCalledWith('text to copy');
      }
    });
  });

  describe('_createActionPannel', () => {
    beforeEach(() => {
      // 设置 active action items
      global.current_action_items_active = [
        { name: '翻译', active: true, prompt: 'translate', other: false },
        { name: '解释', active: true, prompt: 'explain', other: false }
      ];
      
      // 注意：createButton 是实际函数，不是 mock，不需要 mockClear()
    });

    it('应该创建操作按钮面板', () => {
      const uuid = 404;
      const arrActionButton = [];
      const mockDivMsg = {
        querySelector: jest.fn(() => null),
        appendChild: jest.fn(),
        firstChild: null,
        removeChild: jest.fn()
      };

      const actionPannel = chataction._createActionPannel(uuid, arrActionButton, mockDivMsg);

      expect(actionPannel.tagName).toBe('DIV');
      expect(actionPannel.id).toBe(`CustomPannel_ActionPannel_${uuid}`);
      expect(actionPannel.className).toContain('grid');
    });

    it('应该为每个激活的操作项创建按钮', () => {
      const uuid = 505;
      const arrActionButton = [];
      const mockDivMsg = {
        querySelector: jest.fn(() => null),
        appendChild: jest.fn(),
        firstChild: null,
        removeChild: jest.fn()
      };

      chataction._createActionPannel(uuid, arrActionButton, mockDivMsg);

      // 应该为每个 active action item 创建一个按钮
      // _createActionPannel 会调用 createButton 创建操作按钮和菜单按钮
      expect(global.createButton).toHaveBeenCalled();
      expect(arrActionButton.length).toBe(global.current_action_items_active.length);
    });

    it('应该限制列数在 1-3 之间', () => {
      const uuid = 606;
      const arrActionButton = [];
      const mockDivMsg = {
        querySelector: jest.fn(() => null),
        appendChild: jest.fn(),
        firstChild: null,
        removeChild: jest.fn()
      };

      // 测试 1 个 action item
      global.current_action_items_active = [
        { name: 'test1', active: true, prompt: 'prompt1', other: false }
      ];
      const pannel1 = chataction._createActionPannel(uuid, arrActionButton, mockDivMsg);
      expect(pannel1.className).toContain('grid-cols-1');

      // 测试 3 个 action items
      global.current_action_items_active = [
        { name: 'test1', active: true, prompt: 'prompt1', other: false },
        { name: 'test2', active: true, prompt: 'prompt2', other: false },
        { name: 'test3', active: true, prompt: 'prompt3', other: false }
      ];
      const pannel3 = chataction._createActionPannel(uuid + 1, [], mockDivMsg);
      expect(pannel3.className).toContain('grid-cols-3');

      // 测试超过 3 个 action items（应该限制为 3）
      global.current_action_items_active = [
        { name: 'test1', active: true, prompt: 'prompt1', other: false },
        { name: 'test2', active: true, prompt: 'prompt2', other: false },
        { name: 'test3', active: true, prompt: 'prompt3', other: false },
        { name: 'test4', active: true, prompt: 'prompt4', other: false }
      ];
      const pannel4 = chataction._createActionPannel(uuid + 2, [], mockDivMsg);
      expect(pannel4.className).toContain('grid-cols-3');
    });
  });

  describe('createCustomPannel', () => {
    beforeEach(() => {
      global.current_action_items_active = [
        { name: '翻译', active: true, prompt: 'translate', other: false }
      ];
    });

    it('应该创建自定义面板', () => {
      const uuid = 707;
      const panel = chataction.createCustomPannel(uuid);

      expect(panel.tagName).toBe('DIV');
      expect(panel.id).toBe(`CustomPannel_${uuid}`);
    });

    it('应该在没有激活的操作项时返回空 div', () => {
      global.current_action_items_active = [];

      const uuid = 808;
      const panel = chataction.createCustomPannel(uuid);

      expect(panel.tagName).toBe('DIV');
      expect(panel.id).not.toBe(`CustomPannel_${uuid}`);
    });

    it('应该处理 current_action_items_active 为 null 的情况', () => {
      global.current_action_items_active = null;

      const uuid = 909;
      const panel = chataction.createCustomPannel(uuid);

      expect(panel.tagName).toBe('DIV');
    });

    it('应该处理错误情况', () => {
      global.document.createElement.mockImplementationOnce(() => {
        throw new Error('Create error');
      });

      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

      const panel = chataction.createCustomPannel(1010);

      expect(panel.tagName).toBe('DIV');
      expect(consoleErrorSpy).toHaveBeenCalled();

      consoleErrorSpy.mockRestore();
    });
  });
});
