// ============================================================================
// Sidepanel - 侧边栏主文件
// 功能：管理侧边栏的 UI 和消息处理
// ============================================================================

if (debug) console.log('[Sidepanel] Sidepanel loaded, debug mode:', debug);

// ============================================================================
// 状态管理
// ============================================================================

let currentOnoff = true;

// TTS 配置
let current_tts_endpoint = default_tts_endpoint;
let current_tts_model = default_tts_model;
let current_tts_voice = default_tts_voice;
let current_auth_token = default_auth_token;

// Chat 配置
let current_chat_endpoint = default_chat_endpoint;
let current_chat_model = default_chat_model;
let current_action_items_active = default_action_items.filter(item => item.active === true);

// ============================================================================
// UI 元素引用
// ============================================================================

let toggleSwitch = null;
let divDebuginfo = null;

// ============================================================================
// SVG 图标常量
// ============================================================================

const SVGSetting_6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 fill-gray-600"><path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" /></svg>`;
const SVGDeleteAll_6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 fill-gray-600"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" /></svg>`;
const SVGLoadingSpin = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class=" animate-spin w-4 h-4 "><path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clip-rule="evenodd" /></svg>`;
const SVGSetting = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-red-600"><path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" /></svg>`;
const SVGDelete_light = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-gray-400"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" /></svg>`;
const SVGCopy_light = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-gray-400 "><path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z" clip-rule="evenodd" /></svg>`;
const SVGClose_light = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-gray-400 "><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd" /></svg>`;

// ============================================================================
// 存储监听器设置
// ============================================================================

/**
 * 处理存储变化
 * @param {Object} changes - 存储变化对象
 */
function handleStorageChanges(changes, allChanges) {
  // createStorageListener 会传递两个参数：
  // - changes: 过滤后的相关变化（第一个参数）
  // - allChanges: 完整的变化对象（第二个参数，可选）
  // 为了兼容，我们使用第一个参数
  if (debug) {
    console.log('[Sidepanel] Storage changed:', Object.keys(changes));
    console.log('[Sidepanel] Changes details:', changes);
  }

  if (changes['onoff']) {
    currentOnoff = changes['onoff'].newValue;
    _showOnoff(currentOnoff);
  }

  // 使用 ?? 运算符，如果新值为 null 或 undefined，则使用默认值
  if (changes['tts_endpoint']) {
    current_tts_endpoint = changes['tts_endpoint'].newValue ?? default_tts_endpoint;
  }

  if (changes['tts_model']) {
    current_tts_model = changes['tts_model'].newValue ?? default_tts_model;
  }

  if (changes['tts_voice']) {
    current_tts_voice = changes['tts_voice'].newValue ?? default_tts_voice;
  }

  if (changes['auth_token']) {
    current_auth_token = changes['auth_token'].newValue ?? default_auth_token;
  }

  if (changes['chat_endpoint']) {
    current_chat_endpoint = changes['chat_endpoint'].newValue ?? default_chat_endpoint;
  }

  if (changes['chat_model']) {
    current_chat_model = changes['chat_model'].newValue ?? default_chat_model;
  }

  if (changes['action_items']) {
    const action_items = changes['action_items'].newValue;
    if (action_items && Array.isArray(action_items)) {
      current_action_items_active = action_items.filter(item => item.active);
    } else {
      current_action_items_active = default_action_items.filter(item => item.active);
    }
  }
  
  if (debug) {
    console.log('[Sidepanel] Config updated:', {
      tts_endpoint: current_tts_endpoint,
      tts_model: current_tts_model,
      tts_voice: current_tts_voice,
      chat_endpoint: current_chat_endpoint,
      chat_model: current_chat_model
    });
  }
}

/**
 * 存储监听器移除函数（用于清理）
 */
let removeStorageListener = null;

/**
 * 设置存储变化监听器
 */
function setupStorageListeners() {
  if (debug) console.log('[Sidepanel] Setting up storage listeners...');

  try {
    // 如果已经有监听器，先移除旧的
    if (removeStorageListener) {
      removeStorageListener();
      removeStorageListener = null;
    }

    const storageUtils = window.storageUtils;
    const keysToWatch = [
      'onoff',
      'tts_endpoint',
      'tts_model',
      'tts_voice',
      'auth_token',
      'chat_endpoint',
      'chat_model',
      'action_items'
    ];

    // if (storageUtils && storageUtils.createStorageListener) {
      // 使用 storageUtils 创建监听器
      removeStorageListener = storageUtils.createStorageListener(keysToWatch, handleStorageChanges);
      if (debug) {
        console.log('[Sidepanel] Storage listeners set up using createStorageListener for keys:', keysToWatch);
      }
    // } else {
    //   // 降级方案：直接使用 Chrome API
    //   chrome.storage.local.onChanged.addListener(handleStorageChanges);
    //   if (debug) {
    //     console.log('[Sidepanel] Storage listeners set up using Chrome API directly');
    //   }
    // }

    if (debug) console.log('[Sidepanel] Storage listeners set up successfully');
  } catch (error) {
    console.error('[Sidepanel] Error setting up storage listeners:', error);
  }
}

// ============================================================================
// 初始化函数
// ============================================================================

/**
 * 初始化侧边栏
 */
async function init() {
  if (debug) console.log('[Sidepanel] Initializing...');

  try {
    // 获取 DOM 元素引用
    toggleSwitch = document.getElementById('toggleSwitch');
    divDebuginfo = debug ? document.getElementById('debuginfo') : null;

    // 显示调试信息
    if (debug && divDebuginfo) {
      divDebuginfo.innerHTML = "debug";
    }

    // 初始化 onoff 状态
    await initOnoffState();

    // 初始化配置：取得配置参数
    await initConfig();

    // 设置存储监听器（在获取配置之后，确保能响应后续的变化）
    setupStorageListeners();

    // 初始化 UI 按钮
    initButtons();

    // 设置消息监听器(接收网页上选中的内容)
    setupMessageListeners();

    if (debug) console.log('[Sidepanel] Initialized successfully');
  } catch (error) {
    console.error('[Sidepanel] Error during initialization:', error);
  }
}

/**
 * 初始化 onoff 状态
 */
async function initOnoffState() {
  try {
    if (!toggleSwitch) {
      console.warn('[Sidepanel] toggleSwitch element not found');
      return;
    }

    const storageUtils = window.storageUtils;
    
    // 打开sidepanel时，即将Onoff开关设为true。 并更新缓存内的参数
    // if (storageUtils && storageUtils.setStorageValue) {
      await storageUtils.setStorageValue("onoff", currentOnoff);
    // } else {
    //   await chrome.storage.local.set({ "onoff": currentOnoff });
    // }

    // 显示开关状态
    _showOnoff(currentOnoff);

    // 对开关加事件监听，当开关状态改变时，更新缓存内的参数
    toggleSwitch.addEventListener('change', async function() {
      const newValue = this.checked;
      // if (storageUtils && storageUtils.setStorageValue) {
        await storageUtils.setStorageValue("onoff", newValue);
      // } else {
      //   await chrome.storage.local.set({ "onoff": newValue });
      // }
    });
  } catch (error) {
    console.error('[Sidepanel] Error initializing onoff state:', error);
  }
}

/**
 * 应用配置数据到状态变量
 * @param {Object} data - 配置数据对象
 */
function applyConfigData(data) {
  // 使用 ?? 运算符，如果值为 null 或 undefined，则使用默认值
  // 但要注意，如果存储中明确设置了空字符串，也应该使用空字符串
  current_tts_endpoint = data.tts_endpoint ?? default_tts_endpoint;
  current_tts_model = data.tts_model ?? default_tts_model;
  current_tts_voice = data.tts_voice ?? default_tts_voice;
  current_auth_token = data.auth_token ?? default_auth_token;
  current_chat_endpoint = data.chat_endpoint ?? default_chat_endpoint;
  current_chat_model = data.chat_model ?? default_chat_model;
  
  if (data.action_items && Array.isArray(data.action_items)) {
    current_action_items_active = data.action_items.filter(item => item.active);
  } else {
    // 如果没有 action_items 或不是数组，使用默认值
    current_action_items_active = default_action_items.filter(item => item.active);
  }
  
  if (debug) {
    console.log('[Sidepanel] Config applied:', {
      tts_endpoint: current_tts_endpoint,
      tts_model: current_tts_model,
      tts_voice: current_tts_voice,
      chat_endpoint: current_chat_endpoint,
      chat_model: current_chat_model,
      action_items_count: current_action_items_active.length
    });
  }
}

/**
 * 初始化配置：取得配置参数
 */
async function initConfig() {
  try {
    const storageUtils = window.storageUtils;
    const keys = [
      "tts_endpoint",
      "tts_model",
      "tts_voice",
      "auth_token",
      "chat_endpoint",
      "chat_model",
      "action_items"
    ];

    let data;
    // if (storageUtils && storageUtils.getStorageValues) {
      data = await storageUtils.getStorageValues(keys);
    // } else {
    //   // 降级方案：直接使用 Chrome API
    //   data = await chrome.storage.local.get(keys);
    // }

    // 应用配置数据
    applyConfigData(data);
  } catch (error) {
    console.error('[Sidepanel] Error initializing config:', error);
  }
}

/**
 * 初始化 UI 按钮
 */
function initButtons() {
  try {
    // “设置”按钮（左上角的设置按钮）
    const btnSetting = document.getElementById('btnSetting');
    if (btnSetting) {
      btnSetting.id = "SettingButton";
      const btnName = chrome.i18n.getMessage("btn_name_setting");
      btnSetting.innerHTML = `${SVGSetting_6} ${btnName}`;
      btnSetting.addEventListener('click', function() {
        if (chrome.runtime.openOptionsPage) {
          chrome.runtime.openOptionsPage();
        }
      });
    }

    // “添加内容块”按钮（右下角的加号）
    const btnAddOne = document.getElementById('btnAddOne');
    if (btnAddOne) {
      btnAddOne.addEventListener('click', function() {
        add_content_block("");
      });
    }
  } catch (error) {
    console.error('[Sidepanel] Error initializing buttons:', error);
  }
}

// ============================================================================
// UI 辅助函数
// ============================================================================

/**
 * 显示 onoff 状态
 * @param {boolean} bOnoff - onoff 状态
 */
function _showOnoff(bOnoff) {
  try {
    if (toggleSwitch) {
      toggleSwitch.checked = bOnoff;
    }

    const onoffElement = document.body.querySelector('#definition-onoff');
    if (onoffElement) {
      onoffElement.innerText = bOnoff 
        ? chrome.i18n.getMessage("onoff_on") 
        : chrome.i18n.getMessage("onoff_off");
    }
  } catch (error) {
    console.error('[Sidepanel] Error showing onoff:', error);
  }
}

/**
 * 创建设置按钮（仅用于错误消息时，提示打开设置页）
 * @returns {HTMLElement} 设置按钮元素
 */
function getBtnSetting() {
  try {
    const btnName = chrome.i18n.getMessage("btn_name_setting");
    const btnSetting = document.createElement('a');
    btnSetting.className = "flex items-center justify-center gap-x-1.5 p-1 font-semibold text-red-600 hover:bg-blue-100 hover:underline";
    btnSetting.innerHTML = `<span aria-hidden="true">→</span>${SVGSetting} ${btnName}`;
    btnSetting.addEventListener('click', function() {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      }
    });
    return btnSetting;
  } catch (error) {
    console.error('[Sidepanel] Error creating setting button:', error);
    return document.createElement('div'); // 返回空元素作为降级
  }
}

/**
 * 创建按钮元素
 * @param {string} btnId - 按钮 ID
 * @param {string} btnClassName - 按钮类名
 * @param {string} btnHtml - 按钮 HTML 内容
 * @param {boolean} disabled - 是否禁用，默认 false
 * @returns {HTMLElement} 按钮元素
 */
function createButton(btnId, btnClassName, btnHtml, disabled = false) {
  try {
    const btnButton = document.createElement('button');
    btnButton.id = btnId;
    btnButton.className = btnClassName;
    btnButton.innerHTML = btnHtml;
    btnButton.disabled = disabled;
    return btnButton;
  } catch (error) {
    console.error('[Sidepanel] Error creating button:', error);
    return document.createElement('div'); // 返回空元素作为降级
  }
}

// ============================================================================
// 消息处理
// ============================================================================

/**
 * 处理来自 content script 的消息
 */
function setupMessageListeners(){
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (debug) {
      console.log('[Sidepanel] Message received:', request.type);
      console.log('[Sidepanel] Sender:', sender);
    }

    try {
      if (request.type === 'selectedText') {
        if (debug) console.log('[Sidepanel] Selected text:', request.msg);
        
        add_content_block(request.msg);
        sendResponse({ data: "success" });
        return true; // 异步响应
      }

      sendResponse({ data: "done" });
    } catch (error) {
      console.error('[Sidepanel] Error handling message:', error);
      sendResponse({ data: "error", error: error.message });
    }
  });
}

// ============================================================================
// 启动初始化
// ============================================================================

// 等待 DOM 加载完成后再初始化
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOM 已经加载完成
  init();
}
