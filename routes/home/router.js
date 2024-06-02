const express = require("express");
const Cookie = require("../../cookie/Cookie");
const fs = require("fs");
const path = require("path");
const Main = require("../../Main");
const router = express.Router();

router.use("/public", express.static(__dirname + '/public'));

router.get("", async (req, res) => {
    let userInfo = await Cookie.validateUser(req);
    let username = userInfo.username;
    let shouldRegister = true;

    if(userInfo.code === 200){

        if(username.length >= 1 && username.length <= 20){
            if(Main.instance.users.indexOf(username) === -1){
                Main.instance.users.push(username);
            }
            shouldRegister = false;
        }
    }
    if(shouldRegister){
        let html = fs.readFileSync(path.join(__dirname) + "/register_template.html").toString();
        return res.send(html);
    }
    let html = fs.readFileSync(path.join(__dirname) + "/global_chat_template.html").toString();
    html = html.replaceAll("{username}", username)
    return res.send(html);
});

module.exports = router;