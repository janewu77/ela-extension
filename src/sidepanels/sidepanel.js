let currentOnoff = true;

let current_tts_endpoint = default_tts_endpoint
let current_tts_model = default_tts_model
let current_tts_voice = default_tts_voice
let current_auth_token = default_auth_token

let toggleSwitch = document.getElementById('toggleSwitch');

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

  document.getElementById('btnSetting').addEventListener('click', function() {
    if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
  });

}

init();

function showOnoff(bOnoff) {
  toggleSwitch.checked = bOnoff;
  document.body.querySelector('#definition-onoff').innerText = bOnoff ? 'ON' : 'OFF';
}



let myuuid = 0; //换成uuid

// onMessage
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (debug) {
      console.log(`sender:${sender}`);
    }
    

    if (request.type == 'selectedText') {
      if (debug) console.log(`[sidepanel]...selectedText:${request.msg}`);

      myuuid = myuuid + 1;
      document.getElementById('container-content').appendChild(createMsgDiv(request.msg, myuuid));
      sendResponse({data: "success"});
      // return true;  // Will respond asynchronously.
    }
    sendResponse({data: "done"});
  }
);

