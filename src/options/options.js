// ============================================================================
// Options Page - 扩展选项页面
// 功能：管理扩展的配置选项，包括 TTS、Chat 和 Action Items 设置
// ============================================================================

if (debug) console.log('[Options] Options page loaded, debug mode:', debug);

// ============================================================================
// 常量定义
// ============================================================================

const SVGEdit = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 fill-blue-600"><path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" /><path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" /></svg>`;

const SVGCheck = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 fill-blue-600"><path fill-rule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" /></svg>`;

const SVGCheckDisabled = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 fill-gray-600"><path fill-rule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" /></svg>`;

// ============================================================================
// 状态管理
// ============================================================================

let maskedKey = "";

// ============================================================================
// DOM 元素引用
// ============================================================================

const templateActionItem = document.getElementById("template_action_setting");

// ============================================================================
// 存储操作辅助函数（使用共用模块）
// ============================================================================

// 直接使用 window.storageUtils（已在 options.html 中加载 storage.js）
// 不声明局部变量，直接使用 window.storageUtils 避免重复声明

// ============================================================================
// TTS 配置管理
// ============================================================================

/**
 * 初始化 TTS Endpoint 配置
 * @param {HTMLFormElement} form - 表单元素
 */
async function initTTSEndpoint(form) {
  try {
    const value = await window.storageUtils.getStorageValue("tts_endpoint");
    if (value) {
      form.TTSEndpoint.value = value;
    }

    form.TTSEndpoint.addEventListener("change", async (event) => {
      if (debug) console.log('[Options] TTS endpoint changed:', event.target.value);
      await window.storageUtils.setStorageValue("tts_endpoint", event.target.value);
    });
  } catch (error) {
    console.error('[Options] Error initializing TTS endpoint:', error);
  }
}

/**
 * 初始化 API Key 配置
 * @param {HTMLFormElement} form - 表单元素
 */
async function initAPIKey(form) {
  try {
    // 初始状态：禁用输入框，显示编辑图标
    form.TTSOpenAIAPIKey.disabled = true;
    form.onoffTTSOpenAIAPIKey.innerHTML = SVGEdit;

    const authToken = await window.storageUtils.getStorageValue("auth_token");

    if (authToken === default_auth_token || !authToken) {
      // 默认值或未设置：允许编辑
      maskedKey = default_auth_token;
      form.TTSOpenAIAPIKey.value = "";
      form.TTSOpenAIAPIKey.disabled = false;
      form.onoffTTSOpenAIAPIKey.disabled = true;
      form.onoffTTSOpenAIAPIKey.innerHTML = SVGCheckDisabled;
    } else {
      // 已设置：显示掩码值，允许编辑
      maskedKey = maskMsg(authToken);
      form.TTSOpenAIAPIKey.value = maskedKey;
      form.TTSOpenAIAPIKey.disabled = true;
      form.onoffTTSOpenAIAPIKey.disabled = false;
      form.onoffTTSOpenAIAPIKey.innerHTML = SVGEdit;
    }

    // 编辑/保存按钮点击事件
    form.onoffTTSOpenAIAPIKey.addEventListener("click", async (event) => {
      const isEditing = !form.TTSOpenAIAPIKey.disabled;

      if (isEditing) {
        // 保存新 key
        const newKey = form.TTSOpenAIAPIKey.value.trim();
        if (newKey.length > 0) {
          await window.storageUtils.setStorageValue("auth_token", newKey);
          maskedKey = maskMsg(newKey);
        }
        form.TTSOpenAIAPIKey.value = maskedKey;
        form.TTSOpenAIAPIKey.disabled = true;
        form.onoffTTSOpenAIAPIKey.disabled = false;
        form.onoffTTSOpenAIAPIKey.innerHTML = SVGEdit;
      } else {
        // 开始编辑
        form.TTSOpenAIAPIKey.value = "";
        form.TTSOpenAIAPIKey.disabled = false;
        form.onoffTTSOpenAIAPIKey.disabled = true;
        form.onoffTTSOpenAIAPIKey.innerHTML = SVGCheckDisabled;
      }
    });

    // 输入框输入事件：根据内容启用/禁用保存按钮
    form.TTSOpenAIAPIKey.addEventListener("input", (event) => {
      if (debug) console.log('[Options] API key input:', event.target.value.length > 0);
      const hasContent = event.target.value.length > 0;
      form.onoffTTSOpenAIAPIKey.disabled = !hasContent;
      form.onoffTTSOpenAIAPIKey.innerHTML = hasContent ? SVGCheck : SVGCheckDisabled;
    });
  } catch (error) {
    console.error('[Options] Error initializing API key:', error);
  }
}

