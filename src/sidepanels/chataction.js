const ClassNameForPlayButtonMulti = `flex items-center justify-center p-1 font-semibold text-gray-600 hover:bg-blue-100 disabled:bg-gray-50 disabled:cursor-not-allowed rounded bg-gray-100 border-1 border-blue-300`;
    

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
  if (debug) console.log("createCustomPannel");

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
  // 确保 countActiveBtn 在有效范围内，即 1 到 3 之间
  const validCount = Math.max(1, Math.min(current_action_items_active.length, 3));
  actionPannel.className = `mt-1 grid grid-cols-${validCount}  gap-x-0.5 gap-y-0.5 bg-white-100 rounded ` ;
  

  //action items
  current_action_items_active.map((actionItem, index) => {
    let i = index + 1;
    // console.log(actionItem);

    let btnAction = createButton( `btnAction${i}`, ClassNameForPlayButtonMulti, actionItem.name, false);    
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
  });
  
  // container for btnClear, btnCopy
  let divTxtAreaMenu = document.createElement('div');
  divTxtAreaMenu.className = " absolute top-0 right-0 ";

  // button clear
  let btnClear = createButton(`btnClear_${uuid}`, ClassNameForTxtAreaButton + " visibility: hidden ", SVGDelete_light, false);    
  divTxtAreaMenu.appendChild(btnClear);

  // button copy
  let btnCopy = createButton(`btnCopy_${uuid}`, ClassNameForTxtAreaButton + " visibility: hidden ", SVGCopy_light, false);    
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

  


