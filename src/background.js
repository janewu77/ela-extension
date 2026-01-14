importScripts('scripts/const.js');
importScripts('scripts/backendapi.js');
importScripts('scripts/storage.js');

// ============================================================================
// 存储管理函数（使用共用模块）
// ============================================================================

// 从 storage.js 导入的函数已经在全局作用域中可用（通过 window.storageUtils）
// 为了保持向后兼容，我们使用这些函数
// 注意：在 Service Worker 环境中，window 可能不可用，所以直接使用全局函数

// ============================================================================
// UI 更新函数
// ============================================================================

/**
 * 更新扩展徽章文本
 * @param {boolean} isOn - 是否开启功能
 */
function updateBadge(isOn) {
  if (debug) console.log(`[UI] Updating badge: ${isOn ? 'ON' : 'OFF'}`);
  
  chrome.action.setBadgeText({ text: isOn ? 'ON' : 'OFF' }).catch((error) => {
    console.error('[UI] Error updating badge:', error);
  });
}

// ============================================================================
// 扩展安装和初始化
// ============================================================================

/**
 * 初始化扩展的默认配置
 */
async function initializeExtension() {
  if (debug) console.log('[Init] Initializing extension...');
  
  try {
    // 初始化所有存储值（使用 storage.js 中的函数）
    const storageUtils = (typeof window !== 'undefined' ? window.storageUtils : null) ||
                        (typeof self !== 'undefined' ? self.storageUtils : null);
    const initStorageValuesFunc = storageUtils ? storageUtils.initStorageValues : initStorageValues;
    
    await initStorageValuesFunc({
      "onoff": defaultOnoff,
      "auth_token": default_auth_token,
      "tts_endpoint": default_tts_endpoint,
      "tts_model": default_tts_model,
      "tts_voice": default_tts_voice,
      "chat_endpoint": default_chat_endpoint,
      "chat_model": default_chat_model,
      "action_items": default_action_items
    });

    // 设置侧边栏行为
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });

    // 初始化徽章
    updateBadge(defaultOnoff);
    
    if (debug) console.log('[Init] Extension initialized successfully');
  } catch (error) {
    console.error('[Init] Error during extension installation:', error);
  }
}

// ============================================================================
// Chrome Extension 事件监听器
// ============================================================================

/**
 * 扩展安装/更新时触发
 */
chrome.runtime.onInstalled.addListener(async () => {
  if (debug) console.log('[Event] Extension installed/updated');
  await initializeExtension();
});

/**
 * 扩展图标点击事件
 */
chrome.action.onClicked.addListener(async (tab) => {
  if (debug) console.log(`[Event] Action clicked on tab: ${tab.id}`);
  // 可以在这里添加点击图标的处理逻辑
});

/**
 * 键盘快捷键命令
 */
chrome.commands.onCommand.addListener((command) => {
  if (debug) console.log(`[Event] Command executed: ${command}`);
  // 可以在这里添加命令处理逻辑
});

/**
 * 存储变化监听（使用 storageUtils.createStorageListener）
 */
(function setupStorageListener() {
  const storageUtils = (typeof window !== 'undefined' ? window.storageUtils : null) ||
                      (typeof self !== 'undefined' ? self.storageUtils : null);
  
  if (storageUtils && storageUtils.createStorageListener) {
    // 使用 createStorageListener 只监听 onoff 变化
    storageUtils.createStorageListener('onoff', (changes) => {
      if (debug) console.log('[Event] Storage changed: onoff');
      
      const onoffChange = changes['onoff'];
      if (onoffChange) {
        updateBadge(onoffChange.newValue);
        
        // 如果需要，可以在这里添加其他逻辑
        // if (onoffChange.newValue) {
        //   getApiVersion();
        // }
      }
    });
  } else {
    // 降级方案：直接使用 Chrome API
    chrome.storage.local.onChanged.addListener((changes) => {
      if (debug) console.log('[Event] Storage changed:', Object.keys(changes));
      
      const onoffChange = changes['onoff'];
      if (onoffChange) {
        updateBadge(onoffChange.newValue);
      }
    });
  }
})();

/**
 * 消息处理
 * 注意：主要消息处理逻辑在 sidepanel.js 中
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (debug) {
    console.log('[Event] Message received:', request.type);
    console.log('[Event] Request:', request);
    console.log('[Event] Sender:', sender);
  }

  // 处理同步消息
  // 如果需要异步处理，应该返回 true 并在异步操作完成后调用 sendResponse
  
  // 示例：处理特定类型的消息
  // if (request.type === 'selectedText') {
  //   if (debug) console.log(`[Message] Selected text: ${request.msg}`);
  //   sendResponse({ data: "processed" });
  //   return true; // 异步响应
  // }
  
  // 默认响应
  sendResponse({ data: "done" });
  
  // 同步响应时不需要返回 true
  // 异步响应时必须返回 true
});

// 导出函数供测试使用（在 Node.js 环境中）
if (typeof module !== 'undefined' && module.exports) {
  // 在测试环境中，从 storage.js 模块导入
  const storageUtils = require('./scripts/storage.js');
  
  module.exports = {
    initStorageValue: storageUtils.initStorageValue,
    initStorageValues: storageUtils.initStorageValues,
    updateBadge,
    initializeExtension
  };
}