/**
 * 初始化 TTS Model 配置
 */
async function initTTSModel() {
  try {
    const containerName = document.getElementById("tts_model_container_name");
    containerName.innerHTML = chrome.i18n.getMessage("tts_model_container_name");

    const currentModel = await window.storageUtils.getStorageValue("tts_model");
    const container = document.getElementById("tts_model_container");

    arrTTSModel.forEach(model => {
      container.appendChild(createRadioOption("tts_model", model, currentModel));
    });
  } catch (error) {
    console.error('[Options] Error initializing TTS model:', error);
  }
}

/**
 * 初始化 TTS Voice 配置
 */
async function initTTSVoice() {
  try {
    const containerName = document.getElementById("tts_voice_container_name");
    containerName.innerHTML = chrome.i18n.getMessage("tts_voice_container_name");

    const currentVoice = await window.storageUtils.getStorageValue("tts_voice");
    const container = document.getElementById("tts_voice_container");

    arrTTSVoice.forEach(voice => {
      container.appendChild(createRadioOption("tts_voice", voice, currentVoice));
    });
  } catch (error) {
    console.error('[Options] Error initializing TTS voice:', error);
  }
}

// ============================================================================
// Chat 配置管理
// ============================================================================

/**
 * 初始化 Chat Endpoint 配置
 * @param {HTMLFormElement} form - 表单元素
 */
async function initChatEndpoint(form) {
  try {
    const value = await window.storageUtils.getStorageValue("chat_endpoint");
    if (value) {
      form.ChatEndpoint.value = value;
    }

    form.ChatEndpoint.addEventListener("change", async (event) => {
      if (debug) console.log('[Options] Chat endpoint changed:', event.target.value);
      await window.storageUtils.setStorageValue("chat_endpoint", event.target.value);
    });
  } catch (error) {
    console.error('[Options] Error initializing chat endpoint:', error);
  }
}

/**
 * 初始化 Chat Model 配置
 */
async function initChatModel() {
  try {
    const containerName = document.getElementById("chat_model_container_name");
    containerName.innerHTML = chrome.i18n.getMessage("chat_model_container_name");

    const currentModel = await window.storageUtils.getStorageValue("chat_model");
    const container = document.getElementById("chat_model_container");

    arrChatModel.forEach(model => {
      container.appendChild(createRadioOption("chat_model", model, currentModel));
    });
  } catch (error) {
    console.error('[Options] Error initializing chat model:', error);
  }
}

// ============================================================================
// Action Items 配置管理
// ============================================================================

/**
 * 构建 Action Items HTML
 * @param {Array} actionItems - Action items 数组
 * @param {HTMLElement} container - 容器元素
 * @param {HTMLElement} template - 模板元素
 */
function constructActionItemsHTML(actionItems, container, template) {
  // 清空容器
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }

  actionItems.forEach((actionItem, index) => {
    const itemIndex = index + 1;

    // 克隆并替换模板中的占位符
    let html = template.innerHTML;
    html = html.replace(/\{1\}/g, itemIndex);
    html = html.replace(/\{button\}/g, chrome.i18n.getMessage("button"));
    html = html.replace(/\{status_active\}/g, chrome.i18n.getMessage("btn_name_active"));
    html = html.replace(/\{prompt\}/g, chrome.i18n.getMessage("prompt"));

    // 创建新的 action item 元素
    const divActionItem = document.createElement('div');
    divActionItem.innerHTML = html;
    container.appendChild(divActionItem);

    // 获取输入元素
    const inputName = divActionItem.querySelector(`#action_name_${itemIndex}`);
    const inputPrompt = divActionItem.querySelector(`#action_prompt_${itemIndex}`);
    const inputStatus = divActionItem.querySelector(`#action_status_${itemIndex}`);

    // 设置初始值
    inputName.value = actionItem.name || '';
    inputPrompt.value = actionItem.prompt || '';
    inputStatus.checked = actionItem.active || false;

    // 名称输入事件
    inputName.addEventListener("change", async (event) => {
      if (debug) {
        console.log(`[Options] Action ${itemIndex} name changed:`, event.target.value);
      }

      let newValue = event.target.value.slice(0, 10).trim();
      newValue = newValue.length === 0 ? actionItem.name : newValue;
      
      actionItem.name = newValue;
      inputName.value = newValue;
      await window.storageUtils.setStorageValue("action_items", actionItems);
    });

    // Prompt 输入事件
    inputPrompt.addEventListener("change", async (event) => {
      if (debug) {
        console.log(`[Options] Action ${itemIndex} prompt changed`);
      }

      actionItem.prompt = event.target.value;
      await window.storageUtils.setStorageValue("action_items", actionItems);
    });

    // 状态切换事件
    inputStatus.addEventListener("change", async (event) => {
      if (debug) {
        console.log(`[Options] Action ${itemIndex} status changed:`, event.target.checked);
      }

      actionItem.active = event.target.checked;
      await window.storageUtils.setStorageValue("action_items", actionItems);
    });
  });
}

