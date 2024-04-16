// let current_action_word = defalut_action_word;
// let current_action_transalate = defalut_action_transalate;
//for custom buttons
function createCustomPannel(uuid){
    const container = document.createElement('div');
  
    const divMsg = document.createElement('div');
    divMsg.className = "mt-2 p-2 rounded" ;
  
    const actionPannel = document.createElement('div');
    actionPannel.className = "mt-1 grid grid-cols-3 divide-x divide-gray-900/5 bg-gray-100 rounded" ;
  
    const onError = function(error) {
      divMsg.innerHTML = `!!! ${error}`;
      divMsg.appendChild(getBtnSetting());
    };
  
    const onSuccess = function( data) {
      if (debug) console.log(` data: ${data}`);
      let msg = data["choices"][0]["message"]["content"];
  
      markdownContent = marked.parse(msg);
      divMsg.innerHTML = markdownContent;
    };
  
    // button btnActionTrans
    let btnActionTrans = document.createElement('button');
    btnActionTrans.id = "btnOpTrans";
    btnActionTrans.className = ClassNameForPlayButton;
    btnActionTrans.innerHTML = current_action_transalate.name;
    actionPannel.appendChild(btnActionTrans);
    
    // button btnOpWord
    let btnActionWord = document.createElement('button');
    btnActionWord.id = "btnOpWord";
    btnActionWord.className = ClassNameForPlayButton;
    btnActionWord.innerHTML = current_action_word.name;
    actionPannel.appendChild(btnActionWord);
    
    // button delete
    let btnDelete = document.createElement('button');
    btnDelete.id = `btnDelete_${uuid}`;
    btnDelete.className = ClassNameForPlayButton;
    btnDelete.innerHTML = SVGDelete;
    btnDelete.disabled = true;
    actionPannel.appendChild(btnDelete);
    
  
    btnActionWord.addEventListener('click', function() {
      if (debug) console.log(`${current_action_word.name} clicked. ${uuid}`);
      btnDelete.disabled = false;
      divMsg.innerHTML = "";
      fetchChat(mapMsg.get(uuid), current_action_word.prompt, onSuccess, onError);
    });

    btnActionTrans.addEventListener('click', function() {
      if (debug) console.log(`${current_action_transalate.name} clicked. ${uuid}`);
      btnDelete.disabled = false;
      divMsg.innerHTML = "";
      fetchChat(mapMsg.get(uuid), current_action_transalate.prompt, onSuccess, onError);
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
  


