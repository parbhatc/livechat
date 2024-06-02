let socket = new WebSocket("ws://localhost:5932");
let isConnected = false;
let messageInput = document.getElementById("message");

socket.addEventListener('open', () => {
    isConnected = true;
    socket.send(JSON.stringify({type: "register", username}))
});

socket.addEventListener('message', (event) => {
    try{
        let data = JSON.parse(event.data);

        if(data.type === "message"){
            addText(data.username, data.message)
        }
    }catch (e){
    }
});


document.querySelector("form").onsubmit = function (e){
    e.preventDefault();
    let msg = messageInput.value;

    if(msg.length >= 1){
        msg.value = "";
        socket.send(JSON.stringify({type: "message", username, message: msg}))
    }
}

function addText(user, message){
    let messageDiv = document.createElement("div");

    let usernameSpan = document.createElement("span");
    usernameSpan.className = "username";
    usernameSpan.innerText = user + ": ";
    messageDiv.appendChild(usernameSpan);

    let messageSpan = document.createElement("span");
    messageSpan.className = "message";
    messageSpan.innerText = message;
    messageDiv.appendChild(messageSpan);

    document.querySelector(".global_texts").appendChild(messageDiv);
}