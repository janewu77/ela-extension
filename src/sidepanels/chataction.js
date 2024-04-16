// let current_action_word = defalut_action_word;
// let current_action_transalate = defalut_action_transalate;
//for custom buttons
function createCustomPannel(uuid){
    const container = document.createElement('div');
  
    const divMsg = document.createElement('div');
    divMsg.className = "mt-2 rounded" ;
  
    const actionPannel = document.createElement('div');
    actionPannel.className = "mt-1 grid grid-cols-3 divide-x divide-gray-900/5 bg-gray-100 rounded" ;

    // button btnActionTrans
    let btnActionTrans = document.createElement('button');
    btnActionTrans.id = "btnOpTrans";
    btnActionTrans.className = ClassNameForPlayButton;
    btnActionTrans.innerHTML = current_action_transalate.name;
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
      divMsg.innerHTML = `!!! ${error}`;
      divMsg.appendChild(getBtnSetting());

      btnActionTrans.disabled = false;
      btnActionWord.disabled = false;
      btnDelete.disabled = false;
    };
  
    const onSuccess = function( data) {
      if (debug) console.log(` data: ${data}`);
      let msg = data["choices"][0]["message"]["content"];
  
      // let formatedMsg = marked.parse(msg);
      // divMsg.innerHTML = formatedMsg;

      divMsg.innerHTML = '';
      let textareaElement = document.createElement('textarea');
      // textareaElement.name = "message";
      let textareaClassName = "block w-full rounded-md border-0 border-gray-300 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-500 text-sm leading-6";
      textareaElement.className = textareaClassName;
      textareaElement.readOnly = true;
      textareaElement.textContent = msg;

      const lineCount = calculateLines(textareaElement, textareaClassName);
      // console.info(`linecount:${lineCount}`);
      textareaElement.rows = lineCount > 12 ? 12: lineCount;
      divMsg.appendChild(textareaElement);

      btnActionTrans.disabled = false;
      btnActionWord.disabled = false;
      btnDelete.disabled = false;

    };
  
    btnActionWord.addEventListener('click', function() {
      if (debug) console.log(`${current_action_word.name} clicked. ${uuid}`);
      
      btnActionWord.disabled = true;
      btnActionTrans.disabled = true;
      btnDelete.disabled = true;

      divMsg.innerHTML = "";
      fetchChat(mapMsg.get(uuid), current_action_word.prompt, onSuccess, onError);
    });

    btnActionTrans.addEventListener('click', function() {
      if (debug) console.log(`${current_action_transalate.name} clicked. ${uuid}`);

      btnActionWord.disabled = true;
      btnActionTrans.disabled = true;
      btnDelete.disabled = true;

      divMsg.innerHTML = "";
      fetchChat(mapMsg.get(uuid), current_action_transalate.prompt, onSuccess, onError);
    });
  
    btnDelete.addEventListener('click', function() {
        if (debug) console.log(`btnDelete clicked. ${uuid}`);

        divMsg.innerHTML = "";

        btnActionWord.disabled = false;
        btnActionTrans.disabled = false;
        btnDelete.disabled = true;
        
    });
  
    container.appendChild(divMsg)
    container.appendChild(actionPannel)
    return container;

} //End createCustomPannel

  


