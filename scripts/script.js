let user = {
    name: "Patolino2"
}
let messages=[];
let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants ", user);
setInterval(keepOn, 5000);

function keepOn() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", user);
}

setInterval(getMsg, 3000);

function getMsg () {
    let msg = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    msg.then(loadMsg);
}

function loadMsg(info){
    document.querySelector(".chat").innerHTML='';
    messages=info.data;
    for (let i=0; i<messages.length; i++) {
        if (messages[i].type === 'status') {
            document.querySelector(".chat").innerHTML+= `<div class="msg"><p><b>${messages[i].time} </b><strong>${messages[i].from}</strong> para <strong>${messages[i].to}</strong>: ${messages[i].text}</p></div>`
        } else if (messages[i].type === 'message') {
            document.querySelector(".chat").innerHTML+= `<div class="msg normal"><p><b>${messages[i].time} </b><strong>${messages[i].from}</strong> para <strong>${messages[i].to}</strong>: ${messages[i].text}</p></div>`
        } else if (messages[i].type === 'private_message') {
            document.querySelector(".chat").innerHTML+= `<div class="msg private"><p><b>${messages[i].time} </b><strong>${messages[i].from}</strong> para <strong>${messages[i].to}</strong>: ${messages[i].text}</p></div>`
        }
        
    }
}
function send() {
    let newMessage;
    newMessage = {
        from: user.name,
        to: "Todos",
        text: document.querySelector("input").value,
        type: "message"
    }
    let reload = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", newMessage);
    reload.then(getMsg);
    document.querySelector("input").value = '';
}