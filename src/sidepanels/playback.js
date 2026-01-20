// ============================================================================
// Playback Module - 音频播放模块
// 功能：管理音频播放、内容块创建和删除
// ============================================================================

if (debug) console.log('[Playback] Playback module loaded, debug mode:', debug);

// ============================================================================
// 状态管理
// ============================================================================

let myuuid = 0;
let lastNode = null;

// 使用 Map 管理每个内容块的资源
const mapAudioContext = new Map();      // AudioContext 实例
const mapAudioBufferCache = new Map();  // 缓存的音频数据
const mapSource = new Map();            // 当前的音频源
const mapMsg = new Map();               // 消息内容
const mapAudioLoop = new Map();         // 循环播放设置

// ============================================================================
// SVG 图标常量
// ============================================================================

const SVGPlay = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-gray-600"><path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" /></svg>`;
const SVGStop = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-gray-600"><path fill-rule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clip-rule="evenodd" /></svg>`;
const SVGPause = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-gray-600"><path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clip-rule="evenodd" /></svg>`;
const SVGDelete = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-gray-600"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" /></svg>`;
const SVGLoop = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4" fill-red-600"><path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clip-rule="evenodd" /></svg>`;

// SVGSetting、SVGLoadingSpin、SVGClose_light 等在 sidepanel.js 中已定义，这里不重复声明

// ============================================================================
// CSS 类名常量
// ============================================================================

const ClassNameForPlayButton = `flex items-center justify-center gap-x-2.5 p-1 font-semibold text-gray-600 first:rounded-l last:rounded-r hover:bg-blue-100 disabled:bg-gray-50 disabled:cursor-not-allowed`;
const ClassNameForTxtAreaButton = `flex items-center justify-center gap-x-2.5 p-1 font-semibold text-gray-600 rounded rounded hover:bg-blue-100 disabled:bg-gray-50 disabled:cursor-not-allowed`;

// ============================================================================
// DOM 元素引用
// ============================================================================

const divContentContainer = document.getElementById('container-content');

// ============================================================================
// 内容块管理
// ============================================================================

/**
 * 添加内容块
 * @param {string} msg - 消息内容
 * 每次都插到最前面（从上往下为倒序，即最新的在最上面）
 */
function add_content_block(msg) {
  if (debug) console.log('[Playback] Adding content block:', msg?.substring(0, 50));

  try {
    if (!divContentContainer) {
      console.error('[Playback] Content container not found');
      return;
    }

    myuuid = myuuid + 1;

    const msgDiv = _createMsgDiv(msg || '', myuuid);

    if (lastNode == null) {
      divContentContainer.appendChild(msgDiv);
    } else {
      divContentContainer.insertBefore(msgDiv, lastNode);
    }

    lastNode = document.getElementById(myuuid);
  } catch (error) {
    console.error('[Playback] Error adding content block:', error);
  }
}

/**
 * 获取当前最后一个节点
 */
function get_current_lastNode() {
  try {
    let currLastNode = null;
    for (let uuid = myuuid; uuid >= 0; uuid--) {
      currLastNode = document.getElementById(uuid);
      if (currLastNode != null) break;
    }
    lastNode = currLastNode;
  } catch (error) {
    console.error('[Playback] Error getting current last node:', error);
  }
}

/**
 * 删除所有内容块
 * -- 右上角删除按钮的功能，清除所有内容块，并清除map里的缓存数据
 */
function deleteAllBlocks() {
  if (debug) console.log('[Playback] Deleting all blocks, count:', myuuid);

  try {
    for (let uuid = 1; uuid <= myuuid; uuid++) {
      if (mapMsg.has(uuid)) {
        btnStopClicked(uuid); //先停止音频播放
        mapMsg.delete(uuid);  //清除map里的缓存数据
        mapAudioLoop.delete(uuid);

        const element = document.getElementById(uuid);
        if (element) {
          element.remove();
        }
      }
    }

    myuuid = 0;
    lastNode = null;
  } catch (error) {
    console.error('[Playback] Error deleting all blocks:', error);
  }
}

