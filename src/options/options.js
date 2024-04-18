
let maskedKey = "";

const SVGEdit = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 fill-blue-600"><path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" /><path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" /></svg>`;
const SVGCheck= `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 fill-blue-600"><path fill-rule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" /></svg>`
const SVGCheckDisabled= `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 fill-gray-600"><path fill-rule="evenodd" d="M12.516 2.17a.75.75 0 0 0-1.032 0 11.209 11.209 0 0 1-7.877 3.08.75.75 0 0 0-.722.515A12.74 12.74 0 0 0 2.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 0 0 .374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 0 0-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08Zm3.094 8.016a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clip-rule="evenodd" /></svg>`


const templateActionItem = document.getElementById("template_action_setting");

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
  optionsForm.TTSOpenAIAPIKey.disabled = true;
  optionsForm.onoffTTSOpenAIAPIKey.innerHTML=SVGEdit;
  chrome.storage.local.get("auth_token", (data) => {
    if (data.auth_token == default_auth_token){
      maskedKey = default_auth_token;
      optionsForm.TTSOpenAIAPIKey.value = "";
      optionsForm.TTSOpenAIAPIKey.disabled = false;

      optionsForm.onoffTTSOpenAIAPIKey.disabled = true;
      optionsForm.onoffTTSOpenAIAPIKey.innerHTML = SVGCheckDisabled;
    }else{
      maskedKey = maskMsg(data.auth_token);
      optionsForm.TTSOpenAIAPIKey.value = maskedKey;
      optionsForm.TTSOpenAIAPIKey.disabled = true;

      optionsForm.onoffTTSOpenAIAPIKey.disabled = false;
      optionsForm.onoffTTSOpenAIAPIKey.innerHTML = SVGEdit;
    }
  });
  optionsForm.onoffTTSOpenAIAPIKey.addEventListener("click", (event) => {
    let onOff = !optionsForm.TTSOpenAIAPIKey.disabled;
    // if (debug) console.log('onOff: ', onOff); 

    if (onOff){
      //save new key
      let newKey = optionsForm.TTSOpenAIAPIKey.value;
      if (newKey.length > 0){
        chrome.storage.local.set({ "auth_token": newKey });
        maskedKey = maskMsg(newKey);
      }
      optionsForm.TTSOpenAIAPIKey.value = maskedKey; 
      optionsForm.TTSOpenAIAPIKey.disabled = true;

      optionsForm.onoffTTSOpenAIAPIKey.disabled = false;
      optionsForm.onoffTTSOpenAIAPIKey.innerHTML = SVGEdit;
    }else{
      optionsForm.TTSOpenAIAPIKey.value = "";
      optionsForm.TTSOpenAIAPIKey.disabled = false;

      optionsForm.onoffTTSOpenAIAPIKey.disabled = true;
      optionsForm.onoffTTSOpenAIAPIKey.innerHTML = SVGCheckDisabled; //SVGCheck;
    }
    
  });
  optionsForm.TTSOpenAIAPIKey.addEventListener("input", (event) => {
    if (debug) console.log('auth_token: ', event.target.value); 
    let hasContent = event.target.value.length > 0
    optionsForm.onoffTTSOpenAIAPIKey.disabled = !hasContent;
    optionsForm.onoffTTSOpenAIAPIKey.innerHTML = hasContent? SVGCheck: SVGCheckDisabled; //SVGCheck;
  });

  // const arrTTSModel = ["tts-1", "tts-1-hd"];
  // const arrTTSVoice = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"];
  //tts_model
  chrome.storage.local.get("tts_model", (data) => {
    let tts_model_container = document.getElementById("tts_model_container");
    arrTTSModel.map(model => {
      tts_model_container.appendChild(createDivWithRadioes("tts_model", model, data.tts_model));
    });
  });

  //tts_voice
  chrome.storage.local.get("tts_voice", (data) => {
    let tts_voice_container = document.getElementById("tts_voice_container");
    arrTTSVoice.map(voice => {
      tts_voice_container.appendChild(createDivWithRadioes("tts_voice", voice, data.tts_voice));
    });
  });

  //chat_endpoint
  chrome.storage.local.get("chat_endpoint", (data) => {
    optionsForm.ChatEndpoint.value = data.chat_endpoint;
  });
  optionsForm.ChatEndpoint.addEventListener("change", (event) => {
    if (debug) console.log('chat_endpoint: ', event.target.value); 
    chrome.storage.local.set({ "chat_endpoint": event.target.value });
  });

  //chat_model
  chrome.storage.local.get("chat_model", (data) => {
    let chat_model_container = document.getElementById("chat_model_container");
    // if (debug) console.log('chat_model: ',  data.chat_model); 
    arrChatModel.map(model => {
      chat_model_container.appendChild(createDivWithRadioes("chat_model", model, data.chat_model));
    });
  });

  
  //container_action_items
  const containerActionItem = document.getElementById("container_action_items");
  while (containerActionItem.firstChild) containerActionItem.removeChild(containerActionItem.firstChild);
  chrome.storage.local.get("action_items", (data) => {
    let action_items = data.action_items;
    constructActionItemsHTML(action_items, containerActionItem, templateActionItem)
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

    //chat
    chrome.storage.local.set({ "chat_endpoint": default_chat_endpoint });
    chrome.storage.local.set({ "chat_model": default_chat_model });

    optionsForm.ChatEndpoint.value = default_chat_endpoint;
    let formatedValue = default_chat_model.replace(".", 'dot');
    document.getElementById(`chat_model_${formatedValue}`).checked = true;

    //actions 
    chrome.storage.local.set({ "action_items": default_action_items });
    let action_items = JSON.parse(JSON.stringify(default_action_items));
    while (containerActionItem.firstChild) containerActionItem.removeChild(containerActionItem.firstChild);
    constructActionItemsHTML(action_items, containerActionItem, templateActionItem)

  });
}

