
//call api
// current_tts_endpoint current_auth_token current_tts_model current_tts_voice
function fetchAudio(msg, onSuccess, onError) {
    if (debug) console.log(`fetchAudio ${msg}`);
  
    fetch(current_tts_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${current_auth_token}`
      },
      body: JSON.stringify({
        "model": current_tts_model, 
        "input": msg,  //" 您好吗?How are you today? ",
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
      onSuccess(arrayBuffer);
    })
    .catch(error => {
      onError(error);
      console.error('Request failed', error);
    });
}

//current_chat_endpoint current_chat_model
//current_auth_token
function fetchChat(msg, prompt, onSuccess, onError) {
    if (debug) console.log(`fetchChat ${msg}`);
  
    fetch(current_chat_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${current_auth_token}`
      },
      body: JSON.stringify({
        "model": current_chat_model, 
        "messages": [
           {"role": "assistant", "content": prompt},
           {"role": "user", "content": msg} 
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
      onSuccess(data);
    })
    .catch(error => {
      onError(error);
      console.error('Request failed', error);
    });
  }