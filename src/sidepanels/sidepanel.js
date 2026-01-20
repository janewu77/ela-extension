// ============================================================================
// Sidepanel - 侧边栏主文件
// 功能：管理侧边栏的 UI 和消息处理
// ============================================================================

if (debug) {
  console.log("[Sidepanel] Sidepanel loaded, debug mode:", debug);
}

// ============================================================================
// 状态管理
// ============================================================================

let currentOnoff = true;

// TTS 配置
let current_tts_endpoint = default_tts_endpoint;
let current_tts_model = default_tts_model;
let current_tts_voice = default_tts_voice;
// eslint-disable-next-line no-unused-vars
let current_auth_token = default_auth_token; // 在 api.js 中使用

// Chat 配置
let current_chat_endpoint = default_chat_endpoint;
let current_chat_model = default_chat_model;
let current_action_items_active = default_action_items.filter((item) => item.active === true);

// ============================================================================
// UI 元素引用
// ============================================================================

let toggleSwitch = null;
let divDebuginfo = null;

// ============================================================================
// 存储监听器设置
// ============================================================================

/**
 * 处理存储变化
 * @param {Object} changes - 存储变化对象
 */
function handleStorageChanges(changes, _allChanges) {
  // createStorageListener 会传递两个参数：
  // - changes: 过滤后的相关变化（第一个参数）
  // - allChanges: 完整的变化对象（第二个参数，可选）
  // 为了兼容，我们使用第一个参数
  if (debug) {
    console.log("[Sidepanel] Storage changed:", Object.keys(changes));
    console.log("[Sidepanel] Changes details:", changes);
  }

  if (changes["onoff"]) {
    currentOnoff = changes["onoff"].newValue;
    _showOnoff(currentOnoff);
  }

  // 使用 ?? 运算符，如果新值为 null 或 undefined，则使用默认值
  if (changes["tts_endpoint"]) {
    current_tts_endpoint = changes["tts_endpoint"].newValue ?? default_tts_endpoint;
  }

  if (changes["tts_model"]) {
    current_tts_model = changes["tts_model"].newValue ?? default_tts_model;
  }

  if (changes["tts_voice"]) {
    current_tts_voice = changes["tts_voice"].newValue ?? default_tts_voice;
  }

  if (changes["auth_token"]) {
    current_auth_token = changes["auth_token"].newValue ?? default_auth_token;
  }

  if (changes["chat_endpoint"]) {
    current_chat_endpoint = changes["chat_endpoint"].newValue ?? default_chat_endpoint;
  }

  if (changes["chat_model"]) {
    current_chat_model = changes["chat_model"].newValue ?? default_chat_model;
  }

  if (changes["action_items"]) {
    const action_items = changes["action_items"].newValue;
    if (action_items && Array.isArray(action_items)) {
      current_action_items_active = action_items.filter((item) => item.active);
    } else {
      current_action_items_active = default_action_items.filter((item) => item.active);
    }
  }

  if (debug) {
    console.log("[Sidepanel] Config updated:", {
      tts_endpoint: current_tts_endpoint,
      tts_model: current_tts_model,
      tts_voice: current_tts_voice,
      chat_endpoint: current_chat_endpoint,
      chat_model: current_chat_model,
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
  if (debug) {
    console.log("[Sidepanel] Setting up storage listeners...");
  }

  try {
    // 如果已经有监听器，先移除旧的
    if (removeStorageListener) {
      removeStorageListener();
      removeStorageListener = null;
    }

    const storageUtils = window.storageUtils;
    const keysToWatch = [
      "onoff",
      "tts_endpoint",
      "tts_model",
      "tts_voice",
      "auth_token",
      "chat_endpoint",
      "chat_model",
      "action_items",
    ];

    // if (storageUtils && storageUtils.createStorageListener) {
    // 使用 storageUtils 创建监听器
    removeStorageListener = storageUtils.createStorageListener(keysToWatch, handleStorageChanges);
    if (debug) {
      console.log(
        "[Sidepanel] Storage listeners set up using createStorageListener for keys:",
        keysToWatch
      );
    }
    // } else {
    //   // 降级方案：直接使用 Chrome API
    //   chrome.storage.local.onChanged.addListener(handleStorageChanges);
    //   if (debug) {
    //     console.log('[Sidepanel] Storage listeners set up using Chrome API directly');
    //   }
    // }

    if (debug) {
      console.log("[Sidepanel] Storage listeners set up successfully");
    }
  } catch (error) {
    console.error("[Sidepanel] Error setting up storage listeners:", error);
  }
}

// ============================================================================
// 初始化函数
// ============================================================================

/**
 * 初始化侧边栏
 */
async function init() {
  if (debug) {
    console.log("[Sidepanel] Initializing...");
  }

  try {
    // 获取 DOM 元素引用
    toggleSwitch = document.getElementById("toggleSwitch");
    divDebuginfo = debug ? document.getElementById("debuginfo") : null;

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

    if (debug) {
      console.log("[Sidepanel] Initialized successfully");
    }
  } catch (error) {
    console.error("[Sidepanel] Error during initialization:", error);
  }
}

/**
 * 初始化 onoff 状态
 */
async function initOnoffState() {
  try {
    if (!toggleSwitch) {
      console.warn("[Sidepanel] toggleSwitch element not found");
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
    toggleSwitch.addEventListener("change", async function () {
      const newValue = this.checked;
      // if (storageUtils && storageUtils.setStorageValue) {
      await storageUtils.setStorageValue("onoff", newValue);
      // } else {
      //   await chrome.storage.local.set({ "onoff": newValue });
      // }
    });
  } catch (error) {
    console.error("[Sidepanel] Error initializing onoff state:", error);
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
    current_action_items_active = data.action_items.filter((item) => item.active);
  } else {
    // 如果没有 action_items 或不是数组，使用默认值
    current_action_items_active = default_action_items.filter((item) => item.active);
  }

  if (debug) {
    console.log("[Sidepanel] Config applied:", {
      tts_endpoint: current_tts_endpoint,
      tts_model: current_tts_model,
      tts_voice: current_tts_voice,
      chat_endpoint: current_chat_endpoint,
      chat_model: current_chat_model,
      action_items_count: current_action_items_active.length,
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
      "action_items",
    ];

    // if (storageUtils && storageUtils.getStorageValues) {
    const data = await storageUtils.getStorageValues(keys);
    // } else {
    //   // 降级方案：直接使用 Chrome API
    //   data = await chrome.storage.local.get(keys);
    // }

    // 应用配置数据
    applyConfigData(data);
  } catch (error) {
    console.error("[Sidepanel] Error initializing config:", error);
  }
}

/**
 * 初始化 UI 按钮
 */
function initButtons() {
  try {
    // "设置"按钮（左上角的设置按钮） -- 点击后打开option页面
    const btnSetting = document.getElementById("btnSetting");
    if (btnSetting) {
      btnSetting.id = "SettingButton";
      const btnName = chrome.i18n.getMessage("btn_name_setting");
      // 安全地设置按钮内容：SVG（来自常量）+ 文本（来自 i18n，安全）
      btnSetting.textContent = ""; // 清空内容
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = SVGSetting_6; // SVG 来自常量，安全
      const svgElement = tempDiv.firstElementChild;
      if (svgElement) {
        btnSetting.appendChild(svgElement);
      }
      // 使用 textContent 安全地添加文本（即使来自 i18n 也转义）
      if (btnName) {
        btnSetting.appendChild(document.createTextNode(" " + btnName));
      }
      btnSetting.addEventListener("click", function () {
        if (chrome.runtime.openOptionsPage) {
          chrome.runtime.openOptionsPage();
        }
      });
    }

    // “添加内容块”按钮（右下角的加号） -- 点击后增加一块空白块，可输入任何内容
    const btnAddOne = document.getElementById("btnAddOne");
    if (btnAddOne) {
      btnAddOne.addEventListener("click", function () {
        add_content_block("");
      });
    }
  } catch (error) {
    console.error("[Sidepanel] Error initializing buttons:", error);
  }
}

// ============================================================================
// UI 辅助函数
// ============================================================================

/**
 * 显示 onoff 状态(仅在当前页面上显示)
 * @param {boolean} bOnoff - onoff 状态
 */
function _showOnoff(bOnoff) {
  try {
    if (toggleSwitch) {
      toggleSwitch.checked = bOnoff;
    }

    const onoffElement = document.body.querySelector("#definition-onoff");
    if (onoffElement) {
      onoffElement.innerText = bOnoff
        ? chrome.i18n.getMessage("onoff_on")
        : chrome.i18n.getMessage("onoff_off");
    }
  } catch (error) {
    console.error("[Sidepanel] Error showing onoff:", error);
  }
}

/**
 * 创建设置按钮（仅用于错误消息时，提示打开设置页）
 * @returns {HTMLElement} 设置按钮元素
 */
function getBtnSetting() {
  try {
    const btnName = chrome.i18n.getMessage("btn_name_setting");
    const btnSetting = document.createElement("a");
    btnSetting.className =
      "flex items-center justify-center gap-x-1.5 p-1 font-semibold text-red-600 hover:bg-blue-100 hover:underline";
    // 安全地设置按钮内容
    const arrowSpan = document.createElement("span");
    arrowSpan.setAttribute("aria-hidden", "true");
    arrowSpan.textContent = "→";
    btnSetting.appendChild(arrowSpan);
    // 添加 SVG
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = SVGSetting; // SVG 来自常量，安全
    const svgElement = tempDiv.firstElementChild;
    if (svgElement) {
      btnSetting.appendChild(svgElement);
    }
    // 使用 textContent 安全地添加文本
    if (btnName) {
      btnSetting.appendChild(document.createTextNode(" " + btnName));
    }
    btnSetting.addEventListener("click", function () {
      if (chrome.runtime.openOptionsPage) {
        chrome.runtime.openOptionsPage();
      }
    });
    return btnSetting;
  } catch (error) {
    console.error("[Sidepanel] Error creating setting button:", error);
    return document.createElement("div"); // 返回空元素作为降级
  }
}

/**
 * 创建按钮元素
 * @param {string} btnId - 按钮 ID
 * @param {string} btnClassName - 按钮类名
 * @param {string} btnHtml - 按钮 HTML 内容（仅用于安全的 SVG 等，文本应使用 textContent）
 * @param {boolean} disabled - 是否禁用，默认 false
 * @returns {HTMLElement} 按钮元素
 */
function createButton(btnId, btnClassName, btnHtml, disabled = false) {
  try {
    const btnButton = document.createElement("button");
    btnButton.id = btnId;
    btnButton.className = btnClassName;
    // 注意：这里使用 innerHTML 是为了支持 SVG 图标
    // 调用者应确保 btnHtml 来自安全的常量（如 SVG 图标），而不是用户输入
    // 对于用户输入的内容，应该使用 textContent 或 setButtonContent 函数
    btnButton.innerHTML = btnHtml || "";
    btnButton.disabled = disabled;
    return btnButton;
  } catch (error) {
    console.error("[Sidepanel] Error creating button:", error);
    return document.createElement("div"); // 返回空元素作为降级
  }
}

// ============================================================================
// 消息处理
// ============================================================================

/**
 * 处理来自 content script 的消息
 */
function setupMessageListeners() {
  chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (debug) {
      console.log("[Sidepanel] Message received:", request.type);
      console.log("[Sidepanel] Sender:", sender);
    }

    try {
      if (request.type === "selectedText") {
        if (debug) {
          console.log("[Sidepanel] Selected text:", request.msg);
        }

        add_content_block(request.msg);
        sendResponse({ data: "success" });
        return true; // 异步响应
      }

      sendResponse({ data: "done" });
    } catch (error) {
      console.error("[Sidepanel] Error handling message:", error);
      sendResponse({ data: "error", error: error.message });
    }
  });
}

// ============================================================================
// 启动初始化
// ============================================================================

// 等待 DOM 加载完成后再初始化
if (typeof window !== "undefined" && typeof module === "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    // DOM 已经加载完成
    init();
  }
}

// 导出函数供测试使用（在 Node.js 环境中）
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    init,
    initOnoffState,
    initConfig,
    initButtons,
    setupStorageListeners,
    handleStorageChanges,
    applyConfigData,
    _showOnoff,
    getBtnSetting,
    createButton,
    setupMessageListeners,
    // 导出 SVG 常量供其他模块使用
    SVGLoadingSpin,
    SVGDelete_light,
    SVGCopy_light,
    SVGClose_light,
    SVGDeleteAll_6,
  };
}
