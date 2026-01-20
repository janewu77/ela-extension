// ============================================================================
// API 调用模块
// 功能：处理 TTS 和 Chat API 的请求
// ============================================================================

if (debug) {
  console.log("[API] API module loaded, debug mode:", debug);
}

// ============================================================================
// TTS API
// ============================================================================

/**
 * 获取 TTS 音频数据
 * @param {string} msg - 要转换为语音的文本
 * @param {Function} onSuccess - 成功回调函数 (arrayBuffer) => void
 * @param {Function} onError - 错误回调函数 (error) => void
 */
function fetchAudio(msg, onSuccess, onError) {
  if (debug) {
    console.log("[API] fetchAudio:", msg?.substring(0, 50));
  }

  if (!msg || typeof msg !== "string" || msg.trim().length === 0) {
    const errorMsg =
      chrome.i18n?.getMessage("err_empty_message_audio") || "Empty message provided to fetchAudio";
    const error = new Error(errorMsg);
    console.error("[API]", error.message);
    onError(error);
    return;
  }

  if (!current_tts_endpoint || !current_auth_token) {
    const errorMsg =
      chrome.i18n?.getMessage("err_tts_not_configured") ||
      "TTS endpoint or auth token not configured";
    const error = new Error(errorMsg);
    console.error("[API]", error.message);
    onError(error);
    return;
  }

  // 使用 Headers 对象确保 header 值符合 ISO-8859-1 编码要求
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  // 确保 authorization token 只包含 ASCII 字符
  const authToken = String(current_auth_token || "").trim();
  if (authToken) {
    headers.set("authorization", `Bearer ${authToken}`);
  }

  fetch(current_tts_endpoint, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      model: current_tts_model,
      input: msg,
      voice: current_tts_voice,
      tts_model: "tts_openai",
    }),
  })
    .then((response) => {
      if (!response.ok) {
        let errorMsg = response.statusText;

        // 处理 401 错误（认证失败）
        if (response.status === 401) {
          errorMsg =
            chrome.i18n?.getMessage("err_key") ||
            "Please check if your OpenAI API Key is correctly set.";
        } else if (!errorMsg || errorMsg.length === 0) {
          errorMsg = chrome.i18n?.getMessage("err_unknown") || "Unknown error";
        }

        throw new Error(`${errorMsg} [${response.status}]`);
      }
      return response.arrayBuffer();
    })
    .then((arrayBuffer) => {
      if (debug) {
        console.log("[API] fetchAudio success, size:", arrayBuffer.byteLength);
      }
      onSuccess(arrayBuffer);
    })
    .catch((error) => {
      console.error("[API] fetchAudio failed:", error);
      onError(error);
    });
}

// ============================================================================
// Chat API
// ============================================================================

/**
 * 获取 Chat 响应
 * @param {string} msg - 用户消息
 * @param {string} prompt - 系统提示词
 * @param {Function} onSuccess - 成功回调函数 (response, stream) => void
 * @param {Function} onError - 错误回调函数 (error) => void
 * @param {boolean} stream - 是否使用流式响应，默认 true
 */
function fetchChat(msg, prompt, onSuccess, onError, stream = true) {
  if (debug) {
    console.log("[API] fetchChat, stream:", stream);
  }

  if (!msg || typeof msg !== "string" || msg.trim().length === 0) {
    const errorMsg =
      chrome.i18n?.getMessage("err_empty_message_chat") || "Empty message provided to fetchChat";
    const error = new Error(errorMsg);
    console.error("[API]", error.message);
    onError(error);
    return;
  }

  if (!current_chat_endpoint || !current_auth_token) {
    const errorMsg =
      chrome.i18n?.getMessage("err_chat_not_configured") ||
      "Chat endpoint or auth token not configured";
    const error = new Error(errorMsg);
    console.error("[API]", error.message);
    onError(error);
    return;
  }

  // 使用 Headers 对象确保 header 值符合 ISO-8859-1 编码要求
  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  // 确保 authorization token 只包含 ASCII 字符
  const authToken = String(current_auth_token || "").trim();
  if (authToken) {
    headers.set("authorization", `Bearer ${authToken}`);
  }

  fetch(current_chat_endpoint, {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      model: current_chat_model,
      messages: [
        { role: "system", content: prompt },
        { role: "user", content: msg },
      ],
      stream: stream,
      temperature: 1,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        let errorMsg = response.statusText;

        // 处理 401 错误（认证失败）
        if (response.status === 401) {
          errorMsg =
            chrome.i18n?.getMessage("err_key") ||
            "Please check if your OpenAI API Key is correctly set.";
        } else if (!errorMsg || errorMsg.length === 0) {
          errorMsg = chrome.i18n?.getMessage("err_unknown") || "Unknown error";
        }

        throw new Error(`${errorMsg} [${response.status}]`);
      }

      if (stream) {
        return response;
      }
      return response.json();
    })
    .then((data) => {
      if (debug) {
        console.log("[API] fetchChat success");
      }
      onSuccess(data, stream);
    })
    .catch((error) => {
      console.error("[API] fetchChat failed:", error);
      onError(error);
    });
}

// ============================================================================
// 流式响应处理
// ============================================================================

/**
 * 读取流式响应数据
 * @param {ReadableStreamDefaultReader} reader - 流读取器
 * @param {Function} afterGetContent - 每次获取内容时的回调 (content) => void
 * @param {Function} onDone - 完成时的回调 () => void
 */
function streamResponseRead(reader, afterGetContent, onDone) {
  if (!reader) {
    console.error("[API] Invalid reader provided to streamResponseRead");
    if (onDone) {
      onDone();
    }
    return;
  }

  const decoder = new TextDecoder("utf-8");

  function readChunk() {
    reader
      .read()
      .then(({ done, value }) => {
        if (done) {
          if (debug) {
            console.log("[API] Stream reading completed");
          }
          if (onDone) {
            onDone();
          }
          return;
        }

        try {
          const data = decoder.decode(value, { stream: true });
          const dataArray = data.split("\n");

          for (const element of dataArray) {
            // 检查结束标记
            if (element === "data: [DONE]") {
              if (debug) {
                console.log("[API] Stream DONE marker received");
              }
              if (onDone) {
                onDone();
              }
              return;
            }

            // 跳过空行
            if (element.length <= 0) {
              continue;
            }

            // 解析 JSON 数据
            try {
              // 移除 'data: ' 前缀（如果存在）
              const jsonStr = element.startsWith("data: ") ? element.substring(6) : element;

              const json = JSON.parse(jsonStr);

              if (json["choices"] && json["choices"].length > 0) {
                const content = json["choices"][0]["delta"]?.["content"];
                if (content !== null && content !== undefined && afterGetContent) {
                  afterGetContent(content);
                }
              }
            } catch (parseError) {
              // 忽略单个 JSON 解析错误，继续处理下一行
              if (debug) {
                console.warn("[API] Failed to parse JSON line:", element, parseError);
              }
            }
          }

          // 继续读取下一个数据块
          readChunk();
        } catch (decodeError) {
          console.error("[API] Error decoding stream data:", decodeError);
          if (onDone) {
            onDone();
          }
        }
      })
      .catch((readError) => {
        console.error("[API] Error reading stream:", readError);
        if (onDone) {
          onDone();
        }
      });
  }

  readChunk();
}

// ============================================================================
// 导出函数供测试使用（在 Node.js 环境中）
// ============================================================================

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    fetchAudio,
    fetchChat,
    streamResponseRead,
  };
}
