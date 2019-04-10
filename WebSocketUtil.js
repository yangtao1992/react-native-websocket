let isConnect = false;
let isReconnect = true;
let ws,obj,wsUrl,mCallBack;
export const initPush = (url,params,callBack) =>{
    if(url){
        wsUrl = url;
        obj = params;
        mCallBack = callBack;
        closeConnect();
        return init();
    }
};

export const closePush = () =>{
    closeConnect();
};

function closeConnect() {
    if(ws){
        isReconnect = false;
        ws.close();
    }
}

function init(){
    ws = new WebSocket(wsUrl);
    // 打开连接
    ws.onopen = () => {
        checkHeart.reset().start();
        //发送连接验证token
        ws.send(obj);
    };

    // 接收消息
    ws.onmessage = (evt) => {
        checkHeart.reset().start();
        msgHandle(evt);
    };

    //发生错误
    ws.onerror = (evt) => {
    };

    //连接被关闭
    ws.onclose = (evt) => {
        if(isReconnect){
            reconnect();
        }else{
            isReconnect = true;
        }
    };
    return ws;
}

function reconnect() {
    if(!isConnect){
        isConnect = true;
        setTimeout(function(){
            init();
            isConnect = false;
        }, 2000);
    }
}

var checkHeart = {
    timeoutObj: null,
    reset:function(){
        clearTimeout(this.timeoutObj);
        return this;
    },
    start:function(){
        this.timeoutObj = setTimeout(function(){
            ws.close();
        },40000)
    }
};

//消息处理
function msgHandle(evt){
    let obj = JSON.parse(evt.data);
    if(obj){
        //根据消息类型进行对应的逻辑处理
    }
}

