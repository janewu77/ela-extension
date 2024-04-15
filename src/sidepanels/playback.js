// 全局变量
const mapAudioContext = new Map();
const mapAudioBufferCache = new Map();  // 用于缓存解码后的音频数据
const mapSource = new Map();            // 当前的音频源
const mapMsg = new Map();

//button-svg
const SVGPlay = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-gray-600"><path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" /></svg>` ;
const SVGStop = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-gray-600"><path fill-rule="evenodd" d="M4.5 7.5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-9a3 3 0 0 1-3-3v-9Z" clip-rule="evenodd" /></svg>` ;
const SVGPause = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-gray-600"><path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clip-rule="evenodd" /></svg>` ;
const SVGDelete = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-gray-600"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" /></svg>` ;
const SVGSetting = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-red-600"><path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" /></svg>`
const SVGDeleteAll_6 = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 fill-gray-600"><path fill-rule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clip-rule="evenodd" /></svg>` ;


//class name
const ClassNameForPlayButton = `flex items-center justify-center gap-x-2.5 p-1 font-semibold text-gray-600 first:rounded-l last:rounded-r hover:bg-blue-100 disabled:bg-gray-50 disabled:cursor-not-allowed`;

if (debug){
  // debuginfo
  divDebuginfo = document.getElementById('debuginfo');
  divDebuginfo.innerHTML = "debug";
}

// button delete all 
btnDeleteAll = document.getElementById('btnDeleteAll');
btnDeleteAll.id = "DeleteAll"
btnDeleteAll.innerHTML =  `${SVGDeleteAll_6} Clear all`;
btnDeleteAll.addEventListener('click', function() {
  if (debug) console.log(`btnDeleteAll clicked. ${myuuid}`);

  for (let uuid = 1; uuid <= myuuid; uuid++) {
    if (mapMsg.has(uuid)){
        btnStopClicked(uuid);

        mapMsg.delete(uuid);
        document.getElementById(uuid).remove();
    }
  }
});


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


// 生成内容段
function createMsgDiv(newContent, uuid) {
  mapMsg.set(uuid, newContent)

  mapAudioContext.set(uuid, null);
  mapAudioBufferCache.set(uuid, null)
  mapSource.set(uuid, null)

  const divContainer = document.createElement('div');
  divContainer.id = uuid;
  divContainer.className = "pl-2 pr-2 pt-6 pb-6 flex-auto overflow-hidden  bg-white ring-1 ring-gray-900/5 "


  //content
  const contentElement = document.createElement('div');
  contentElement.className = " mb-2 "
  contentElement.innerHTML = `<p class="text-sm" >${newContent}</p>`;

  //error msg
  const divSysMsg = document.createElement('div');
  // divSysMsg.id = `SysMsg_${uuid}`;
  divSysMsg.className = " p-1 text-red-600"
  divSysMsg.hidden = true;
  divSysMsg.innerHTML = ""
  // divSysMsg.appendChild(btnSetting);

  divContainer.appendChild(contentElement);
  divContainer.appendChild(divSysMsg);

  let pannelElement = createPlayerPannel(uuid, divContainer, divSysMsg);
  let customPannelElement = createCustomPannel(uuid);
  divContainer.appendChild(pannelElement);
  divContainer.appendChild(customPannelElement);

  return divContainer;
}

