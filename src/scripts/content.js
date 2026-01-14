// ============================================================================
// Content Script - 页面内容脚本
// 功能：监听页面文本选择，并将选中的文本发送给扩展
// ============================================================================

if (debug) console.log('[Content] Content script loaded, debug mode:', debug);

// ============================================================================
// 状态管理
// ============================================================================

let currentOnoff = false;

/**
 * 初始化扩展状态
 */
async function initializeState() {
  try {
    const data = await chrome.storage.local.get('onoff');
    currentOnoff = data.onoff ?? false;
    if (debug) console.log('[Content] Initial state loaded:', currentOnoff);
  } catch (error) {
    console.error('[Content] Error loading initial state:', error);
    currentOnoff = false;
  }
}

/**
 * 更新扩展状态
 * @param {boolean} newValue - 新的开关状态
 */
function updateState(newValue) {
  currentOnoff = newValue;
  if (debug) console.log('[Content] State updated:', currentOnoff);
}

// ============================================================================
// 文本选择处理
// ============================================================================

/**
 * 获取当前选中的文本
 * @returns {string} 选中的文本（已修剪）
 */
function getSelectedText() {
  try {
    const selection = window.getSelection();
    if (!selection) return '';
    
    const text = selection.toString().trim();
    return text;
  } catch (error) {
    console.error('[Content] Error getting selected text:', error);
    return '';
  }
}

/**
 * 发送选中的文本到扩展
 * @param {string} selectedText - 选中的文本
 */
async function sendSelectedText(selectedText) {
  if (!selectedText || selectedText.length === 0) {
    return;
  }

  try {
    const message = {
      type: 'selectedText',
      msg: selectedText,
      isTopFrame: window.self === window.top
    };

    if (debug) console.log('[Content] Sending selected text:', selectedText);
    
    await chrome.runtime.sendMessage(message);
  } catch (error) {
    console.error('[Content] Error sending message:', error);
  }
}

/**
 * 处理文本选择事件
 */
function handleTextSelection() {
  if (!currentOnoff) {
    if (debug) console.log('[Content] Extension is disabled, ignoring selection');
    return;
  }

  const selectedText = getSelectedText();
  if (selectedText.length > 0) {
    sendSelectedText(selectedText);
  }
}

// ============================================================================
// 事件监听器
// ============================================================================

/**
 * 处理鼠标释放事件
 * @param {MouseEvent} event - 鼠标事件对象
 */
function handleMouseUp(event) {
  if (debug) {
    console.log('[Content] Mouse up event, onoff:', currentOnoff);
    console.log('[Content] Event details:', {
      target: event.target,
      timestamp: event.timeStamp
    });
  }

  // TODO: 检查 event.origin 以增加安全性
  handleTextSelection();
}

// ============================================================================
// 初始化
// ============================================================================

/**
 * 初始化内容脚本
 */
async function initialize() {
  // 初始化状态
  await initializeState();

  // 监听存储变化（使用 storageUtils.createStorageListener）
  if (typeof window !== 'undefined' && window.storageUtils) {
    const removeListener = window.storageUtils.createStorageListener('onoff', (changes) => {
      if (debug) console.log('[Content] Storage changed: onoff');
      
      const onoffChange = changes['onoff'];
      if (onoffChange) {
        updateState(onoffChange.newValue);
      }
    });
    
    // 保存移除函数以便后续清理（如果需要）
    if (typeof window !== 'undefined') {
      window._contentStorageListenerCleanup = removeListener;
    }
  } else {
    // 降级方案：直接使用 Chrome API
    chrome.storage.local.onChanged.addListener((changes) => {
      if (debug) console.log('[Content] Storage changed:', Object.keys(changes));
      
      const onoffChange = changes['onoff'];
      if (onoffChange) {
        updateState(onoffChange.newValue);
      }
    });
  }

  // 监听鼠标释放事件（文本选择）
  document.addEventListener('mouseup', handleMouseUp);

  if (debug) console.log('[Content] Content script initialized');
}

// 启动初始化（仅在浏览器环境中自动执行，不在 Node.js 测试环境中执行）
if (typeof window !== 'undefined' && typeof module === 'undefined') {
  initialize().catch((error) => {
    console.error('[Content] Error during initialization:', error);
  });
}

// 导出函数供测试使用（在 Node.js 环境中）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeState,
    updateState,
    getSelectedText,
    sendSelectedText,
    handleTextSelection,
    handleMouseUp,
    initialize,
    getCurrentOnoff: () => currentOnoff,
    setCurrentOnoff: (value) => { currentOnoff = value; }
  };
}
