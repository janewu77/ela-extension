// 全局变量
let myuuid = 0; //换成uuid
let lastNode = null;

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


//class name
const ClassNameForPlayButton = `flex items-center justify-center gap-x-2.5 p-1 font-semibold text-gray-600 first:rounded-l last:rounded-r hover:bg-blue-100 disabled:bg-gray-50 disabled:cursor-not-allowed`;
const ClassNameForTxtAreaButton = `flex items-center justify-center gap-x-2.5 p-1 font-semibold text-gray-600 rounded rounded hover:bg-blue-100 disabled:bg-gray-50 disabled:cursor-not-allowed`;


const divContentContainer = document.getElementById('container-content');

//add one block
function add_content_block(msg){
  // console.log(`add_content_block:${msg}`);
  myuuid = myuuid + 1;
  
  if (lastNode == null) {
    divContentContainer.appendChild(_createMsgDiv(msg, myuuid));
  }else{
    divContentContainer.insertBefore(_createMsgDiv(msg, myuuid), lastNode);
  }
  lastNode = document.getElementById(myuuid);
}

function get_current_lastNode(){
  let currLastNode = null;
  for (let uuid = myuuid; uuid >= 0; uuid--) {
    currLastNode = document.getElementById(uuid);
    if (currLastNode != null) break;
  }
  lastNode = currLastNode;
}


// button delete all block one by one
let btnName = chrome.i18n.getMessage("btn_clearall");// Clear all
btnDeleteAll = document.getElementById('btnDeleteAll');
btnDeleteAll.id = "DeleteAll"
btnDeleteAll.innerHTML =  `${SVGDeleteAll_6} ${btnName}`;
btnDeleteAll.addEventListener('click', function() {
  if (debug) console.log(`btnDeleteAll clicked. ${myuuid}`);

  for (let uuid = 1; uuid <= myuuid; uuid++) {
    if (mapMsg.has(uuid)){
        btnStopClicked(uuid);

        mapMsg.delete(uuid);
        document.getElementById(uuid).remove();
    }
  }
  myuuid = 0;
  lastNode = null
});


// 生成内容段
function _createMsgDiv(newContent, uuid) {
  mapMsg.set(uuid, newContent)

  mapAudioContext.set(uuid, null);
  mapAudioBufferCache.set(uuid, null)
  mapSource.set(uuid, null)

  const divContainer = document.createElement('div');
  divContainer.id = uuid;
  divContainer.className = " relative pl-2 pr-2 pt-6 pb-2 flex-auto overflow-hidden bg-white ring-1 ring-gray-900/5 "

  //content
  const contentElement = document.createElement('div');
  contentElement.id =  `Content_${uuid}`;
  contentElement.className = " mb-2"
  contentElement.innerHTML = '';
  if (debug) contentElement.innerHTML = `<p class="text-sm" >${uuid}</p>`;
  contentElement.innerHTML += `<p class="text-sm" >${newContent}</p>`;

  // let textareaElement = document.createElement('textarea');
  // textareaElement.name = "message";
  // let textareaClassName = "block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-500 text-sm leading-6";
  // textareaElement.className = textareaClassName;
  // textareaElement.readOnly = true;
  // textareaElement.textContent = newContent;

  // const lineCount = calculateLines(textareaElement, textareaClassName);
  // console.info(`linecount:${lineCount}`);
  // textareaElement.rows = lineCount > 20 ? 20: lineCount;
  // contentElement.appendChild(textareaElement);


  //error msg
  const divSysMsg = document.createElement('div');
  divSysMsg.id = `SysMsg_${uuid}`;
  divSysMsg.className = " p-1 text-red-600"
  divSysMsg.hidden = true;
  divSysMsg.innerHTML = ""
  // divSysMsg.appendChild(btnSetting);

  divContainer.appendChild(contentElement);
  divContainer.appendChild(divSysMsg);

  let pannelElement = createPlayerPannel(uuid, divContainer, divSysMsg);
  divContainer.appendChild(pannelElement);

  if (current_action_items_active.length >= 1){
    let customPannelElement = createCustomPannel(uuid);
    divContainer.appendChild(customPannelElement);
  }

  // console.log(divContainer.innerHTML);
  return divContainer;
}

//create pannel for player
function createPlayerPannel(uuid, container, divSysMsg){
  //pannel && buttons
  const pannelElement = document.createElement('div');
  pannelElement.id = `PlayerPannel_${uuid}`;
  pannelElement.className = " mt-2 grid grid-cols-3 divide-x divide-gray-900/5 bg-gray-100 rounded" ;

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
    btnPlay.innerHTML = SVGPlay;
    btnPause.disabled = false;
    btnStop.disabled = false;
  };

  const onPlayEnded = function() {
    btnPlay.innerHTML = SVGPlay;
    //play ended
    btnPlay.disabled = false;
    btnPause.disabled = true;
    // btnStop.disabled = true;
  };

  const onErrorAudio = function(error) {
    btnPlay.innerHTML = SVGPlay;

    btnPlay.disabled = false;
    btnPause.disabled = true;
    btnStop.disabled = true;

    //show error msg
    divSysMsg.hidden = false;
    divSysMsg.innerHTML = `!!! ${error}`;
    divSysMsg.appendChild(getBtnSetting());
  };

  const onReqSuccess = function(data){
    btnPlay.innerHTML = SVGPlay;

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

      btnPlay.innerHTML = SVGLoadingSpin;

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
        fetchAudio(mapMsg.get(uuid), onReqSuccess, onErrorAudio); // 如果没有缓存，则获取音频数据
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


  // container for btnDelete
  let divTxtAreaMenu = document.createElement('div');
  divTxtAreaMenu.className = " absolute top-1 right-1 ";
  container.appendChild(divTxtAreaMenu);

  // button delete
  let btnDelete = document.createElement('button');
  btnDelete.id = "btnDelete";
  btnDelete.className = ClassNameForTxtAreaButton;
  btnDelete.innerHTML = SVGClose_light;
  btnDelete.disabled = false;
  divTxtAreaMenu.appendChild(btnDelete);
  
  btnDelete.addEventListener('click', function() {
      if (debug) console.log(`btnDelete clicked. ${uuid}`);

      btnPlay.disabled = true;
      btnPause.disabled = true;
      btnStop.disabled = true;

      btnStopClicked(uuid);

      mapMsg.delete(uuid);
      container.remove();

      get_current_lastNode();

  });

  return pannelElement;
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

