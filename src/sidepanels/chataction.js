// ============================================================================
// Chat Action Module - 聊天操作模块
// 功能：管理自定义操作按钮和响应显示（AI功能按钮、复制、清除、出错时的提示与按钮）
// 说明：点击AI功能按钮发起API请求
// ============================================================================

if (debug) {
  console.log("[ChatAction] Chat action module loaded, debug mode:", debug);
}

// ============================================================================
// CSS 类名常量
// ============================================================================

const ClassNameForPlayButtonMulti = `flex items-center justify-center p-1 font-semibold text-gray-600 hover:bg-blue-100 disabled:bg-gray-50 disabled:cursor-not-allowed rounded bg-gray-100 border-1 border-blue-300`;

// ============================================================================
// UI 辅助函数
// ============================================================================

/**
 * 显示/隐藏按钮
 * @param {HTMLElement} btnCopy - 按钮元素
 * @param {string} visibility - 可见性 ('visible' 或 'hidden')
 */
function showBtn(btnCopy, visibility) {
  try {
    if (!btnCopy) {
      console.warn("[ChatAction] Invalid button element provided to showBtn");
      return;
    }

    const visibilityClass = visibility === "visible" ? "visible" : "hidden";
    btnCopy.className = ClassNameForTxtAreaButton + ` ${visibilityClass}`;
  } catch (error) {
    console.error("[ChatAction] Error showing/hiding button:", error);
  }
}

/**
 * 启用/禁用所有按钮
 * @param {HTMLElement[]} arrBtn - 按钮数组
 * @param {boolean} disabled - 是否禁用
 */
function disableAllBtn(arrBtn, disabled) {
  try {
    if (!Array.isArray(arrBtn)) {
      console.warn("[ChatAction] Invalid button array provided to disableAllBtn");
      return;
    }

    arrBtn.forEach((btnAction) => {
      if (btnAction && typeof btnAction.disabled !== "undefined") {
        btnAction.disabled = disabled;
      }
    });
  } catch (error) {
    console.error("[ChatAction] Error disabling/enabling buttons:", error);
  }
}

// ============================================================================
// 自定义面板创建
// ============================================================================

/**
 * 创建自定义操作面板
 * @param {number} uuid - 唯一标识符
 * @returns {HTMLElement} 自定义面板容器元素
 */
function createCustomPannel(uuid) {
  if (debug) {
    console.log("[ChatAction] Creating custom panel, uuid:", uuid);
  }

  try {
    if (!current_action_items_active || current_action_items_active.length === 0) {
      if (debug) {
        console.log("[ChatAction] No active action items, skipping custom panel");
      }
      return document.createElement("div");
    }

    const arrActionButton = [];
    const container = document.createElement("div");
    container.id = `CustomPannel_${uuid}`;

    // 创建消息显示区域
    const divMsg = _createResponseElement(uuid);

    // 创建操作按钮面板
    const actionPannel = _createActionPannel(uuid, arrActionButton, divMsg);

    // 创建菜单按钮（清除和复制） -- 在创建操作按钮面板中一起创建
    // const divTxtAreaMenu = _createMenuButtons(uuid, divMsg, arrActionButton);

    container.appendChild(divMsg);
    container.appendChild(actionPannel);

    return container;
  } catch (error) {
    console.error("[ChatAction] Error creating custom panel:", error);
    return document.createElement("div");
  }
}

/**
 * 创建响应显示元素
 * @param {number} uuid - 唯一标识符
 * @returns {HTMLElement} 响应元素
 */
function _createResponseElement(uuid) {
  const divMsg = document.createElement("div");
  divMsg.id = `CustomPannel_SysMsg_${uuid}`;
  divMsg.className = "mt-2 rounded relative";

  const textareaElement = document.createElement("textarea");
  const textareaElementID = `CustomPannel_Response_${uuid}`;
  textareaElement.id = textareaElementID;
  const textareaClassName =
    "block w-full rounded-md border-0 border-gray-300 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-500 text-sm leading-6";
  textareaElement.className = textareaClassName;
  textareaElement.readOnly = true;

  return divMsg;
}

/**
 * 创建操作按钮面板
 * @param {number} uuid - 唯一标识符
 * @param {HTMLElement[]} arrActionButton - 按钮数组（用于存储创建的按钮）
 * @param {HTMLElement} divMsg - 消息显示区域
 * @returns {HTMLElement} 操作面板元素
 */
