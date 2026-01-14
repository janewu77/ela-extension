// ============================================================================
// 工具函数库
// 提供通用的工具函数供扩展使用
// ============================================================================

// ============================================================================
// 字符串处理
// ============================================================================

/**
 * 掩码敏感信息（如 API Key）
 * 显示前5个字符和后2个字符，中间用星号替代
 * @param {string} msg - 需要掩码的字符串
 * @returns {string} 掩码后的字符串
 */
function maskMsg(msg) {
  if (!msg || typeof msg !== 'string') {
    return msg || '';
  }

  // 如果字符串长度小于7，直接返回原字符串
  if (msg.length < 7) {
    return msg;
  }

  // 显示前5个字符和后2个字符，中间用8个星号替代
  return msg.slice(0, 5) + '********' + msg.slice(-2);
}

// ============================================================================
// DOM 操作
// ============================================================================

/**
 * 计算 textarea 的实际行数
 * 通过创建一个隐藏的 div 来模拟 textarea 的样式和内容来计算
 * @param {HTMLTextAreaElement} textarea - 目标 textarea 元素
 * @param {string} className - 用于模拟样式的 CSS 类名
 * @returns {number} 计算出的行数
 */
function calculateLines(textarea, className) {
  if (!textarea || !(textarea instanceof HTMLTextAreaElement)) {
    console.error('[Util] Invalid textarea element provided to calculateLines');
    return 1;
  }

  if (!document || !document.body) {
    console.error('[Util] DOM not available for calculateLines');
    return 1;
  }

  let dummy = null;
  try {
    // 创建一个隐藏的 div 来模拟 textarea
    dummy = document.createElement('div');
    
    // 设置类名（用于应用样式和后续清理）
    dummy.className = className ? `${className} temp-line-calculator` : 'temp-line-calculator';

    // 复制 textarea 的字体样式
    const textareaStyle = window.getComputedStyle(textarea);
    dummy.style.font = textareaStyle.font;
    dummy.style.fontSize = textareaStyle.fontSize;
    dummy.style.fontFamily = textareaStyle.fontFamily;
    dummy.style.fontWeight = textareaStyle.fontWeight;
    dummy.style.lineHeight = textareaStyle.lineHeight;
    dummy.style.padding = textareaStyle.padding;
    dummy.style.boxSizing = textareaStyle.boxSizing;
    dummy.style.width = textarea.offsetWidth + 'px';
    
    // 设置隐藏和文本处理样式
    dummy.style.visibility = 'hidden';
    dummy.style.position = 'absolute';
    dummy.style.top = '-9999px';
    dummy.style.whiteSpace = 'pre-wrap'; // 保持空白符处理方式相同
    dummy.style.wordWrap = 'break-word'; // 允许单词在必要时断行
    dummy.style.overflowWrap = 'break-word'; // 现代浏览器的换行属性

    // 添加到 DOM 中（需要添加到 DOM 才能正确计算样式）
    document.body.appendChild(dummy);

    // 设置文本内容（替换换行符为 <br> 来确保效果）
    dummy.textContent = textarea.value;
    dummy.innerHTML = dummy.innerHTML.replace(/\n/g, '<br>');

    // 计算总高度
    const totalHeight = dummy.clientHeight;

    // 计算单行高度（使用单个字符）
    dummy.textContent = 'A';
    const singleLineHeight = dummy.clientHeight || 1; // 避免除以0

    // 计算行数（向上取整）
    const lineCount = Math.ceil(totalHeight / singleLineHeight);
    const result = Math.max(1, lineCount); // 至少返回1行
    
    // 正常流程中移除元素（finally 块会确保即使这里出错也会清理）
    document.body.removeChild(dummy);
    dummy = null; // 标记为已清理，避免 finally 中重复操作
    
    return result;
  } catch (error) {
    console.error('[Util] Error calculating lines:', error);
    return 1; // 出错时返回默认值
  } finally {
    // 确保临时元素被清理（无论成功还是失败）
    if (dummy && dummy.parentNode) {
      dummy.parentNode.removeChild(dummy);
    }
  }
}

// ============================================================================
// 导出函数（用于测试和模块化）
// ============================================================================

// 导出函数供测试使用（在 Node.js 环境中）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    maskMsg,
    calculateLines
  };
}