// ============================================================================
// 初始化函数
// ============================================================================

/**
 * 初始化 “删除所有” 按钮
 */
function initDeleteAllButton() {
  try {
    const btnDeleteAll = document.getElementById('btnDeleteAll');
    if (!btnDeleteAll) {
      console.warn('[Playback] Delete all button not found');
      return;
    }

    btnDeleteAll.id = "DeleteAll";
    const btnName = chrome.i18n.getMessage("btn_clearall");
    btnDeleteAll.innerHTML = `${SVGDeleteAll_6} ${btnName}`;
    btnDeleteAll.addEventListener('click', deleteAllBlocks);
  } catch (error) {
    console.error('[Playback] Error initializing delete all button:', error);
  }
}

/**
 * 初始化 playback 模块
 */
function initPlayback() {
  if (debug) console.log('[Playback] Initializing playback module...');

  try {
    // 初始化删除所有按钮
    initDeleteAllButton();

    if (debug) console.log('[Playback] Playback module initialized successfully');
  } catch (error) {
    console.error('[Playback] Error during initialization:', error);
  }
}

// ============================================================================
// 内容块创建
// ============================================================================

/**
 * 创建消息内容块
 * @param {string} newContent - 新内容
 * @param {number} uuid - 唯一标识符
 * @returns {HTMLElement} 创建的内容块元素
 */
function _createMsgDiv(newContent, uuid) {
  if (debug) console.log('[Playback] Creating message div, uuid:', uuid);

  try {
    // 初始化资源映射
    mapMsg.set(uuid, newContent || '');
    mapAudioContext.set(uuid, null);
    mapAudioBufferCache.set(uuid, null);
    mapSource.set(uuid, null);
    mapAudioLoop.set(uuid, true);

    // 创建容器
    const divContainer = document.createElement('div');
    divContainer.id = uuid;
    divContainer.className = "relative pl-2 pr-2 pt-6 pb-2 flex-auto overflow-hidden bg-white ring-1 ring-gray-900/5";

    // 创建内容区域
    const contentElement = _createContentElement(uuid, newContent);
    divContainer.appendChild(contentElement);

    // 创建系统消息区域
    const divSysMsg = _createSysMsgElement(uuid);
    divContainer.appendChild(divSysMsg);

    // 创建播放器面板
    const pannelElement = createPlayerPannel(uuid, divContainer, divSysMsg);
    divContainer.appendChild(pannelElement);

    // 创建自定义面板（如果有激活的 action items）
    if (current_action_items_active && current_action_items_active.length >= 1) {
      const customPannelElement = createCustomPannel(uuid);
      divContainer.appendChild(customPannelElement);
    }

    return divContainer;
  } catch (error) {
    console.error('[Playback] Error creating message div:', error);
    return document.createElement('div'); // 返回空元素作为降级
  }
}

/**
 * 创建内容元素
 * @param {number} uuid - 唯一标识符
 * @param {string} content - 内容文本
 * @returns {HTMLElement} 内容元素
 */
function _createContentElement(uuid, content) {
  const contentElement = document.createElement('div');
  contentElement.id = `Content_${uuid}`;
  contentElement.className = "mb-2";
  contentElement.innerHTML = '';

  if (debug) {
    contentElement.innerHTML = `<p class="text-sm">${uuid}</p>`;
  }

  // 创建可编辑的 textarea
  const textareaElement = document.createElement('textarea');
  textareaElement.name = "message";
  const textareaClassName = "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6";
  textareaElement.className = textareaClassName;
  textareaElement.readOnly = false;
  textareaElement.textContent = content || '';

  // 监听内容变化
  textareaElement.addEventListener("change", (event) => {
    const newValue = event.target.value;
    if (debug) console.log('[Playback] Content changed, uuid:', uuid);

    // 更新消息内容
    mapMsg.set(uuid, newValue);

    // 重置音频资源（内容改变后需要重新生成音频）
    mapAudioContext.set(uuid, null);
    mapAudioBufferCache.set(uuid, null);
    mapSource.set(uuid, null);
  });

  // 计算并设置 textarea 行数
  try {
    const lineCount = calculateLines(textareaElement, textareaClassName) + 2;
    if (debug) console.log('[Playback] Line count:', lineCount, 'uuid:', uuid);
    textareaElement.rows = lineCount > 20 ? 20 : lineCount;
  } catch (error) {
    console.error('[Playback] Error calculating lines:', error);
    textareaElement.rows = 5; // 默认行数
  }

  contentElement.appendChild(textareaElement);
  return contentElement;
}

