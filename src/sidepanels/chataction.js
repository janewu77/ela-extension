
//for custom buttons
function createCustomPannel(uuid){
    const container = document.createElement('div');
  
    const divMsg = document.createElement('div');
    divMsg.className = "mt-2 rounded" ;
  
    const actionPannel = document.createElement('div');
    actionPannel.className = "mt-1 grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-100 rounded" ;
  
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
  
    // button btnOp1
    let actionName = current_action_name;
    let btnAction = document.createElement('button');
    btnAction.id = "btnOp1";
    btnAction.className = ClassNameForPlayButton;
    btnAction.innerHTML = actionName;
    actionPannel.appendChild(btnAction);
    
  
    // button delete
    let btnDelete = document.createElement('button');
    btnDelete.id = `btnDelete_${uuid}`;
    btnDelete.className = ClassNameForPlayButton;
    btnDelete.innerHTML = SVGDelete;
    btnDelete.disabled = true;
    actionPannel.appendChild(btnDelete);
    
  
    btnAction.addEventListener('click', function() {
      if (debug) console.log(`${actionName} clicked. ${uuid}`);
      btnDelete.disabled = false;
      divMsg.innerHTML = "";
      fetchChat(mapMsg.get(uuid), default_action_prompt, onSuccess, onError);
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
  


