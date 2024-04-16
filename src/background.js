importScripts('scripts/const.js');
importScripts('scripts/backendapi.js');


// onInstalled
chrome.runtime.onInstalled.addListener(() => {
    if (debug) console.log(`chrome.runtime.onInstalled`);

    chrome.storage.local.set({ "onoff": defaultOnoff });

    // chrome.storage.local.set({ "auth_token": default_auth_token });
    chrome.storage.local.get("auth_token", (data) => {
      auth_token = data.auth_token == null ? default_auth_token : data.auth_token;
      chrome.storage.local.set({ "auth_token": auth_token });
    });

    //tts
    // chrome.storage.local.set({ "tts_endpoint": default_tts_endpoint });
    chrome.storage.local.get("tts_endpoint", (data) => {
      tts_endpoint = data.tts_endpoint == null ? default_tts_endpoint : data.tts_endpoint;
      chrome.storage.local.set({ "tts_endpoint": tts_endpoint });
    });

    // chrome.storage.local.set({ "tts_model": default_tts_model });
    chrome.storage.local.get("tts_model", (data) => {
      tts_model = data.tts_model == null ? default_tts_model : data.tts_model;
      chrome.storage.local.set({ "tts_model": tts_model });
    });

    // chrome.storage.local.set({ "tts_voice": default_tts_voice });
    chrome.storage.local.get("tts_voice", (data) => {
      tts_voice = data.tts_voice == null ? default_tts_voice : data.tts_voice;
      chrome.storage.local.set({ "tts_voice": tts_voice });
    });
    
    //chat
    chrome.storage.local.get("chat_endpoint", (data) => {
      chat_endpoint = data.chat_endpoint == null ? default_chat_endpoint : data.chat_endpoint;
      chrome.storage.local.set({ "chat_endpoint": chat_endpoint });
    });
    chrome.storage.local.get("chat_model", (data) => {
      chat_model = data.chat_model == null ? default_chat_model : data.chat_model;
      chrome.storage.local.set({ "chat_model": chat_model });
    });

    //actions: action_translate,action_word
    chrome.storage.local.get("action_translate", (data) => {
      action_translate = data.action_translate == null ? default_action_translate : data.action_translate;
      chrome.storage.local.set({ "action_translate": action_translate });
    });
    chrome.storage.local.get("action_word", (data) => {
      action_word = data.action_word == null ? default_action_word : data.action_word;
      chrome.storage.local.set({ "action_word": action_word });
    });

    //set side pannel
    chrome.sidePanel
    .setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));

    //init badege
    chrome.action.setBadgeText({ text:  defaultOnoff ? 'ON' : 'OFF'});

  });


// action.onClicked
chrome.action.onClicked.addListener(async (tab) => {
  if (debug) console.log(`chrome.action.onClicked`);
});


// // contextMenus.onClicked
// chrome.contextMenus.onClicked.addListener((info, tab) => {
//   if (debug) console.log(`chrome.contextMenus.onClicked`);

//     // if (info.menuItemId === 'openSidePanel') {
//     //   // This will open the panel in all the pages on the current window.
//     //   chrome.sidePanel.open({ windowId: tab.windowId });
//     // }
//   });

// onCommand
chrome.commands.onCommand.addListener((command) => {
  if (debug) console.log(`Command: ${command}`);

  // if (command === 'openSidePanel') {
  //   chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  //     // chrome.tabs.sendMessage(tabs[0].id, {action: "toggleSidebar"});
  //     chrome.sidePanel.open({ windowId:  tabs[0].windowId});
  //   });
  // }
});

// local.onChanged
chrome.storage.local.onChanged.addListener((changes) => {
  const currentOnoff = changes['onoff'];

  if (currentOnoff) {
    chrome.action.setBadgeText({text: currentOnoff.newValue ? 'ON' : 'OFF'});
    // chrome.sidePanel.setOptions({ path: onoff ? mainPage : welcomePage });
    // if (currentOnoff.newValue){
    //   getApiVersion();
    // }
    
  }
});


//onMessage
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (debug) console.log(`chrome.runtime.onMessage`);
    if (debug) {
      console.log(`request:${request}`);
      console.log(`sender:${sender}`);
      console.log(`sendResponse:${sendResponse}`);
    }

    // if (request.type == 'selectedText') {
    //   if (debug) console.log(`[bg]...selectedText:${request.msg}`);
    //   return true;  
    // }
    sendResponse({data: "done"});
    // return true;
  }
);

