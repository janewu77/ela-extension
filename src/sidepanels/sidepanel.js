
let currentOnoff = true;

let current_tts_endpoint = default_tts_endpoint
let current_tts_model = default_tts_model
let current_tts_voice = default_tts_voice
let current_auth_token = default_auth_token

let toggleSwitch = document.getElementById('toggleSwitch');

//button Setting
const SVGSetting_6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 fill-gray-600"><path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" /></svg>`
const divContentContainer = document.getElementById('container-content');

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



let myuuid = 0; //换成uuid
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

