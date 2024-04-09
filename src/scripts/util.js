function maskMsg(msg){
    if (msg.length < 7) return msg;
    // let str = "Hello, World!";
    let result = msg.slice(0, 5) + "********" + msg.slice(-2);
    return result;
}
  