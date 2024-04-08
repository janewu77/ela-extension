

function constructOptions() {
  const optionsForm = document.getElementById("optionsForm");

  //tts_endpoint
  chrome.storage.local.get("tts_endpoint", (data) => {
    optionsForm.TTSEndpoint.value = data.tts_endpoint;
  });
  optionsForm.TTSEndpoint.addEventListener("change", (event) => {
    if (debug) console.log('tts_endpoint: ', event.target.value); 
    chrome.storage.local.set({ "tts_endpoint": event.target.value });
  });


  //auth_token
  chrome.storage.local.get("auth_token", (data) => {
    optionsForm.TTSOpenAIAPIKey.value = data.auth_token;
  });
  optionsForm.TTSOpenAIAPIKey.addEventListener("change", (event) => {
    if (debug) console.log('auth_token: ', event.target.value); 
    chrome.storage.local.set({ "auth_token": event.target.value });
  });

  // const arrTTSModel = ["tts-1", "tts-1-hd"];
  // const arrTTSVoice = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
  //tts_model
  chrome.storage.local.get("tts_model", (data) => {
    let tts_model_container = document.getElementById("tts_model_container");
    arrTTSModel.map(model => {
      tts_model_container.appendChild(createDiv("tts_model", model, data.tts_model));
    });
  });

  //tts_voice
  chrome.storage.local.get("tts_voice", (data) => {
    let tts_voice_container = document.getElementById("tts_voice_container");
    arrTTSVoice.map(voice => {
      tts_voice_container.appendChild(createDiv("tts_voice", voice, data.tts_voice));
    });
  });
  
  //btnReset
  const btnReset = document.getElementById("btnReset");
  btnReset.addEventListener('click', function() {

    chrome.storage.local.set({ "tts_endpoint": default_tts_endpoint });
    chrome.storage.local.set({ "tts_model": default_tts_model });
    chrome.storage.local.set({ "tts_voice": default_tts_voice });
    chrome.storage.local.set({ "auth_token": default_auth_token });

    optionsForm.TTSEndpoint.value = default_tts_endpoint;
    optionsForm.TTSOpenAIAPIKey.value = default_auth_token;
    document.getElementById(`tts_model_${default_tts_model}`).checked = true;
    document.getElementById(`tts_voice_${default_tts_voice}`).checked = true;

  });
}


constructOptions();


function createDiv(radioName, radioValue, currentValue) {
  const newElement = document.createElement('div');
  newElement.className = " flex items-center gap-x-3 "
  newElement.innerHTML = '';

  //radio
  newElement.innerHTML += `<input id="${radioName}_${radioValue}" value="${radioValue}" name="${radioName}" type="radio" class="h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-500">`;
  newElement.innerHTML += `<label for="${radioName}_${radioValue}" class="block text-sm font-medium leading-6 text-gray-900">${radioValue}</label>`;
  
  let radioInut = newElement.querySelector(`#${radioName}_${radioValue}`);
  radioInut.checked = radioValue == currentValue;

  radioInut.addEventListener("change", (event) => {
    if (event.target.checked){
      if (debug) console.log(`${radioName}`, event.target.value); 
      chrome.storage.local.set({ [radioName]: event.target.value });
    }
  });
  return newElement;
}