/**
 * 创建系统消息元素
 * @param {number} uuid - 唯一标识符
 * @returns {HTMLElement} 系统消息元素
 */
function _createSysMsgElement(uuid) {
  const divSysMsg = document.createElement('div');
  divSysMsg.id = `SysMsg_${uuid}`;
  divSysMsg.className = "p-1 text-red-600";
  divSysMsg.hidden = true;
  divSysMsg.innerHTML = "";
  return divSysMsg;
}

// ============================================================================
// 循环播放复选框
// ============================================================================

/**
 * 创建循环播放复选框
 * @param {string} id - 复选框 ID
 * @returns {HTMLElement} 复选框容器元素
 */
function createLoopCheckbox(id) {
  try {
    const btnName = chrome.i18n.getMessage("btn_player_loop");
    const divLoopPlay = document.createElement('div');
    divLoopPlay.className = "grid gap-x-2 bg-white justify-items-center";
    divLoopPlay.innerHTML = `
      <div class="relative flex gap-x-2 ml-2">
        <div class="flex h-6 items-center">
          <input id="${id}" name="${id}" type="checkbox" checked class="h-4 w-4 rounded border-gray-300 focus:ring-blue-500">
        </div>
        <div class="leading-6">
          <label for="${id}" class="text-gray-900">${btnName}</label>
        </div>
      </div>
    `;
    return divLoopPlay;
  } catch (error) {
    console.error('[Playback] Error creating loop checkbox:', error);
    return document.createElement('div');
  }
}

// ============================================================================
// 播放器面板创建
// ============================================================================

/**
 * 创建播放器面板
 * @param {number} uuid - 唯一标识符
 * @param {HTMLElement} container - 容器元素
 * @param {HTMLElement} divSysMsg - 系统消息元素
 * @returns {HTMLElement} 播放器面板元素
 */
