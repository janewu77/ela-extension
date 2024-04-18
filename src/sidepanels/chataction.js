
function showBtn(btnCopy, visibility){
  btnCopy.className = ClassNameForTxtAreaButton + ` visibility: ${visibility} `; //hidden: visible
}

function disableAllBtn(arrBtn, disabled){
  arrBtn.forEach(btnAction => {
    btnAction.disabled = disabled;
  }); 
}

//for custom buttons
function createCustomPannel(uuid){
    let arrActionButton = [];
    const container = document.createElement('div');
    container.id = `CustomPannel_${uuid}`;
  
    const divMsg = document.createElement('div');
    divMsg.id = `CustomPannel_SysMsg_${uuid}`;
    divMsg.className = "mt-2 rounded relative " ;

    const textareaElement = document.createElement('textarea');
    const textareaElementID = `CustomPannel_Response_${uuid}`;
    textareaElement.id = textareaElementID;
    // textareaElement.name = "message";
    const textareaClassName = "block w-full rounded-md border-0 border-gray-300 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-blue-500 text-sm leading-6";
    textareaElement.className = textareaClassName;
    textareaElement.readOnly = true;
  
    const actionPannel = document.createElement('div');
    actionPannel.id = `CustomPannel_ActionPannel_${uuid}`;
    actionPannel.className = "mt-1 grid grid-cols-2 divide-x divide-gray-900/5 bg-gray-100 rounded" ;

    //action items
    for (let index = 0; index < current_action_items.length; index++) {
      let actionItem = current_action_items[index];
      let i = index + 1;
      console.log(actionItem);
      if (!actionItem.active) continue;
      let btnAction = document.createElement('button');
      btnAction.id = `btnAction${i}`;
      btnAction.className = ClassNameForPlayButton;
      btnAction.innerHTML = actionItem.name;
      btnAction.disabled = false;
      actionPannel.appendChild(btnAction);

      arrActionButton.push(btnAction);

      btnAction.addEventListener('click', function() {
        if (debug) console.log(`${actionItem.name} clicked. ${uuid}`);
        btnAction.innerHTML = SVGLoadingSpin + actionItem.name;
  
        showBtn(btnClear, "hidden");
        showBtn(btnCopy, "hidden");
        
        disableAllBtn(arrActionButton, true);
  
        fetchChat(mapMsg.get(uuid), actionItem.prompt, function(response, stream){
          btnAction.innerHTML = actionItem.name;
    
          if (debug) console.log(` onSuccess stream:${stream}`);
          // if (debug) console.log(` onSuccess divMsg.hasChildNodes():${divMsg.hasChildNodes()}`);
    
          const txtArea = divMsg.querySelector(`#${textareaElementID}`);
          if (txtArea != null){
            txtArea.textContent = '';
          }else{
            while (divMsg.firstChild) divMsg.removeChild(divMsg.firstChild);
            divMsg.appendChild(textareaElement);
            divMsg.appendChild(divTxtAreaMenu);
            // divMsg.appendChild(btnCopy);
          }
          
          if (stream){
            //read stream data
            textareaElement.rows = 12;
            streamResponseRead(response.body.getReader(), (content) => {
              textareaElement.textContent += content;
            }, ()=>{
              showBtn(btnClear, "visible");
              showBtn(btnCopy, "visible");
            });
    
          }else{
            let msg = response["choices"][0]["message"]["content"];
            textareaElement.textContent = msg;
            const lineCount = calculateLines(textareaElement, textareaClassName);
            // console.info(`linecount:${lineCount}`);
            textareaElement.rows = lineCount > 12 ? 12: lineCount;
            showBtn(btnClear, "visible");
            showBtn(btnCopy, "visible");
          }
    
          disableAllBtn(arrActionButton, false);
        }, function(error) {
          // loadedAllBtn(arrActionButton);
          // btnActionTrans.innerHTML = current_action_translate.name;
          btnAction.innerHTML = actionItem.name;
          showBtn(btnClear, "hidden");
          showBtn(btnCopy, "hidden");
    
          while (divMsg.firstChild) divMsg.removeChild(divMsg.firstChild);
    
          const divErrMsg = document.createElement('div');
          divErrMsg.innerHTML = `!!! ${error}`;
          divErrMsg.appendChild(getBtnSetting());
          divMsg.appendChild(divErrMsg);
    
          disableAllBtn(arrActionButton, false);
        }, true);
      });
    };
    
    // container for btnClear, btnCopy
    let divTxtAreaMenu = document.createElement('div');
    divTxtAreaMenu.className = " absolute top-0 right-0 ";

    // button clear
    let btnClear = document.createElement('button');
    btnClear.id = `btnClear_${uuid}`;
    btnClear.className = ClassNameForTxtAreaButton + " visibility: hidden "
    btnClear.innerHTML = SVGDelete_light;
    divTxtAreaMenu.appendChild(btnClear);

    // button copy
    let btnCopy = document.createElement('button');
    btnCopy.id = `btnCopy_${uuid}`;
    btnCopy.className = ClassNameForTxtAreaButton + " visibility: hidden "; //visibility: visible
    btnCopy.innerHTML = SVGCopy_light;
    divTxtAreaMenu.appendChild(btnCopy);


    btnClear.addEventListener('click', function() {
        if (debug) console.log(`btnClear clicked. ${uuid}`);

        showBtn(btnClear, "hidden");
        showBtn(btnCopy, "hidden");
        textareaElement.textContent = ''
        disableAllBtn(arrActionButton, false);
    });

    btnCopy.addEventListener('click', function() {
      if (debug) console.log(`btnCopy clicked. ${uuid}`);
      navigator.clipboard.writeText(textareaElement.textContent);
    });
  
    container.appendChild(divMsg)
    container.appendChild(actionPannel)
    return container;

} //End createCustomPannel

  


