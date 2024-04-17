// let current_action_word = defalut_action_word;
// let current_action_transalate = defalut_action_transalate;
//for custom buttons
function createCustomPannel(uuid){
    const container = document.createElement('div');
    container.id = `CustomPannel_${uuid}`;
  
    const divMsg = document.createElement('div');
    divMsg.id = `CustomPannel_SysMsg_${uuid}`;
    divMsg.className = "mt-2 rounded" ;

    const textareaElement = document.createElement('textarea');
    const textareaElementID = `CustomPannel_Response_${uuid}`;
    textareaElement.id = textareaElementID;
    // textareaElement.name = "message";
    const textareaClassName = "block w-full rounded-md border-0 border-gray-300 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-500 text-sm leading-6";
    textareaElement.className = textareaClassName;
    textareaElement.readOnly = true;
  
    const actionPannel = document.createElement('div');
    actionPannel.id = `CustomPannel_ActionPannel_${uuid}`;
    actionPannel.className = "mt-1 grid grid-cols-3 divide-x divide-gray-900/5 bg-gray-100 rounded" ;

    // button btnActionTrans
    let btnActionTrans = document.createElement('button');
    btnActionTrans.id = "btnOpTrans";
    btnActionTrans.className = ClassNameForPlayButton;
    btnActionTrans.innerHTML = current_action_translate.name;
    btnActionTrans.disabled = false;
    actionPannel.appendChild(btnActionTrans);
    
    // button btnOpWord
    let btnActionWord = document.createElement('button');
    btnActionWord.id = "btnOpWord";
    btnActionWord.className = ClassNameForPlayButton;
    btnActionWord.innerHTML = current_action_word.name;
    btnActionWord.disabled = false;
    actionPannel.appendChild(btnActionWord);
    
    // button delete
    let btnDelete = document.createElement('button');
    btnDelete.id = `btnDelete_${uuid}`;
    btnDelete.className = ClassNameForPlayButton;
    btnDelete.innerHTML = SVGDelete;
    btnDelete.disabled = true;
    actionPannel.appendChild(btnDelete);
  


    const onError = function(error) {
      while (divMsg.firstChild) divMsg.removeChild(divMsg.firstChild);

      const divErrMsg = document.createElement('div');
      divErrMsg.innerHTML = `!!! ${error}`;
      divErrMsg.appendChild(getBtnSetting());
      divMsg.appendChild(divErrMsg);

      btnActionTrans.disabled = false;
      btnActionWord.disabled = false;
      btnDelete.disabled = false;
    };

    const onSuccess = function(response, stream){
      if (debug) console.log(` onSuccess stream:${stream}`);
      // if (debug) console.log(` onSuccess divMsg.hasChildNodes():${divMsg.hasChildNodes()}`);

      const txtArea = divMsg.querySelector(`#${textareaElementID}`);
      if (txtArea != null){
        txtArea.textContent = '';
      }else{
        while (divMsg.firstChild) divMsg.removeChild(divMsg.firstChild);
        divMsg.appendChild(textareaElement);
      }
      
      if (stream){
        //read stream data
        textareaElement.rows = 12;
        streamResponseRead(response.body.getReader(), (content) => {
          textareaElement.textContent += content;
        });

      }else{
        let msg = response["choices"][0]["message"]["content"];
        textareaElement.textContent = msg;
        const lineCount = calculateLines(textareaElement, textareaClassName);
        // console.info(`linecount:${lineCount}`);
        textareaElement.rows = lineCount > 12 ? 12: lineCount;
      }

      btnActionTrans.disabled = false;
      btnActionWord.disabled = false;
      btnDelete.disabled = false;
    }

  
    btnActionWord.addEventListener('click', function() {
      if (debug) console.log(`${current_action_word.name} clicked. ${uuid}`);
      
      btnActionWord.disabled = true;
      btnActionTrans.disabled = true;
      btnDelete.disabled = true;

      fetchChat(mapMsg.get(uuid), current_action_word.prompt, onSuccess, onError, true);
    });

    btnActionTrans.addEventListener('click', function() {
      if (debug) console.log(`${current_action_translate.name} clicked. ${uuid}`);

      btnActionWord.disabled = true;
      btnActionTrans.disabled = true;
      btnDelete.disabled = true;

      fetchChat(mapMsg.get(uuid), current_action_translate.prompt, onSuccess, onError, true);
    });
  
    btnDelete.addEventListener('click', function() {
        if (debug) console.log(`btnDelete clicked. ${uuid}`);

        // divMsg.innerHTML = "";
        while (divMsg.firstChild) divMsg.removeChild(divMsg.firstChild);

        btnActionWord.disabled = false;
        btnActionTrans.disabled = false;
        btnDelete.disabled = true;
        
    });
  
    container.appendChild(divMsg)
    container.appendChild(actionPannel)
    return container;

} //End createCustomPannel

  


