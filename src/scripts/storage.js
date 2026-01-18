// ============================================================================
// 存储工具模块
// 提供统一的 Chrome Storage API 封装，供多个文件共用
// ============================================================================

// ============================================================================
// 辅助函数
// ============================================================================

/**
 * 验证键名是否有效
 * @param {any} key - 要验证的键名
 * @returns {boolean} 是否为有效键名
 */
function isValidKey(key) {
  return typeof key === 'string' && key.length > 0;
}

/**
 * 安全地记录日志（避免记录敏感信息）
 * @param {string} message - 日志消息
 * @param {any} value - 要记录的值（可选）
 */
function logStorage(message, value) {
  if (debug) {
    // 对于敏感键（如 auth_token），不记录实际值
    const sensitiveKeys = ['auth_token', 'api_key', 'password', 'token'];
    const isSensitive = sensitiveKeys.some(sk => message.toLowerCase().includes(sk));
    
    if (isSensitive && value) {
      console.log(`[Storage] ${message}: [REDACTED]`);
    } else {
      console.log(`[Storage] ${message}`, value !== undefined ? `: ${value}` : '');
    }
  }
}

// ============================================================================
// 基础存储操作
// ============================================================================

/**
 * 从存储中获取值
 * @param {string} key - 存储键名
 * @returns {Promise<any>} 存储的值，如果不存在或出错则返回 null
 */
async function getStorageValue(key) {
  if (!isValidKey(key)) {
    console.error('[Storage] Invalid key provided to getStorageValue:', key);
    return null;
  }

  try {
    const data = await chrome.storage.local.get(key);
    const value = data[key] ?? null;
    if (debug) {
      logStorage(`Get ${key}`, value !== null ? 'success' : 'not found');
    }
    return value;
  } catch (error) {
    console.error(`[Storage] Error getting ${key}:`, error);
    return null;
  }
}

/**
 * 设置存储值
 * @param {string} key - 存储键名
 * @param {any} value - 要设置的值
 * @returns {Promise<boolean>} 是否设置成功
 */
async function setStorageValue(key, value) {
  if (!isValidKey(key)) {
    console.error('[Storage] Invalid key provided to setStorageValue:', key);
    return false;
  }

  try {
    await chrome.storage.local.set({ [key]: value });
    logStorage(`Set ${key}`, 'success');
    return true;
  } catch (error) {
    console.error(`[Storage] Error setting ${key}:`, error);
    return false;
  }
}

/**
 * 批量获取存储值
 * @param {string[]} keys - 存储键名数组
 * @returns {Promise<Object>} 包含所有键值对的对象
 */
async function getStorageValues(keys) {
  if (!Array.isArray(keys) || keys.length === 0) {
    console.error('[Storage] Invalid keys array provided to getStorageValues');
    return {};
  }

  // 验证所有键名
  const validKeys = keys.filter(key => {
    if (!isValidKey(key)) {
      console.warn(`[Storage] Invalid key in array: ${key}`);
      return false;
    }
    return true;
  });

  if (validKeys.length === 0) {
    console.error('[Storage] No valid keys provided');
    return {};
  }

  try {
    const data = await chrome.storage.local.get(validKeys);
    logStorage(`Get ${validKeys.length} values`, 'success');
    return data;
  } catch (error) {
    console.error(`[Storage] Error getting values for keys:`, error);
    return {};
  }
}

/**
 * 批量设置存储值
 * @param {Object} values - 键值对对象 {key: value}
 * @returns {Promise<boolean>} 是否设置成功
 */
async function setStorageValues(values) {
  if (!values || typeof values !== 'object' || Array.isArray(values)) {
    console.error('[Storage] Invalid values object provided to setStorageValues');
    return false;
  }

  // 验证所有键名
  const entries = Object.entries(values);
  const validEntries = entries.filter(([key]) => {
    if (!isValidKey(key)) {
      console.warn(`[Storage] Invalid key in values object: ${key}`);
      return false;
    }
    return true;
  });

  if (validEntries.length === 0) {
    console.error('[Storage] No valid key-value pairs provided');
    return false;
  }

  try {
    const validValues = Object.fromEntries(validEntries);
    await chrome.storage.local.set(validValues);
    logStorage(`Set ${validEntries.length} values`, 'success');
    return true;
  } catch (error) {
    console.error(`[Storage] Error setting multiple values:`, error);
    return false;
  }
}

/**
 * 删除存储值
 * @param {string} key - 要删除的键名
 * @returns {Promise<boolean>} 是否删除成功
 */
async function removeStorageValue(key) {
  if (!isValidKey(key)) {
    console.error('[Storage] Invalid key provided to removeStorageValue:', key);
    return false;
  }

  try {
    await chrome.storage.local.remove(key);
    logStorage(`Remove ${key}`, 'success');
    return true;
  } catch (error) {
    console.error(`[Storage] Error removing ${key}:`, error);
    return false;
  }
}

/**
 * 批量删除存储值
 * @param {string[]} keys - 要删除的键名数组
 * @returns {Promise<boolean>} 是否删除成功
 */
