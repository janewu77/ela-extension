
let currentOnoff = true;

let current_tts_endpoint = default_tts_endpoint
let current_tts_model = default_tts_model
let current_tts_voice = default_tts_voice
let current_auth_token = default_auth_token

let current_chat_endpoint = default_chat_endpoint
let current_llm_model = defalut_llm_model
let current_action_prompt = default_action_prompt
let current_action_name = default_action_name

let toggleSwitch = document.getElementById('toggleSwitch');

//button Setting
const SVGSetting_6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 fill-gray-600"><path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" /></svg>`
const SVGDeleteAll_6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 fill-gray-600"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" /></svg>` ;


if (debug){
  // debuginfo
  divDebuginfo = document.getElementById('debuginfo');
  divDebuginfo.innerHTML = "debug";
}

chrome.storage.local.onChanged.addListener((changes) => {

  const changedOnoff = changes['onoff'];
  if (changedOnoff) {
    currentOnoff = changedOnoff.newValue;
    showOnoff(currentOnoff);
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
  
});

function init(){

  //onoff
  chrome.storage.local.set({ "onoff": currentOnoff });
  showOnoff(currentOnoff);
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


  // setting button
  let btnSetting = document.getElementById('btnSetting');
  btnSetting.id = "SettingButton";
  btnSetting.innerHTML =  `${SVGSetting_6} Setting`;

  btnSetting.addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
  });

  
}

init();

function showOnoff(bOnoff) {
  toggleSwitch.checked = bOnoff;
  document.body.querySelector('#definition-onoff').innerText = bOnoff ? 'ON' : 'OFF';
}

function getBtnSetting(){
  // only for error msg
  const btnSetting = document.createElement('a');
  // btnSetting.id = "btnSetting";
  btnSetting.className = "flex items-center justify-center gap-x-1.5 p-1 font-semibold text-red-600 hover:bg-blue-100 hover:underline "
  // btnSetting.innerHTML = SVGSetting;
  btnSetting.innerHTML = `<span aria-hidden="true">→</span>${SVGSetting}Setting`;
  btnSetting.addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
  });
  return btnSetting;
}


let myuuid = 0; //换成uuid
const divContentContainer = document.getElementById('container-content');
// onMessage
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (debug) {
      console.log(`sender:${sender}`);
    }
    
    if (request.type == 'selectedText') {
      if (debug) console.log(`[sidepanel]...selectedText:${request.msg}`);

      let lastNode = document.getElementById(myuuid);
      myuuid = myuuid + 1;
      
      if (myuuid == 1 ){
        divContentContainer.appendChild(createMsgDiv(request.msg, myuuid));
      }else{
        divContentContainer.insertBefore(createMsgDiv(request.msg, myuuid), lastNode);
      }
      
      sendResponse({data: "success"});
      // return true;  // Will respond asynchronously.
    }
    sendResponse({data: "done"});
  }
);