/**
 * 初始化 Action Items 配置
 */
async function initActionItems() {
  try {
    const containerName = document.getElementById("container_action_items_name");
    containerName.innerHTML = chrome.i18n.getMessage("container_action_items_name");

    const container = document.getElementById("container_action_items");
    const actionItems = await window.storageUtils.getStorageValue("action_items") || default_action_items;

    constructActionItemsHTML(actionItems, container, templateActionItem);
  } catch (error) {
    console.error('[Options] Error initializing action items:', error);
  }
}

// ============================================================================
// UI 辅助函数
// ============================================================================

/**
 * 创建单选按钮选项
 * @param {string} radioName - 单选按钮组名称
 * @param {string} radioValue - 单选按钮值
 * @param {string} currentValue - 当前选中的值
 * @returns {HTMLElement} 包含单选按钮的 div 元素
 */
function createRadioOption(radioName, radioValue, currentValue) {
  const container = document.createElement('div');
  container.className = "flex items-center gap-x-3";

  // 格式化值（将点号替换为 dot，用于 ID）
  const formattedValue = radioValue.replace(".", 'dot');
  const radioId = `${radioName}_${formattedValue}`;

  // 创建单选按钮
  const radioInput = document.createElement('input');
  radioInput.id = radioId;
  radioInput.type = "radio";
  radioInput.className = "h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-500";
  radioInput.checked = radioValue === currentValue;
  radioInput.value = radioValue;
  radioInput.name = radioName;

  // 创建标签
  const label = document.createElement('label');
  label.htmlFor = radioId;
  label.className = "block text-sm font-medium leading-6 text-gray-900";
  label.textContent = radioValue;

  container.appendChild(radioInput);
  container.appendChild(label);

  // 添加变更事件监听器
  radioInput.addEventListener("change", async (event) => {
    if (event.target.checked) {
      if (debug) console.log(`[Options] ${radioName} changed:`, event.target.value);
      await window.storageUtils.setStorageValue(radioName, event.target.value);
    }
  });

  return container;
}

/**
 * 设置帮助信息
 * @param {string} containerId - 容器元素 ID
 * @param {string} href - 帮助链接 URL
 * @param {string} preTitleKey - 前置文本的 i18n key
 * @param {string} titleKey - 链接文本的 i18n key
 */
function setHelpInfo(containerId, href, preTitleKey, titleKey) {
  try {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn(`[Options] Help container not found: ${containerId}`);
      return;
    }

    container.innerHTML = chrome.i18n.getMessage(preTitleKey);

    const link = document.createElement('a');
    link.href = href;
    link.target = "_blank";
    link.className = "text-xs font-semibold leading-6 text-gray-900";
    link.innerHTML = chrome.i18n.getMessage(titleKey) + " →";

    container.appendChild(link);
  } catch (error) {
    console.error(`[Options] Error setting help info for ${containerId}:`, error);
  }
}

// ============================================================================
// 重置功能
// ============================================================================

/**
 * 重置所有配置到默认值
 * @param {HTMLFormElement} form - 表单元素
 */
