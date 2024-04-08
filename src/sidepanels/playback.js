// 全局变量
const mapAudioContext = new Map();
const mapAudioBufferCache = new Map();  // 用于缓存解码后的音频数据
const mapSource = new Map();            // 当前的音频源
const mapMsg = new Map();


btnDelete = document.getElementById('btnDelete');
btnDelete.addEventListener('click', function() {
  if (debug) console.log(`btnDelete clicked. ${myuuid}`);

  for (let uuid = 1; uuid <= myuuid; uuid++) {
    if (mapMsg.has(uuid)){
        btnStopClicked(uuid);

        mapMsg.delete(uuid);
        document.getElementById(uuid).remove();
    }
  }
});



// 生成内容段
function createMsgDiv(newContent, uuid) {
  mapMsg.set(uuid, newContent)

  mapAudioContext.set(uuid, null);
  mapAudioBufferCache.set(uuid, null)
  mapSource.set(uuid, null)

  const newElementParent = document.createElement('div');
  newElementParent.id = uuid;
  newElementParent.className = " p-4 "

  //content
  const contentElement = document.createElement('div');
  contentElement.innerHTML = `<p class="text-sm" >${newContent}</p>`;

  //button
  const pannelElement = document.createElement('div');
  pannelElement.className = "mt-2 grid grid-cols-4 divide-x divide-gray-900/5 bg-gray-100 rounded-md " ;
  const btnClassName = `class="flex tems-center justify-center gap-x-2.5 p-1 font-semibold text-gray-200 first:rounded-l-md last:rounded-r-md  hover:bg-blue-100 disabled:bg-gray-50 disabled:cursor-not-allowed"`;
  pannelElement.innerHTML += ` <button id="playAudio" ${btnClassName}><img src="../images/play.png" alt="Play" class="h-5 w-5"></button> `;
  pannelElement.innerHTML += ` <button id="pauseAudio" ${btnClassName}><img src="../images/pause.png" alt="Pause" class="h-5 w-5"></button> `;
  pannelElement.innerHTML += ` <button id="stopAudio" ${btnClassName}><img src="../images/stop.png" alt="Stop" class="h-5 w-5"></button> `;
  pannelElement.innerHTML += ` <button id="btnDelete" ${btnClassName}><img src="../images/delete.png" alt="Delete" class="h-5 w-5"></button> `;

  newElementParent.appendChild(contentElement);
  newElementParent.appendChild(pannelElement);

  let buttonPlay = pannelElement.querySelector('#playAudio');
  let buttonPause = pannelElement.querySelector('#pauseAudio');
  let buttonStop = pannelElement.querySelector('#stopAudio');
  let btnDelete = pannelElement.querySelector('#btnDelete');
  

  buttonPlay.disabled = false;
  buttonPause.disabled = true;
  buttonStop.disabled = true;
  btnDelete.disabled = false;

  //button: play
  buttonPlay.addEventListener('click', function() {
    if (debug) console.log(`buttonPlay clicked. ${uuid}`);

    buttonPlay.disabled = true;
    buttonPause.disabled = false;
    buttonStop.disabled = false;

    // let audioContext = mapAudioContext.get(uuid);
    let audioBufferCache = mapAudioBufferCache.get(uuid);
    // let source = mapSource.get(uuid);

    onended = function() {
          buttonPlay.disabled = false;
          buttonPause.disabled = true;
          buttonStop.disabled = true;
    };
    
    // 检查是否有缓存的音频数据
    if (audioBufferCache) {
        playAudioBuffer(uuid, onended); // 使用缓存的音频数据播放
    } else {
        fetchAndPlayAudio(uuid, onended); // 如果没有缓存，则获取音频数据
    }
  });

  //button: pause
  buttonPause.addEventListener('click', function() {
    if (debug) console.log(`buttonPause clicked. ${uuid}`);

    let audioContext = mapAudioContext.get(uuid);

    if (audioContext && audioContext.state === 'running') {
      buttonPlay.disabled = false;
      buttonPause.disabled = true;
      buttonStop.disabled = false;

      audioContext.suspend().then(() => console.log(`Playback suspended.${uuid}`));
    }
  });


  //button: stop
  buttonStop.addEventListener('click', function() {
    if (debug) console.log(`buttonStop clicked. ${uuid}`);

    buttonPlay.disabled = false;
    buttonPause.disabled = false;
    buttonStop.disabled = true;

    btnStopClicked(uuid);

  });

  //delete
  btnDelete.addEventListener('click', function() {
    if (debug) console.log(`btnDelete clicked. ${uuid}`);

    buttonPlay.disabled = true;
    buttonPause.disabled = true;
    buttonStop.disabled = true;

    btnStopClicked(uuid);
    
    mapMsg.delete(uuid);
    newElementParent.remove();

  });

  return newElementParent;
}


function btnStopClicked(uuid){
    let audioContext = mapAudioContext.get(uuid);
    // let audioBufferCache = mapAudioBufferCache.get(uuid);
    let source = mapSource.get(uuid);

    if (source) {
        source.stop(0); // 停止音频源
        source.disconnect(); // 断开连接
    }
    if (audioContext) {
        audioContext.close().then(() => {
            audioContext = null; // 关闭并重置 audioContext
            audioBufferCache = null;
            source = null;
            mapAudioContext.set(uuid, null);
            mapAudioBufferCache.set(uuid, null);
            mapSource.set(uuid, null);

            if (debug) console.log(`Playback stopped. ${uuid}`);
        });
    }
}
 


function fetchAndPlayAudio(uuid, onended) {
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
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => {
      // let audioContext = mapAudioContext.get(uuid);
      let audioContext = new (window.AudioContext || window.webkitAudioContext)();
      mapAudioContext.set(uuid, audioContext);
      mapAudioBufferCache.set(uuid, null)
      mapSource.set(uuid, null)

      audioContext.decodeAudioData(arrayBuffer, buffer => {
          mapAudioBufferCache.set(uuid, buffer)
          // audioBufferCache = buffer;
          playAudioBuffer(uuid, onended);
      }, e => {
          console.log('Audio decoding failed', e);
      });
  })
  .catch(error => console.error('Request failed', error));
}


// 使用 AudioBuffer 播放音频
// function playAudioBuffer(audioContext, audioBuffer, source, onended) {
function playAudioBuffer(uuid, onended) {
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
      onended();
      if (debug) console.log(`Playback finished ${uuid}`);
  };
}

