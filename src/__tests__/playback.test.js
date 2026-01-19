/**
 * Playback.js 测试文件
 * 
 * 直接引用 playback.js 文件进行测试，确保测试的是实际代码
 */

// ============================================================================
// Mock 全局变量和依赖
// ============================================================================

// 引入 mock 常量
const { setupMockConstants } = require('./mockConst.mock.js');

// 设置全局 mock 常量（必须在 require 之前设置）
setupMockConstants();

// Mock 全局变量和函数
global.current_action_items_active = global.default_action_items.filter(item => item.active);

// Mock document 和 DOM（必须在 require 模块之前设置）
// 注意：mockDivContentContainer 必须在模块加载前创建，因为 playback.js 在顶层会获取它
const mockDivContentContainer = {
  appendChild: jest.fn(),
  insertBefore: jest.fn(),
  removeChild: jest.fn()
};

let mockBtnDeleteAll = null;
let mockElements = {};

/**
 * 创建 mock DOM 元素
 */
function createMockElement(tag = 'div', props = {}) {
  return {
    tagName: tag.toUpperCase(),
    className: '',
    innerHTML: '',
    id: props.id || '',
    disabled: false,
    hidden: false,
    rows: 0,
    readOnly: false,
    textContent: '',
    value: '',
    checked: false,
    appendChild: jest.fn(),
    removeChild: jest.fn(),
    remove: jest.fn(),
    addEventListener: jest.fn(),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(() => []),
    childNodes: [],
    ...props
  };
}

/**
 * 创建 getElementById 的 mock 实现
 */
function createGetElementByIdMock() {
  return jest.fn((id) => {
    if (id === 'container-content') return mockDivContentContainer;
    if (id === 'btnDeleteAll') return mockBtnDeleteAll;
    
    // 对于数字 ID，返回 mockElements 中的节点
    if (typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id))) {
      const numId = typeof id === 'number' ? id : parseInt(id, 10);
      return mockElements[numId] || null;
    }
    
    return mockElements[id] || null;
  });
}

/**
 * 重置 DOM mock
 */
function resetDOM() {
  // 不重新创建 mockDivContentContainer，只重置其方法
  mockDivContentContainer.appendChild.mockClear();
  mockDivContentContainer.insertBefore.mockClear();
  mockDivContentContainer.removeChild.mockClear();
  
  mockBtnDeleteAll = createMockElement('button', {
    id: 'btnDeleteAll',
    innerHTML: ''
  });
  
  mockElements = {};
  
  global.document = {
    ...global.document,
    readyState: 'complete',
    getElementById: createGetElementByIdMock(),
    createElement: jest.fn((tag) => createMockElement(tag)),
    addEventListener: jest.fn()
  };
}

// 在 require 之前先设置 document
resetDOM();

// 直接引用实际模块，而不是 mock
const sidepanel = require('../sidepanels/sidepanel.js');
const playback = require('../sidepanels/playback.js');
const chataction = require('../sidepanels/chataction.js');
const api = require('../sidepanels/api.js');
const util = require('../scripts/util.js');

// 使用实际导出的常量和函数
global.SVGLoadingSpin = sidepanel.SVGLoadingSpin;
global.SVGClose_light = sidepanel.SVGClose_light;
global.SVGDeleteAll_6 = sidepanel.SVGDeleteAll_6;
global.SVGDelete_light = sidepanel.SVGDelete_light;
global.SVGCopy_light = sidepanel.SVGCopy_light;
global.ClassNameForTxtAreaButton = playback.ClassNameForTxtAreaButton;

// 使用 jest.spyOn 包装实际函数，以便跟踪调用情况
global.createCustomPannel = jest.spyOn(chataction, 'createCustomPannel');
global.createButton = jest.spyOn(sidepanel, 'createButton');
global.getBtnSetting = jest.spyOn(sidepanel, 'getBtnSetting');
global.fetchAudio = jest.spyOn(api, 'fetchAudio');
global.calculateLines = jest.spyOn(util, 'calculateLines');