function _createActionPannel(uuid, arrActionButton, divMsg) {
  const actionPannel = document.createElement("div");
  actionPannel.id = `CustomPannel_ActionPannel_${uuid}`;

  // 确保列数在有效范围内（1-3）
  const validCount = Math.max(1, Math.min(current_action_items_active.length, 3));
  actionPannel.className = `mt-1 grid grid-cols-${validCount} gap-x-0.5 gap-y-0.5 bg-white-100 rounded`;

  // 获取响应 textarea 元素
  const textareaElementID = `CustomPannel_Response_${uuid}`;
  const textareaElement =
    divMsg.querySelector(`#${textareaElementID}`) ||
    (() => {
      const el = document.createElement("textarea");
      el.id = textareaElementID;
      el.className =
        "block w-full rounded-md border-0 border-gray-300 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-500 text-sm leading-6";
      el.readOnly = true;
      return el;
    })();

  const textareaClassName = textareaElement.className;

  // 创建菜单按钮（需要在创建操作按钮之前创建，以便在回调中使用） -- 清除与复制小按钮
  const divTxtAreaMenu = _createMenuButtons(uuid, divMsg, arrActionButton);

  // 为每个激活的操作项创建按钮
  current_action_items_active.forEach((actionItem, index) => {
    const i = index + 1;

    const btnAction = createButton(
      `btnAction${i}`,
      ClassNameForPlayButtonMulti,
      actionItem.name,
      false
    );
    actionPannel.appendChild(btnAction);
    arrActionButton.push(btnAction);

    // 按钮点击事件
    btnAction.addEventListener("click", function () {
      if (debug) {
        console.log(`[ChatAction] Action button clicked: ${actionItem.name}, uuid: ${uuid}`);
      }

      try {
        // 更新按钮状态
        // 安全地设置按钮内容：SVG（来自常量，安全）+ 文本（来自用户配置，需要转义）
        btnAction.textContent = ""; // 清空内容
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = SVGLoadingSpin; // SVG 来自常量，安全
        const svgElement = tempDiv.firstElementChild;
        if (svgElement) {
          btnAction.appendChild(svgElement);
        }
        // 使用 textContent 安全地添加用户输入的文本
        if (actionItem.name) {
          btnAction.appendChild(document.createTextNode(actionItem.name));
        }
        showBtn(divTxtAreaMenu.querySelector(`#btnClear_${uuid}`), "hidden");
        showBtn(divTxtAreaMenu.querySelector(`#btnCopy_${uuid}`), "hidden");
        disableAllBtn(arrActionButton, true);

        // 获取消息内容
        const msg = mapMsg.get(uuid);
        if (!msg || msg.trim().length === 0) {
          const errorMsg = chrome.i18n?.getMessage("err_empty_message") || "Empty message";
          throw new Error(errorMsg);
        }

        // 调用 Chat API
        fetchChat(
          msg,
          actionItem.prompt,
          function (response, stream) {
            // 安全地设置按钮文本（防止 XSS）
            btnAction.textContent = actionItem.name || "";

            if (debug) {
              console.log("[ChatAction] Chat response received, stream:", stream);
            }

            // 获取或创建 textarea
            let txtArea = divMsg.querySelector(`#${textareaElementID}`);
            if (txtArea === null) {
              // 清空并添加新元素
              while (divMsg.firstChild) {
                divMsg.removeChild(divMsg.firstChild);
              }
              divMsg.appendChild(textareaElement);
              divMsg.appendChild(divTxtAreaMenu);
              txtArea = textareaElement;
            }

            // 清空之前的内容
            txtArea.textContent = "";

            if (stream) {
              // 流式响应
              txtArea.rows = 12;
              streamResponseRead(
                response.body.getReader(),
                (content) => {
                  txtArea.textContent += content;
                },
                () => {
                  showBtn(divTxtAreaMenu.querySelector(`#btnClear_${uuid}`), "visible");
                  showBtn(divTxtAreaMenu.querySelector(`#btnCopy_${uuid}`), "visible");
                }
              );
            } else {
              // 非流式响应
              try {
                const msg = response["choices"]?.[0]?.["message"]?.["content"];
                if (msg) {
                  txtArea.textContent = msg;
                  const lineCount = calculateLines(txtArea, textareaClassName);
                  txtArea.rows = lineCount > 12 ? 12 : lineCount;
                } else {
                  const errorMsg =
                    chrome.i18n?.getMessage("err_invalid_response") || "Invalid response format";
                  throw new Error(errorMsg);
                }
              } catch (parseError) {
                console.error("[ChatAction] Error parsing response:", parseError);
                const errorMsg =
                  chrome.i18n?.getMessage("err_parse_failed") || "Failed to parse response";
                throw new Error(errorMsg);
              }

              showBtn(divTxtAreaMenu.querySelector(`#btnClear_${uuid}`), "visible");
              showBtn(divTxtAreaMenu.querySelector(`#btnCopy_${uuid}`), "visible");
            }

            disableAllBtn(arrActionButton, false);
          },
          function (error) {
            // 错误处理
            // 安全地设置按钮文本（防止 XSS）
            btnAction.textContent = actionItem.name || "";
            showBtn(divTxtAreaMenu.querySelector(`#btnClear_${uuid}`), "hidden");
            showBtn(divTxtAreaMenu.querySelector(`#btnCopy_${uuid}`), "hidden");

            // 显示错误消息
            while (divMsg.firstChild) {
              divMsg.removeChild(divMsg.firstChild);
            }

            const divErrMsg = document.createElement("div");
            // 使用 textContent 防止 XSS 攻击，安全地显示错误消息
            const errorText = error instanceof Error ? error.message : String(error);
            divErrMsg.textContent = `!! ${errorText}`;
            divErrMsg.appendChild(getBtnSetting());
            divMsg.appendChild(divErrMsg);

            disableAllBtn(arrActionButton, false);
          },
          true
        );
      } catch (error) {
        console.error("[ChatAction] Error in action button click:", error);
        // 安全地设置按钮文本（防止 XSS）
        btnAction.textContent = actionItem.name || "";
        disableAllBtn(arrActionButton, false);
      }
    });
  });

  return actionPannel;
}