function createPlayerPannel(uuid, container, divSysMsg) {
  if (debug) console.log('[Playback] Creating player panel, uuid:', uuid);

  try {
    const pannelElement = document.createElement('div');
    pannelElement.id = `PlayerPannel_${uuid}`;
    pannelElement.className = "mt-2 grid grid-cols-4 divide-x divide-gray-900/5 bg-gray-100 rounded";

    // 创建按钮
    const btnPlay = createButton("playAudio", ClassNameForPlayButton, SVGPlay, false);
    const btnPause = createButton("pauseAudio", ClassNameForPlayButton, SVGPause, true);
    const btnStop = createButton("stopAudio", ClassNameForPlayButton, SVGStop, true);

    pannelElement.appendChild(btnPlay);
    pannelElement.appendChild(btnPause);
    pannelElement.appendChild(btnStop);

    // 定义回调函数
    const onBeforePlay = function() {
      btnPlay.innerHTML = SVGPlay;
      btnPause.disabled = false;
      btnStop.disabled = false;
    };

    const onPlayEnded = function() {
      btnPlay.innerHTML = SVGPlay;
      btnPlay.disabled = false;
      btnPause.disabled = true;
    };

    const onErrorAudio = function(error) {
      btnPlay.innerHTML = SVGPlay;
      btnPlay.disabled = false;
      btnPause.disabled = true;
      btnStop.disabled = true;

      // 显示错误消息
      // 使用 textContent 防止 XSS 攻击，安全地显示错误消息
      divSysMsg.hidden = false;
      const errorText = error instanceof Error ? error.message : String(error);
      divSysMsg.textContent = `!! ${errorText}`;
      divSysMsg.appendChild(getBtnSetting());
    };

    const onTTSReqSuccess = function(data) {
      btnPlay.innerHTML = SVGPlay;

      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        mapAudioContext.set(uuid, audioContext);
        mapAudioBufferCache.set(uuid, null);
        mapSource.set(uuid, null);

        audioContext.decodeAudioData(data, buffer => {
          mapAudioBufferCache.set(uuid, buffer);
          playAudioBuffer(uuid, onBeforePlay, onPlayEnded);
        }, error => {
          console.error('[Playback] Audio decoding failed:', error);
          onErrorAudio('Audio decoding failed');
        });
      } catch (error) {
        console.error('[Playback] Error creating audio context:', error);
        onErrorAudio('Failed to create audio context');
      }
    };

    // 播放按钮事件
    btnPlay.addEventListener('click', function() {
      if (debug) console.log('[Playback] Play button clicked, uuid:', uuid);

      btnPlay.innerHTML = SVGLoadingSpin;

      // 清除错误消息
      divSysMsg.innerHTML = "";
      divSysMsg.hidden = true;

      btnPlay.disabled = true;

      // 检查是否有缓存的音频数据
      const audioBufferCache = mapAudioBufferCache.get(uuid);
      if (audioBufferCache) {
        playAudioBuffer(uuid, onBeforePlay, onPlayEnded);
      } else {
        // 获取音频数据
        const msg = mapMsg.get(uuid);
        if (msg) {
          fetchAudio(msg, onTTSReqSuccess, onErrorAudio);
        } else {
          onErrorAudio('Empty message');
        }
      }
    });

    // 暂停按钮事件
    btnPause.addEventListener('click', function() {
      if (debug) console.log('[Playback] Pause button clicked, uuid:', uuid);

      const audioContext = mapAudioContext.get(uuid);

      if (audioContext && audioContext.state === 'running') {
        btnPlay.disabled = false;
        btnPause.disabled = true;
        btnStop.disabled = false;

        audioContext.suspend().then(() => {
          if (debug) console.log('[Playback] Playback suspended, uuid:', uuid);
        }).catch(error => {
          console.error('[Playback] Error suspending playback:', error);
        });
      }
    });

    // 停止按钮事件
    btnStop.addEventListener('click', function() {
      if (debug) console.log('[Playback] Stop button clicked, uuid:', uuid);

      btnPlay.disabled = false;
      btnPause.disabled = true;
      btnStop.disabled = true;

      btnStopClicked(uuid);
    });

    // 创建删除按钮容器
    const divTxtAreaMenu = document.createElement('div');
    divTxtAreaMenu.className = "absolute top-1 right-1";
    container.appendChild(divTxtAreaMenu);

    // 删除按钮
    const btnDelete = createButton("btnDelete", ClassNameForTxtAreaButton, SVGClose_light, false);
    divTxtAreaMenu.appendChild(btnDelete);
    btnDelete.addEventListener('click', function() {
      if (debug) console.log('[Playback] Delete button clicked, uuid:', uuid);

      btnPlay.disabled = true;
      btnPause.disabled = true;
      btnStop.disabled = true;

      btnStopClicked(uuid);

      mapMsg.delete(uuid);
      mapAudioLoop.delete(uuid);
      container.remove();

      get_current_lastNode();
    });

    // 循环播放复选框
    const btnLoopPlay = createLoopCheckbox("loop");
    pannelElement.appendChild(btnLoopPlay);
    const inputStatus = btnLoopPlay.querySelector("#loop");
    if (inputStatus) {
      inputStatus.addEventListener("change", (event) => {
        if (debug) {
          console.log('[Playback] Loop checkbox changed, uuid:', uuid, 'checked:', event.target.checked);
        }
        mapAudioLoop.set(uuid, event.target.checked);
      });
    }

    return pannelElement;
  } catch (error) {
    console.error('[Playback] Error creating player panel:', error);
    return document.createElement('div');
  }
}