//create pannel for player
function createPlayerPannel(uuid, container, divSysMsg){
  //pannel && buttons
  const pannelElement = document.createElement('div');
  pannelElement.className = "mt-2 grid grid-cols-4 divide-x divide-gray-900/5 bg-gray-100 rounded" ;

  let btnPlay = document.createElement('button');
  btnPlay.id = "playAudio";
  btnPlay.className = ClassNameForPlayButton;
  btnPlay.innerHTML = SVGPlay;
  pannelElement.appendChild(btnPlay);

  let btnPause = document.createElement('button');
  btnPause.id = "pauseAudio";
  btnPause.className = ClassNameForPlayButton;
  btnPause.innerHTML = SVGPause;
  pannelElement.appendChild(btnPause);

  let btnStop = document.createElement('button');
  btnStop.id = "stopAudio";
  btnStop.className = ClassNameForPlayButton;
  btnStop.innerHTML = SVGStop;
  pannelElement.appendChild(btnStop);

  btnPlay.disabled = false;
  btnPause.disabled = true;
  btnStop.disabled = true;

  //events
  const onBeforePlay = function() {
    btnPause.disabled = false;
    btnStop.disabled = false;
  };

  const onPlayEnded = function() {
    //play ended
    btnPlay.disabled = false;
    btnPause.disabled = true;
    // btnStop.disabled = true;
  };

  const onErrorAudio = function(error) {
    btnPlay.disabled = false;
    btnPause.disabled = true;
    btnStop.disabled = true;

    //show error msg
    divSysMsg.hidden = false;
    divSysMsg.innerHTML = `!!! ${error}`;
    divSysMsg.appendChild(getBtnSetting());
  };

  const onReqSuccess = function(uuid, data){
      // let audioContext = mapAudioContext.get(uuid);
      let audioContext = new (window.AudioContext || window.webkitAudioContext)();
      mapAudioContext.set(uuid, audioContext);
      mapAudioBufferCache.set(uuid, null)
      mapSource.set(uuid, null)

      audioContext.decodeAudioData(data, buffer => {
          mapAudioBufferCache.set(uuid, buffer)
          // audioBufferCache = buffer;
          playAudioBuffer(uuid, onBeforePlay, onPlayEnded);
      }, e => {
          console.log('Audio decoding failed', e);
      });

  };

  //button: play
  btnPlay.addEventListener('click', function() {
      if (debug) console.log(`buttonPlay clicked. ${uuid}`);

      //clear error msg
      divSysMsg.innerHTML = "";
      divSysMsg.hidden = true;

      // disable play button
      btnPlay.disabled = true;
      // btnPause.disabled = false;
      // btnStop.disabled = false;

      // let audioContext = mapAudioContext.get(uuid);
      let audioBufferCache = mapAudioBufferCache.get(uuid);
      // let source = mapSource.get(uuid);

      // 检查是否有缓存的音频数据
      if (audioBufferCache) {
        playAudioBuffer(uuid, onBeforePlay, onPlayEnded); // 使用缓存的音频数据播放
      } else {
        //fetch & play(when success)
        fetchAudio(uuid, onReqSuccess, onErrorAudio); // 如果没有缓存，则获取音频数据
      }
  });

  //button: pause
  btnPause.addEventListener('click', function() {
  if (debug) console.log(`buttonPause clicked. ${uuid}`);

  let audioContext = mapAudioContext.get(uuid);

  if (audioContext && audioContext.state === 'running') {
    btnPlay.disabled = false;
    btnPause.disabled = true;
    btnStop.disabled = false;

    audioContext.suspend().then(() => console.log(`Playback suspended.${uuid}`));
  }
  });

  //button: stop
  btnStop.addEventListener('click', function() {
    if (debug) console.log(`buttonStop clicked. ${uuid}`);

    btnPlay.disabled = false;
    btnPause.disabled = true;
    btnStop.disabled = true;

    btnStopClicked(uuid);
  });

  // button delete
  let btnDelete = document.createElement('button');
  btnDelete.id = "btnDelete";
  btnDelete.className = ClassNameForPlayButton;
  btnDelete.innerHTML = SVGDelete;
  btnDelete.disabled = false;
  pannelElement.appendChild(btnDelete);
  btnDelete.addEventListener('click', function() {
      if (debug) console.log(`btnDelete clicked. ${uuid}`);

      btnPlay.disabled = true;
      btnPause.disabled = true;
      btnStop.disabled = true;

      btnStopClicked(uuid);

      mapMsg.delete(uuid);
      container.remove();

  });

  return pannelElement;
}


//for custom buttons
function createCustomPannel(uuid){
  //
  const container = document.createElement('div');

  const divMsg = document.createElement('div');
  divMsg.className = "mt-2 rounded" ;

  const actionPannel = document.createElement('div');
  actionPannel.className = "mt-1 grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-100 rounded" ;

  const onError = function(error) {
    //show error msg
    // divMsg.hidden = false;
    divMsg.innerHTML = `!!! ${error}`;
    divMsg.appendChild(getBtnSetting());
  };

  const onSuccess = function(uuid, data) {
    if (debug) console.log(`uuid: ${uuid} data: ${data}`);
    //show error msg
    // divMsg.hidden = false;
    let msg = data["choices"][0]["message"]["content"];

    markdownContent = marked.parse(msg);
    divMsg.innerHTML = markdownContent;
  };

  // button btnOp1
  let actionName = "查单词";
  let btnAction = document.createElement('button');
  btnAction.id = "btnOp1";
  btnAction.className = ClassNameForPlayButton;// + " bg-gray-100 ";
  btnAction.innerHTML = actionName;
  actionPannel.appendChild(btnAction);
  

  // button delete
  let btnDelete = document.createElement('button');
  btnDelete.id = `btnDelete_${uuid}`;
  btnDelete.className = ClassNameForPlayButton;
  btnDelete.innerHTML = SVGDelete;
  btnDelete.disabled = true;
  actionPannel.appendChild(btnDelete);
  

  btnAction.addEventListener('click', function() {
    if (debug) console.log(`${actionName} clicked. ${uuid}`);
    btnDelete.disabled = false;
    divMsg.innerHTML = "";
    fetchChat(uuid, onSuccess, onError);
  });

  btnDelete.addEventListener('click', function() {
      if (debug) console.log(`btnDelete clicked. ${uuid}`);
      btnDelete.disabled = true;
      divMsg.innerHTML = "";
  });

  container.appendChild(divMsg)
  container.appendChild(actionPannel)
  return container;
}