/**
 * 创建菜单按钮（清除和复制）
 * @param {number} uuid - 唯一标识符
 * @param {HTMLElement} divMsg - 消息显示区域
 * @param {HTMLElement[]} arrActionButton - 操作按钮数组
 * @returns {HTMLElement} 菜单按钮容器
 */
function _createMenuButtons(uuid, divMsg, arrActionButton) {
  const divTxtAreaMenu = document.createElement("div");
  divTxtAreaMenu.className = "absolute top-0 right-0";

  const textareaElementID = `CustomPannel_Response_${uuid}`;

  // 清除按钮
  const btnClear = createButton(
    `btnClear_${uuid}`,
    ClassNameForTxtAreaButton + " visibility: hidden",
    SVGDelete_light,
    false
  );
  divTxtAreaMenu.appendChild(btnClear);

  btnClear.addEventListener("click", function () {
    if (debug) {
      console.log("[ChatAction] Clear button clicked, uuid:", uuid);
    }

    try {
      showBtn(btnClear, "hidden");
      showBtn(divTxtAreaMenu.querySelector(`#btnCopy_${uuid}`), "hidden");

      const txtArea = divMsg.querySelector(`#${textareaElementID}`);
      if (txtArea) {
        txtArea.textContent = "";
      }

      disableAllBtn(arrActionButton, false);
    } catch (error) {
      console.error("[ChatAction] Error clearing text:", error);
    }
  });

  // 复制按钮
  const btnCopy = createButton(
    `btnCopy_${uuid}`,
    ClassNameForTxtAreaButton + " visibility: hidden",
    SVGCopy_light,
    false
  );
  divTxtAreaMenu.appendChild(btnCopy);

  btnCopy.addEventListener("click", async function () {
    if (debug) {
      console.log("[ChatAction] Copy button clicked, uuid:", uuid);
    }

    try {
      const txtArea = divMsg.querySelector(`#${textareaElementID}`);
      if (txtArea && txtArea.textContent) {
        await navigator.clipboard.writeText(txtArea.textContent);
        if (debug) {
          console.log("[ChatAction] Text copied to clipboard");
        }
      }
    } catch (error) {
      console.error("[ChatAction] Error copying text:", error);
    }
  });

  return divTxtAreaMenu;
}

// 导出函数供测试使用（在 Node.js 环境中）
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    showBtn,
    disableAllBtn,
    createCustomPannel,
    _createResponseElement,
    _createActionPannel,
    _createMenuButtons,
  };
}
