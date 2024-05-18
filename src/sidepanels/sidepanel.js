
let currentOnoff = true;

//tts
let current_tts_endpoint = default_tts_endpoint
let current_tts_model = default_tts_model
let current_tts_voice = default_tts_voice
let current_auth_token = default_auth_token

//chat
let current_chat_endpoint = default_chat_endpoint
let current_chat_model = default_chat_model
// let current_action_items = default_action_items;
let current_action_items_active = default_action_items.filter(item => item.active===true );

//ui
let toggleSwitch = document.getElementById('toggleSwitch');

//button Setting
const SVGSetting_6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 fill-gray-600"><path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" /></svg>`
const SVGDeleteAll_6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 fill-gray-600"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" /></svg>` ;
const SVGLoadingSpin = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class=" animate-spin w-4 h-4 "><path fill-rule="evenodd" d="M4.755 10.059a7.5 7.5 0 0 1 12.548-3.364l1.903 1.903h-3.183a.75.75 0 1 0 0 1.5h4.992a.75.75 0 0 0 .75-.75V4.356a.75.75 0 0 0-1.5 0v3.18l-1.9-1.9A9 9 0 0 0 3.306 9.67a.75.75 0 1 0 1.45.388Zm15.408 3.352a.75.75 0 0 0-.919.53 7.5 7.5 0 0 1-12.548 3.364l-1.902-1.903h3.183a.75.75 0 0 0 0-1.5H2.984a.75.75 0 0 0-.75.75v4.992a.75.75 0 0 0 1.5 0v-3.18l1.9 1.9a9 9 0 0 0 15.059-4.035.75.75 0 0 0-.53-.918Z" clip-rule="evenodd" /></svg>`;

const SVGDelete_light = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-gray-400"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" /></svg>` ;
const SVGCopy_light = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-gray-400 "><path fill-rule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z" clip-rule="evenodd" /><path fill-rule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375Zm9.586 4.594a.75.75 0 0 0-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 0 0-1.06 1.06l1.5 1.5a.75.75 0 0 0 1.116-.062l3-3.75Z" clip-rule="evenodd" /></svg>`;
const SVGClose_light = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-gray-400 "><path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.72 6.97a.75.75 0 1 0-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06L12 13.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L13.06 12l1.72-1.72a.75.75 0 1 0-1.06-1.06L12 10.94l-1.72-1.72Z" clip-rule="evenodd" /></svg>`;

if (debug){
  // debuginfo
  divDebuginfo = document.getElementById('debuginfo');
  divDebuginfo.innerHTML = "debug";
}


// listener: setting
chrome.storage.local.onChanged.addListener((changes) => {

  const changedOnoff = changes['onoff'];
  if (changedOnoff) {
    currentOnoff = changedOnoff.newValue;
    _showOnoff(currentOnoff);
  }

  if (changes['tts_endpoint']) {
    current_tts_endpoint = changes['tts_endpoint'].newValue;
  }

  if (changes['tts_model']) {
    current_tts_model = changes['tts_model'].newValue;
  }

  if (changes['tts_voice']) {
    current_tts_voice = changes['tts_voice'].newValue;
  }

  if (changes['auth_token']) {
    current_auth_token = changes['auth_token'].newValue;
  }

  //chat
  if (changes['chat_endpoint']) {
    current_chat_endpoint = changes['chat_endpoint'].newValue;
  }
  if (changes['chat_model']) {
    current_chat_model = changes['chat_model'].newValue;
  }

  //chat - actions
  if (changes['action_items']) {
    let action_items = changes['action_items'].newValue;
    current_action_items_active = action_items.filter(item => item.active );
  }
  
});

function init(){

  //onoff
  chrome.storage.local.set({ "onoff": currentOnoff });
  _showOnoff(currentOnoff);
  toggleSwitch.addEventListener('change', function() {
    chrome.storage.local.set({ "onoff": this.checked });
  });

  //tts setting
  chrome.storage.local.get("tts_endpoint", (data) => {
    current_tts_endpoint = data.tts_endpoint;
  });

  chrome.storage.local.get("tts_model", (data) => {
    current_tts_model = data.tts_model;
  });

  chrome.storage.local.get("tts_voice", (data) => {
    current_tts_voice = data.tts_voice;
  });

  chrome.storage.local.get("auth_token", (data) => {
    current_auth_token = data.auth_token;
  });

  //tts
  chrome.storage.local.get("chat_endpoint", (data) => {
    current_chat_endpoint = data.chat_endpoint;
  });
  chrome.storage.local.get("chat_model", (data) => {
    current_chat_model = data.chat_model;
  });

  //actions
  chrome.storage.local.get("action_items", (data) => {
    let action_items = data.action_items;
    current_action_items_active = action_items.filter(item => item.active );
  });

  // setting button
  let btnName = chrome.i18n.getMessage("btn_name_setting");
  let btnSetting = document.getElementById('btnSetting');
  btnSetting.id = "SettingButton";
  btnSetting.innerHTML =  `${SVGSetting_6} ${btnName}`;

  btnSetting.addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
  });


  //add an empty one
  const btnAddOne = document.getElementById('btnAddOne');
  btnAddOne.addEventListener('click', function() {
    add_content_block("");
  });
  
}

init();

function _showOnoff(bOnoff) {
  toggleSwitch.checked = bOnoff;
  document.body.querySelector('#definition-onoff').innerText = bOnoff ? chrome.i18n.getMessage("onoff_on") : chrome.i18n.getMessage("onoff_off");
}

function getBtnSetting(){
  let btnName = chrome.i18n.getMessage("btn_name_setting");
  // only for error msg
  const btnSetting = document.createElement('a');
  // btnSetting.id = "btnSetting";
  btnSetting.className = "flex items-center justify-center gap-x-1.5 p-1 font-semibold text-red-600 hover:bg-blue-100 hover:underline "
  // btnSetting.innerHTML = SVGSetting;
  btnSetting.innerHTML = `<span aria-hidden="true">→</span>${SVGSetting} ${btnName}`;
  btnSetting.addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
  });
  return btnSetting;
}

// onMessage
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (debug) {
      console.log(`sender:${sender}`);
    }
    
    if (request.type == 'selectedText') {
      if (debug) console.log(`[sidepanel]...selectedText:${request.msg}`);

      add_content_block(request.msg)      
      sendResponse({data: "success"});
      // return true;  // Will respond asynchronously.
    }
    sendResponse({data: "done"});
  }
);

function createButton(btnId, btnClassName, btnHtml, disabled=false){
  let btnButton = document.createElement('button');
  btnButton.id = btnId;
  btnButton.className = btnClassName;
  btnButton.innerHTML = btnHtml;
  btnButton.disabled = disabled;
  return btnButton;
}