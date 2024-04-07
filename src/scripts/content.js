
// content.js
if (debug) console.log(`This is in content! debug:${debug}!`);

var currentOnoff = false;
chrome.storage.local.get("onoff", (data) => {
  currentOnoff = data.onoff;
});

chrome.storage.local.onChanged.addListener((changes) => {
  const changedOnoff = changes['onoff'];
  if (changedOnoff) {
    currentOnoff = changedOnoff.newValue;
  }

});

// 监听选择事件 
// mouseup selectionchange
document.addEventListener('mouseup', function(event) {
    // todo: 检查 event.origin 以增加安全性
    if (debug) console.log(`mouseup onoff:${currentOnoff}`);
    if (debug) {
      console.log(`event:${event}`);
    }

    if (currentOnoff) {
      //取得选中的文字
      var selectedText = window.getSelection().toString();
      if ( selectedText.length > 0 ) {
          selectedText = selectedText.trim();
          // 向background script发送消息
          if (debug) console.log(`[content.js][mouseup]selectedText:${selectedText}`);
          chrome.runtime.sendMessage({type: 'selectedText', msg: selectedText, isTopFrame: window.self === window.top});
      }
    }
  
});