function maskMsg(msg){
    if (msg.length < 7) return msg;
    // let str = "Hello, World!";
    let result = msg.slice(0, 5) + "********" + msg.slice(-2);
    return result;
}
  
function calculateLines(textarea, className) {
    // 创建一个隐藏的 div 来模拟 textarea
    const dummy = document.createElement('div');
    dummy.className = className;
    document.body.appendChild(dummy);
    // dummy.style.width = textarea.offsetWidth + 'px';
    dummy.style.font = window.getComputedStyle(textarea).font;
    dummy.style.visibility = 'hidden';
    dummy.style.whiteSpace = 'pre-wrap'; // 保持空白符处理方式相同
    dummy.style.wordWrap = 'break-word'; // 允许单词在必要时断行
  
    // 将文本设置到 dummy 中，替换换行符为 <br> 来确保效果
    dummy.textContent = textarea.value;
    dummy.innerHTML = dummy.innerHTML.replace(/\n/g, '<br>');
  
    // 计算 dummy 高度和单行高度
    const singleLineHeight = dummy.clientHeight;
    dummy.textContent = 'A'; // 设置为单个字符来计算单行高度
    const lineHeight = dummy.clientHeight;
    document.body.removeChild(dummy);
    return Math.ceil(singleLineHeight / lineHeight);
}