async function resetToDefaults(form) {
  try {
    if (debug) console.log('[Options] Resetting to defaults');

    // 重置 TTS 配置
    await window.storageUtils.setStorageValue("tts_endpoint", default_tts_endpoint);
    await window.storageUtils.setStorageValue("tts_model", default_tts_model);
    await window.storageUtils.setStorageValue("tts_voice", default_tts_voice);
    await window.storageUtils.setStorageValue("auth_token", default_auth_token);

    form.TTSEndpoint.value = default_tts_endpoint;
    form.TTSOpenAIAPIKey.value = default_auth_token;
    
    // 更新单选按钮状态
    const ttsModelRadio = document.getElementById(`tts_model_${default_tts_model}`);
    if (ttsModelRadio) ttsModelRadio.checked = true;

    const ttsVoiceRadio = document.getElementById(`tts_voice_${default_tts_voice}`);
    if (ttsVoiceRadio) ttsVoiceRadio.checked = true;

    // 重置 Chat 配置
    await window.storageUtils.setStorageValue("chat_endpoint", default_chat_endpoint);
    await window.storageUtils.setStorageValue("chat_model", default_chat_model);

    form.ChatEndpoint.value = default_chat_endpoint;
    
    const formattedChatModel = default_chat_model.replace(".", 'dot');
    const chatModelRadio = document.getElementById(`chat_model_${formattedChatModel}`);
    if (chatModelRadio) chatModelRadio.checked = true;

    // 重置 Action Items
    await window.storageUtils.setStorageValue("action_items", default_action_items);
    const actionItems = JSON.parse(JSON.stringify(default_action_items));
    const container = document.getElementById("container_action_items");
    constructActionItemsHTML(actionItems, container, templateActionItem);

    if (debug) console.log('[Options] Reset completed');
  } catch (error) {
    console.error('[Options] Error resetting to defaults:', error);
  }
}

/**
 * 初始化重置按钮
 */
function initResetButton() {
  try {
    const btnReset = document.getElementById("btnReset");
    if (!btnReset) {
      console.warn('[Options] Reset button not found');
      return;
    }

    btnReset.innerHTML = chrome.i18n.getMessage("btn_name_reset");
    btnReset.addEventListener('click', async () => {
      const form = document.getElementById("optionsForm");
      await resetToDefaults(form);
    });
  } catch (error) {
    console.error('[Options] Error initializing reset button:', error);
  }
}

// ============================================================================
// 初始化
// ============================================================================

/**
 * 初始化选项页面
 */
async function initializeOptions() {
  if (debug) console.log('[Options] Initializing options page...');

  try {
    const form = document.getElementById("optionsForm");
    if (!form) {
      console.error('[Options] Options form not found');
      return;
    }

    // 初始化 TTS 配置
    await initTTSEndpoint(form);
    await initAPIKey(form);
    await initTTSModel();
    await initTTSVoice();

    // 初始化 Chat 配置
    await initChatEndpoint(form);
    await initChatModel();

    // 初始化 Action Items
    await initActionItems();

    // 初始化重置按钮
    initResetButton();

    // 设置帮助信息
    setHelpInfo("TTSEndpoint_help", "https://platform.openai.com/docs/api-reference/audio", "howtofill", "learnmore");
    setHelpInfo("TTSOpenAIAPIKey_help", "https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key", "howtofindmykey", "learnmore");
    setHelpInfo("tts_model_container_help", "https://platform.openai.com/docs/guides/text-to-speech", "howtochoose", "learnmore");
    setHelpInfo("tts_voice_container_help", "https://platform.openai.com/docs/guides/text-to-speech", "howtochoose", "learnmore");
    setHelpInfo("ChatEndpoint_help", "https://platform.openai.com/docs/api-reference/chat", "howtofill", "learnmore");

    if (debug) console.log('[Options] Options page initialized successfully');
  } catch (error) {
    console.error('[Options] Error during initialization:', error);
  }
}

// 启动初始化
initializeOptions();

// 导出函数供测试使用（在 Node.js 环境中）
if (typeof module !== 'undefined' && module.exports) {
  // 在测试环境中，从 storage.js 模块导入
  const storageUtils = require('../scripts/storage.js');
  
  module.exports = {
    storageUtils,
    initTTSEndpoint,
    initAPIKey,
    initTTSModel,
    initTTSVoice,
    initChatEndpoint,
    initChatModel,
    initActionItems,
    constructActionItemsHTML,
    createRadioOption,
    setHelpInfo,
    resetToDefaults,
    initResetButton,
    initializeOptions
  };
}