// ============================================================================
// 音频播放控制
// ============================================================================

/**
 * 停止音频播放
 * @param {number} uuid - 唯一标识符
 */
function btnStopClicked(uuid) {
  if (debug) console.log('[Playback] Stopping audio, uuid:', uuid);

  try {
    const audioContext = mapAudioContext.get(uuid);
    const source = mapSource.get(uuid);

    // 清理资源
    mapAudioContext.delete(uuid);
    mapAudioBufferCache.delete(uuid);
    mapSource.delete(uuid);

    // 停止音频源
    if (source) {
      try {
        source.stop(0);
        source.disconnect();
      } catch (error) {
        // 忽略已停止的源错误
        if (debug) console.warn('[Playback] Error stopping source (may already be stopped):', error);
      }
    }

    // 关闭音频上下文
    if (audioContext) {
      audioContext.close().then(() => {
        if (debug) console.log('[Playback] Audio context closed, uuid:', uuid);
      }).catch(error => {
        console.error('[Playback] Error closing audio context:', error);
      });
    }
  } catch (error) {
    console.error('[Playback] Error in btnStopClicked:', error);
  }
}

/**
 * 播放音频缓冲区
 * @param {number} uuid - 唯一标识符
 * @param {Function} onBefore - 播放前回调
 * @param {Function} onEnded - 播放结束回调
 */
function playAudioBuffer(uuid, onBefore, onEnded) {
  if (debug) console.log('[Playback] Playing audio buffer, uuid:', uuid);

  try {
    if (onBefore) onBefore();

    let audioContext = mapAudioContext.get(uuid);
    const audioBufferCache = mapAudioBufferCache.get(uuid);
    let source = mapSource.get(uuid);

    if (!audioContext || !audioBufferCache) {
      console.error('[Playback] Missing audio context or buffer, uuid:', uuid);
      if (onEnded) onEnded();
      return;
    }

    // 如果上下文被暂停，恢复它
    if (audioContext.state === 'suspended') {
      audioContext.resume().catch(error => {
        console.error('[Playback] Error resuming audio context:', error);
      });
      return;
    }

    // 停止之前的源（如果存在）
    if (source) {
      try {
        source.stop(0);
        source.disconnect();
      } catch (error) {
        // 忽略已停止的源错误
      }
    }

    // 创建新的音频源
    source = audioContext.createBufferSource();
    mapSource.set(uuid, source);

    source.buffer = audioBufferCache;
    source.connect(audioContext.destination);
    source.start(0);

    // 播放结束处理
    source.onended = function() {
      const loop = mapAudioLoop.get(uuid);
      if (loop) {
        // 循环播放：延迟 200ms 后重新播放
        setTimeout(function() {
          playAudioBuffer(uuid, onBefore, onEnded);
        }, 200);
      } else {
        // 正常结束
        if (source) {
          try {
            source.disconnect();
          } catch (error) {
            // 忽略断开连接错误
          }
        }
        mapSource.set(uuid, null);
        if (onEnded) onEnded();
        if (debug) console.log('[Playback] Playback finished, uuid:', uuid);
      }
    };
  } catch (error) {
    console.error('[Playback] Error playing audio buffer:', error);
    if (onEnded) onEnded();
  }
}

// ============================================================================
// 启动初始化
// ============================================================================

// 等待 DOM 加载完成后再初始化
if (typeof window !== 'undefined' && typeof module === 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPlayback);
  } else {
    // DOM 已经加载完成
    initPlayback();
  }
}

// 导出函数供测试使用（在 Node.js 环境中）
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    add_content_block,
    get_current_lastNode,
    deleteAllBlocks,
    initDeleteAllButton,
    initPlayback,
    _createMsgDiv,
    _createContentElement,
    _createSysMsgElement,
    createLoopCheckbox,
    createPlayerPannel,
    btnStopClicked,
    playAudioBuffer,
    // 导出常量供其他模块使用
    ClassNameForTxtAreaButton
  };
}
