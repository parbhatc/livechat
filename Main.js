const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require('body-parser');
const {Server} = require("ws");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

const SERVER_PORT = 80;
const SOCKET_PORT = 5932;

class Main{

    constructor() {
        Main.instance = this;
        this.users = [];
        this.initApp();
        this.initSockets();
    }

    initApp(){
        app.use(cookieParser());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use("/api/user", require("./api/user"));

        app.use("/", require("./routes/home/router"));

        app.listen(SERVER_PORT, () => {
            console.log("Server started.");
        });
    }

    initSockets(){
        this.clients = {};
        this.addressToCleint = {};

        let that = this;
        let wss = new Server({ port: SOCKET_PORT })
        wss.on('connection', (ws, req) => {
            let clientAddress = req.socket.remoteAddress;
            let clientPort = req.socket.remotePort;
            let client = clientAddress + ":" + clientPort;

            ws.on('message', (message) => {
                let data;
                try{
                    data = JSON.parse(message);
                }catch (err){
                }

                if(data !== undefined){
                    let type = data.type;

                    if(type !== undefined){
                        switch(type){
                            case "register":
                                that.clients[data.username] = ws;
                                that.addressToCleint[client] = data.username;

                                for(let c of Object.values(that.clients)){
                                    if(c !== null){
                                        c.send(JSON.stringify({type: "message", username: data.username, message: "has entered the chat."}))
                                    }
                                }
                                break;
                            case "message":
                                for(let c of Object.values(that.clients)){
                                    if(c !== null) c.send(JSON.stringify(data))
                                }
                                break;
                        }
                    }
                }
            });

            ws.on('close', () => {
                let username = that.addressToCleint[client];

                if(username !== undefined){
                    delete that.addressToCleint[client];
                    delete that.clients[username];

                    for(let c of Object.values(that.clients)){
                        if(c !== null){
                            c.send(JSON.stringify({type: "message", username, message: "has left the chat."}))
                        }
                    }
                }
            });
        });

        console.log(`WebSocket server is listening on ws://localhost:${SOCKET_PORT}`);
    }
}

module.exports = Main;