async function removeStorageValues(keys) {
  if (!Array.isArray(keys) || keys.length === 0) {
    console.error('[Storage] Invalid keys array provided to removeStorageValues');
    return false;
  }

  // 验证所有键名
  const validKeys = keys.filter(key => {
    if (!isValidKey(key)) {
      console.warn(`[Storage] Invalid key in array: ${key}`);
      return false;
    }
    return true;
  });

  if (validKeys.length === 0) {
    console.error('[Storage] No valid keys provided');
    return false;
  }

  try {
    await chrome.storage.local.remove(validKeys);
    logStorage(`Remove ${validKeys.length} values`, 'success');
    return true;
  } catch (error) {
    console.error(`[Storage] Error removing values:`, error);
    return false;
  }
}

/**
 * 清空所有存储
 * @returns {Promise<boolean>} 是否清空成功
 */
async function clearStorage() {
  try {
    await chrome.storage.local.clear();
    logStorage('Clear all storage', 'success');
    return true;
  } catch (error) {
    console.error('[Storage] Error clearing storage:', error);
    return false;
  }
}

// ============================================================================
// 存储初始化操作
// ============================================================================

/**
 * 初始化存储值，如果不存在则使用默认值
 * @param {string} key - 存储键名
 * @param {any} defaultValue - 默认值
 * @returns {Promise<any>} - 返回设置后的值
 */
async function initStorageValue(key, defaultValue) {
  if (!isValidKey(key)) {
    console.error('[Storage] Invalid key provided to initStorageValue:', key);
    return defaultValue;
  }

  logStorage(`Initializing ${key}`, defaultValue);
  
  try {
    // 获取当前值
    // const data = await chrome.storage.local.get(key);
    // const existingValue = data[key];
    const existingValue = await getStorageValue(key)
    
    // 如果值为 null 或 undefined，使用默认值
    const value = existingValue == null ? defaultValue : existingValue;
    
    // 初始化时总是设置值（确保值被正确设置和同步）
    // 注意：即使值已经存在，也会重新设置，这是初始化的预期行为
    const success = await setStorageValue(key, value);
    if (!success) {
      console.warn(`[Storage] Failed to set value for ${key}, using computed value`);
      return value;
    }
    
    return value;
  } catch (error) {
    console.error(`[Storage] Error initializing ${key}:`, error);
    // 如果出错，尝试设置默认值
    try {
      const success = await setStorageValue(key, defaultValue);
      return success ? defaultValue : defaultValue;
    } catch (setError) {
      console.error(`[Storage] Error setting default value for ${key}:`, setError);
      return defaultValue;
    }
  }
}

/**
 * 批量初始化存储值
 * @param {Object} config - 键值对配置对象 {key: defaultValue}
 * @returns {Promise<Object>} 初始化后的所有值
 */
async function initStorageValues(config) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    console.error('[Storage] Invalid config object provided to initStorageValues');
    return {};
  }

  logStorage('Batch initializing storage values', `${Object.keys(config).length} keys`);
  
  try {
    const entries = Object.entries(config);
    const results = await Promise.all(
      entries.map(([key, defaultValue]) =>
        initStorageValue(key, defaultValue).then(value => [key, value])
      )
    );
    
    const resultObject = Object.fromEntries(results);
    logStorage('Batch initialization completed', 'success');
    return resultObject;
  } catch (error) {
    console.error('[Storage] Error during batch initialization:', error);
    return {};
  }
}

// ============================================================================
// 存储监听器辅助函数
// ============================================================================

/**
 * 创建存储变化监听器
 * @param {string|string[]} keys - 要监听的键名或键名数组
 * @param {Function} callback - 变化回调函数 (changes) => void
 * @returns {Function} 移除监听器的函数
 */
function createStorageListener(keys, callback) {
  if (debug) console.log('[createStorageListener] - begin');
  if (!callback || typeof callback !== 'function') {
    console.error('[Storage] Invalid callback provided to createStorageListener');
    return () => {};
  }

  const keysArray = Array.isArray(keys) ? keys : [keys];
  const validKeys = keysArray.filter(key => isValidKey(key));

  if (validKeys.length === 0) {
    console.error('[Storage] No valid keys provided to createStorageListener');
    return () => {};
  }

  const listener = (changes) => {
    if (debug) console.log('[Storage] Storage changed, checking keys:', validKeys);

    // 检查是否有监听的键发生变化
    const relevantChanges = {};
    let hasChanges = false;

    for (const key of validKeys) {
      if (key in changes) {
        relevantChanges[key] = changes[key];
        hasChanges = true;
      }
    }

    if (hasChanges) {
      if (debug) console.log('[Storage] Relevant changes detected:', Object.keys(relevantChanges));
      callback(relevantChanges, changes);
    }
  };

  chrome.storage.local.onChanged.addListener(listener);

  if (debug) console.log('[createStorageListener]End');

  // 返回移除监听器的函数
  return () => {
    chrome.storage.local.onChanged.removeListener(listener);
  };
}

// ============================================================================
// 导出函数（用于测试和模块化）
// ============================================================================

// 创建统一的导出对象
const storageUtils = {
  // 基础操作
  getStorageValue,
  setStorageValue,
  getStorageValues,
  setStorageValues,
  removeStorageValue,
  removeStorageValues,
  clearStorage,
  
  // 初始化操作
  initStorageValue,
  initStorageValues,
  
  // 监听器
  createStorageListener
};

// 导出函数供其他文件使用（在浏览器环境和 Service Worker 环境中）
if (typeof window !== 'undefined') {
  window.storageUtils = storageUtils;
} else if (typeof self !== 'undefined') {
  // Service Worker 环境
  self.storageUtils = storageUtils;
}

// 导出函数供测试使用（在 Node.js 环境中）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = storageUtils;
}
