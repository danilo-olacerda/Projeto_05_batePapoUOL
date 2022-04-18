let user = {
    name: ""
}
let selectedUser = "Todos";
let msgType = "message";
let lastMsg="";
let input = document.querySelector(".msg-area");
function login() {
    user.name = document.querySelector(".name").value;
    let promise = axios.post("https://mock-api.driven.com.br/api/v6/uol/participants ", user);
    promise.then(logged);
    promise.catch(loginError);
}
function loginError() {
    alert("Esse nome já está sendo utilizado, escolha outro!");
}
function logged (infos) {
    document.querySelector(".container-login").classList.add("hidden");
    document.querySelector("main").classList.remove("hidden");
    getMsg;
    getParticipants;
    setInterval(keepOn, 5000);
    setInterval(getMsg, 3000);
    setInterval(getParticipants, 10000);
}
function alerta (el) {
    console.log(el.response.status)
}
function keepOn() {
    axios.post("https://mock-api.driven.com.br/api/v6/uol/status", user);
}

function getMsg () {
    let msg = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    msg.then(loadMsg);
}

function loadMsg(info){
    document.querySelector(".chat").innerHTML='';
    let messages=info.data;
    for (let i=0; i<messages.length; i++) {
        if (messages[i].type === 'status') {
            document.querySelector(".chat").innerHTML+= `<div class="msg"><p><b>${messages[i].time} </b><strong>${messages[i].from}</strong> para <strong>${messages[i].to}</strong>: ${messages[i].text}</p></div>`
        } else if (messages[i].type === 'message') {
            document.querySelector(".chat").innerHTML+= `<div class="msg normal"><p><b>${messages[i].time} </b><strong>${messages[i].from}</strong> para <strong>${messages[i].to}</strong>: ${messages[i].text}</p></div>`
        } else if (messages[i].type === 'private_message' && (messages[i].from === user.name || messages[i].to === selectedUser || messages[i].to === "Todos")) {
            document.querySelector(".chat").innerHTML+= `<div class="msg private"><p><b>${messages[i].time} </b><strong>${messages[i].from}</strong> para <strong>${messages[i].to}</strong>: ${messages[i].text}</p></div>`
        }
        
    }
    if (lastMsg===''){
        scrollToBottom();
        lastMsg = document.querySelector(".chat").lastChild;
    }
    if (lastMsg.innerHTML != document.querySelector(".chat").lastChild.innerHTML) {
        scrollToBottom();
        lastMsg = document.querySelector(".chat").lastChild;
    }
}
function send() {
    let newMessage;
    newMessage = {
        from: user.name,
        to: selectedUser,
        text: document.querySelector(".msg-area").value,
        type: msgType
    }
    let reload = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", newMessage);
    reload.then(getMsg);
    reload.catch(msgError);
    document.querySelector(".msg-area").value = '';
}
function msgError () {
    alert("Você foi desconectado!")
    window.location.reload()
}
function scrollToBottom() {
    let el = document.querySelector(".chat");
    el.scrollIntoView(false);
}
function back() {
    document.querySelector(".container-corner").classList.add("hidden");
}
input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {  
    send();
    }
})
function openMenu() {
    document.querySelector(".container-corner").classList.remove("hidden");
}
function getParticipants() {
    let participants = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    participants.then(loadParticipants);
}
function loadParticipants(info) {
    let users = info.data;
    let keepUser = 0;
    document.querySelector(".people").innerHTML=`
    <div class="person todos" onclick="selectUser(this)">
        <div>
            <ion-icon name="people"></ion-icon>
            <h4>Todos</h4>
        </div>
        <div>
            <ion-icon name="checkmark"></ion-icon>
        </div>         
    </div>`;
    for (let i=0; i<users.length; i++) {
        if (users[i].name!= user.name) {
        document.querySelector(".people").innerHTML+=`
        <div class="person" onclick="selectUser(this)">
            <div>
                <ion-icon name="person-circle"></ion-icon>
                <h4>${users[i].name}</h4>
            </div>
            <div>
                <ion-icon name="checkmark"></ion-icon>
            </div>         
        </div>`;
        }
        if (selectedUser===users[i].name) {
            document.querySelector(".people").lastChild.classList.add("check");
            keepUser=1;
        }
    }
    if (keepUser===0 && selectedUser!="Todos") {
        alert("O usuario selecionado desconectou! Mudando para todos.")
        selectedUser="Todos";
        document.querySelector(".todos").classList.add("check");
        if (msgType==="private_message") {
            document.querySelector(".send-details").querySelector("h4").innerHTML = `<h4>Enviando para ${selectedUser} (reservadamente)</h4>`;
        } else {
            document.querySelector(".send-details").querySelector("h4").innerHTML = `<h4>Enviando para ${selectedUser} (Público)</h4>`;
        }
    }
    if (selectedUser==="Todos") {
        document.querySelector(".todos").classList.add("check");
        if (msgType==="private_message") {
            document.querySelector(".send-details").querySelector("h4").innerHTML = `<h4>Enviando para ${selectedUser} (reservadamente)</h4>`;
        } else {
            document.querySelector(".send-details").querySelector("h4").innerHTML = `<h4>Enviando para ${selectedUser} (Público)</h4>`;
        }
    }
}
function selectUser(el) {
    selectedUser = el.querySelector("h4").innerHTML;
    let selection = document.querySelector(".check.person");
    if (selection==null) {
        el.classList.add("check");
    } else {
        selection.classList.remove("check");
        el.classList.add("check");
    }
    if (msgType==="private_message") {
        document.querySelector(".send-details").querySelector("h4").innerHTML = `<h4>Enviando para ${selectedUser} (reservadamente)</h4>`;
    } else {
        document.querySelector(".send-details").querySelector("h4").innerHTML = `<h4>Enviando para ${selectedUser} (Público)</h4>`;
    }
}
function selectType(el) {
    let selection = document.querySelector(".check.option");
    if (selection==null) {
        el.classList.add("check");
    } else {
        selection.classList.remove("check");
        el.classList.add("check");
    }
    if (el.querySelector("h4").innerHTML === "Reservadamente") {
        msgType="private_message";
        document.querySelector(".send-details").querySelector("h4").innerHTML = `<h4>Enviando para ${selectedUser} (reservadamente)</h4>`;
    } else {
        document.querySelector(".send-details").querySelector("h4").innerHTML = `<h4>Enviando para ${selectedUser} (Público)</h4>`;
        msgType= "message";
    }
}