constructOptions();

function constructActionItemsHTML(action_items, containerActionItem, templateActionItem){
  action_items.map((actionItem, index) => {
      // let actionItem = action_items[index];
      let i = index + 1;
      
      let tmpHtml = templateActionItem.innerHTML;
      tmpHtml = tmpHtml.replace(/\{1\}/g, index+1);

      const divActionItem = document.createElement('div');
      divActionItem.innerHTML = tmpHtml;
      containerActionItem.appendChild(divActionItem);
      

      const inputNameId = `#action_name_${i}`;
      const inputPromptId = `#action_prompt_${i}`;
      const inputStatusId = `#action_status_${i}`;

      let inputName = divActionItem.querySelector(inputNameId);
      inputName.value = actionItem.name;

      let inputPrompt = divActionItem.querySelector(inputPromptId);
      inputPrompt.value = actionItem.prompt;

      let inputStatus = divActionItem.querySelector(inputStatusId);
      inputStatus.checked = actionItem.active;

      inputName.addEventListener("change", (event) => {
          if (debug) {
            console.log('inputNameId: ', inputNameId); 
            console.log('new value:: ', event.target.value); 
          }

          let newValue = event.target.value.slice(0, 10);
          newValue = newValue.length == 0 ? actionItem.name : newValue;
          actionItem.name = newValue;
          inputName.value = newValue;
          chrome.storage.local.set({ "action_items": action_items });
      });

      inputPrompt.addEventListener("change", (event) => {
        if (debug) {
          console.log('inputPromptId: ', inputPromptId); 
          console.log('new value:: ', event.target.value); 
        }

        let newValue = event.target.value;
        actionItem.prompt = newValue;
        inputPrompt.value = newValue;
        chrome.storage.local.set({ "action_items": action_items });
      });

      inputStatus.addEventListener("click", (event) => {
        if (debug) {
          console.log('inputStatusId: ', inputStatusId); 
          console.log('new value: ', event.target.value); 
          console.log('new checked: ', event.target.checked); 
        }
        let checked = event.target.checked;
        let newValue = checked;
        actionItem.active = newValue;
        inputStatus.checked = newValue;
        chrome.storage.local.set({ "action_items": action_items });
      });

    // return divActionItem;
  });
}

function createDivWithRadioes(radioName, radioValue, currentValue) {
  const newElement = document.createElement('div');
  newElement.className = " flex items-center gap-x-3 "
  newElement.innerHTML = '';

  let formatedValue = radioValue.replace(".", 'dot');
  let radio_id = `${radioName}_${formatedValue}`;

  //radio
  let radioInput = document.createElement('input');
  radioInput.id = radio_id;
  radioInput.type = "radio";
  radioInput.className = "h-4 w-4 border-gray-300 text-blue-500 focus:ring-blue-500";
  radioInput.defaultChecked = radioValue === currentValue;
  radioInput.value = radioValue;
  radioInput.name = radioName;

  newElement.appendChild(radioInput);
  newElement.innerHTML += `<label for="${radioName}_${radioValue}" class="block text-sm font-medium leading-6 text-gray-900">${radioValue}</label>`;
  
  let radioInput2 = newElement.querySelector(`#${radio_id}`);
  if (radioInput2 != null){
    // console.log(`!!!!${radioName}`);
    radioInput2.addEventListener("change", (event) => {
      // console.log(event.target.value);
      if (event.target.checked){
        if (debug) console.log(`${radioName}`, event.target.value); 
        chrome.storage.local.set({ [radioName]: event.target.value });
      }
    });
  }
 
  // console.log(newElement.innerHTML);
  return newElement;
}