function btnStopClicked(uuid){
    let audioContext = mapAudioContext.get(uuid);
    // let audioBufferCache = mapAudioBufferCache.get(uuid);
    let source = mapSource.get(uuid);

    mapAudioContext.delete(uuid);
    mapAudioBufferCache.delete(uuid);
    mapSource.delete(uuid);

    if (source) {
        source.stop(0); // 停止音频源
        source.disconnect(); // 断开连接
    }
    if (audioContext) {
        audioContext.close().then(() => {
            audioContext = null; 
            // audioBufferCache = null;
            source = null;
            if (debug) console.log(`Playback stopped(2). ${uuid}`);
        });
    }
    if (debug) console.log(`Playback stopped(1). ${uuid}`);
}
 

//call api
function fetchAudio(uuid, onSuccess, onError) {
  if (debug) console.log(`fetchAudio ${uuid}`);

  fetch(current_tts_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${current_auth_token}`
    },
    body: JSON.stringify({
      "model": current_tts_model, 
      "input": mapMsg.get(uuid), //" 您好吗?How are you today? ",
      "voice": current_tts_voice,
      "tts_model": "tts_openai",
    }),
  })
  .then(response => {
    if (!response.ok) {
        msg = response.statusText;
        if (response.status == 401 && msg.length < 1) msg = "请检查【OpenAI-API-Key】是否正确设置.";
        throw new Error(`${msg}[${response.status}]`);
    }
    return response.arrayBuffer();
  })
  .then(arrayBuffer => {
    onSuccess(uuid, arrayBuffer);
  })
  .catch(error => {
    onError(error);
    console.error('Request failed', error);
  });
}

//
//https://platform.openai.com/docs/api-reference/chat/create
let current_chat_endpoint = "https://api.openai.com/v1/chat/completions";
current_llm_model = "gpt-3.5-turbo";

function fetchChat(uuid, onSuccess, onError) {
  if (debug) console.log(`fetchChat ${uuid}`);

  fetch(current_chat_endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'authorization': `Bearer ${current_auth_token}`
    },
    body: JSON.stringify({
      // "llm_model": "tts_openai",
      "model": current_llm_model, 
      "messages": [
         {"role": "assistant", "content": default_prompt_word},
         {"role": "user", "content": mapMsg.get(uuid)}
      ],
      "temperature": 0.8,
      "stream":false
    }),
  })
  .then(response => {
    if (!response.ok) {
        msg = response.statusText;
        if (response.status == 401 && msg.length < 1) msg = "请检查【OpenAI-API-Key】是否正确设置.";
        throw new Error(`${msg}[${response.status}]`);
    }
    // return response; //.arrayBuffer();
    return response.json();
  })
  .then(data => {
    onSuccess(uuid, data);
  })
  .catch(error => {
    onError(error);
    console.error('Request failed', error);
  });
}

// 使用 AudioBuffer 播放音频
// function playAudioBuffer(audioContext, audioBuffer, source, onended) {
function playAudioBuffer(uuid, onBefore, onEnded) {
  if (debug) console.log(`playAudioBuffer ${uuid}`);

  onBefore();

  let audioContext = mapAudioContext.get(uuid);
  let audioBufferCache = mapAudioBufferCache.get(uuid);
  let source = mapSource.get(uuid);

  if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
      return;
  }
  if (source) {
      source.stop(0);
      source.disconnect();
  }
  source = audioContext.createBufferSource();
  mapSource.set(uuid, source)

  source.buffer = audioBufferCache;
  source.connect(audioContext.destination);
  source.start(0);
  source.onended = function() {
      if (source) source.disconnect();
      source = null;
      mapSource.set(uuid, source)
      onEnded();
      if (debug) console.log(`Playback finished ${uuid}`);
  };
}

