// Mock Chrome Extension APIs
// 创建自定义的 Chrome API mock，避免依赖外部包
global.chrome = {
  storage: {
    local: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn(),
      onChanged: {
        addListener: jest.fn(),
        removeListener: jest.fn(),
        hasListener: jest.fn()
      }
    },
    session: {
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
      clear: jest.fn()
    }
  },
  runtime: {
    onInstalled: {
      addListener: jest.fn()
    },
    onMessage: {
      addListener: jest.fn()
    },
    sendMessage: jest.fn()
  },
  action: {
    setBadgeText: jest.fn(),
    setBadgeBackgroundColor: jest.fn(),
    onClicked: {
      addListener: jest.fn()
    }
  },
  sidePanel: {
    setPanelBehavior: jest.fn(),
    open: jest.fn()
  },
  commands: {
    onCommand: {
      addListener: jest.fn()
    }
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn()
  }
};

// Mock importScripts
global.importScripts = jest.fn((...scripts) => {
  // 在测试环境中，模拟导入脚本的行为
  // 如果需要，可以在这里加载实际的脚本文件
  scripts.forEach(script => {
    // 模拟导入行为
  });
});

// Mock DOM APIs for content script testing
global.window = {
  getSelection: jest.fn(),
  self: {},
  top: {},
  getComputedStyle: jest.fn()
};

global.document = {
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  createElement: jest.fn(),
  createTextNode: jest.fn((text) => {
    // 创建文本节点的 mock
    const textNode = {
      nodeType: 3, // TEXT_NODE
      nodeValue: text,
      textContent: text,
      data: text,
    };
    return textNode;
  }),
  body: {
    appendChild: jest.fn(),
    removeChild: jest.fn()
  },
  querySelector: jest.fn()
};

// Mock HTMLTextAreaElement for util.js testing
global.HTMLTextAreaElement = class HTMLTextAreaElement {
  constructor() {
    this.value = '';
    this.offsetWidth = 0;
    this.clientHeight = 0;
  }
};

// 设置测试环境的 debug 变量
// 在测试环境中，debug 始终为 true
global.debug = true;

// ============================================================================
// SVG 图标常量（从 icons.js 导入，模拟浏览器环境）
// ============================================================================
// 在浏览器环境中，icons.js 通过 script 标签加载，SVG 常量作为全局变量可用
// 在测试环境中，我们从 icons.js 导入并设置为全局变量
const icons = require('./src/scripts/icons.js');
global.SVGSetting_6 = icons.SVGSetting_6;
global.SVGSetting = icons.SVGSetting;
global.SVGDeleteAll_6 = icons.SVGDeleteAll_6;
global.SVGDelete_light = icons.SVGDelete_light;
global.SVGCopy_light = icons.SVGCopy_light;
global.SVGClose_light = icons.SVGClose_light;
global.SVGLoadingSpin = icons.SVGLoadingSpin;
global.SVGPlay = icons.SVGPlay;
global.SVGPause = icons.SVGPause;
global.SVGStop = icons.SVGStop;
global.SVGEdit = icons.SVGEdit;
global.SVGCheck = icons.SVGCheck;
global.SVGCheckDisabled = icons.SVGCheckDisabled;

// 保留原始 console 方法，但允许在测试中 mock
// 这样测试可以选择性地 mock console 方法
if (!global.console._original) {
  global.console._original = {
    log: console.log,
    error: console.error,
    warn: console.warn,
    info: console.info,
    debug: console.debug
  };
}