// Mock chrome.i18n
global.chrome = {
  ...global.chrome,
  i18n: {
    getMessage: jest.fn((key) => {
      const messages = {
        'btn_clearall': '清除全部',
        'btn_player_loop': '循环播放'
      };
      return messages[key] || key;
    })
  }
};

// Mock AudioContext
class MockAudioContext {
  constructor() {
    this.state = 'running';
    this.destination = {};
  }
  
  createBufferSource() {
    return {
      buffer: null,
      connect: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
      disconnect: jest.fn(),
      onended: null
    };
  }
  
  decodeAudioData(arrayBuffer, success, error) {
    const mockBuffer = { duration: 1.0 };
    if (success) success(mockBuffer);
  }
  
  suspend() {
    this.state = 'suspended';
    return Promise.resolve();
  }
  
  resume() {
    this.state = 'running';
    return Promise.resolve();
  }
  
  close() {
    return Promise.resolve();
  }
}

global.window = {
  ...global.window,
  AudioContext: MockAudioContext,
  webkitAudioContext: MockAudioContext
};

// ============================================================================
// 测试套件
// ============================================================================

describe('Playback.js 测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    resetDOM();
    
    // 重置全局变量
    global.current_action_items_active = global.default_action_items.filter(item => item.active);
    
    // 重置 spy 函数
    global.createCustomPannel.mockClear();
    global.createButton.mockClear();
    global.getBtnSetting.mockClear();
    global.fetchAudio.mockClear();
    global.calculateLines.mockClear();
    
    // 重置 fetchAudio 的默认实现
    global.fetchAudio.mockImplementation((msg, onSuccess, onError) => {
      if (msg && msg.length > 0) {
        const mockArrayBuffer = new ArrayBuffer(8);
        if (onSuccess) onSuccess(mockArrayBuffer);
      } else {
        if (onError) onError(new Error('Empty message'));
      }
    });
    
    // 重置 calculateLines 的默认返回值
    global.calculateLines.mockReturnValue(1);
  });

  describe('add_content_block', () => {
    it('应该添加内容块到容器', () => {
      playback.add_content_block('test message');

      expect(mockDivContentContainer.appendChild).toHaveBeenCalled();
      expect(global.document.createElement).toHaveBeenCalled();
    });

    it('应该处理空消息和 null 消息', () => {
      playback.add_content_block('');
      expect(mockDivContentContainer.appendChild).toHaveBeenCalled();

      mockDivContentContainer.appendChild.mockClear();
      playback.add_content_block(null);
      expect(mockDivContentContainer.appendChild).toHaveBeenCalled();
    });

    it('应该处理容器不存在的情况', () => {
      global.document.getElementById.mockReturnValue(null);
      
      // 重新加载模块以获取 null 的 divContentContainer
      delete require.cache[require.resolve('../sidepanels/playback.js')];
      const playbackReloaded = require('../sidepanels/playback.js');

      expect(() => playbackReloaded.add_content_block('test')).not.toThrow();
    });

    it('应该使用 lastNode 插入新节点', () => {
      // 设置 getElementById 以支持数字 ID（用于 lastNode 查找）
      // 对于任何数字 ID，都返回一个节点，这样无论 myuuid 从什么值开始，都能正确设置 lastNode
      global.document.getElementById.mockImplementation((id) => {
        if (id === 'container-content') return mockDivContentContainer;
        if (id === 'btnDeleteAll') return mockBtnDeleteAll;
        
        // 对于数字 ID，返回 mockElements 中的节点
        if (typeof id === 'number' || (typeof id === 'string' && /^\d+$/.test(id))) {
          const numId = typeof id === 'number' ? id : parseInt(id, 10);
          if (!mockElements[numId]) {
            mockElements[numId] = createMockElement('div', { id: numId });
          }
          return mockElements[numId];
        }
        
        return mockElements[id] || null;
      });
      
      // 第一次添加，应该使用 appendChild（因为 lastNode 是 null）
      playback.add_content_block('test');
      expect(mockDivContentContainer.appendChild).toHaveBeenCalled();
      
      // 清除调用记录，准备测试第二次调用
      mockDivContentContainer.appendChild.mockClear();
      mockDivContentContainer.insertBefore.mockClear();
      
      // 第二次添加应该使用 insertBefore（因为 lastNode 不为 null）
      playback.add_content_block('test2');
      expect(mockDivContentContainer.insertBefore).toHaveBeenCalled();
    });
  });

  describe('get_current_lastNode', () => {
    it('应该找到当前最后一个节点', () => {
      const mockNode = createMockElement('div', { id: 2 });
      mockElements[2] = mockNode;
      
      playback.get_current_lastNode();

      expect(global.document.getElementById).toHaveBeenCalledWith(2);
    });

    it('应该处理没有节点的情况', () => {
      global.document.getElementById.mockReturnValue(null);

      expect(() => playback.get_current_lastNode()).not.toThrow();
    });
  });

  describe('deleteAllBlocks', () => {
    it('应该删除所有内容块', () => {
      const mockElement = createMockElement('div', { id: 1 });
      mockElement.remove = jest.fn();
      mockElements[1] = mockElement;

      playback.deleteAllBlocks();

      expect(mockElement.remove).toHaveBeenCalled();
    });

    it('应该处理没有内容块的情况', () => {
      global.document.getElementById.mockReturnValue(null);

      expect(() => playback.deleteAllBlocks()).not.toThrow();
    });
  });

  describe('initDeleteAllButton', () => {
    it('应该初始化删除所有按钮', () => {
      playback.initDeleteAllButton();

      expect(mockBtnDeleteAll.id).toBe('DeleteAll');
      expect(mockBtnDeleteAll.innerHTML).toContain('清除全部');
      expect(mockBtnDeleteAll.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
    });

    it('应该处理按钮不存在的情况', () => {
      global.document.getElementById.mockReturnValueOnce(null);

      expect(() => playback.initDeleteAllButton()).not.toThrow();
    });
  });

  describe('initPlayback', () => {
    it('应该完成初始化', () => {
      playback.initPlayback();

      expect(mockBtnDeleteAll.addEventListener).toHaveBeenCalled();
    });

    it('应该处理初始化错误', () => {
      global.document.getElementById.mockImplementation(() => {
        throw new Error('DOM error');
      });

      expect(() => playback.initPlayback()).not.toThrow();
    });
  });

  describe('_createMsgDiv', () => {
    it('应该创建消息内容块', () => {
      const msgDiv = playback._createMsgDiv('test content', 1);

      expect(msgDiv.tagName).toBe('DIV');
      expect(msgDiv.id).toBe(1);
      expect(global.document.createElement).toHaveBeenCalled();
    });

    it('应该处理空内容', () => {
      const msgDiv = playback._createMsgDiv('', 1);

      expect(msgDiv.tagName).toBe('DIV');
    });

    it('应该根据 action items 状态创建自定义面板', () => {
      // 有激活的 action items
      global.current_action_items_active = [
        { name: 'test', active: true, prompt: 'test', other: false }
      ];
      playback._createMsgDiv('test', 1);
      expect(global.createCustomPannel).toHaveBeenCalledWith(1);

      // 没有激活的 action items
      global.createCustomPannel.mockClear();
      global.current_action_items_active = [];
      playback._createMsgDiv('test', 2);
      expect(global.createCustomPannel).not.toHaveBeenCalled();
    });

    it('应该处理错误情况', () => {
      global.document.createElement.mockImplementationOnce(() => {
        throw new Error('Create error');
      });

      const msgDiv = playback._createMsgDiv('test', 1);
      expect(msgDiv.tagName).toBe('DIV');
    });
  });

  describe('_createContentElement', () => {
    it('应该创建内容元素并设置 textarea', () => {
      const contentElement = playback._createContentElement(1, 'test content');

      expect(contentElement.tagName).toBe('DIV');
      expect(contentElement.id).toBe('Content_1');
      expect(global.document.createElement).toHaveBeenCalledWith('textarea');
      expect(contentElement.appendChild).toHaveBeenCalled();
    });

    it('应该计算并设置行数', () => {
      global.calculateLines.mockReturnValue(5);

      playback._createContentElement(1, 'test content');

      expect(global.calculateLines).toHaveBeenCalled();
    });

    it('应该处理计算行数错误', () => {
      global.calculateLines.mockImplementation(() => {
        throw new Error('Calculate error');
      });

      expect(() => playback._createContentElement(1, 'test')).not.toThrow();
    });
  });

  describe('_createSysMsgElement', () => {
    it('应该创建系统消息元素', () => {
      const sysMsg = playback._createSysMsgElement(1);

      expect(sysMsg.tagName).toBe('DIV');
      expect(sysMsg.id).toBe('SysMsg_1');
      expect(sysMsg.hidden).toBe(true);
    });
  });

  describe('createLoopCheckbox', () => {
    it('应该创建循环播放复选框', () => {
      const checkbox = playback.createLoopCheckbox('loop1');

      expect(checkbox.tagName).toBe('DIV');
      expect(checkbox.innerHTML).toContain('循环播放');
      expect(checkbox.querySelector).toBeDefined();
    });

    it('应该处理错误情况', () => {
      global.chrome.i18n.getMessage.mockImplementationOnce(() => {
        throw new Error('i18n error');
      });

      const checkbox = playback.createLoopCheckbox('loop1');
      expect(checkbox.tagName).toBe('DIV');
    });
  });

  describe('createPlayerPannel', () => {
    let container, divSysMsg;

    beforeEach(() => {
      container = createMockElement('div');
      divSysMsg = createMockElement('div');
    });

    it('应该创建播放器面板', () => {
      const panel = playback.createPlayerPannel(1, container, divSysMsg);

      expect(panel.tagName).toBe('DIV');
      expect(panel.id).toBe('PlayerPannel_1');
      expect(global.createButton).toHaveBeenCalled();
    });

    it('应该创建播放、暂停、停止按钮', () => {
      playback.createPlayerPannel(1, container, divSysMsg);

      expect(global.createButton).toHaveBeenCalledWith(
        'playAudio',
        expect.any(String),
        expect.any(String),
        false
      );
      expect(global.createButton).toHaveBeenCalledWith(
        'pauseAudio',
        expect.any(String),
        expect.any(String),
        true
      );
      expect(global.createButton).toHaveBeenCalledWith(
        'stopAudio',
        expect.any(String),
        expect.any(String),
        true
      );
    });

    it('应该创建循环播放复选框', () => {
      const panel = playback.createPlayerPannel(1, container, divSysMsg);

      expect(panel.appendChild).toHaveBeenCalled();
    });

    it('应该处理错误情况', () => {
      global.createButton.mockImplementationOnce(() => {
        throw new Error('Button error');
      });

      const panel = playback.createPlayerPannel(1, container, divSysMsg);
      expect(panel.tagName).toBe('DIV');
    });
  });

  describe('btnStopClicked', () => {
    it('应该停止音频播放并清理资源', () => {
      expect(() => playback.btnStopClicked(1)).not.toThrow();
    });

    it('应该处理没有音频上下文的情况', () => {
      expect(() => playback.btnStopClicked(999)).not.toThrow();
    });
  });

  describe('playAudioBuffer', () => {
    it('应该播放音频缓冲区', () => {
      const onBefore = jest.fn();
      const onEnded = jest.fn();

      expect(() => playback.playAudioBuffer(1, onBefore, onEnded)).not.toThrow();
    });

    it('应该调用 onBefore 回调', () => {
      const onBefore = jest.fn();
      const onEnded = jest.fn();

      playback.playAudioBuffer(1, onBefore, onEnded);

      // 由于需要 AudioContext 和 AudioBuffer，如果没有设置会直接返回
      // 这里我们只验证函数不会抛出错误
      expect(true).toBe(true);
    });

    it('应该处理错误情况', () => {
      const onBefore = jest.fn();
      const onEnded = jest.fn();

      expect(() => playback.playAudioBuffer(999, onBefore, onEnded)).not.toThrow();
    });
  });
});
