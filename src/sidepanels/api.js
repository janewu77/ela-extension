
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
          if (response.status == 401 && msg.length < 1) msg = chrome.i18n.getMessage("err_key"); //请检查【OpenAI-API-Key】是否正确设置。
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
function fetchChat(msg, prompt, onSuccess, onError, stream=true) {
    if (debug) console.log(`fetchChat stream: ${stream} `);
  
    fetch(current_chat_endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${current_auth_token}`
      },
      body: JSON.stringify({
        "model": current_chat_model, 
        "messages": [
           {"role": "system", "content": prompt},
           {"role": "user", "content": msg} 
        ],
        "stream":stream,
        "temperature": 1,
        "top_p": 1,
        "frequency_penalty": 0,
        "presence_penalty": 0
      }),
    })
    .then(response => {
      if (!response.ok) {
          msg = response.statusText;
          if (response.status == 401 && msg.length < 1) msg = chrome.i18n.getMessage("err_key");
          throw new Error(`${msg}[${response.status}]`);
      }
      // return response; //.arrayBuffer();
      if (stream) return response;
      return response.json();
    })
    .then(data => {
      onSuccess(data, stream);
    })
    .catch(error => {
      onError(error);
      console.error('Request failed', error);
    });
  }

  const decoder = new TextDecoder("utf-8");
  function streamResponseRead(reader, afterGetContent, onDone) {

    // const reader = response.body.getReader();
    reader.read().then(({ done, value }) => {
      if (done) {
        console.log('Stream 已经读取完毕');
        onDone();
        return;
      }
      let data = decoder.decode(value, {stream: true}); 
      // 按行拆分
      let dataArray = data.split('\n');

      for (const element of dataArray) {
        // console.log(`element:[${element}]`);
        if (element.length <= 0 || element === "data: [DONE]"){
            continue;
        }
        // 在这里处理每个元素
        try {
            let json = JSON.parse(element.substring(6)); // 假设每个项前有 'data: ' 需要去掉
            if (json['choices'].length > 0){
              let content = json['choices'][0]['delta']['content'];
              if (content != null){
                // console.log(`content:${content}`);
                afterGetContent(content);
              }
            }
              
        } catch (e) {
            console.error('解析错误', e);
        }
    }
      // 递归调用，继续读取下一个数据块
      streamResponseRead(reader, afterGetContent, onDone);
    });
  }