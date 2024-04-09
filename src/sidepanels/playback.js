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

//class name
const ClassNameButton = `flex items-center justify-center gap-x-2.5 p-1 font-semibold text-gray-600 first:rounded-l last:rounded-r hover:bg-blue-100 disabled:bg-gray-50 disabled:cursor-not-allowed`;
  

// button delete all 
btnDeleteAll = document.getElementById('btnDeleteAll');
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

// only for error msg
const btnSetting = document.createElement('a');
btnSetting.id = "btnSetting";
btnSetting.className = "flex items-center justify-center gap-x-1.5 p-1 font-semibold text-red-600 hover:bg-blue-100 hover:underline "

// btnSetting.innerHTML = SVGSetting;
const SVGSetting = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 fill-red-600"><path d="M18.75 12.75h1.5a.75.75 0 0 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM12 6a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 6ZM12 18a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 12 18ZM3.75 6.75h1.5a.75.75 0 1 0 0-1.5h-1.5a.75.75 0 0 0 0 1.5ZM5.25 18.75h-1.5a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 0 1.5ZM3 12a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 3 12ZM9 3.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5ZM12.75 12a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0ZM9 15.75a2.25 2.25 0 1 0 0 4.5 2.25 2.25 0 0 0 0-4.5Z" /></svg>`
btnSetting.innerHTML = `<span aria-hidden="true">→</span>${SVGSetting}Setting`;
btnSetting.addEventListener('click', function() {
  if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
});


// 生成内容段
function createMsgDiv(newContent, uuid) {
  mapMsg.set(uuid, newContent)

  mapAudioContext.set(uuid, null);
  mapAudioBufferCache.set(uuid, null)
  mapSource.set(uuid, null)

  const divContainer = document.createElement('div');
  divContainer.id = uuid;
  divContainer.className = " p-4 "

  //content
  const contentElement = document.createElement('div');
  contentElement.className = " mb-2 "
  contentElement.innerHTML = `<p class="text-sm" >${newContent}</p>`;

  //error msg
  const divSysMsg = document.createElement('div');
  // divSysMsg.id = uuid;
  divSysMsg.className = " p-1 text-red-600"
  divSysMsg.hidden = true;
  divSysMsg.innerHTML = ""
  // divSysMsg.appendChild(btnSetting);

  //pannel && buttons
  const pannelElement = document.createElement('div');
  pannelElement.className = "mt-2 grid grid-cols-4 divide-x divide-gray-900/5 bg-gray-100 rounded" ;
  
  let btnPlay = document.createElement('button');
  btnPlay.id = "playAudio";
  btnPlay.className = ClassNameButton;
  btnPlay.innerHTML = SVGPlay;
  pannelElement.appendChild(btnPlay);

  let btnPause = document.createElement('button');
  btnPause.id = "pauseAudio";
  btnPause.className = ClassNameButton;
  btnPause.innerHTML = SVGPause;
  pannelElement.appendChild(btnPause);

  let btnStop = document.createElement('button');
  btnStop.id = "stopAudio";
  btnStop.className = ClassNameButton;
  btnStop.innerHTML = SVGStop;
  pannelElement.appendChild(btnStop);


  btnPlay.disabled = false;
  btnPause.disabled = true;
  btnStop.disabled = true;
  

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

    onended = function() {
      btnPlay.disabled = false;
      btnPause.disabled = true;
      // btnStop.disabled = true;
    };

    onBeforePlay = function() {
      btnPause.disabled = false;
      btnStop.disabled = false;
    };

    onError = function(error) {
      btnPlay.disabled = false;
      btnPause.disabled = true;
      btnStop.disabled = true;

      //show error msg
      divSysMsg.hidden = false;
      divSysMsg.innerHTML = `!!! ${error}`;
      divSysMsg.appendChild(btnSetting);
      
    };

    
    // 检查是否有缓存的音频数据
    if (audioBufferCache) {
        onBeforePlay();
        playAudioBuffer(uuid, onended); // 使用缓存的音频数据播放
    } else {
        fetchAndPlayAudio(uuid, onended, onBeforePlay, onError); // 如果没有缓存，则获取音频数据
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


  //delete
  let btnDelete = document.createElement('button');
  btnDelete.id = "btnDelete";
  btnDelete.className = ClassNameButton;
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
    divContainer.remove();

  });

  divContainer.appendChild(contentElement);
  divContainer.appendChild(divSysMsg);
  divContainer.appendChild(pannelElement);
  return divContainer;
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
 

function fetchAndPlayAudio(uuid, onended, onBeforePlay, onError) {
  if (debug) console.log(`fetchAndPlayAudio ${uuid}`);

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
      // "tts_model": "tts_edge",
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
      // let audioContext = mapAudioContext.get(uuid);
      let audioContext = new (window.AudioContext || window.webkitAudioContext)();
      mapAudioContext.set(uuid, audioContext);
      mapAudioBufferCache.set(uuid, null)
      mapSource.set(uuid, null)

      audioContext.decodeAudioData(arrayBuffer, buffer => {
          mapAudioBufferCache.set(uuid, buffer)
          // audioBufferCache = buffer;
          onBeforePlay();
          playAudioBuffer(uuid, onended);
      }, e => {
          console.log('Audio decoding failed', e);
      });
  })
  .catch(error => {
    onError(error);
    console.error('Request failed', error);
  });
}


// 使用 AudioBuffer 播放音频
// function playAudioBuffer(audioContext, audioBuffer, source, onended) {
function playAudioBuffer(uuid, onEnded) {
  if (debug) console.log(`playAudioBuffer ${uuid}`);

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

